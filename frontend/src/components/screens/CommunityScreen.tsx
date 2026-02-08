import { motion } from "framer-motion";
import { Users, Calendar, Heart, MessageCircle, ChevronRight, Play, ExternalLink } from "lucide-react";

const circles = [
  { 
    name: "Anxiety Support", 
    members: 234, 
    emoji: "🌿", 
    description: "A safe space to share and heal" 
  },
  { 
    name: "Mindfulness Practice", 
    members: 189, 
    emoji: "🧘", 
    description: "Daily meditation together",
    youtubeLink: "https://www.youtube.com/watch?v=inpok4MKVLM"
  },
  { 
    name: "Grief & Loss", 
    members: 156, 
    emoji: "💜", 
    description: "You're not walking alone" 
  },
  { 
    name: "Self-Care Journey", 
    members: 312, 
    emoji: "🌸", 
    description: "Small steps, big changes" 
  },
];

const upcomingEvents = [
  { title: "Morning Meditation", time: "8:00 AM", day: "Tomorrow", attendees: 45 },
  { title: "Gentle Yoga Session", time: "6:00 PM", day: "Thursday", attendees: 28 },
  { title: "Group Check-in", time: "7:00 PM", day: "Friday", attendees: 62 },
];

export const CommunityScreen = () => {
  const handleYouTubeClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex gap-6"
    >
      {/* Left - Support Circles */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-foreground">Support Circles</h2>
          <p className="text-sm text-muted-foreground mt-1">Communities that understand your journey</p>
        </div>

        <div className="grid grid-cols-2 gap-5 flex-1">
          {circles.map((circle, index) => (
            <motion.div
              key={circle.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="calm-card p-6 flex flex-col cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{circle.emoji}</span>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  {circle.members} members
                </span>
              </div>
              <h3 className="font-medium text-foreground text-lg mb-2">{circle.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{circle.description}</p>
              
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                  Join circle <ChevronRight className="w-4 h-4" />
                </button>
                
                {circle.youtubeLink && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleYouTubeClick(circle.youtubeLink!);
                    }}
                    className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-medium">Watch</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-80 flex flex-col gap-5">
        {/* Upcoming events */}
        <div className="calm-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Upcoming Sessions</h3>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{event.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{event.day} · {event.time}</span>
                  <span className="text-xs text-primary font-medium">{event.attendees} joining</span>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-5 py-3 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/15 transition-colors">
            See all events
          </button>
        </div>

        {/* Community guidelines */}
        <div className="calm-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-accent" />
            <h3 className="font-medium text-foreground">Our Values</h3>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              Kindness first, always
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              No judgment, only support
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              Your privacy is sacred
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              Every feeling is valid
            </li>
          </ul>
        </div>

        {/* Quick chat */}
        <div className="calm-card p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Community Chat</h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Join a circle to connect with others who understand your journey
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
