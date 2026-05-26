import os
import cv2
import csv
import threading
import time
from datetime import datetime
import tkinter as tk
from tkinter import messagebox, filedialog
import customtkinter as ctk
from PIL import Image, ImageTk

# Import local database and face recognition modules
import database
import face_recognition_handler as frh

# Set theme and appearance
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

class AttendanceApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Window properties
        self.title("Smart Face Recognition Attendance System")
        self.geometry("1200x700")
        self.resizable(False, False)

        # State variables
        self.cap = None
        self.is_camera_running = False
        self.current_mode = "Idle"  # Idle, Sampling, Tracking
        self.recognizer_model = frh.FaceRecognizer()
        
        # Sampling state
        self.sampling_student_id = ""
        self.sampling_count = 0
        self.sampling_limit = 30

        # UI Layout setup
        self.setup_ui()
        
        # Close protocol
        self.protocol("WM_DELETE_WINDOW", self.on_closing)

    def setup_ui(self):
        # Configure Grid Layout (1 row, 3 columns)
        self.grid_columnconfigure(0, weight=1, minsize=340) # Left Sidebar (Enroll/Train)
        self.grid_columnconfigure(1, weight=2, minsize=520) # Center (Camera Stream)
        self.grid_columnconfigure(2, weight=1, minsize=340) # Right (Logs Table)
        self.grid_rowconfigure(0, weight=1)

        # ----------------------------------------------------
        # 1. LEFT SIDEBAR: REGISTRATION & TRAINING
        # ----------------------------------------------------
        self.left_frame = ctk.CTkFrame(self, corner_radius=15, fg_color="#1E293B")
        self.left_frame.grid(row=0, column=0, padx=15, pady=15, sticky="nsew")
        
        # Section Header
        self.reg_title = ctk.CTkLabel(
            self.left_frame, 
            text="Student Registration", 
            font=("Segoe UI", 20, "bold"), 
            text_color="#38BDF8"
        )
        self.reg_title.pack(pady=(20, 25))

        # Form Container
        self.form_frame = ctk.CTkFrame(self.left_frame, fg_color="transparent")
        self.form_frame.pack(fill="x", padx=25, pady=5)

        # Student ID Entry
        self.id_label = ctk.CTkLabel(self.form_frame, text="Student ID", font=("Segoe UI", 12, "bold"))
        self.id_label.pack(anchor="w", py=2)
        self.id_entry = ctk.CTkEntry(self.form_frame, placeholder_text="e.g. BCA-101", height=35)
        self.id_entry.pack(fill="x", pady=(0, 15))

        # Student Name Entry
        self.name_label = ctk.CTkLabel(self.form_frame, text="Full Name", font=("Segoe UI", 12, "bold"))
        self.name_label.pack(anchor="w", py=2)
        self.name_entry = ctk.CTkEntry(self.form_frame, placeholder_text="e.g. Ramesh Kumar", height=35)
        self.name_entry.pack(fill="x", pady=(0, 15))

        # Department Entry
        self.dept_label = ctk.CTkLabel(self.form_frame, text="Department", font=("Segoe UI", 12, "bold"))
        self.dept_label.pack(anchor="w", py=2)
        self.dept_entry = ctk.CTkEntry(self.form_frame, placeholder_text="e.g. BCA / B.Tech CSE", height=35)
        self.dept_entry.pack(fill="x", pady=(0, 25))

        # Buttons Panel
        self.buttons_frame = ctk.CTkFrame(self.left_frame, fg_color="transparent")
        self.buttons_frame.pack(fill="x", padx=25, pady=5)

        # Step 1: Capture Face Samples Button
        self.btn_capture = ctk.CTkButton(
            self.buttons_frame,
            text="1. Capture Face Samples",
            font=("Segoe UI", 13, "bold"),
            fg_color="#0EA5E9",
            hover_color="#0284C7",
            height=40,
            command=self.start_face_sampling
        )
        self.btn_capture.pack(fill="x", pady=8)

        # Step 2: Train Model Button
        self.btn_train = ctk.CTkButton(
            self.buttons_frame,
            text="2. Train Face Recognizer",
            font=("Segoe UI", 13, "bold"),
            fg_color="#8B5CF6",
            hover_color="#7C3AED",
            height=40,
            command=self.train_face_model
        )
        self.btn_train.pack(fill="x", pady=8)

        # Divider Line
        self.divider = ctk.CTkFrame(self.left_frame, height=2, fg_color="#334155")
        self.divider.pack(fill="x", padx=25, pady=15)

        # Info Status Box
        self.status_box = ctk.CTkFrame(self.left_frame, fg_color="#0F172A", corner_radius=10)
        self.status_box.pack(fill="both", expand=True, padx=25, pady=(0, 20))

        self.status_header = ctk.CTkLabel(self.status_box, text="System Log / Instructions", font=("Segoe UI", 11, "bold"), text_color="#94A3B8")
        self.status_header.pack(pady=(8, 4), padx=10, anchor="w")

        self.status_lbl = ctk.CTkLabel(
            self.status_box, 
            text="1. Input student details above.\n2. Click 'Capture Face Samples'.\n3. Wait for camera collection.\n4. Click 'Train Face Recognizer'.",
            font=("Consolas", 11),
            text_color="#10B981",
            justify="left",
            wraplength=260
        )
        self.status_lbl.pack(pady=(4, 8), padx=10, fill="both", expand=True)


        # ----------------------------------------------------
        # 2. CENTER PANEL: LIVE WEBCAM & FACE TRACKER
        # ----------------------------------------------------
        self.center_frame = ctk.CTkFrame(self, corner_radius=15, fg_color="#0F172A")
        self.center_frame.grid(row=0, column=1, padx=5, pady=15, sticky="nsew")

        # Camera Header
        self.cam_title = ctk.CTkLabel(
            self.center_frame, 
            text="Live Face Tracker Feed", 
            font=("Segoe UI", 20, "bold"),
            text_color="#F8FAFC"
        )
        self.cam_title.pack(pady=(20, 10))

        # Mode Indicator Pill
        self.mode_pill = ctk.CTkLabel(
            self.center_frame,
            text="SYSTEM STATUS: IDLE",
            font=("Segoe UI", 11, "bold"),
            text_color="#94A3B8",
            fg_color="#334155",
            corner_radius=8,
            height=25,
            width=180
        )
        self.mode_pill.pack(pady=(0, 15))

        # Camera Viewport Box
        self.video_frame = ctk.CTkFrame(self.center_frame, fg_color="#1E293B", corner_radius=12, border_width=2, border_color="#334155")
        self.video_frame.pack(padx=20, pady=5, fill="both", expand=True)

        self.camera_label = ctk.CTkLabel(self.video_frame, text="Camera Offline\nClick 'Start Tracking' or 'Capture Samples' to Initialize", font=("Segoe UI", 13), text_color="#64748B")
        self.camera_label.pack(fill="both", expand=True)

        # Camera Control Buttons Panel
        self.cam_controls = ctk.CTkFrame(self.center_frame, fg_color="transparent")
        self.cam_controls.pack(fill="x", padx=20, pady=20)
        self.cam_controls.grid_columnconfigure(0, weight=1)
        self.cam_controls.grid_columnconfigure(1, weight=1)

        # Start Attendance Tracking
        self.btn_track = ctk.CTkButton(
            self.cam_controls,
            text="Start Attendance Tracking",
            font=("Segoe UI", 13, "bold"),
            fg_color="#10B981",
            hover_color="#059669",
            height=40,
            command=self.start_attendance_tracking
        )
        self.btn_track.grid(row=0, column=0, padx=8, sticky="ew")

        # Stop Camera / Idle
        self.btn_stop_cam = ctk.CTkButton(
            self.cam_controls,
            text="Stop Camera / Standby",
            font=("Segoe UI", 13, "bold"),
            fg_color="#EF4444",
            hover_color="#DC2626",
            height=40,
            command=self.stop_camera
        )
        self.btn_stop_cam.grid(row=0, column=1, padx=8, sticky="ew")


        # ----------------------------------------------------
        # 3. RIGHT PANEL: ATTENDANCE LOGS
        # ----------------------------------------------------
        self.right_frame = ctk.CTkFrame(self, corner_radius=15, fg_color="#1E293B")
        self.right_frame.grid(row=0, column=2, padx=15, pady=15, sticky="nsew")

        # Logs Header
        self.logs_title = ctk.CTkLabel(
            self.right_frame, 
            text="Today's Attendance", 
            font=("Segoe UI", 20, "bold"),
            text_color="#F8FAFC"
        )
        self.logs_title.pack(pady=(20, 5))

        self.logs_subtitle = ctk.CTkLabel(
            self.right_frame, 
            text=f"Date: {datetime.now().strftime('%Y-%m-%d')}", 
            font=("Segoe UI", 12),
            text_color="#94A3B8"
        )
        self.logs_subtitle.pack(pady=(0, 15))

        # Logs Scrollable Frame (Interactive Table)
        self.logs_scroll_frame = ctk.CTkScrollableFrame(self.right_frame, fg_color="#0F172A", corner_radius=10)
        self.logs_scroll_frame.pack(padx=20, pady=5, fill="both", expand=True)

        # Refresh button / Export Panel
        self.logs_controls = ctk.CTkFrame(self.right_frame, fg_color="transparent")
        self.logs_controls.pack(fill="x", padx=20, pady=20)

        # Refresh button
        self.btn_refresh = ctk.CTkButton(
            self.logs_controls,
            text="Refresh Logs List",
            font=("Segoe UI", 12),
            fg_color="#475569",
            hover_color="#334155",
            height=32,
            command=self.refresh_logs
        )
        self.btn_refresh.pack(fill="x", pady=(0, 10))

        # Export CSV Button
        self.btn_export = ctk.CTkButton(
            self.logs_controls,
            text="Export Log to CSV File",
            font=("Segoe UI", 13, "bold"),
            fg_color="#F59E0B",
            hover_color="#D97706",
            height=40,
            command=self.export_logs_to_csv
        )
        self.btn_export.pack(fill="x")

        # Load initial logs
        self.refresh_logs()

    # ----------------------------------------------------
    # UI CONTROLLERS & EVENT HANDLERS
    # ----------------------------------------------------

    def log_status(self, text, is_error=False):
        self.status_lbl.configure(text=text, text_color="#EF4444" if is_error else "#10B981")

    def refresh_logs(self):
        """
        Clears and repopulates the scrollable logs frame with today's database logs.
        """
        # Clear child widgets
        for widget in self.logs_scroll_frame.winfo_children():
            widget.destroy()

        # Fetch today's records
        logs = database.get_attendance_logs_for_date()

        if not logs:
            no_log = ctk.CTkLabel(
                self.logs_scroll_frame, 
                text="No attendance marked today.", 
                font=("Segoe UI", 12, "italic"),
                text_color="#64748B"
            )
            no_log.pack(pady=40)
            return

        # Add records to view
        for item in logs:
            row = ctk.CTkFrame(self.logs_scroll_frame, fg_color="#1E293B", corner_radius=6)
            row.pack(fill="x", pady=4, padx=5)

            # Left side: Timestamp
            time_lbl = ctk.CTkLabel(
                row, 
                text=item["time"], 
                font=("Consolas", 12, "bold"), 
                text_color="#38BDF8"
            )
            time_lbl.pack(side="left", padx=8, pady=6)

            # Center: Student Details
            det_lbl = ctk.CTkLabel(
                row, 
                text=f"{item['name']} ({item['student_id']})", 
                font=("Segoe UI", 12, "bold"),
                text_color="#F1F5F9",
                anchor="w"
            )
            det_lbl.pack(side="left", padx=5, fill="x", expand=True)

            # Right side: Department (truncated if necessary)
            dept_lbl = ctk.CTkLabel(
                row, 
                text=item["department"], 
                font=("Segoe UI", 11), 
                text_color="#64748B"
            )
            dept_lbl.pack(side="right", padx=8)

    def start_camera(self):
        """
        Initializes the opencv camera connection if not already running.
        """
        if not self.is_camera_running:
            self.cap = cv2.VideoCapture(0)
            if not self.cap.isOpened():
                messagebox.showerror("Camera Error", "Could not access webcam device 0. Check permissions or connections.")
                self.cap = None
                return False
            self.is_camera_running = True
            self.update_camera_frame()
        return True

    def stop_camera(self):
        """
        Releases the webcam and resets GUI state back to idle standby.
        """
        self.is_camera_running = False
        self.current_mode = "Idle"
        self.mode_pill.configure(text="SYSTEM STATUS: IDLE", text_color="#94A3B8", fg_color="#334155")
        
        if self.cap:
            self.cap.release()
            self.cap = None

        self.camera_label.configure(
            image=None, 
            text="Camera Offline\nClick 'Start Tracking' or 'Capture Samples' to Initialize"
        )
        self.camera_label.image = None
        self.log_status("Camera stream closed. System set to Standby.")

    def start_face_sampling(self):
        """
        Verifies inputs and starts the face samples collection pipeline.
        """
        student_id = self.id_entry.get().strip()
        name = self.name_entry.get().strip()
        dept = self.dept_entry.get().strip()

        if not student_id or not name:
            messagebox.showwarning("Input Error", "Please provide a valid Student ID and Name.")
            return

        # Insert student metadata into database (if not exists)
        student_exists = database.get_student(student_id)
        if not student_exists:
            success = database.add_student(student_id, name, dept)
            if not success:
                messagebox.showerror("Database Error", "Failed to register student record in DB.")
                return
            self.log_status(f"Registered metadata for {name} ({student_id}).")
        else:
            self.log_status(f"Loaded existing student profile: {student_exists['name']}.")

        # Launch camera and initiate sampling
        if self.start_camera():
            self.sampling_student_id = student_id
            self.sampling_count = 0
            self.current_mode = "Sampling"
            
            self.mode_pill.configure(
                text="SYSTEM STATUS: SAMPLING", 
                text_color="#F8FAFC", 
                fg_color="#0EA5E9"
            )
            self.log_status("Please look at the camera. Capturing 30 face samples...")

    def start_attendance_tracking(self):
        """
        Checks if model exists, loads it, and starts live attendance evaluation loop.
        """
        # Make sure recognizer is loaded
        loaded = self.recognizer_model.load_model()
        if not loaded:
            messagebox.showwarning("Model Missing", "Attendance tracking requires a trained model. Please enroll a student and train the recognizer first!")
            return

        if self.start_camera():
            self.current_mode = "Tracking"
            self.mode_pill.configure(
                text="SYSTEM STATUS: TRACKING", 
                text_color="#F8FAFC", 
                fg_color="#10B981"
            )
            self.log_status("Tracking active! Stand in front of camera to record attendance.")

    def train_face_model(self):
        """
        Triggers the model training pipeline in a background thread to keep UI fluid.
        """
        self.log_status("Reading samples and training classifier... Please wait.")
        self.btn_train.configure(state="disabled")

        def training_worker():
            success, msg = frh.train_recognizer()
            
            # Use main thread scheduler to update UI
            def callback():
                self.btn_train.configure(state="normal")
                if success:
                    self.log_status(msg)
                    messagebox.showinfo("Training Complete", msg)
                    # Reload recognizer model instantly
                    self.recognizer_model.load_model()
                else:
                    self.log_status(msg, is_error=True)
                    messagebox.showerror("Training Error", msg)
            
            self.after(0, callback)

        # Launch thread
        threading.Thread(target=training_worker, daemon=True).start()

    def update_camera_frame(self):
        """
        Main recursive camera feed capture and face recognition pipeline.
        """
        if not self.is_camera_running or not self.cap:
            return

        ret, frame = self.cap.read()
        if ret:
            # Mirror the frame horizontally for natural UX
            frame = cv2.flip(frame, 1)
            
            # Setup image sizes
            frame_h, frame_w = frame.shape[:2]
            
            # Convert to gray for detectors and classifiers
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            faces = frh.detect_faces(gray)
            
            if self.current_mode == "Sampling":
                # Only sample if a single face is visible to avoid noisy datasets
                if len(faces) == 1:
                    x, y, w, h = faces[0]
                    
                    # Highlight face bounding box
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (14, 165, 233), 2)
                    
                    # Crop and save grayscaled sample
                    cropped_face = gray[y:y+h, x:x+w]
                    # Resize to standard size (e.g. 200x200) for uniform LBPH training
                    cropped_resized = cv2.resize(cropped_face, (200, 200))
                    
                    self.sampling_count += 1
                    frh.save_sample_image(self.sampling_student_id, cropped_resized, self.sampling_count)
                    
                    # Overlay progress
                    cv2.putText(
                        frame, 
                        f"Sample {self.sampling_count}/{self.sampling_limit}", 
                        (x, y - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 
                        0.6, 
                        (14, 165, 233), 
                        2
                    )
                    
                    self.log_status(f"Captured sample {self.sampling_count}/{self.sampling_limit}.")
                    
                    # Check limit reached
                    if self.sampling_count >= self.sampling_limit:
                        self.current_mode = "Idle"
                        self.mode_pill.configure(text="SYSTEM STATUS: IDLE", text_color="#94A3B8", fg_color="#334155")
                        self.log_status(f"Completed capturing 30 samples for Student {self.sampling_student_id}!")
                        
                        # Clear inputs in main thread
                        self.id_entry.delete(0, tk.END)
                        self.name_entry.delete(0, tk.END)
                        self.dept_entry.delete(0, tk.END)
                        
                        messagebox.showinfo(
                            "Samples Captured", 
                            f"30 face samples for student '{self.sampling_student_id}' were successfully cataloged. Click 'Train Face Recognizer' to finalize."
                        )
                elif len(faces) == 0:
                    self.log_status("No face detected! Please adjust lighting and face the camera.", is_error=True)
                else:
                    self.log_status("Multiple faces detected! Please ensure only one person is in the frame.", is_error=True)

            elif self.current_mode == "Tracking":
                for (x, y, w, h) in faces:
                    cropped_face = gray[y:y+h, x:x+w]
                    cropped_resized = cv2.resize(cropped_face, (200, 200))
                    
                    # Run predictions
                    student_id, name, conf = self.recognizer_model.predict_face(cropped_resized)
                    
                    if student_id != "Unknown" and student_id != "No Model" and student_id != "Error":
                        # Mark present in database
                        success, db_name, time_marked = database.mark_attendance(student_id)
                        
                        # Set colors and labels
                        rect_color = (0, 255, 0) # Green for authorized
                        display_text = f"{name} ({student_id})"
                        
                        if success:
                            self.log_status(f"Logged Attendance: {db_name} is marked present at {time_marked}!")
                            self.refresh_logs()
                    else:
                        rect_color = (0, 0, 255) # Red for unauthorized
                        display_text = "Unknown Face"
                    
                    # Draw rectangle
                    cv2.rectangle(frame, (x, y), (x+w, y+h), rect_color, 2)
                    # Overlay text
                    cv2.putText(
                        frame, 
                        display_text, 
                        (x, y - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 
                        0.6, 
                        rect_color, 
                        2
                    )

            elif self.current_mode == "Idle":
                # Simply highlight detected faces, no predictions
                for (x, y, w, h) in faces:
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (245, 158, 11), 2)
                    cv2.putText(
                        frame, 
                        "Face Detected", 
                        (x, y - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 
                        0.5, 
                        (245, 158, 11), 
                        1
                    )
            
            # Convert OpenCV BGR to RGB
            rgb_img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Resize image to fit viewport width=480 height=360
            resized_img = cv2.resize(rgb_img, (480, 360))
            
            # Create PIL image
            pil_image = Image.fromarray(resized_img)
            
            # Convert to CTkImage format
            ctk_image = ctk.CTkImage(light_image=pil_image, dark_image=pil_image, size=(480, 360))
            
            # Configure label
            self.camera_label.configure(image=ctk_image, text="")
            self.camera_label.image = ctk_image

        # Re-schedule frame loop (roughly 30 FPS)
        self.after(30, self.update_camera_frame)

    def export_logs_to_csv(self):
        """
        Dumps today's attendance logs list into a physical CSV file.
        """
        logs = database.get_attendance_logs_for_date()
        if not logs:
            messagebox.showwarning("Empty Log", "There are no attendance records to export today.")
            return

        # Request location
        default_name = f"Attendance_Log_{datetime.now().strftime('%Y-%m-%d')}.csv"
        file_path = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV Files", "*.csv")],
            initialfile=default_name,
            title="Save Attendance CSV File"
        )

        if not file_path:
            return

        try:
            with open(file_path, "w", newline="") as csv_file:
                writer = csv.writer(csv_file)
                # Header row
                writer.writerow(["Log ID", "Student ID", "Student Name", "Department", "Date Logged", "Time Logged"])
                
                for row in logs:
                    writer.writerow([
                        row["id"],
                        row["student_id"],
                        row["name"],
                        row["department"],
                        row["date"],
                        row["time"]
                    ])
            
            messagebox.showinfo("Export Successful", f"Attendance spreadsheet saved to:\n{file_path}")
            self.log_status(f"Exported attendance logs sheet to CSV.")
        except Exception as e:
            messagebox.showerror("Export Failed", f"An error occurred writing files: {str(e)}")

    def on_closing(self):
        """
        Callback to guarantee that system camera handle is closed before main thread exits.
        """
        self.stop_camera()
        self.destroy()

if __name__ == "__main__":
    app = AttendanceApp()
    app.mainloop()
