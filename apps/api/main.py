import numpy as np
import cv2
import base64
import json # Import json for sending structured data
from fastapi import FastAPI, WebSocket, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from deepface import DeepFace
import database as db
from pydantic import BaseModel, computed_field
import pickle
from typing import Literal
from fastapi.responses import JSONResponse

app = FastAPI()

# ... (CORS Middleware remains the same) ...
origins = ["http://localhost:3001","https://sih-sih-co98.vercel.app"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... (The /enroll endpoint remains the same) ...
@app.post("/enroll")
async def enroll_face(roll_number: str = Form(...), image: UploadFile = File(...), db_session: Session = Depends(db.get_db)):
    # ... (This function is unchanged)
    try:
        image_bytes = await image.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        embedding = DeepFace.represent(img, model_name='VGG-Face', enforce_detection=True)[0]['embedding']
        student_to_update = db_session.query(db.Student).filter(db.Student.rollNumber == roll_number).first()
        if not student_to_update:
            raise HTTPException(status_code=404, detail=f"Student with roll number '{roll_number}' not found.")
        student_to_update.encoding = embedding
        db_session.commit()
        return {"status": "success", "message": f"Successfully enrolled face for student {roll_number}."}
    except HTTPException as e:
        raise e
    except Exception as e:
        db_session.rollback()
        raise HTTPException(status_code=400, detail=f"Could not process image or update database: {e}")

# --- NEW WEBSOCKET ENDPOINT FOR AUTO-CAPTURE ANALYSIS ---
@app.websocket("/ws/analyze_face")
async def analyze_face(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            base64_str = await websocket.receive_text()
            if "," in base64_str:
                base64_str = base64_str.split(',')[1]

            img_bytes = base64.b64decode(base64_str)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            response = {"face_found": False, "confidence": 0.0}
            try:
                # We use extract_faces to get detection confidence. MTCNN is a good detector.
                face_objs = DeepFace.extract_faces(frame, detector_backend='mtcnn', enforce_detection=False)
                
                # The returned object is a list, one for each face found
                if len(face_objs) > 0 and face_objs[0]['confidence'] > 0:
                    # We only care about the most confident face
                    first_face = face_objs[0]
                    response["face_found"] = True
                    response["confidence"] = round(first_face['confidence'], 4)

            except (ValueError, IndexError):
                pass # No face found, response remains False

            # Send the analysis result back to the frontend
            await websocket.send_text(json.dumps(response))
    except Exception:
        print("Analysis client disconnected.")


# ... (The /ws/recognize endpoint remains the same) ...

@app.websocket("/ws/recognize")
async def recognize_face(websocket: WebSocket, db_session: Session = Depends(db.get_db)):
    await websocket.accept()
    print("WebSocket connection established.")
    try:
        while True:
            base64_str = await websocket.receive_text()

            if "," in base64_str:
                base64_str = base64_str.split(',')[1]

            img_bytes = base64.b64decode(base64_str)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            recognized_info = "..." 
            try:
                embedding = DeepFace.represent(frame, model_name='VGG-Face', enforce_detection=False)[0]['embedding']
                
                # --- THIS IS THE CORRECTED QUERY SYNTAX ---
                closest_student = db_session.query(db.Student).filter(db.Student.encoding != None).order_by(db.Student.encoding.op('<->')(embedding)).first()
                
                # The `op('<->')` returns the distance, so we need to get it differently
                if closest_student:
                    # To get the distance with .op(), we can re-calculate it or just trust the ordering
                    distance = np.linalg.norm(np.array(closest_student.encoding) - np.array(embedding))
                    print(f"DEBUG: Closest match found: {closest_student.rollNumber} with distance: {distance:.4f}")

                    MATCH_THRESHOLD = 1.2 
                    if distance < MATCH_THRESHOLD:
                        recognized_info = closest_student.rollNumber
                    else:
                        recognized_info = "Unknown"
                else:
                    print("DEBUG: No encodings found in the database to compare against.")
                    recognized_info = "Unknown"
                
                print(f"DEBUG: Match result: {recognized_info}")

            except (ValueError, IndexError):
                print("DEBUG: DeepFace could not find a face in the current frame.")
                recognized_info = "No face detected"

            await websocket.send_text(recognized_info)
    except Exception as e:
        print(f"FATAL WEBSOCKET ERROR: {e}") 
        print("Client disconnected.")
        
# --- STUDENT HABITS PREDICTION MODEL ENDPOINTS ---        
        
# Load the trained model
with open('models/StudentHabitsModel.pkl', 'rb') as f:
    model = pickle.load(f)

with open('models/StudentHabitsScaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

class StudentInput(BaseModel):
    age: float
    gender: Literal["Male", "Female"]
    study_hours_per_day: float
    social_media_hours: float
    part_time_job: Literal["Yes", "No"]
    attendance_percentage: float
    sleep_hours: float
    diet_quality: Literal["Fair", "Good", "Poor"]
    exercise_hours: float
    parental_education_level: Literal["Master", "High School", "Bachelor", "None"]
    mental_health: int

    @computed_field
    @property
    def gender_valid(self) -> int:
        try:
            return 1 if self.gender == "Male" else 0
        except ValueError:
            raise ValueError("Invalid Input")
    
    @computed_field
    @property
    def part_time_job_valid(self) -> int:
        return 1 if self.part_time_job == "Yes" else 0
    
    @computed_field
    @property
    def diet_quality_valid(self) -> int:
        return 0 if self.diet_quality == "Fair" else (1 if self.diet_quality == "Good" else 2)
    
    @computed_field
    @property
    def parental_education_level_valid(self) -> int:
        if self.parental_education_level == "Master":
            return 0
        elif self.parental_education_level == "High School":
            return 1
        elif self.parental_education_level == "Bachelor":
            return 2
        else:
            return 3

#human readable endpoint
@app.get('/')
def home():
    return {"message": "Welcome to the EduVance API."}

#machine readable endpoint eg: AWS services like kubernentes
@app.get('/health')
def health_check():
    return {
        "status": "OK",
        "message": "The API is healthy and running.",
    }

#prediction endpoint
@app.post("/predict")
async def predict(input: StudentInput):
    # Scale age and attendance_percentage
    scaled = scaler.transform([[input.age, input.attendance_percentage]])
    age_scaled = scaled[0][0]
    attendance_scaled = scaled[0][1]

    # Prepare input array
    input_array = np.array([[age_scaled, input.gender_valid, input.study_hours_per_day,
                             input.social_media_hours, input.part_time_job_valid, attendance_scaled,
                             input.sleep_hours, input.diet_quality_valid, input.exercise_hours,
                             input.parental_education_level_valid, input.mental_health]])
    try:
        prediction = model.predict(input_array)
        return JSONResponse(status_code=200, content={"predicted_exam_score": round(float(prediction[0]),2)})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# --- Student Droupout Prediction Model Endpoints ---

# Load your model
try:
    with open('models/model3.pkl', "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    model = None
    print("model3.pkl file not found. Place it in the same directory as this script.")

# Health check endpoint
@app.get("/health")
def health_check():
    if model is not None:
        return {"status": "ok"}
    else:
        raise HTTPException(status_code=500, detail="Model not loaded.")
    
# User-facing Pydantic model
class StudentData(BaseModel):
    application_mode: str
    course: str
    attendance: str
    previous_qualification: str
    mothers_qualification: str
    fathers_qualification: str
    mothers_occupation: str
    fathers_occupation: str
    displaced: str
    debtor: str
    tuition_fees_up_to_date: str
    gender: str
    scholarship_holder: str
    age_at_enrollment: int
    international: str
    curricular_units_1st_sem_credited: int
    curricular_units_1st_sem_enrolled: int
    curricular_units_1st_sem_evaluations: int
    curricular_units_1st_sem_approved: int
    curricular_units_1st_sem_grade: float
    curricular_units_1st_sem_without_evaluations: int
    curricular_units_2nd_sem_credited: int
    curricular_units_2nd_sem_enrolled: int
    curricular_units_2nd_sem_evaluations: int
    curricular_units_2nd_sem_approved: int
    curricular_units_2nd_sem_grade: float
    curricular_units_2nd_sem_without_evaluations: int

# Helper mapping functions
def application_mode_to_numeric(val):
    mapping = {"General": 1, "Transfer": 7, "Other": 8}
    return mapping.get(val, 0)

def course_to_numeric(val):
    mapping = {"CS": 1, "Maths": 2, "Business": 3, "Engineering": 5, "Medical": 11, "Arts": 15, "Other": 12}
    return mapping.get(val, 0)

def attendance_to_numeric(val):
    return 1 if val.lower() == "daytime" else 0

def previous_qualification_to_numeric(val):
    mapping = {"Secondary": 1, "High School": 2, "Other": 3}
    return mapping.get(val, 0)

def mothers_qualification_to_numeric(val):
    mapping = {"Secondary": 1, "High School": 2, "Graduate": 3, "Other": 4}
    return mapping.get(val, 0)

def fathers_qualification_to_numeric(val):
    mapping = {"Secondary": 1, "High School": 2, "Graduate": 3, "Other": 4}
    return mapping.get(val, 0)

def mothers_occupation_to_numeric(val):
    mapping = {"Office Worker": 1, "Self-Employed": 2, "Unemployed": 3, "Other": 4}
    return mapping.get(val, 0)

def fathers_occupation_to_numeric(val):
    mapping = {"Office Worker": 1, "Self-Employed": 2, "Unemployed": 3, "Other": 4}
    return mapping.get(val, 0)

def yesno_to_numeric(val):
    return 1 if val.lower() == "yes" else 0

def gender_to_numeric(val):
    return 0 if val.lower() == "male" else 1

@app.get("/")
def home():
    return {"message": "Welcome to the Student Dropout Prediction API"}

@app.post("/dropout")
def predict(data: StudentData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded.")
    features = [
        application_mode_to_numeric(data.application_mode),
        course_to_numeric(data.course),
        attendance_to_numeric(data.attendance),
        previous_qualification_to_numeric(data.previous_qualification),
        mothers_qualification_to_numeric(data.mothers_qualification),
        fathers_qualification_to_numeric(data.fathers_qualification),
        mothers_occupation_to_numeric(data.mothers_occupation),
        fathers_occupation_to_numeric(data.fathers_occupation),
        yesno_to_numeric(data.displaced),
        yesno_to_numeric(data.debtor),
        yesno_to_numeric(data.tuition_fees_up_to_date),
        gender_to_numeric(data.gender),
        yesno_to_numeric(data.scholarship_holder),
        data.age_at_enrollment,
        yesno_to_numeric(data.international),
        data.curricular_units_1st_sem_credited,
        data.curricular_units_1st_sem_enrolled,
        data.curricular_units_1st_sem_evaluations,
        data.curricular_units_1st_sem_approved,
        data.curricular_units_1st_sem_grade,
        data.curricular_units_1st_sem_without_evaluations,
        data.curricular_units_2nd_sem_credited,
        data.curricular_units_2nd_sem_enrolled,
        data.curricular_units_2nd_sem_evaluations,
        data.curricular_units_2nd_sem_approved,
        data.curricular_units_2nd_sem_grade,
        data.curricular_units_2nd_sem_without_evaluations
    ]
    features_np = np.array([features]).astype(float)
    try:
        pred = model.predict(features_np)[0]
        label_map = {0: "Dropout", 1: "Graduate", 2: "Enrolled"}
        return JSONResponse(content={"result": label_map.get(pred, "Unknown")})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
