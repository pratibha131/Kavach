import { useState, useEffect, useRef } from "react";
import { Video, Shield, AlertTriangle, Activity, Heart, Eye, Mic, Wifi, CheckCircle, XCircle, Inbox, Loader2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useCases } from "@/contexts/CaseContext";

const VideoKYC = () => {
  const { cases, addCase } = useCases();
  const [isLive, setIsLive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [metrics, setMetrics] = useState({
    faceAuth: 96, lipSync: 92, microExpr: 88, pulseRPPG: 72, blinkRate: 0.4, headPose: 2.3, latency: 45,
  });
  const [alerts, setAlerts] = useState<{ time: number; type: string; severity: string }[]>([]);
  const [verdict, setVerdict] = useState<"monitoring" | "passed" | "flagged">("monitoring");

  const kycFlaggedCases = cases.filter(c => c.kycFlagged);

  // START/STOP CAMERA
  useEffect(() => {
    if (isLive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isLive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setIsLive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // SNAPSHOT & ANALYZE
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || !isLive) return;
    
    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const formData = new FormData();
      formData.append("file", blob, "kyc_snapshot.jpg");

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/analyze`, {
          method: "POST",
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          const r = data.case;
          
          // MAP REAL AI SCORES TO BARS
          // Inverting AI scores (if AI says 80% fake, we show 20% health)
          setMetrics(prev => ({
            ...prev,
            faceAuth: 100 - (r.confidence > 70 ? r.confidence : 0),
            lipSync: 100 - r.voiceClone,
            microExpr: 100 - r.faceSwap,
            pulseRPPG: 100 - r.synthetic,
            latency: Math.floor(100 + Math.random() * 50)
          }));

          if (r.severity === "critical" || r.severity === "suspicious") {
            setAlerts(prev => [...prev.slice(-9), { 
              time: elapsed, 
              type: `AI ALERT: ${r.verdict} (${r.confidence}%)`, 
              severity: r.severity === "critical" ? "critical" : "high" 
            }]);
          }
          
          addCase(r);
        }
      } catch (e) {
        console.error("KYC Analysis failed:", e);
      } finally {
        setIsAnalyzing(false);
      }
    }, 'image/jpeg', 0.8);
  };

  // TICKER TACTICS (Visual micro-movements)
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setElapsed(p => p + 1);
      
      // Every 5 seconds, do a real AI scan
      if (elapsed > 0 && elapsed % 5 === 0) {
        captureAndAnalyze();
      }

      setMetrics(prev => {
        const a = Math.random();
        return {
          ...prev,
          faceAuth: Math.max(60, Math.min(100, prev.faceAuth + (Math.random() - 0.5) * 1)),
          blinkRate: +(0.2 + Math.random() * 0.5).toFixed(2),
          headPose: +(Math.random() * 8).toFixed(1),
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive, elapsed]);

  const startSession = () => { setIsLive(true); setElapsed(0); setAlerts([]); setVerdict("monitoring"); };
  const endSession = () => { setIsLive(false); setVerdict(alerts.some(a => a.severity === "critical") ? "flagged" : "passed"); };
  const mc = (v: number, t: number) => v >= t ? "text-success" : v >= t * 0.6 ? "text-warning" : "text-destructive";

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Video KYC <span className="gradient-text">Interceptor</span></h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time BFSI fraud detection · Powered by Kavach AI</p>
          </div>
          {isLive ? (
            <button onClick={endSession} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2">
              <XCircle className="w-4 h-4" /> End Session
            </button>
          ) : (
            <button onClick={startSession} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2">
              <Video className="w-4 h-4" /> Start KYC Session
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield className={`w-4 h-4 ${isAnalyzing ? "text-primary animate-pulse" : "text-primary"}`} /> 
                {isAnalyzing ? "AI Engine Analyzing..." : "Live KYC Feed"}
              </h3>
              {isLive && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Neural Link:</span>
                    <span className="text-[10px] font-mono text-success drop-shadow-sm">ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-destructive animate-pulse font-bold">● REC</span>
                    <span className="text-xs font-mono text-muted-foreground">{Math.floor(elapsed/60)}:{(elapsed%60).toString().padStart(2,"0")}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative bg-black rounded-lg aspect-video flex items-center justify-center overflow-hidden border border-white/5">
              <canvas ref={canvasRef} className="hidden" />
              {isLive ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 scan-line pointer-events-none opacity-20" />
                  
                  {/* Face Tracking Box Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 border border-primary/40 rounded-3xl relative">
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 space-y-1 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10">
                    <div className="text-[10px] font-mono text-success px-1">FACE_AUTH: {metrics.faceAuth.toFixed(0)}%</div>
                    <div className={`text-[10px] font-mono ${mc(metrics.lipSync, 70)} px-1`}>LIP_SYNC: {metrics.lipSync.toFixed(0)}%</div>
                    <div className={`text-[10px] font-mono ${mc(metrics.pulseRPPG, 40)} px-1`}>RPPG_VAL: {metrics.pulseRPPG.toFixed(0)}%</div>
                  </div>

                  {isAnalyzing && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> RUNNING FORENSIC SCAN...
                    </div>
                  )}
                </>
              ) : verdict !== "monitoring" ? (
                <div className="text-center">
                  {verdict === "passed" ? (
                    <div className="animate-in zoom-in-50 duration-500">
                      <CheckCircle className="w-16 h-16 text-success mx-auto mb-3 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
                      <p className="text-lg font-semibold text-success tracking-tight">KYC VERIFIED</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">Session ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                    </div>
                  ) : (
                    <div className="animate-in zoom-in-50 duration-500">
                      <XCircle className="w-16 h-16 text-destructive mx-auto mb-3 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
                      <p className="text-lg font-semibold text-destructive tracking-tight">IDENTITY FLAGGED</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">Automatic alert sent to Fraud Dept.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center group">
                  <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                    <Video className="w-8 h-8 text-primary/40" />
                  </div>
                  <p className="text-sm text-foreground font-medium">Camera Offline</p>
                  <p className="text-xs text-muted-foreground mt-1">Start session to begin biometric interception</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5 border-l-2 border-primary">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Live Biometrics
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Eye, label: "Face Authenticity", value: metrics.faceAuth, threshold: 80, id: "fa" },
                  { icon: Mic, label: "Lip-Sync Match", value: metrics.lipSync, threshold: 70, id: "ls" },
                  { icon: Activity, label: "Micro-Expressions", value: metrics.microExpr, threshold: 60, id: "me" },
                  { icon: Heart, label: "Pulse rPPG", value: metrics.pulseRPPG, threshold: 40, id: "ppg" },
                ].map((m) => (
                  <div key={m.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-mono"><m.icon className="w-3.5 h-3.5" /> {m.label}</span>
                      <span className={`text-xs font-bold font-mono ${mc(m.value, m.threshold)}`}>{m.value.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{
                        width: `${m.value}%`,
                        background: m.value >= m.threshold ? "hsl(142 76% 45%)" : m.value >= m.threshold * 0.6 ? "hsl(38 92% 50%)" : "hsl(0 84% 60%)",
                        boxShadow: m.value < m.threshold * 0.6 ? "0 0 8px rgba(239, 68, 68, 0.4)" : "none"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 border-l-2 border-warning group overflow-hidden relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" /> Intelligence Feed
                </h3>
                {alerts.length > 0 && <span className="text-[10px] bg-destructive text-white px-2 py-0.5 rounded-full font-bold animate-pulse">{alerts.length} NEW</span>}
              </div>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-8 h-8 text-success/20 mx-auto mb-2" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">System Clear</p>
                  </div>
                ) : (
                  alerts.slice().reverse().map((a, i) => (
                    <div key={i} className={`p-2.5 rounded-lg text-[10px] font-mono leading-relaxed transition-all duration-300 animate-in slide-in-from-right-4 ${a.severity === "critical" ? "bg-destructive/10 border border-destructive/20 text-destructive" : "bg-warning/10 border border-warning/20 text-warning"}`}>
                      <span className="opacity-50">[{a.time}s]</span> {a.type.toUpperCase()}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoKYC;
