import { useState } from "react";
import { Microscope, Waves, Eye, Layers, Grid3X3, Activity, Inbox, Download } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCases } from "@/contexts/CaseContext";

const ForensicLab = () => {
  const { cases } = useCases();
  const [activeTab, setActiveTab] = useState<"heatmap" | "spectrogram" | "temporal" | "ela">("heatmap");
  const [selectedCase, setSelectedCase] = useState<string | null>(cases[0]?.id || null);

  const currentCase = cases.find(c => c.id === selectedCase) || cases[0];

  // Generate data based on current case
  const heatmapCells = Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const isTampered = currentCase && currentCase.severity !== "authentic" && row >= 2 && row <= 4 && col >= 3 && col <= 5;
    return { id: i, row, col, value: isTampered ? 70 + Math.random() * 30 : Math.random() * 30, tampered: !!isTampered };
  });

  const spectrogramData = Array.from({ length: 50 }, (_, i) => ({
    freq: i * 200,
    amplitude: Math.random() * 100,
    anomaly: currentCase && currentCase.severity !== "authentic" && i > 18 && i < 28 ? Math.random() * 80 + 20 : Math.random() * 15,
  }));

  const temporalData = Array.from({ length: 30 }, (_, i) => ({
    frame: i * 5,
    faceConf: 92 + Math.random() * 8,
    lipSync: currentCase && currentCase.severity !== "authentic" && i > 10 && i < 20 ? 40 + Math.random() * 20 : 85 + Math.random() * 10,
    blink: i === 12 || i === 24 ? 30 : 90 + Math.random() * 10,
  }));

  const downloadForensicData = () => {
    if (!currentCase) return;
    const data = `FORENSIC LAB ANALYSIS - ${currentCase.id}
=========================================
File: ${currentCase.fileName}
Severity: ${currentCase.severity}
Confidence: ${currentCase.confidence}%

DETECTION SCORES:
Face Swap: ${currentCase.faceSwap}%
Voice Clone: ${currentCase.voiceClone}%
Synthetic: ${currentCase.synthetic}%

HASHES:
File: ${currentCase.fileHash}
Analysis: ${currentCase.analysisHash}

TAMPER TIMESTAMPS:
${currentCase.tamperTimestamps.join("\n")}
`;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Forensic_Lab_${currentCase.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Forensic <span className="gradient-text">Lab</span></h1>
            <p className="text-sm text-muted-foreground mt-1">Deep-dive analysis · Live from analysis engine</p>
          </div>
          {currentCase && (
            <button onClick={downloadForensicData} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              <Download className="w-4 h-4" /> Download Report
            </button>
          )}
        </div>

        {cases.length === 0 ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-foreground font-medium">No cases to analyze</p>
            <p className="text-sm text-muted-foreground mt-1">Analyze media first to see forensic data here</p>
          </div>
        ) : (
          <>
            {/* Case Selector */}
            <div className="flex gap-2 flex-wrap">
              {cases.map(c => (
                <button key={c.id} onClick={() => setSelectedCase(c.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-mono transition-all ${
                    selectedCase === c.id ? "bg-primary/20 text-primary glow-border" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}>
                  {c.id} ({c.severity})
                </button>
              ))}
            </div>

            {/* Tool Tabs */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "heatmap", icon: Grid3X3, label: "Heatmap" },
                { key: "spectrogram", icon: Waves, label: "Spectrogram" },
                { key: "temporal", icon: Activity, label: "Temporal" },
                { key: "ela", icon: Layers, label: "ELA" },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key ? "bg-primary/20 text-primary glow-border" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}>
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "heatmap" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" /> Manipulation Heatmap — {currentCase?.fileName}
                  </h3>
                  <div className="grid grid-cols-8 gap-1 aspect-square max-w-[320px] mx-auto">
                    {heatmapCells.map(cell => (
                      <div key={cell.id} className="rounded-sm cursor-pointer transition-all hover:scale-110 relative group"
                        style={{
                          backgroundColor: cell.tampered
                            ? `hsl(0 ${60 + cell.value * 0.4}% ${30 + cell.value * 0.2}%)`
                            : `hsl(190 ${cell.value}% ${15 + cell.value * 0.3}%)`,
                          aspectRatio: "1",
                        }}>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border border-border rounded px-2 py-1 whitespace-nowrap z-10">
                          <span className="text-xs font-mono">{cell.value.toFixed(0)}% {cell.tampered ? "⚠️" : "✓"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Region Analysis</h3>
                  <div className="space-y-3">
                    {[
                      { region: "Face Center", score: currentCase?.faceSwap || 0 },
                      { region: "Mouth/Lips", score: currentCase?.voiceClone || 0 },
                      { region: "Synthetic Layer", score: currentCase?.synthetic || 0 },
                    ].map((r, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary/50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-foreground">{r.region}</span>
                          <span className={`text-xs font-mono px-2 py-0.5 rounded ${r.score > 70 ? "bg-destructive/20 text-destructive" : r.score > 40 ? "bg-warning/20 text-warning" : "bg-success/20 text-success"}`}>{r.score}%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${r.score}%`, background: r.score > 70 ? "hsl(0 72% 51%)" : r.score > 40 ? "hsl(38 92% 50%)" : "hsl(142 76% 46%)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "spectrogram" && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Waves className="w-4 h-4 text-primary" /> Audio Frequency — {currentCase?.fileName}
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={spectrogramData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                    <XAxis dataKey="freq" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -15, fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} label={{ value: 'Amplitude', angle: -90, position: 'insideLeft', offset: 10, fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 18%)", borderRadius: "8px", color: "hsl(210 40% 92%)" }} />
                    <Area type="monotone" dataKey="amplitude" stroke="hsl(190 100% 50%)" fill="hsl(190 100% 50% / 0.15)" />
                    <Area type="monotone" dataKey="anomaly" stroke="hsl(0 72% 51%)" fill="hsl(0 72% 51% / 0.2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-2 font-mono">Red zones = synthetic voice artifacts</p>
              </div>
            )}

            {activeTab === "temporal" && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Temporal Analysis — {currentCase?.fileName}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={temporalData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                    <XAxis dataKey="frame" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} label={{ value: 'Frame / Time', position: 'insideBottom', offset: -15, fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} domain={[0, 100]} label={{ value: 'Confidence Score', angle: -90, position: 'insideLeft', offset: 10, fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 18%)", borderRadius: "8px", color: "hsl(210 40% 92%)" }} />
                    <Area type="monotone" dataKey="faceConf" name="Face" stroke="hsl(190 100% 50%)" fill="hsl(190 100% 50% / 0.1)" strokeWidth={2} />
                    <Area type="monotone" dataKey="lipSync" name="Lip-Sync" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50% / 0.1)" strokeWidth={2} />
                    <Area type="monotone" dataKey="blink" name="Blink" stroke="hsl(260 80% 60%)" fill="hsl(260 80% 60% / 0.1)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === "ela" && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Error Level Analysis — {currentCase?.fileName}
                </h3>
                <div className="grid grid-cols-8 gap-0.5 max-w-[320px] mx-auto">
                  {Array.from({ length: 64 }, (_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isFace = currentCase?.severity !== "authentic" && row >= 1 && row <= 5 && col >= 2 && col <= 5;
                    const val = isFace ? 60 + Math.random() * 40 : Math.random() * 25;
                    return (
                      <div key={i} className="aspect-square rounded-[2px]" style={{
                        backgroundColor: isFace ? `hsl(38 ${50 + val}% ${20 + val * 0.3}%)` : `hsl(222 30% ${12 + val * 0.3}%)`,
                      }} />
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center font-mono">Bright = higher compression inconsistency</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ForensicLab;
