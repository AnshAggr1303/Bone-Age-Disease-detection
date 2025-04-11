from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
from datetime import datetime

app = FastAPI()

# Allow all CORS origins (for dev only)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your model once at startup
model = load_model("fine_tuned_model.keras")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()

    # Preprocess image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))
    image_array = np.array(image).astype("float32") / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    # Predict
    prediction = model.predict(image_array)
    bone_age = float(prediction[0][0])

    # Construct dummy confidence and std deviation
    confidence_score = 0.93  # Placeholder
    std_dev = 5.2            # Placeholder

    return {
        "bone_age_months": round(bone_age, 2),
        "confidenceScore": confidence_score,
        "standardDeviation": std_dev,
        "timestamp": datetime.utcnow().isoformat()
    }
