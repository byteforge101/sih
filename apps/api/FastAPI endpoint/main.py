from fastapi import FastAPI
from pydantic import BaseModel, computed_field
import pickle
import numpy as np
from typing import Literal
from fastapi.responses import JSONResponse

from sklearn.preprocessing import StandardScaler

app = FastAPI()

# Load the trained model
with open('model/model.pkl', 'rb') as f:
    model = pickle.load(f)

# Load the scaler used for age and attendance_percentage
scaler = StandardScaler()
# Fit scaler with training data (replace with your actual training data loading if needed)
import pandas as pd
df = pd.read_csv('./student_habits_performance.csv')
scaler.fit(df[['age', 'attendance_percentage']])

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
    return {"message": "Welcome to the Insurance Premium Prediction API. Use the /predict endpoint to get predictions."}

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
