import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Video, MessageCircle, Heart, Clock, ChevronRight } from "lucide-react";
import { useState } from "react";

const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    title: "Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Trauma"],
    rating: 4.9,
    reviews: 127,
    experience: "12 years",
    location: "New York, NY",
    image: "SM",
    availability: "Available today",
    sessionTypes: ["Video", "Chat"],
    bio: "Specializing in cognitive behavioral therapy with a warm, supportive approach.",
    hourlyRate: "$150"
  },
  {
    id: 2,
    name: "Dr. James Chen",
    title: "Licensed Therapist",
    specialties: ["Relationships", "Self-Esteem", "Life Transitions"],
    rating: 4.8,
    reviews: 98,
    experience: "8 years",
    location: "Los Angeles, CA",
    image: "JC",
    availability: "Next available: Tomorrow",
    sessionTypes: ["Video", "In-Person"],
    bio: "Helping individuals navigate life's challenges with compassion and understanding.",
    hourlyRate: "$130"
  },
  {
    id: 3,
    name: "Dr. Maya Patel",
    title: "Mindfulness Specialist",
    specialties: ["Stress", "Mindfulness", "Burnout"],
    rating: 5.0,
    reviews: 156,
    experience: "15 years",
    location: "San Francisco, CA",
    image: "MP",
    availability: "Available today",
    sessionTypes: ["Video", "Chat", "In-Person"],
    bio: "Integrating mindfulness practices with traditional therapy for holistic healing.",
    hourlyRate: "$175"
  },
  {
    id: 4,
    name: "Dr. Michael Brooks",
    title: "Family Therapist",
    specialties: ["Family", "Couples", "Parenting"],
    rating: 4.7,
    reviews: 82,
    experience: "10 years",
    location: "Chicago, IL",
    image: "MB",
    availability: "Next available: Wed",
    sessionTypes: ["Video", "In-Person"],
    bio: "Strengthening family bonds through open communication and understanding.",
    hourlyRate: "$140"
  },
  {
    id: 5,
    name: "Dr. Emily Rodriguez",
    title: "Trauma Specialist",
    specialties: ["PTSD", "Grief", "Healing"],
    rating: 4.9,
    reviews: 143,
    experience: "14 years",
    location: "Austin, TX",
    image: "ER",
    availability: "Available today",
    sessionTypes: ["Video"],
    bio: "Creating a safe space for healing and recovery from life's deepest wounds.",
    hourlyRate: "$160"
  },
  {
    id: 6,
    name: "Dr. David Kim",
    title: "Youth Counselor",
    specialties: ["Teens", "ADHD", "Academic Stress"],
    rating: 4.8,
    reviews: 67,
    experience: "7 years",
    location: "Seattle, WA",
    image: "DK",
    availability: "Next available: Thu",
    sessionTypes: ["Video", "Chat"],
    bio: "Supporting young minds through the challenges of growing up.",
    hourlyRate: "$125"
  }
];

export const TherapistsScreen = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Find Your Therapist</h1>
        <p className="text-muted-foreground">Connect with licensed professionals who understand your journey</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["All", "Available Today", "Video Sessions", "In-Person", "Anxiety", "Depression", "Relationships"].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 rounded-full text-sm font-medium bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Therapist Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {therapists.map((therapist, index) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`calm-card p-6 cursor-pointer transition-all duration-300 ${
                selectedTherapist === therapist.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedTherapist(therapist.id)}
            >
              {/* Header with Avatar */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-semibold text-primary">
                  {therapist.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{therapist.name}</h3>
                  <p className="text-sm text-muted-foreground">{therapist.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm font-medium text-foreground">{therapist.rating}</span>
                    <span className="text-xs text-muted-foreground">({therapist.reviews} reviews)</span>
                  </div>
                </div>
                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                  <Heart className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </button>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{therapist.bio}</p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-4">
                {therapist.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {therapist.experience}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {therapist.location}
                </div>
              </div>

              {/* Session Types */}
              <div className="flex items-center gap-2 mb-4">
                {therapist.sessionTypes.includes("Video") && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                    <Video className="w-3.5 h-3.5" />
                    Video
                  </div>
                )}
                {therapist.sessionTypes.includes("Chat") && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat
                  </div>
                )}
                {therapist.sessionTypes.includes("In-Person") && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    In-Person
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">{therapist.availability}</p>
                  <p className="text-sm font-semibold text-foreground">{therapist.hourlyRate}/session</p>
                </div>
                <button className="flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  <Calendar className="w-4 h-4" />
                  Book
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
