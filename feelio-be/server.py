# feelio-be/server.py
import base64
import cv2
import numpy as np
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from main import FeelioTherapist, Config, setup_logging

# Define Data Models
class UserMessage(BaseModel):
    message: str

class ImagePayload(BaseModel):
    image: str  # Base64 encoded image from frontend

app = FastAPI()

# Allow React to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

therapist = None
last_detected_emotion = "neutral"  # Store the last emotion we saw

@app.on_event("startup")
def startup_event():
    global therapist
    setup_logging()
    Config.validate()
    print("🚀 Dr. Libra is initializing...")
    
    # Initialize Therapist BUT DO NOT start the vision loop automatically
    therapist = FeelioTherapist(Config)
    print("✅ Dr. Libra is READY! (Waiting for images from Frontend)")

def base64_to_image(base64_string):
    """Convert base64 string from React to an OpenCV image"""
    try:
        # Remove the "data:image/jpeg;base64," prefix if present
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
        
        image_bytes = base64.b64decode(base64_string)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"❌ Image Decode Error: {e}")
        return None

@app.post("/vision")
def analyze_vision(payload: ImagePayload):
    """React sends a snapshot -> We return the emotion"""
    global last_detected_emotion
    
    # 1. Convert Base64 -> OpenCV Image
    frame = base64_to_image(payload.image)
    
    if frame is not None:
        # 2. Run MediaPipe on this single frame
        # We manually call the detector on this specific frame
        emotion = therapist.vision.analyze_frame(frame) # You might need to expose this method or create a helper
        if emotion:
            last_detected_emotion = emotion
            
    return {"emotion": last_detected_emotion}

@app.post("/chat")
def chat_endpoint(user_input: UserMessage):
    """React sends text -> We use the LAST detected emotion to reply"""
    try:
        # Generate response using the last emotion we saw from the snapshots
        response_text = therapist._generate_response(user_input.message, last_detected_emotion)
        
        return {
            "reply": response_text,
            "detected_emotion": last_detected_emotion
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)