import { Video, Image, Mic, AlertTriangle, CheckCircle } from "lucide-react";

const analyses = [
  { id: 1, name: "suspect_video_042.mp4", type: "video", status: "deepfake", confidence: 97.3, time: "2 min ago" },
  { id: 2, name: "audio_sample_18.wav", type: "audio", status: "authentic", confidence: 12.1, time: "8 min ago" },
  { id: 3, name: "profile_image.jpg", type: "image", status: "deepfake", confidence: 89.7, time: "15 min ago" },
  { id: 4, name: "interview_clip.mp4", type: "video", status: "suspicious", confidence: 64.2, time: "22 min ago" },
  { id: 5, name: "voice_memo_03.mp3", type: "audio", status: "authentic", confidence: 8.5, time: "35 min ago" },
];

const typeIcons = { video: Video, image: Image, audio: Mic };

const RecentAnalysis = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Recent Analyses</h3>
      <div className="space-y-3">
        {analyses.map((item) => {
          const TypeIcon = typeIcons[item.type as keyof typeof typeIcons];
          const isDeepfake = item.status === "deepfake";
          const isSuspicious = item.status === "suspicious";
          return (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <TypeIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate font-mono">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-semibold ${
                  isDeepfake ? "text-destructive" : isSuspicious ? "text-warning" : "text-success"
                }`}>
                  {item.confidence}%
                </span>
                {isDeepfake ? (
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-success" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAnalysis;
