import { useState, useEffect } from "react";
import { Video, Shield, AlertTriangle, Activity, Heart, Eye, Mic, Wifi, CheckCircle, XCircle, Inbox } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useCases } from "@/contexts/CaseContext";

const VideoKYC = () => {
  const { cases } = useCases();
  const [isLive, setIsLive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [metrics, setMetrics] = useState({
    faceAuth: 96, lipSync: 92, microExpr: 88, pulseRPPG: 72, blinkRate: 0.4, headPose: 2.3, latency: 45,
  });
  const [alerts, setAlerts] = useState<{ time: number; type: string; severity: string }[]>([]);
  const [verdict, setVerdict] = useState<"monitoring" | "passed" | "flagged">("monitoring");

  const kycFlaggedCases = cases.filter(c => c.kycFlagged);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setElapsed(p => p + 1);
      setMetrics(prev => {
        const a = Math.random();
        return {
          faceAuth: Math.max(60, Math.min(100, prev.faceAuth + (Math.random() - 0.4) * 3)),
          lipSync: Math.max(20, a > 0.85 ? prev.lipSync - 15 - Math.random() * 20 : Math.min(100, prev.lipSync + (Math.random() - 0.3) * 5)),
          microExpr: Math.max(30, a > 0.9 ? prev.microExpr - 20 : Math.min(100, prev.microExpr + (Math.random() - 0.3) * 4)),
          pulseRPPG: Math.max(0, a > 0.88 ? 0 : Math.min(100, Math.max(40, prev.pulseRPPG + (Math.random() - 0.5) * 10))),
          blinkRate: +(0.2 + Math.random() * 0.5).toFixed(2),
          headPose: +(Math.random() * 8).toFixed(1),
          latency: Math.floor(30 + Math.random() * 40),
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    if (!isLive) return;
    if (metrics.lipSync < 50) setAlerts(prev => [...prev.slice(-9), { time: elapsed, type: "Lip-sync desync", severity: "critical" }]);
    if (metrics.pulseRPPG < 20) setAlerts(prev => [...prev.slice(-9), { time: elapsed, type: "No rPPG pulse — synthetic face", severity: "critical" }]);
    if (metrics.microExpr < 50) setAlerts(prev => [...prev.slice(-9), { time: elapsed, type: "Micro-expression anomaly", severity: "high" }]);
  }, [metrics, elapsed, isLive]);

  const startSession = () => { setIsLive(true); setElapsed(0); setAlerts([]); setVerdict("monitoring"); };
  const endSession = () => { setIsLive(false); setVerdict(alerts.some(a => a.severity === "critical") ? "flagged" : "passed"); };
  const mc = (v: number, t: number) => v >= t ? "text-success" : v >= t * 0.6 ? "text-warning" : "text-destructive";

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Video KYC <span className="gradient-text">Interceptor</span></h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time BFSI fraud detection · {kycFlaggedCases.length} cases flagged from analysis</p>
          </div>
          {isLive ? (
            <button onClick={endSession} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90">End Session</button>
          ) : (
            <button onClick={startSession} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Start KYC Session</button>
          )}
        </div>

        {/* Flagged cases from analysis */}
        {kycFlaggedCases.length > 0 && (
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" /> KYC-Flagged Cases (from Analysis)
            </h3>
            <div className="space-y-2">
              {kycFlaggedCases.map(c => (
                <div key={c.id} className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-primary">{c.id}</span>
                    <p className="text-sm text-foreground">{c.fileName}</p>
                  </div>
                  <span className="text-xs font-mono text-destructive">{c.confidence}% deepfake</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Video className="w-4 h-4 text-primary" /> Live KYC Feed</h3>
              {isLive && <div className="flex items-center gap-2"><span className="text-xs text-destructive animate-pulse">● REC</span><span className="text-xs font-mono text-muted-foreground">{Math.floor(elapsed/60)}:{(elapsed%60).toString().padStart(2,"0")}</span></div>}
            </div>
            <div className="relative bg-secondary/30 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
              {isLive ? (
                <>
                  <div className="absolute inset-0 scan-line" />
                  <div className="text-center z-10">
                    <div className="w-32 h-32 rounded-full border-2 border-primary/50 mx-auto mb-4 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full bg-secondary/50 flex items-center justify-center"><Eye className="w-12 h-12 text-primary/50" /></div>
                    </div>
                    <p className="text-sm text-foreground">Face detection active</p>
                    <p className="text-xs text-muted-foreground font-mono">Tracking 68 facial landmarks</p>
                  </div>
                  <div className="absolute top-3 left-3 space-y-1">
                    <div className="text-xs font-mono text-success bg-background/80 px-2 py-0.5 rounded">FACE: {metrics.faceAuth.toFixed(0)}%</div>
                    <div className={`text-xs font-mono ${mc(metrics.lipSync, 70)} bg-background/80 px-2 py-0.5 rounded`}>LIP: {metrics.lipSync.toFixed(0)}%</div>
                    <div className={`text-xs font-mono ${mc(metrics.pulseRPPG, 40)} bg-background/80 px-2 py-0.5 rounded`}>rPPG: {metrics.pulseRPPG.toFixed(0)}%</div>
                  </div>
                </>
              ) : verdict !== "monitoring" ? (
                <div className="text-center">
                  {verdict === "passed" ? <><CheckCircle className="w-16 h-16 text-success mx-auto mb-3" /><p className="text-lg font-semibold text-success">KYC Passed</p></> :
                   <><XCircle className="w-16 h-16 text-destructive mx-auto mb-3" /><p className="text-lg font-semibold text-destructive">SESSION FLAGGED</p></>}
                </div>
              ) : (
                <div className="text-center"><Video className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" /><p className="text-sm text-muted-foreground">Start KYC Session to begin</p></div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Biometric Metrics</h3>
              <div className="space-y-3">
                {[
                  { icon: Eye, label: "Face Auth", value: metrics.faceAuth, unit: "%", threshold: 80 },
                  { icon: Mic, label: "Lip-Sync", value: metrics.lipSync, unit: "%", threshold: 70 },
                  { icon: Activity, label: "Micro-Expr", value: metrics.microExpr, unit: "%", threshold: 60 },
                  { icon: Heart, label: "Pulse rPPG", value: metrics.pulseRPPG, unit: "%", threshold: 40 },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><m.icon className="w-3 h-3" /> {m.label}</span>
                      <span className={`text-sm font-mono ${mc(m.value, m.threshold)}`}>{m.value.toFixed(0)}{m.unit}</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{
                        width: `${m.value}%`,
                        background: m.value >= m.threshold ? "hsl(142 76% 46%)" : m.value >= m.threshold * 0.6 ? "hsl(38 92% 50%)" : "hsl(0 72% 51%)",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" /> Alerts
                {alerts.length > 0 && <span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full font-mono">{alerts.length}</span>}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {alerts.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">No alerts</p> :
                  alerts.map((a, i) => (
                    <div key={i} className={`p-2 rounded-lg text-xs ${a.severity === "critical" ? "bg-destructive/10 border border-destructive/20" : "bg-warning/10 border border-warning/20"}`}>
                      <p className={`font-mono ${a.severity === "critical" ? "text-destructive" : "text-warning"}`}>[{a.time}s] {a.type}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoKYC;
