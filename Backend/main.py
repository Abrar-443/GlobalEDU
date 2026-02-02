from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# ✅ CORS (Vite default port = 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Load model ONCE at startup
model = joblib.load("uk_decision_model.pkl")


# -------- Request schema --------
class PredictionInput(BaseModel):
    age: int
    score: float
    income: float


# -------- Health check --------
@app.get("/")
def root():
    return {"status": "Backend is running"}


# -------- Prediction endpoint --------
@app.post("/predict")
def predict(data: PredictionInput):
    """
    IMPORTANT:
    Model is a sklearn Pipeline with preprocessing,
    so we must pass a DataFrame with column names
    exactly as used during training.
    """

    input_df = pd.DataFrame(
        [{
            "age": data.age,
            "score": data.score,
            "income": data.income
        }]
    )

    prediction = model.predict(input_df)

    return {
        "prediction": int(prediction[0])
    }
