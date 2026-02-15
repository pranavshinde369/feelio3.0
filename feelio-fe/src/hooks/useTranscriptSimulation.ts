import { useState, useEffect, useCallback } from "react";

interface TimelineEvent {
  id: string;
  time: string;
  type: "ai" | "user" | "milestone";
  content: string;
}

interface UseTranscriptSimulationOptions {
  onThinkingChange: (isThinking: boolean) => void;
  onSpeakingChange: (isSpeaking: boolean) => void;
}

const aiResponses = [
  "Welcome to your safe space. I'm Dr. Libra, and I'm here to listen without judgment.",
  "How are you feeling right now, in this moment?",
  "It sounds like you've been carrying a lot. That takes real strength.",
  "Let's explore that feeling together. What does it remind you of?",
  "Remember, every emotion you feel is valid and important.",
  "I notice you mentioned feeling overwhelmed. Can you tell me more about that?",
  "You're doing great by being here and opening up. That's not easy.",
  "Take a deep breath with me. You're in a safe space.",
];

const milestones = [
  "Session started",
  "First emotional check-in",
  "Deep reflection moment",
  "Breakthrough insight",
];

export const useTranscriptSimulation = ({ 
  onThinkingChange, 
  onSpeakingChange 
}: UseTranscriptSimulationOptions) => {
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [conversationTimeline, setConversationTimeline] = useState<TimelineEvent[]>([]);
  const [responseIndex, setResponseIndex] = useState(0);
  const [milestoneIndex, setMilestoneIndex] = useState(0);

  const getTimeString = useCallback(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    });
  }, []);

  const addTimelineEvent = useCallback((type: "ai" | "user" | "milestone", content: string) => {
    setConversationTimeline((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        time: getTimeString(),
        type,
        content,
      },
    ].slice(-15)); // Keep last 15 events
  }, [getTimeString]);

  useEffect(() => {
    // Initial welcome message after a short delay
    const welcomeTimeout = setTimeout(() => {
      addTimelineEvent("milestone", milestones[0]);
      
      // Start thinking
      onThinkingChange(true);
      
      setTimeout(() => {
        onThinkingChange(false);
        onSpeakingChange(true);
        setCurrentTranscript(aiResponses[0]);
        addTimelineEvent("ai", aiResponses[0]);
        
        // Stop speaking after transcript is shown
        setTimeout(() => {
          onSpeakingChange(false);
          setCurrentTranscript("");
        }, 4000);
      }, 2000);
    }, 1500);

    return () => clearTimeout(welcomeTimeout);
  }, [addTimelineEvent, onThinkingChange, onSpeakingChange]);

  useEffect(() => {
    // Simulate ongoing conversation
    const interval = setInterval(() => {
      setResponseIndex((prev) => {
        const next = (prev + 1) % aiResponses.length;
        
        if (next === 0) return prev; // Skip first message (already shown)
        
        // Thinking phase
        onThinkingChange(true);
        
        setTimeout(() => {
          onThinkingChange(false);
          onSpeakingChange(true);
          
          const response = aiResponses[next];
          setCurrentTranscript(response);
          addTimelineEvent("ai", response);
          
          // Occasionally add milestones
          if (next % 3 === 0 && milestoneIndex < milestones.length - 1) {
            setMilestoneIndex((mi) => {
              const nextMi = mi + 1;
              addTimelineEvent("milestone", milestones[nextMi]);
              return nextMi;
            });
          }
          
          // Stop speaking
          setTimeout(() => {
            onSpeakingChange(false);
            setCurrentTranscript("");
          }, 4000 + response.length * 30);
        }, 1500 + Math.random() * 1000);
        
        return next;
      });
    }, 12000 + Math.random() * 8000);

    return () => clearInterval(interval);
  }, [addTimelineEvent, onThinkingChange, onSpeakingChange, milestoneIndex]);

  return {
    currentTranscript,
    conversationTimeline,
  };
};
