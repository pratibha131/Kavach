import { useState, useEffect } from "react";
import { Swords, Shield, Zap, RotateCcw, CheckCircle, XCircle, Activity, Brain, Target, Inbox } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useCases } from "@/contexts/CaseContext";

type Round = {
  id: number;
  adversaryAction: string;
  adversaryModel: string;
  hunterResult: "detected" | "missed";
  hunterConfidence: number;
  technique: string;
  timeMs: number;
};

const techniques = [
  "GAN-StyleTransfer face swap", "Diffusion-based lip replacement", "Wav2Vec voice clone injection",
  "JPEG artifact masking", "Temporal smoothing bypass", "Frequency-domain noise injection",
  "Adversarial perturbation overlay", "rPPG signal synthesis", "Micro-expression replay attack", "Multi-modal fusion attack",
];
const adversaryModels = ["GAN-v4.2", "SD-XL-Turbo", "DALL-E-3-Fine", "VoiceClone-Pro", "FaceForge-v2", "NeRF-Face"];

const RedTeam = () => {
  const { cases } = useCases();
  const [running, setRunning] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [stats, setStats] = useState({ detected: 0, missed: 0, avgConf: 0, totalRounds: 0 });

  const runSimulation = () => { setRunning(true); setRounds([]); setCurrentRound(0); setStats({ detected: 0, missed: 0, avgConf: 0, totalRounds: 0 }); };

  useEffect(() => {
    if (!running || currentRound >= 12) { if (currentRound >= 12) setRunning(false); return; }
    const timer = setTimeout(() => {
      const technique = techniques[Math.floor(Math.random() * techniques.length)];
      const model = adversaryModels[Math.floor(Math.random() * adversaryModels.length)];
      const detected = Math.random() > 0.25;
      const confidence = detected ? 60 + Math.random() * 38 : 20 + Math.random() * 35;
      const round: Round = { id: currentRound + 1, adversaryAction: `Generated ${technique} using ${model}`, adversaryModel: model, hunterResult: detected ? "detected" : "missed", hunterConfidence: +confidence.toFixed(1), technique, timeMs: Math.floor(100 + Math.random() * 400) };
      setRounds(prev => [...prev, round]);
      setStats(prev => { const d = detected ? prev.detected + 1 : prev.detected; const m = detected ? prev.missed : prev.missed + 1; const total = prev.totalRounds + 1; return { detected: d, missed: m, avgConf: +((prev.avgConf * prev.totalRounds + confidence) / total).toFixed(1), totalRounds: total }; });
      setCurrentRound(prev => prev + 1);
    }, 800 + Math.random() * 600);
    return () => clearTimeout(timer);
  }, [running, currentRound]);

  const detectionRate = stats.totalRounds > 0 ? ((stats.detected / stats.totalRounds) * 100).toFixed(1) : "0";

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Red-Team <span className="gradient-text">Adversary Agent</span></h1>
            <p className="text-sm text-muted-foreground mt-1">Self-improving dual-agent system · {cases.length} cases in system</p>
          </div>
          <button onClick={runSimulation} disabled={running}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
            {running ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {running ? "Running..." : "Start Adversarial Round"}
          </button>
        </div>

        <div className="glass-card rounded-xl p-4 border-l-4" style={{ borderLeftColor: "hsl(0 72% 51%)" }}>
          <div className="flex items-start gap-3">
            <Swords className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Dual-Agent Autonomous Loop</p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-destructive font-semibold">Adversary</span> generates attacks.{" "}
                <span className="text-success font-semibold">Hunter</span> defends. Learning from {cases.length} analyzed cases.
              </p>
            </div>
          </div>
        </div>

        {/* Analyzed cases feeding the model */}
        {cases.length > 0 && (
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-xs font-semibold text-foreground mb-2">Training Data (from Analysis Engine)</h3>
            <div className="flex flex-wrap gap-2">
              {cases.slice(0, 8).map(c => (
                <span key={c.id} className={`text-xs px-2 py-1 rounded font-mono ${
                  c.severity === "critical" ? "bg-destructive/20 text-destructive" :
                  c.severity === "suspicious" ? "bg-warning/20 text-warning" :
                  "bg-success/20 text-success"
                }`}>{c.id} ({c.confidence}%)</span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Target, label: "Rounds", value: stats.totalRounds.toString(), color: "text-primary" },
            { icon: Shield, label: "Detected", value: stats.detected.toString(), color: "text-success" },
            { icon: XCircle, label: "Bypassed", value: stats.missed.toString(), color: "text-destructive" },
            { icon: Activity, label: "Detection Rate", value: `${detectionRate}%`, color: +detectionRate > 70 ? "text-success" : "text-warning" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-2xl font-semibold text-foreground font-mono">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Swords className="w-4 h-4 text-destructive" /> <span className="text-destructive">Adversary</span> Attacks
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {rounds.map(r => (
                <div key={r.id} className={`p-3 rounded-lg border ${r.hunterResult === "missed" ? "bg-destructive/5 border-destructive/20" : "bg-secondary/50 border-border"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-muted-foreground">Round #{r.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${r.hunterResult === "missed" ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"}`}>{r.hunterResult === "missed" ? "BYPASSED ✗" : "CAUGHT ✓"}</span>
                  </div>
                  <p className="text-sm text-foreground">{r.technique}</p>
                  <p className="text-xs text-muted-foreground mt-1">Model: {r.adversaryModel} · {r.timeMs}ms</p>
                </div>
              ))}
              {running && <div className="p-3 rounded-lg bg-secondary/30 border border-border animate-pulse"><p className="text-xs text-muted-foreground">Generating attack...</p></div>}
              {rounds.length === 0 && !running && <p className="text-xs text-muted-foreground text-center py-8">Start a round to begin</p>}
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" /> <span className="text-success">Hunter</span> Detections
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {rounds.map(r => (
                <div key={r.id} className={`p-3 rounded-lg border ${r.hunterResult === "detected" ? "bg-success/5 border-success/20" : "bg-secondary/50 border-border"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-muted-foreground">Response #{r.id}</span>
                    <span className={`text-sm font-mono ${r.hunterResult === "detected" ? "text-success" : "text-destructive"}`}>{r.hunterConfidence}%</span>
                  </div>
                  <p className="text-sm text-foreground">{r.hunterResult === "detected" ? `Detected ${r.technique}` : `Failed: ${r.technique}`}</p>
                </div>
              ))}
              {running && <div className="p-3 rounded-lg bg-secondary/30 border border-border animate-pulse"><p className="text-xs text-muted-foreground">Analyzing...</p></div>}
              {rounds.length === 0 && !running && <p className="text-xs text-muted-foreground text-center py-8">Waiting for attacks</p>}
            </div>
          </div>
        </div>

        {rounds.length > 0 && (
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Brain className="w-4 h-4 text-accent" /> Learning Progress</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {rounds.map(r => (
                <div key={r.id} className={`p-2 rounded-lg text-center ${r.hunterResult === "detected" ? "bg-success/10" : "bg-destructive/10"}`}>
                  <p className="text-xs font-mono text-muted-foreground">R{r.id}</p>
                  <p className={`text-sm font-mono font-semibold ${r.hunterResult === "detected" ? "text-success" : "text-destructive"}`}>{r.hunterConfidence}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RedTeam;
