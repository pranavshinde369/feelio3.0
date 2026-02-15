import { X, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmotionalTrajectory from "./EmotionalTrajectory";
import type { Emotion } from "./EmotionBadge";

interface TimelineEvent {
  id: string;
  time: string;
  type: "ai" | "user" | "milestone";
  content: string;
}

interface EmotionDataPoint {
  time: string;
  emotion: Emotion;
  value: number;
}

interface SessionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  emotionHistory: EmotionDataPoint[];
  conversationTimeline: TimelineEvent[];
}

const SessionSidebar = ({ 
  isOpen, 
  onClose, 
  emotionHistory,
  conversationTimeline 
}: SessionSidebarProps) => {
  return (
    <div 
      className={`
        fixed right-0 top-0 h-full w-80 glass border-l border-border
        transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Session Insights</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-4 space-y-6">
          {/* Emotional Trajectory */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Emotional Trajectory</h3>
            </div>
            <div className="glass rounded-xl p-3">
              <EmotionalTrajectory data={emotionHistory} />
            </div>
          </section>

          {/* Conversation Timeline */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Session Timeline</h3>
            </div>
            <div className="space-y-3">
              {conversationTimeline.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Timeline will appear as the session progresses...
                </p>
              ) : (
                conversationTimeline.map((event) => (
                  <TimelineItem key={event.id} event={event} />
                ))
              )}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

const TimelineItem = ({ event }: { event: TimelineEvent }) => {
  const getEventStyles = () => {
    switch (event.type) {
      case "ai":
        return "border-l-primary bg-primary/5";
      case "user":
        return "border-l-secondary bg-secondary/5";
      case "milestone":
        return "border-l-accent bg-accent/10";
      default:
        return "border-l-muted";
    }
  };

  return (
    <div className={`glass rounded-lg p-3 border-l-2 ${getEventStyles()}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground capitalize">
          {event.type === "ai" ? "Dr. Libra" : event.type}
        </span>
        <span className="text-xs text-muted-foreground">{event.time}</span>
      </div>
      <p className="text-sm text-foreground">{event.content}</p>
    </div>
  );
};

export default SessionSidebar;
