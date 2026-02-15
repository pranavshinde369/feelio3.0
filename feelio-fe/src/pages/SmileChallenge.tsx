import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Share2, Download, Trophy, X, Smile, RefreshCw, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCK_LEADERBOARD = [
  { name: "Sarah J.", streak: 45, score: 1200 },
  { name: "Mike R.", streak: 32, score: 980 },
  { name: "You", streak: 12, score: 340 }, // User's rank
  { name: "Emma W.", streak: 10, score: 310 },
];

const SmileChallenge = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // 1. Start Camera
  useEffect(() => {
    const startCam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        toast({ title: "Camera Error", description: "We need camera access to see that smile!", variant: "destructive" });
      }
    };
    startCam();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // 2. Capture & "Branding" Logic
  const captureSmile = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    // Simulate "AI Scanning" for 1.5 seconds
    setTimeout(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d");
        if (context && videoRef.current) {
            // A. Draw Video Frame
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // B. Add "Instagram Filter" Overlay (Dark Gradient at bottom)
            const gradient = context.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
            gradient.addColorStop(0, "transparent");
            gradient.addColorStop(1, "rgba(0,0,0,0.8)");
            context.fillStyle = gradient;
            context.fillRect(0, canvas.height - 150, canvas.width, 150);

            // C. Add Branding Text
            context.fillStyle = "white";
            context.font = "bold 40px sans-serif";
            context.fillText("Feelio Daily Challenge", 40, canvas.height - 60);
            
            context.font = "20px sans-serif";
            context.fillText(new Date().toDateString() + " • #SmileMore", 40, canvas.height - 30);

            // D. Add Logo (Simple Circle)
            context.beginPath();
            context.arc(canvas.width - 60, canvas.height - 60, 30, 0, 2 * Math.PI);
            context.fillStyle = "#2DD4BF"; // Teal color
            context.fill();
            context.fillStyle = "black";
            context.font = "bold 30px sans-serif";
            context.fillText("F", canvas.width - 70, canvas.height - 50);

            // Save
            setCapturedImage(canvas.toDataURL("image/png"));
            setIsProcessing(false);
            toast({ title: "Smile Verified! 😊", description: "Streak increased! Share this to inspire others." });
        }
    }, 1500);
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `feelio-smile-${Date.now()}.png`;
    link.click();
    toast({ title: "Saved to Photos", description: "Ready to post on Instagram Stories!" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 animate-in fade-in flex flex-col items-center">
      <Button variant="ghost" onClick={onClose} className="self-start mb-6 text-slate-400 hover:text-white"><X className="mr-2 h-4 w-4"/> Back to Hub</Button>

      {/* HEADER */}
      <div className="text-center mb-8">
         <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
            <Smile className="w-8 h-8 text-black" />
         </div>
         <h2 className="text-3xl font-bold text-white">Daily Smile Quest</h2>
         <p className="text-slate-400">Challenge: Capture one genuine smile today.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
          
          {/* LEFT: CAMERA BOOTH */}
          <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 p-4 relative overflow-hidden shadow-2xl">
             
             {/* The Viewfinder */}
             <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden mb-6">
                {!capturedImage ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                ) : (
                    <img src={capturedImage} alt="Smile" className="w-full h-full object-cover" />
                )}
                
                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm">
                        <RefreshCw className="w-12 h-12 text-teal-400 animate-spin mb-4" />
                        <p className="text-teal-200 font-mono">Verifying Smile...</p>
                    </div>
                )}
                
                {/* Canvas (Hidden, used for processing) */}
                <canvas ref={canvasRef} className="hidden" />
             </div>

             {/* Action Buttons */}
             <div className="flex gap-3">
                {!capturedImage ? (
                    <Button onClick={captureSmile} className="flex-1 h-14 text-lg bg-teal-500 hover:bg-teal-600 text-black font-bold rounded-xl">
                        <Camera className="mr-2" /> Capture
                    </Button>
                ) : (
                    <>
                        <Button onClick={() => setCapturedImage(null)} variant="outline" className="h-14 w-14 p-0 rounded-xl border-slate-700 hover:bg-slate-800">
                            <RefreshCw />
                        </Button>
                        <Button onClick={downloadImage} className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold rounded-xl">
                            <Instagram className="mr-2" /> Share to Story
                        </Button>
                    </>
                )}
             </div>
          </div>

          {/* RIGHT: LEADERBOARD */}
          <div className="w-full md:w-80 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 h-fit">
             <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-lg">Top Smilers</h3>
             </div>
             
             <div className="space-y-3">
                {MOCK_LEADERBOARD.map((user, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${user.name === 'You' ? 'bg-teal-500/10 border-teal-500/50' : 'bg-slate-800/50 border-slate-800'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i===0 ? 'bg-yellow-400 text-black' : 'bg-slate-700'}`}>
                                {i + 1}
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${user.name === 'You' ? 'text-teal-400' : 'text-white'}`}>{user.name}</p>
                                <p className="text-xs text-slate-500">{user.streak} day streak</p>
                            </div>
                        </div>
                        <span className="text-sm font-mono text-slate-300">{user.score}</span>
                    </div>
                ))}
             </div>

             <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-500 mb-2">Challenge resets in</p>
                <p className="text-xl font-mono text-white">04:22:15</p>
             </div>
          </div>

      </div>
    </div>
  );
};

export default SmileChallenge;