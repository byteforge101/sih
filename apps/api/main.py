import numpy as np
import cv2
import base64
import json # Import json for sending structured data
from fastapi import FastAPI, WebSocket, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from deepface import DeepFace
import database as db

app = FastAPI()

# ... (CORS Middleware remains the same) ...
origins = ["http://localhost:3001"]
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