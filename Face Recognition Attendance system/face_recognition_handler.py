import cv2
import os
import numpy as np
from PIL import Image
import database

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
TRAINER_DIR = os.path.join(BASE_DIR, "trainer")
TRAINER_PATH = os.path.join(TRAINER_DIR, "trainer.yml")

# Ensure directories exist
os.makedirs(DATASET_DIR, exist_ok=True)
os.makedirs(TRAINER_DIR, exist_ok=True)

# Load Haar Cascade face detector
CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

def detect_faces(gray_frame):
    """
    Detects faces in a grayscale frame and returns bounding boxes.
    """
    faces = face_cascade.detectMultiScale(
        gray_frame,
        scaleFactor=1.2,
        minNeighbors=5,
        minSize=(100, 100)
    )
    return faces

def save_sample_image(student_id, gray_face, sample_num):
    """
    Saves a single grayscaled cropped face sample to the dataset directory.
    """
    filename = f"User.{student_id}.{sample_num}.jpg"
    filepath = os.path.join(DATASET_DIR, filename)
    cv2.imwrite(filepath, gray_face)
    return filepath

def get_samples_count(student_id):
    """
    Returns the number of samples already captured for a student_id.
    """
    files = os.listdir(DATASET_DIR)
    prefix = f"User.{student_id}."
    count = sum(1 for f in files if f.startswith(prefix) and f.endswith(".jpg"))
    return count

def train_recognizer():
    """
    Reads the dataset directory, looks up label_id mappings, trains the LBPH Face Recognizer,
    and saves the model as trainer.yml.
    Returns:
        tuple (bool, str) -> (success, message)
    """
    image_paths = [os.path.join(DATASET_DIR, f) for f in os.listdir(DATASET_DIR) if f.endswith(".jpg")]
    
    if not image_paths:
        return False, "No face samples found in dataset directory. Please capture face samples first."
    
    # Get all students to map student_id to label_id
    students = database.get_all_students()
    student_map = {s["student_id"]: s["label_id"] for s in students}
    
    face_samples = []
    labels = []
    
    for path in image_paths:
        # File name format: User.<student_id>.<sample_num>.jpg
        filename = os.path.basename(path)
        parts = filename.split(".")
        if len(parts) < 4:
            continue
            
        student_id = parts[1]
        
        # Look up corresponding integer label_id
        label_id = student_map.get(student_id)
        if label_id is None:
            # Skip samples of students not present in SQLite database
            continue
            
        # Read the image and convert to grayscale (Pillow L mode)
        try:
            pil_img = Image.open(path).convert('L')
            img_numpy = np.array(pil_img, 'uint8')
            
            # Detect face in the sample image to double check and crop (if not already done)
            # The samples should already be cropped, but doing it again adds robustness
            faces = face_cascade.detectMultiScale(img_numpy)
            
            for (x, y, w, h) in faces:
                face_samples.append(img_numpy[y:y+h, x:x+w])
                labels.append(label_id)
        except Exception as e:
            print(f"Error loading sample {path}: {str(e)}")
            continue

    if not face_samples:
        return False, "No valid face samples matched database students."

    try:
        # Create and train LBPH Recognizer
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        recognizer.train(face_samples, np.array(labels))
        recognizer.save(TRAINER_PATH)
        return True, f"Successfully trained model on {len(face_samples)} face samples."
    except AttributeError:
        return False, "OpenCV face recognition module not available. Ensure opencv-contrib-python is installed."
    except Exception as e:
        return False, f"Training failed: {str(e)}"

class FaceRecognizer:
    def __init__(self):
        self.recognizer = None
        self.label_mapping = {}
        self.load_model()
        
    def load_model(self):
        """
        Loads the trained trainer.yml and refreshes the database label mapping.
        """
        self.label_mapping = database.get_label_mapping()
        if os.path.exists(TRAINER_PATH):
            try:
                self.recognizer = cv2.face.LBPHFaceRecognizer_create()
                self.recognizer.read(TRAINER_PATH)
                return True
            except Exception as e:
                print(f"Error loading face recognition model: {str(e)}")
                self.recognizer = None
        else:
            self.recognizer = None
        return False

    def predict_face(self, gray_face):
        """
        Predicts the identity of a face.
        Returns:
            tuple (str, str, float) -> (student_id, name, confidence)
            If unrecognized, returns ("Unknown", "Unknown", confidence)
        """
        if self.recognizer is None:
            return "No Model", "Model Not Trained", 0.0
            
        try:
            label_id, confidence = self.recognizer.predict(gray_face)
            
            # LBPH returns distance as confidence.
            # 0 is a perfect match. Lower is better. Typically:
            # - < 65: Excellent match
            # - < 85: Decent match
            # - > 85: Unreliable / Unknown
            if confidence < 80:
                student_info = self.label_mapping.get(label_id)
                if student_info:
                    return student_info["student_id"], student_info["name"], confidence
                    
            return "Unknown", "Unknown", confidence
        except Exception as e:
            print(f"Prediction failed: {str(e)}")
            return "Error", "Prediction Error", 0.0
