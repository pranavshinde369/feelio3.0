import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { Emotion } from "./EmotionBadge";

interface EmotionDataPoint {
  time: string;
  emotion: Emotion;
  value: number;
}

interface EmotionalTrajectoryProps {
  data: EmotionDataPoint[];
}

const emotionColors: Record<Emotion, string> = {
  happy: "hsl(45, 100%, 50%)",
  sad: "hsl(210, 80%, 50%)",
  calm: "hsl(172, 66%, 50%)",
  anxious: "hsl(30, 90%, 55%)",
  neutral: "hsl(220, 15%, 50%)",
};

const EmotionalTrajectory = ({ data }: EmotionalTrajectoryProps) => {
  if (data.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center">
        <p className="text-xs text-muted-foreground text-center">
          Emotional data will appear as the session progresses...
        </p>
      </div>
    );
  }

  // Add gradient color based on emotion
  const chartData = data.map((point) => ({
    ...point,
    color: emotionColors[point.emotion],
  }));

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => {
              if (value === 0) return "Low";
              if (value === 50) return "Mid";
              if (value === 100) return "High";
              return "";
            }}
            ticks={[0, 50, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => [
              `${value}% intensity`,
              chartData.find(d => d.value === value)?.emotion || "emotion"
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#emotionGradient)"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
            activeDot={{ fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))", r: 5 }}
          />
          <defs>
            <linearGradient id="emotionGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--feelio-teal))" />
              <stop offset="50%" stopColor="hsl(var(--feelio-purple))" />
              <stop offset="100%" stopColor="hsl(var(--feelio-teal))" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionalTrajectory;
