import { useState, useEffect, useCallback } from "react";
import type { Emotion } from "@/components/EmotionBadge";

interface EmotionDataPoint {
  time: string;
  emotion: Emotion;
  value: number;
}

const emotions: Emotion[] = ["calm", "happy", "neutral", "anxious", "sad", "calm", "happy"];
const emotionValues: Record<Emotion, number> = {
  happy: 85,
  calm: 70,
  neutral: 50,
  anxious: 35,
  sad: 25,
};

export const useEmotionSimulation = () => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral");
  const [emotionHistory, setEmotionHistory] = useState<EmotionDataPoint[]>([]);
  const [emotionIndex, setEmotionIndex] = useState(0);

  const getTimeString = useCallback(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false 
    });
  }, []);

  useEffect(() => {
    // Initial emotion
    const initialEmotion = emotions[0];
    setCurrentEmotion(initialEmotion);
    setEmotionHistory([{
      time: getTimeString(),
      emotion: initialEmotion,
      value: emotionValues[initialEmotion],
    }]);

    // Change emotion every 8-15 seconds
    const interval = setInterval(() => {
      setEmotionIndex((prev) => {
        const next = (prev + 1) % emotions.length;
        const newEmotion = emotions[next];
        
        setCurrentEmotion(newEmotion);
        setEmotionHistory((history) => [
          ...history,
          {
            time: getTimeString(),
            emotion: newEmotion,
            value: emotionValues[newEmotion] + Math.floor(Math.random() * 20 - 10),
          },
        ].slice(-10)); // Keep last 10 data points
        
        return next;
      });
    }, 8000 + Math.random() * 7000);

    return () => clearInterval(interval);
  }, [getTimeString]);

  return {
    currentEmotion,
    emotionHistory,
  };
};
