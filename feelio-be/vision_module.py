# feelio-be/vision_module.py
import cv2
import mediapipe as mp

class VisionSystem:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        print("✅ Vision System initialized with MediaPipe (Fast Mode)")

    def analyze_frame(self, frame):
        """
        Takes an OpenCV frame, runs geometry math, returns emotion string.
        """
        if frame is None:
            return "neutral"

        # 1. Convert to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        detected_emotion = "neutral"

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                landmarks = face_landmarks.landmark
                
                # --- EXTRACT KEY POINTS (Y-coordinates) ---
                # Lips
                upper_lip = landmarks[13].y
                lower_lip = landmarks[14].y
                left_corner = landmarks[61].y
                right_corner = landmarks[291].y
                
                # Eyebrows (Inner vs Outer)
                left_brow_outer = landmarks[55].y
                left_brow_inner = landmarks[107].y
                right_brow_outer = landmarks[285].y
                right_brow_inner = landmarks[336].y

                # --- THE MATH (Geometry) ---
                
                # 1. Mouth Openness
                mouth_open_dist = lower_lip - upper_lip
                
                # 2. Smile Ratio
                # Positive (+) = Corners are lower than center (Smile)
                # Negative (-) = Corners are higher than center (Frown)
                mouth_center = (upper_lip + lower_lip) / 2
                corners_avg = (left_corner + right_corner) / 2
                smile_ratio = mouth_center - corners_avg

                # 3. Brow Sadness
                # In sadness, inner brows go UP (smaller Y value) relative to outer brows.
                # We calculate (Outer Y - Inner Y).
                # High Positive Value = Sad Brows
                left_sad = left_brow_outer - left_brow_inner  
                right_sad = right_brow_outer - right_brow_inner
                avg_sad_brow = (left_sad + right_sad) / 2

                # --- 🎛️ TUNING SECTION (Adjust these if it's still wrong) ---
                SMILE_THRESHOLD = 0.015       # Lower = Easier to trigger Happy
                FROWN_THRESHOLD = -0.004      # Closer to 0 = Easier to trigger Sad
                SURPRISE_THRESHOLD = 0.05     # Lower = Easier to trigger Surprise
                SAD_BROW_THRESHOLD = 0.012    # Lower = Easier to trigger Sad Eyes

                # --- DEBUG PRINT (Watch your terminal!) ---
                # Uncomment the line below to see your face numbers in real-time
                # print(f"Smile: {smile_ratio:.4f} | Brow: {avg_sad_brow:.4f}")

                # --- CLASSIFICATION LOGIC ---
                if mouth_open_dist > SURPRISE_THRESHOLD:
                    detected_emotion = "surprise"
                
                elif smile_ratio > SMILE_THRESHOLD: 
                    detected_emotion = "happy"
                
                # Sadness: Check Frown OR Sad Brows
                elif smile_ratio < FROWN_THRESHOLD: 
                    detected_emotion = "sad"
                elif avg_sad_brow > SAD_BROW_THRESHOLD:
                    detected_emotion = "sad"
                    
                else:
                    detected_emotion = "neutral"
                    
        return detected_emotion