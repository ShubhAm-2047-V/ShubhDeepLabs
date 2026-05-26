import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "attendance.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create students table with integer label_id for OpenCV recognizer
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        student_id TEXT PRIMARY KEY,
        label_id INTEGER UNIQUE NOT NULL,
        name TEXT NOT NULL,
        department TEXT,
        created_at TEXT NOT NULL
    )
    """)
    
    # Create attendance table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students (student_id)
    )
    """)
    
    conn.commit()
    conn.close()

def add_student(student_id, name, department):
    conn = get_connection()
    cursor = conn.cursor()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        # Generate next auto-incrementing integer label_id
        cursor.execute("SELECT COALESCE(MAX(label_id), 0) + 1 FROM students")
        next_label_id = cursor.fetchone()[0]
        
        cursor.execute(
            "INSERT INTO students (student_id, label_id, name, department, created_at) VALUES (?, ?, ?, ?, ?)",
            (student_id, next_label_id, name, department, created_at)
        )
        conn.commit()
        success = True
    except sqlite3.IntegrityError:
        success = False
    finally:
        conn.close()
    return success

def get_student(student_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE student_id = ?", (student_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def get_all_students():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students ORDER BY student_id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def mark_attendance(student_id):
    """
    Marks attendance for a student on the current date if not already marked.
    Returns:
        tuple (bool, str, str) -> (success, name, time_marked)
    """
    # Verify student exists
    student = get_student(student_id)
    if not student:
        return False, "Unknown Student", ""

    now = datetime.now()
    current_date = now.strftime("%Y-%m-%d")
    current_time = now.strftime("%H:%M:%S")

    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if already marked present today
    cursor.execute(
        "SELECT * FROM attendance WHERE student_id = ? AND date = ?",
        (student_id, current_date)
    )
    already_marked = cursor.fetchone()
    
    if already_marked:
        conn.close()
        return False, student["name"], already_marked["time"]
        
    # Mark present
    cursor.execute(
        "INSERT INTO attendance (student_id, date, time) VALUES (?, ?, ?)",
        (student_id, current_date, current_time)
    )
    conn.commit()
    conn.close()
    return True, student["name"], current_time

def get_attendance_logs_for_date(date_str=None):
    """
    Retrieves all attendance logs for a specific date, joined with student info.
    If date_str is None, it defaults to the current date.
    """
    if date_str is None:
        date_str = datetime.now().strftime("%Y-%m-%d")
        
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT a.id, a.student_id, s.name, s.department, a.date, a.time
        FROM attendance a
        JOIN students s ON a.student_id = s.student_id
        WHERE a.date = ?
        ORDER BY a.time DESC
    """, (date_str,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_label_mapping():
    """
    Returns a dictionary mapping label_id (int) to a dict of student details.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT label_id, student_id, name, department FROM students")
    rows = cursor.fetchall()
    conn.close()
    return {r["label_id"]: {"student_id": r["student_id"], "name": r["name"], "department": r["department"]} for r in rows}

# Initialize DB immediately when database is imported
init_db()
