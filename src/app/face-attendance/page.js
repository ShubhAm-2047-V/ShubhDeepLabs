"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Camera, UserPlus, RefreshCw, Download, ArrowLeft, Brain, 
  Clock, AlertCircle, FileText, Trash2, CheckCircle2, UserCheck
} from "lucide-react";

// Default seed students
const DEFAULT_STUDENTS = [
  { studentId: "BCA-101", name: "Ramesh Kumar", department: "BCA Computer Sci", addedAt: new Date().toISOString() },
  { studentId: "BTECH-405", name: "Sunita Patel", department: "B.Tech CSE", addedAt: new Date().toISOString() },
  { studentId: "DIP-202", name: "Amit Sharma", department: "Diploma Mechanical", addedAt: new Date().toISOString() }
];

// Default seed logs
const DEFAULT_LOGS = [
  { id: "log-seed-1", studentId: "BTECH-405", name: "Sunita Patel", department: "B.Tech CSE", date: new Date().toLocaleDateString(), time: "09:15:32" },
  { id: "log-seed-2", studentId: "DIP-202", name: "Amit Sharma", department: "Diploma Mechanical", date: new Date().toLocaleDateString(), time: "09:42:10" }
];

export default function FaceAttendanceWorkspace() {
  const [mounted, setMounted] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  
  // Demo Expiry & Timer States
  const [tokenStatus, setTokenStatus] = useState("loading"); // loading, approved, expired, invalid
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300s)

  // Camera & Stream states
  const [cameraActive, setCameraActive] = useState(false);
  const [currentMode, setCurrentMode] = useState("Idle"); // Idle, Sampling, Tracking
  const [trackingActive, setTrackingActive] = useState(false);
  
  // Form fields
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newDept, setNewDept] = useState("");
  
  // Sampling states
  const [samplingStudent, setSamplingStudent] = useState(null);
  const [samplingCount, setSamplingCount] = useState(0);
  const samplingLimit = 30;

  // Stream references
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const frameIdRef = useRef(null);
  
  // Track last marked time to avoid rapid multiple logs
  const lastMarkedRef = useRef({});

  // Refs to avoid stale closures in canvas animation loop
  const currentModeRef = useRef("Idle");
  const trackingActiveRef = useRef(false);
  const samplingStudentRef = useRef(null);
  const samplingCountRef = useRef(0);
  const studentsRef = useRef([]);
  const detectedFacesRef = useRef([]);
  const trackerTaskRef = useRef(null);

  // Load tracking.js and face classifier from CDN on mount
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdnjs.cloudflare.com/ajax/libs/tracking.js/1.1.3/tracking-min.js";
    script1.async = true;
    
    script1.onload = () => {
      const script2 = document.createElement("script");
      script2.src = "https://cdnjs.cloudflare.com/ajax/libs/tracking.js/1.1.3/data/face-min.js";
      script2.async = true;
      script2.onload = () => {
        addSystemLog("Client-side face detection module loaded successfully.", "info");
      };
      document.body.appendChild(script2);
    };
    document.body.appendChild(script1);
    
    return () => {
      // Clean up script tags if component unmounts
      if (document.body.contains(script1)) document.body.removeChild(script1);
    };
  }, []);

  // Keep refs in sync with React state
  useEffect(() => {
    currentModeRef.current = currentMode;
  }, [currentMode]);

  useEffect(() => {
    trackingActiveRef.current = trackingActive;
  }, [trackingActive]);

  useEffect(() => {
    samplingStudentRef.current = samplingStudent;
  }, [samplingStudent]);

  useEffect(() => {
    samplingCountRef.current = samplingCount;
  }, [samplingCount]);

  useEffect(() => {
    studentsRef.current = students;
  }, [students]);

  // Verify token and seed databases on mount
  useEffect(() => {
    setMounted(true);
    
    const localExpiry = localStorage.getItem("shubdeep_demo_expiry");
    if (!localExpiry) {
      setTokenStatus("invalid");
      return;
    }

    const expiryTime = parseInt(localExpiry, 10);
    const remaining = expiryTime - Date.now();
    
    if (remaining > 0) {
      setTokenStatus("approved");
      setTimeLeft(Math.floor(remaining / 1000));
    } else {
      setTokenStatus("expired");
    }

    // Load students database
    const localStudents = localStorage.getItem("shubdeep_attendance_students");
    if (localStudents) {
      setStudents(JSON.parse(localStudents));
    } else {
      setStudents(DEFAULT_STUDENTS);
      localStorage.setItem("shubdeep_attendance_students", JSON.stringify(DEFAULT_STUDENTS));
    }

    // Load logs
    const localLogs = localStorage.getItem("shubdeep_attendance_logs");
    if (localLogs) {
      setAttendanceLogs(JSON.parse(localLogs));
    } else {
      setAttendanceLogs(DEFAULT_LOGS);
      localStorage.setItem("shubdeep_attendance_logs", JSON.stringify(DEFAULT_LOGS));
    }

    addSystemLog("=======================================================", "info");
    addSystemLog("  Face Recognition Engine Online (Webcam Simulation).", "info");
    addSystemLog("  SQLite Database mock loaded inside browser context.", "info");
    addSystemLog("=======================================================", "info");
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (tokenStatus !== "approved") return;

    const timer = setInterval(() => {
      const localExpiry = localStorage.getItem("shubdeep_demo_expiry");
      if (!localExpiry) {
        setTokenStatus("invalid");
        clearInterval(timer);
        return;
      }
      const expiryTime = parseInt(localExpiry, 10);
      const remaining = expiryTime - Date.now();

      if (remaining <= 0) {
        clearInterval(timer);
        setTokenStatus("expired");
        setTimeLeft(0);
        addSystemLog("[System] Demo Session Expired. Session locked.", "warn");
      } else {
        setTimeLeft(Math.floor(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tokenStatus]);

  // Clean camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Console logging helper
  const addSystemLog = (message, level = "info") => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSystemLogs(prev => [{ timestamp, level, message }, ...prev].slice(0, 50));
  };

  // --- CAMERA CONTROL LOGIC ---
  const startCamera = async () => {
    if (cameraActive) return true;
    addSystemLog("Connecting to client webcam device...", "info");
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360, facingMode: "user" }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setCameraActive(true);
      addSystemLog("Webcam connection established. Frame stream active.", "info");
      
      // Initialize tracking.js tracker on the video stream
      if (window.tracking && window.tracking.ObjectTracker) {
        try {
          const tracker = new window.tracking.ObjectTracker('face');
          tracker.setInitialScale(4);
          tracker.setStepSize(2);
          tracker.setEdgesDensity(0.1);
          
          tracker.on('track', (event) => {
            detectedFacesRef.current = event.data || [];
          });
          
          trackerTaskRef.current = window.tracking.track(videoRef.current, tracker);
          addSystemLog("Face detector registered on video stream.", "info");
        } catch (trackerErr) {
          console.error("Tracker initialization failed:", trackerErr);
          addSystemLog("Tracker startup warning. Running in fallback mode.", "warn");
        }
      } else {
        addSystemLog("Tracking library not loaded yet. Running in standby mock.", "warn");
      }

      // Start canvas drawing loops
      setTimeout(() => {
        startCanvasLoop();
      }, 500);
      return true;
    } catch (err) {
      console.error(err);
      addSystemLog("Failed to connect webcam. Falling back to video placeholder.", "error");
      // Fallback: active state but no real webcam (draws a simulated face frame)
      setCameraActive(true);
      setTimeout(() => {
        startCanvasLoop();
      }, 500);
      return true;
    }
  };

  const stopCamera = () => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
    
    if (trackerTaskRef.current) {
      trackerTaskRef.current.stop();
      trackerTaskRef.current = null;
    }
    detectedFacesRef.current = [];

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
    setTrackingActive(false);
    setCurrentMode("Idle");
    addSystemLog("Webcam stream released. Standby mode active.", "info");
  };

  // --- CANVAS & SCANNING PIPELINE ---
  const startCanvasLoop = () => {
    if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);

    let frameCount = 0;
    let targetX = 240;
    let targetY = 180;
    let targetRadius = 65;
    
    // Smooth target movement
    let faceX = 240;
    let faceY = 180;
    let scanLine = 120;
    let scanDirection = 1.5;

    const draw = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      ctx.clearRect(0, 0, width, height);
      frameCount++;

      // 1. Draw webcam feed if actual webcam is active
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        // Draw video mirrored horizontally
        ctx.save();
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        ctx.restore();
      } else {
        // Draw mock camera background
        ctx.fillStyle = "#1E293B";
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.arc(240, 160, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(240, 240, 65, 45, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#475569";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("[Webcam Mock Feed Running]", width / 2, height / 2 + 80);
      }

      // 2. Fetch Face coordinates
      let faces = [];
      if (streamRef.current) {
        faces = detectedFacesRef.current || [];
      } else if (cameraActive) {
        // Fallback simulation when camera is in simulated placeholder mode
        const simX = 240 + Math.sin(frameCount * 0.02) * 15;
        const simY = 170 + Math.cos(frameCount * 0.035) * 8;
        faces = [{ x: simX - 65, y: simY - 65, width: 130, height: 130, isSimulated: true }];
      }

      // If faces are detected in the feed
      if (faces.length > 0) {
        const rect = faces[0];
        
        // Horizontal mirroring correction
        const x = rect.isSimulated ? rect.x : (width - rect.x - rect.width);
        const y = rect.y;
        const w = rect.width;
        const h = rect.height;

        // 3. Handle Sampling Mode
        if (currentModeRef.current === "Sampling" && samplingStudentRef.current) {
          // Draw blue capture crosshair
          ctx.strokeStyle = "#0EA5E9";
          ctx.lineWidth = 3;
          ctx.setLineDash([]);
          ctx.strokeRect(x, y, w, h);

          // Corner markings
          ctx.fillStyle = "#0EA5E9";
          ctx.fillRect(x - 5, y - 5, 20, 5);
          ctx.fillRect(x - 5, y - 5, 5, 20);
          ctx.fillRect(x + w - 15, y - 5, 20, 5);
          ctx.fillRect(x + w, y - 5, 5, 20);
          ctx.fillRect(x - 5, y + h, 20, 5);
          ctx.fillRect(x - 5, y + h - 15, 5, 20);
          ctx.fillRect(x + w - 15, y + h, 20, 5);
          ctx.fillRect(x + w, y + h - 15, 5, 20);

          // Scan animation inside box
          ctx.strokeStyle = "rgba(14, 165, 233, 0.4)";
          ctx.beginPath();
          scanLine += scanDirection;
          if (scanLine > y + h - 10 || scanLine < y + 10) scanDirection *= -1;
          ctx.moveTo(x + 10, scanLine);
          ctx.lineTo(x + w - 10, scanLine);
          ctx.stroke();

          // Overlay text
          ctx.fillStyle = "#0EA5E9";
          ctx.font = "bold 12px sans-serif";
          ctx.fillText(`SAMPLING: ${samplingCountRef.current + 1}/${samplingLimit}`, x, y - 10);
        }

        // 4. Handle Tracking / Recognition Mode
        else if (currentModeRef.current === "Tracking" && trackingActiveRef.current) {
          // Perform mock periodic face identification (every 50 frames ~ 1.5s)
          const scanPeriod = 50;
          const scanIndex = frameCount % scanPeriod;
          
          let labelColor = "#EAB308"; // Scanning yellow
          let labelText = "IDENTIFYING FACE...";
          
          if (scanIndex > 35) {
            // Identify! Match against students
            labelColor = "#10B981"; // Green match
            
            // Pick the last enrolled student (user registered) or default seed
            const matchTarget = studentsRef.current[studentsRef.current.length - 1] || DEFAULT_STUDENTS[0];
            labelText = `${matchTarget.name} (${matchTarget.studentId})`;
            
            // Mark attendance in database
            if (scanIndex === 36) {
              triggerMarkAttendance(matchTarget);
            }
          }

          // Draw bounding box
          ctx.strokeStyle = labelColor;
          ctx.lineWidth = 3;
          ctx.setLineDash([]);
          ctx.strokeRect(x, y, w, h);

          // Corner designs
          ctx.fillStyle = labelColor;
          ctx.fillRect(x - 5, y - 5, 20, 5);
          ctx.fillRect(x - 5, y - 5, 5, 20);
          ctx.fillRect(x + w - 15, y - 5, 20, 5);
          ctx.fillRect(x + w, y - 5, 5, 20);
          ctx.fillRect(x - 5, y + h, 20, 5);
          ctx.fillRect(x - 5, y + h - 15, 5, 20);
          ctx.fillRect(x + w - 15, y + h, 20, 5);
          ctx.fillRect(x + w, y + h - 15, 5, 20);

          // Scan Line
          ctx.strokeStyle = `${labelColor}40`; // transparency
          ctx.beginPath();
          scanLine += scanDirection * 1.5;
          if (scanLine > y + h - 10 || scanLine < y + 10) scanDirection *= -1;
          ctx.moveTo(x + 10, scanLine);
          ctx.lineTo(x + w - 10, scanLine);
          ctx.stroke();

          // Print details
          ctx.fillStyle = labelColor;
          ctx.font = "bold 13px sans-serif";
          ctx.fillText(labelText, x, y - 10);
        }

        // 5. Handle Idle Mode
        else {
          // Just draw yellow boundary box around detected face
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]); // dashed box for standby
          ctx.strokeRect(x, y, w, h);

          ctx.fillStyle = "#F59E0B";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText("FACE DETECTED (STANDBY)", x, y - 10);
        }
      }

      frameIdRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  // --- SIMULATED SAMPLING TRIGGER ---
  useEffect(() => {
    if (currentMode !== "Sampling" || !samplingStudent) return;

    const interval = setInterval(() => {
      setSamplingCount(prev => {
        if (prev + 1 >= samplingLimit) {
          clearInterval(interval);
          finishSampling();
          return samplingLimit;
        }
        addSystemLog(`Face snapshot #${prev + 2} exported to local dataset index.`, "info");
        return prev + 1;
      });
    }, 85); // Capture every 85ms

    return () => clearInterval(interval);
  }, [currentMode, samplingStudent]);

  const finishSampling = () => {
    addSystemLog(`Successfully logged 30 samples to directory.`, "info");
    
    // Add student to the database
    const newStudentObj = {
      studentId: samplingStudent.id,
      name: samplingStudent.name,
      department: samplingStudent.dept,
      addedAt: new Date().toISOString()
    };

    const updatedStudents = [...students, newStudentObj];
    setStudents(updatedStudents);
    localStorage.setItem("shubdeep_attendance_students", JSON.stringify(updatedStudents));
    
    addSystemLog(`Registered student metadata: ${newStudentObj.name} (${newStudentObj.studentId}) saved.`, "info");
    
    // Reset Form
    setNewId("");
    setNewName("");
    setNewDept("");
    setSamplingStudent(null);
    setCurrentMode("Idle");

    // Display alert
    alert(`30 face samples captured! Registered student ${newStudentObj.name}. Ensure you click 'Train Face Recognizer' next.`);
  };

  // --- SYSTEM LOG ACTIONS ---
  const triggerMarkAttendance = (student) => {
    const currentDay = new Date().toLocaleDateString();
    
    // Anti-bounce check: prevent marking the same student multiple times in 10 seconds
    const lastMarked = lastMarkedRef.current[student.studentId] || 0;
    if (Date.now() - lastMarked < 10000) {
      return; // Skip marking
    }

    lastMarkedRef.current[student.studentId] = Date.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Check if already logged today
    const exists = attendanceLogs.some(l => l.studentId === student.studentId && l.date === currentDay);
    if (exists) {
      addSystemLog(`[Attendance Bypass] ${student.name} already marked present today.`, "warn");
      return;
    }

    const newLog = {
      id: `log-${Date.now()}`,
      studentId: student.studentId,
      name: student.name,
      department: student.department,
      date: currentDay,
      time: timeStr
    };

    const updatedLogs = [newLog, ...attendanceLogs];
    setAttendanceLogs(updatedLogs);
    localStorage.setItem("shubdeep_attendance_logs", JSON.stringify(updatedLogs));

    addSystemLog(`[DATABASE Log SUCCESS] Marked ${student.name} PRESENT at ${timeStr}.`, "success");
  };

  const handleEnrollStudent = (e) => {
    e.preventDefault();
    if (!newId.trim() || !newName.trim()) {
      alert("Please enter Student ID and Name.");
      return;
    }

    // Check duplicate ID
    const exists = students.some(s => s.studentId.toLowerCase() === newId.trim().toLowerCase());
    if (exists) {
      alert("A student with this ID is already enrolled.");
      return;
    }

    startCamera().then(res => {
      if (res) {
        setSamplingCount(0);
        setSamplingStudent({ id: newId.trim(), name: newName.trim(), dept: newDept.trim() || "N/A" });
        setCurrentMode("Sampling");
        addSystemLog(`Initializing sampling queue for ${newName.trim()}. Adjust camera focus.`, "info");
      }
    });
  };

  const handleTrainRecognizer = () => {
    addSystemLog("Reading database files and assembling classifier...", "info");
    addSystemLog("Compiling LBPH Face Recognizer matrix...", "info");
    
    // Simulate training delay
    setTimeout(() => {
      addSystemLog("Weights mapped. Successfully saved model to /trainer/trainer.yml.", "info");
      alert("Face recognition classifier trained successfully!");
    }, 1500);
  };

  const handleStartTracking = () => {
    startCamera().then(res => {
      if (res) {
        setTrackingActive(true);
        setCurrentMode("Tracking");
        addSystemLog("Live attendance validation enabled. Standing by for recognition.", "info");
      }
    });
  };

  const handleDeleteStudent = (studentId) => {
    if (!confirm(`Are you sure you want to delete student ID: ${studentId}?`)) return;

    const filtered = students.filter(s => s.studentId !== studentId);
    setStudents(filtered);
    localStorage.setItem("shubdeep_attendance_students", JSON.stringify(filtered));
    addSystemLog(`Removed student ${studentId} from active registry.`, "warn");
  };

  const handleResetLogs = () => {
    if (!confirm("Are you sure you want to reset all logs to default?")) return;
    setAttendanceLogs(DEFAULT_LOGS);
    localStorage.setItem("shubdeep_attendance_logs", JSON.stringify(DEFAULT_LOGS));
    addSystemLog("Attendance database logs cleared and reset to defaults.", "warn");
  };

  const exportLogsToCSV = () => {
    if (attendanceLogs.length === 0) {
      alert("No logs to export.");
      return;
    }

    const csvContent = [
      ["Log ID", "Student ID", "Student Name", "Department", "Date Logged", "Time Logged"],
      ...attendanceLogs.map(l => [l.id, l.studentId, l.name, l.department, l.date, l.time])
    ]
      .map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addSystemLog("Exported attendance logs sheet to CSV download.", "info");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  // Render Loading State
  if (tokenStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#070A13] text-[#94A3B8] flex items-center justify-center font-sans p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2.5 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold">Verifying Secure Access Token...</p>
        </div>
      </div>
    );
  }

  // Render Expired/Invalid Block State
  if (tokenStatus !== "approved") {
    return (
      <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] flex items-center justify-center font-sans p-4">
        <div className="sketch-card bg-white p-8 max-w-md w-full text-center relative shadow-[6px_8px_0px_#2C2C2C]">
          <div className="absolute top-3 left-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
          <div className="absolute top-3 right-3 w-4 h-4 bg-[#FAF6EE] border-2 border-[#2C2C2C] rounded-full" />
          
          <div className="w-12 h-12 bg-red-100 border-2 border-[#2C2C2C] text-red-500 flex items-center justify-center rounded-xl mx-auto mb-5 shadow-[2px_2.5px_0_#2C2C2C]">
            <AlertCircle size={24} />
          </div>
          
          <h2 className="text-[#2C2C2C] text-2xl font-hand font-extrabold mb-3">
            {tokenStatus === "expired" ? "Demo Session Expired" : "Access Key Restricted"}
          </h2>
          
          <p className="text-xs font-marker text-[#5A5A5A] leading-relaxed mb-6">
            {tokenStatus === "expired" 
              ? "Your 5-minute preview session has elapsed. To request new access, click the 'Request Demo Output' button on our home page."
              : "Direct access to this workspace is restricted. Please go to the homepage and click 'Request Demo Output' to start a session."}
          </p>

          <Link
            href="/"
            className="btn-sketch w-full py-3 px-6 text-sm flex items-center justify-center"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2C2C2C] p-4 pt-20 md:pt-24 flex flex-col font-sans">
      
      {/* 1. ROW HEADER */}
      <header className="sketch-card bg-white p-4 flex flex-col md:flex-row md:items-center justify-between shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] mb-5 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 border-2 border-[#2C2C2C] rounded-xl bg-white hover:bg-[#FFF9C4] transition-all text-[#2C2C2C] shadow-[1.5px_2px_0_#2C2C2C] flex items-center justify-center">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-[#8B5CF6] border-2 border-[#2C2C2C] p-2 rounded-xl shadow-[2px_2.5px_0_#2C2C2C]">
              <Camera size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-[#2C2C2C] text-lg md:text-xl font-hand font-extrabold leading-none">Advanced Face Recognition Attendance Portal</h1>
              <p className="text-[10px] md:text-xs font-marker text-[#5A5A5A] mt-1">Unified OpenCV Simulation Dashboard & Database Controller</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3.5 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 marker-red border-2 border-[#2C2C2C] rounded-xl text-[#2C2C2C] font-marker font-bold shadow-[2px_2.5px_0_#2C2C2C] animate-pulse">
            <span>⏱️ EXPIRES IN: {formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-2 font-marker font-bold border-2 border-[#2C2C2C] bg-white rounded-xl px-2.5 py-1.5 shadow-[2px_2px_0_#2C2C2C]">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse border border-[#2C2C2C] ${cameraActive ? "bg-emerald-500 shadow-[0_0_4px_#10b981]" : "bg-red-500"}`}></span>
            <span className="text-[#2C2C2C] tracking-wide">CAMERA: {cameraActive ? "ONLINE" : "STANDBY"}</span>
          </div>
          <button 
            onClick={handleResetLogs}
            className="btn-sketch py-1.5 px-3 text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={12} />
            <span>Reset Logs</span>
          </button>
        </div>
      </header>

      {/* 2. THREE-PANEL CORE GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-grow min-h-0 mb-6">
        
        {/* PANEL A: STUDENT ENROLLMENT (Left - 3 Cols) */}
        <section className="lg:col-span-3 sketch-card bg-white flex flex-col h-full shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] p-5">
          <h2 className="text-[#2C2C2C] text-lg font-hand font-extrabold mb-5 flex items-center gap-2 pb-2.5 border-b-2 border-dashed border-[#2C2C2C]/15">
            <UserPlus size={18} className="text-[#0EA5E9]" />
            <span>Enroll Student</span>
          </h2>
          
          <form onSubmit={handleEnrollStudent} className="space-y-4">
            <div>
              <label className="block text-xs font-marker font-bold text-[#5A5A5A] uppercase mb-1">Student ID</label>
              <input
                type="text"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="e.g. BCA-104"
                className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-3 py-2 text-sm text-[#2C2C2C] focus:outline-none focus:bg-[#FFF9C4]/10 font-sans font-semibold"
                disabled={currentMode === "Sampling"}
              />
            </div>
            
            <div>
              <label className="block text-xs font-marker font-bold text-[#5A5A5A] uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-3 py-2 text-sm text-[#2C2C2C] focus:outline-none focus:bg-[#FFF9C4]/10 font-sans font-semibold"
                disabled={currentMode === "Sampling"}
              />
            </div>

            <div>
              <label className="block text-xs font-marker font-bold text-[#5A5A5A] uppercase mb-1">Department</label>
              <input
                type="text"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                placeholder="e.g. BCA CSE"
                className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-3 py-2 text-sm text-[#2C2C2C] focus:outline-none focus:bg-[#FFF9C4]/10 font-sans font-semibold"
                disabled={currentMode === "Sampling"}
              />
            </div>

            <button
              type="submit"
              className="btn-sketch w-full py-2.5 text-sm flex items-center justify-center gap-1.5"
              disabled={currentMode === "Sampling"}
            >
              <Camera size={14} />
              <span>Capture Face Samples</span>
            </button>
          </form>

          <button
            onClick={handleTrainRecognizer}
            className="btn-sketch w-full py-2.5 text-sm flex items-center justify-center gap-1.5 bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/30 text-[#6D28D9] border-[#8B5CF6] mt-4"
            disabled={currentMode === "Sampling"}
          >
            <Brain size={14} />
            <span>Train Face Recognizer</span>
          </button>

          {/* Subregistered students table list */}
          <div className="flex-grow min-h-[140px] mt-6 flex flex-col">
            <span className="block text-[10px] font-marker font-bold text-[#5A5A5A] uppercase tracking-wider mb-2">Registered Students Index</span>
            <div className="flex-grow overflow-y-auto border-2 border-[#2C2C2C] bg-[#FAF6EE] rounded-xl p-2 max-h-[180px]">
              {students.length === 0 ? (
                <p className="text-[10px] text-center text-gray-500 mt-8 font-sans font-semibold">No students registered.</p>
              ) : (
                <div className="space-y-1.5">
                  {students.map((student, i) => (
                    <div key={i} className="flex items-center justify-between bg-white border border-[#2C2C2C]/10 p-1.5 rounded-lg text-[10px] font-sans font-semibold shadow-[1px_1.5px_0_rgba(0,0,0,0.05)]">
                      <div>
                        <p className="text-[#2C2C2C] font-extrabold">{student.name} ({student.studentId})</p>
                        <p className="text-[9px] text-[#5A5A5A] leading-none">{student.department}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteStudent(student.studentId)}
                        className="text-red-500 hover:text-red-700 p-0.5"
                        title="Delete student"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PANEL B: CAMERA SCANNERS WORKSPACE (Center - 5 Cols) */}
        <section className="lg:col-span-5 sketch-card bg-white flex flex-col h-full shadow-[5px_6px_0_#2C2C2C] border-3 border-[#2C2C2C] overflow-hidden">
          <div className="px-5 py-4 border-b-3 border-[#2C2C2C] flex justify-between items-center bg-[#FAF6EE]">
            <h2 className="text-[#2C2C2C] text-sm md:text-base font-marker font-bold flex items-center gap-2">
              <Camera size={16} className="text-[#2C2C2C]" />
              <span>Camera Tracking Viewport</span>
            </h2>
            <span className="text-[9px] px-2.5 py-0.5 font-marker font-extrabold uppercase border border-[#2C2C2C] rounded-full marker-yellow select-none">
              Mode: {currentMode}
            </span>
          </div>

          {/* Simulated Webcam video display box */}
          <div className="flex-1 bg-[#1E293B] relative overflow-hidden flex items-center justify-center p-2.5">
            
            {/* Native video tag (hidden, feeds stream to canvas) */}
            <video 
              ref={videoRef} 
              className="hidden" 
              width="480" 
              height="360" 
              playsInline 
              muted
            />

            {/* Interactive Canvas */}
            <canvas 
              ref={canvasRef} 
              width="480" 
              height="360" 
              className="w-full max-w-full aspect-[4/3] rounded-lg border-2 border-[#2C2C2C] bg-slate-900 shadow-inner"
            />
            
            {/* Loading text overlays */}
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-center p-6 text-slate-400">
                <Camera size={38} className="text-slate-500 mb-3 animate-bounce" />
                <p className="text-xs font-marker font-extrabold text-slate-200">Video Capture Stream Standby</p>
                <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mt-1">Click &apos;Start Attendance Tracking&apos; or capture samples to load browser media feed.</p>
              </div>
            )}
          </div>

          {/* Action buttons bar */}
          <div className="p-4 border-t-3 border-[#2C2C2C] bg-[#FAF6EE] flex gap-3">
            <button
              onClick={handleStartTracking}
              className="flex-1 btn-sketch py-3 text-sm flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669]"
              disabled={currentMode === "Sampling"}
            >
              <UserCheck size={16} />
              <span>Start Attendance Tracking</span>
            </button>
            <button
              onClick={stopCamera}
              className="btn-sketch py-3 px-5 text-sm bg-red-500 hover:bg-red-600 text-white"
              disabled={!cameraActive}
            >
              Stop Camera
            </button>
          </div>
        </section>

        {/* PANEL C: LIVE ATTENDANCE LEDGER & LOGS (Right - 4 Cols) */}
        <section className="lg:col-span-4 sketch-card bg-white flex flex-col h-full shadow-[4px_5px_0_#2C2C2C] border-3 border-[#2C2C2C] p-5">
          <h2 className="text-[#2C2C2C] text-lg font-hand font-extrabold mb-1 flex items-center gap-2">
            <FileText size={18} className="text-[#F59E0B]" />
            <span>Attendance Ledger</span>
          </h2>
          <span className="block text-[9px] font-mono text-[#5A5A5A] mb-4">LOCAL SQLITE LOGS INDEX: ON-DEVICE</span>

          {/* Ruled ledger paper container */}
          <div className="flex-1 overflow-y-auto border-2 border-[#2C2C2C] rounded-xl p-3 notebook-ruled h-[340px]">
            {attendanceLogs.length === 0 ? (
              <p className="text-center text-xs text-gray-500 italic mt-20">No logs generated today.</p>
            ) : (
              <div className="space-y-2.5">
                {attendanceLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between border-2 border-[#2C2C2C] bg-white p-2.5 rounded-xl shadow-[1.5px_2px_0_#2C2C2C] text-xs font-sans font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[10px] text-[#38BDF8] border border-[#2C2C2C]/10 px-1 py-0.5 rounded bg-slate-50">{log.time}</span>
                      <div>
                        <p className="text-[#2C2C2C] font-extrabold">{log.name}</p>
                        <p className="text-[9px] text-gray-500">{log.studentId} • {log.department}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-300 rounded px-1.5 py-0.5 text-right font-marker">Present</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 pt-4 border-t-2 border-dashed border-[#2C2C2C]/15 space-y-3">
            <button
              onClick={exportLogsToCSV}
              className="btn-sketch w-full py-2.5 text-sm flex items-center justify-center gap-1.5"
            >
              <Download size={14} />
              <span>Export Ledger to CSV</span>
            </button>
            <div className="flex-grow overflow-y-auto max-h-[90px] border-2 border-[#2C2C2C] bg-slate-900 text-[#10B981] font-mono text-[9px] p-2 rounded-xl">
              <span className="block text-[8px] text-[#94A3B8] font-bold border-b border-[#334155] mb-1 pb-0.5">Real-Time Console Monitor</span>
              <div className="space-y-0.5 overflow-y-auto max-h-[60px] flex flex-col-reverse">
                {systemLogs.map((log, idx) => (
                  <p key={idx} className={log.level === "error" ? "text-red-400" : log.level === "warn" ? "text-yellow-400" : log.level === "success" ? "text-emerald-400" : "text-slate-300"}>
                    [{log.timestamp}] {log.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
