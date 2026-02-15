import { Smile, Frown, Cloud, AlertCircle, Minus } from "lucide-react";

export type Emotion = "happy" | "sad" | "calm" | "anxious" | "neutral";

interface EmotionBadgeProps {
  emotion: Emotion;
}

const emotionConfig: Record<Emotion, { icon: typeof Smile; label: string; className: string }> = {
  happy: {
    icon: Smile,
    label: "Happy",
    className: "emotion-happy",
  },
  sad: {
    icon: Frown,
    label: "Sad",
    className: "emotion-sad",
  },
  calm: {
    icon: Cloud,
    label: "Calm",
    className: "emotion-calm",
  },
  anxious: {
    icon: AlertCircle,
    label: "Anxious",
    className: "emotion-anxious",
  },
  neutral: {
    icon: Minus,
    label: "Neutral",
    className: "emotion-neutral",
  },
};

const EmotionBadge = ({ emotion }: EmotionBadgeProps) => {
  const config = emotionConfig[emotion];
  const Icon = config.icon;

  return (
    <div 
      className={`
        glass rounded-full px-4 py-2 flex items-center gap-2 
        border transition-all duration-500 animate-fade-in
        ${config.className}
      `}
    >
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium">
        Sensing: <span className="font-semibold">{config.label}</span>
      </span>
    </div>
  );
};

export default EmotionBadge;
