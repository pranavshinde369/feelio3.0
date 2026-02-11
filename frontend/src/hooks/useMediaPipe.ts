import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const useMediaPipe = () => {
  const [emotion, setEmotion] = useState("Neutral");
  const [confidence, setConfidence] = useState(0.0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastProcess = useRef(0);

  useEffect(() => {
    let faceLandmarker: FaceLandmarker;
    let running = true;

    const setup = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
      });
      detect();
    };

    const detect = () => {
      if (!running) return;
      if (videoRef.current && videoRef.current.currentTime !== lastProcess.current) {
        lastProcess.current = videoRef.current.currentTime;
        
        // Run detection
        const result = faceLandmarker?.detectForVideo(videoRef.current, performance.now());
        
        if (result?.faceBlendshapes && result.faceBlendshapes.length > 0) {
          const shapes = result.faceBlendshapes[0].categories;
          
          // Simple Emotion Mapping logic
          const browDown = shapes.find(s => s.categoryName === 'browDownLeft')?.score || 0;
          const smile = shapes.find(s => s.categoryName === 'mouthSmileLeft')?.score || 0;
          const frown = shapes.find(s => s.categoryName === 'mouthFrownLeft')?.score || 0;
          
          if (browDown > 0.5) { setEmotion("Anxious"); setConfidence(browDown); }
          else if (smile > 0.5) { setEmotion("Happy"); setConfidence(smile); }
          else if (frown > 0.4) { setEmotion("Sad"); setConfidence(frown); }
          else { setEmotion("Neutral"); setConfidence(0.8); }
        }
      }
      requestAnimationFrame(detect);
    };

    setup();
    return () => { running = false; };
  }, []);

  return { emotion, confidence, videoRef };
};