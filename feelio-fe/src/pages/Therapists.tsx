import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X, Star, Search, Filter, Calendar, Clock, CheckCircle2, PhoneCall } from "lucide-react";

type Therapist = {
  id: string;
  name: string;
  profileImage: string;
  specialization: string;
  experience: number;
  rating: number;
  sessionPrice: number;
  availability: string[];
  bio: string;
  status: "online" | "offline";
};

const MOCK_THERAPISTS: Therapist[] = [
  {
    id: "t1",
    name: "Dr. Aanya Verma",
    profileImage: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400",
    specialization: "Anxiety & Burnout",
    experience: 7,
    rating: 4.9,
    sessionPrice: 45,
    availability: ["Today • 6:00 PM", "Tomorrow • 10:30 AM", "Fri • 5:15 PM"],
    bio: "Warm, practical CBT-based therapist focused on small, repeatable changes that actually fit your life.",
    status: "online",
  },
  {
    id: "t2",
    name: "Rahul Singh",
    profileImage: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    specialization: "Relationships & Self-worth",
    experience: 5,
    rating: 4.7,
    sessionPrice: 35,
    availability: ["Tomorrow • 8:00 PM", "Sat • 11:00 AM"],
    bio: "Helps you unlearn harsh self-talk and build calmer, kinder relationships with yourself and others.",
    status: "online",
  },
  {
    id: "t3",
    name: "Dr. Meera Iyer",
    profileImage: "https://images.pexels.com/photos/3760852/pexels-photo-3760852.jpeg?auto=compress&cs=tinysrgb&w=400",
    specialization: "Sleep & Stress",
    experience: 10,
    rating: 5.0,
    sessionPrice: 60,
    availability: ["Thu • 7:30 PM", "Sun • 9:30 AM"],
    bio: "Clinical psychologist blending science-backed routines with gentle accountability so you actually sleep.",
    status: "offline",
  },
];

type Props = {
  onClose: () => void;
};

const Therapists = ({ onClose }: Props) => {
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState<string | "all">("all");
  const [maxPrice, setMaxPrice] = useState(80);
  const [minRating, setMinRating] = useState(4);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [profileTherapist, setProfileTherapist] = useState<Therapist | null>(null);

  const specializations = useMemo(
    () => Array.from(new Set(MOCK_THERAPISTS.map((t) => t.specialization))),
    []
  );

  const filteredTherapists = useMemo(() => {
    return MOCK_THERAPISTS.filter((t) => {
      const matchesSearch =
        !search.trim() ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.specialization.toLowerCase().includes(search.toLowerCase());
      const matchesSpec =
        specializationFilter === "all" || t.specialization === specializationFilter;
      const matchesPrice = t.sessionPrice <= maxPrice;
      const matchesRating = t.rating >= minRating;
      return matchesSearch && matchesSpec && matchesPrice && matchesRating;
    });
  }, [search, specializationFilter, maxPrice, minRating]);

  const handleStartBooking = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setSelectedSlot(null);
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = () => {
    if (!selectedTherapist || !selectedSlot) return;
    // Prototype only: no real API or database call.
    setBookingConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col p-6 animate-in fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          <X className="mr-2 h-4 w-4" /> Back to Hub
        </Button>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Prototype · Therapist Directory
        </span>
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
        {profileTherapist && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={profileTherapist.profileImage}
                    alt={profileTherapist.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-slate-50">
                      {profileTherapist.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {profileTherapist.specialization}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setProfileTherapist(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {profileTherapist.bio}
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3">
                  <p className="text-slate-400 mb-1">Experience</p>
                  <p className="font-semibold text-slate-50">
                    {profileTherapist.experience} years
                  </p>
                </div>
                <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3">
                  <p className="text-slate-400 mb-1">Session price</p>
                  <p className="font-semibold text-slate-50">
                    ${profileTherapist.sessionPrice} / 45 min
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                This is a preview profile only. In a real deployment, this space would
                connect to verified therapist data and richer intake info.
              </p>
            </div>
          </div>
        )}
        <header className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-light text-white flex items-center gap-3">
            Find a Real Therapist
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base">
            Browse a prototype directory of human therapists. This screen is designed
            for future integration with real data, but everything you see here is
            running locally with mock data only.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-[2fr,1.2fr] items-start">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-teal-400" />
                <CardTitle className="text-base md:text-lg text-slate-100">
                  Search Therapists
                </CardTitle>
              </div>
              <CardDescription className="text-xs md:text-sm text-slate-400">
                Filters are all front-end only. No live backend or database yet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                  placeholder="Search by name or specialization..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-sm"
                />
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Filter className="w-4 h-4" />
                  <span>All filters run in-memory</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 text-xs md:text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Specialization</span>
                    <Badge
                      variant="outline"
                      className="border-slate-700 text-[10px] uppercase tracking-wider"
                    >
                      Prototype
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="xs"
                      variant={specializationFilter === "all" ? "default" : "outline"}
                      className={
                        specializationFilter === "all"
                          ? "bg-teal-600 hover:bg-teal-700 text-white border-none"
                          : "bg-slate-900 border-slate-700 text-slate-300"
                      }
                      onClick={() => setSpecializationFilter("all")}
                    >
                      All
                    </Button>
                    {specializations.map((spec) => (
                      <Button
                        key={spec}
                        size="xs"
                        variant={
                          specializationFilter === spec ? "default" : "outline"
                        }
                        className={
                          specializationFilter === spec
                            ? "bg-teal-600 hover:bg-teal-700 text-white border-none"
                            : "bg-slate-900 border-slate-700 text-slate-300"
                        }
                        onClick={() => setSpecializationFilter(spec)}
                      >
                        {spec}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Max Price</span>
                    <span className="text-slate-400 text-xs">${maxPrice}</span>
                  </div>
                  <Slider
                    defaultValue={[80]}
                    value={[maxPrice]}
                    onValueChange={([value]) => setMaxPrice(value)}
                    max={100}
                    min={20}
                    step={5}
                    className="py-1"
                  />
                  <p className="text-[11px] text-slate-500">
                    Sliding this bar does not call any API yet — it only filters local
                    mock data.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Minimum Rating</span>
                    <span className="text-slate-400 text-xs">{minRating}+</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[4, 4.5, 5].map((rating) => (
                      <Button
                        key={rating}
                        size="xs"
                        variant={minRating === rating ? "default" : "outline"}
                        className={
                          minRating === rating
                            ? "bg-amber-400 text-black border-none"
                            : "bg-slate-900 border-slate-700 text-slate-300"
                        }
                        onClick={() => setMinRating(rating)}
                      >
                        <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                        {rating}+
                      </Button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Ratings are illustrative only. In production, these would come from
                    real anonymized reviews.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                Booking Preview
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-slate-400">
                A prototype booking panel that shows how appointments will feel. No
                real booking is created.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedTherapist && (
                <p className="text-sm text-slate-500">
                  Select &ldquo;Book appointment&rdquo; on any therapist to preview the
                  calendar and time slot flow.
                </p>
              )}

              {selectedTherapist && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedTherapist.profileImage}
                      alt={selectedTherapist.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-100">
                        {selectedTherapist.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {selectedTherapist.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                      Available Slots (Sample)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTherapist.availability.map((slot) => (
                        <Button
                          key={slot}
                          size="xs"
                          variant={selectedSlot === slot ? "default" : "outline"}
                          className={
                            selectedSlot === slot
                              ? "bg-teal-600 hover:bg-teal-700 text-white border-none"
                              : "bg-slate-900 border-slate-700 text-slate-200"
                          }
                          onClick={() => {
                            setBookingConfirmed(false);
                            setSelectedSlot(slot);
                          }}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    disabled={!selectedSlot}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={handleConfirmBooking}
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Confirm Prototype Booking
                  </Button>

                  {bookingConfirmed && selectedTherapist && selectedSlot && (
                    <div className="mt-3 rounded-xl bg-slate-950/70 border border-emerald-500/40 p-3 text-xs text-slate-100 space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Prototype booking created</span>
                      </div>
                      <p>
                        Therapist: <span className="font-semibold">{selectedTherapist.name}</span>
                      </p>
                      <p>
                        Slot: <span className="font-semibold">{selectedSlot}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        This is a demo-only flow. Nothing was sent to any server or stored
                        anywhere.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {filteredTherapists.map((t) => (
            <Card
              key={t.id}
              className="bg-slate-900/70 border-slate-800 hover:border-teal-500/40 transition-colors flex flex-col"
            >
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div className="relative">
                  <img
                    src={t.profileImage}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border border-slate-700"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                      t.status === "online" ? "bg-emerald-400" : "bg-slate-500"
                    }`}
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-sm text-slate-100">
                    {t.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    {t.specialization}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>{t.experience} yrs experience</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {t.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-3 pt-0">
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {t.bio}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    <span className="text-slate-200 font-semibold">
                      ${t.sessionPrice}
                    </span>{" "}
                    / 45 min
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Next: {t.availability[0]}
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
                    onClick={() => setProfileTherapist(t)}
                  >
                    View profile
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => handleStartBooking(t)}
                  >
                    Book appointment (prototype)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Therapists;

