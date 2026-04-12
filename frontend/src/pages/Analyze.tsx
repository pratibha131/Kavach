import React, { useState } from "react";
import { Upload, FileVideo, FileAudio, Image, Loader2, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import ThreatIndicator from "@/components/ThreatIndicator";
import { useCases } from "@/contexts/CaseContext";
import { toast } from "sonner";

const Analyze = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    verdict: string;
    confidence: number;
    faceSwap: number;
    voiceClone: number;
    synthetic: number;
    fingerprint: string;
  }>(null);
  const { addCase } = useCases();
  const navigate = useNavigate();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
  };

  const runAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/analyze`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      const newCase = data.case;
      
      const analysisResult = {
        verdict: newCase.verdict,
        confidence: newCase.confidence,
        faceSwap: newCase.faceSwap,
        voiceClone: newCase.voiceClone,
        synthetic: newCase.synthetic,
        fingerprint: newCase.fingerprint,
      };

      setResult(analysisResult);
      addCase(newCase);

      // Toast notification with severity-based messaging
      // Toast notification with severity-based messaging
      if (newCase.severity === "critical") {
        toast.error(`🚨 CRITICAL: ${file!.name} flagged as deepfake (${analysisResult.confidence}%)`, {
          description: "Auto-routed to Police Command & all dashboards. Immediate platform removal recommended.",
          duration: 8000,
        });
      } else if (newCase.severity === "suspicious") {
        toast.warning(`⚠️ SUSPICIOUS: ${file!.name} needs review (${analysisResult.confidence}%)`, {
          description: "Added to monitoring queue across all dashboards.",
          duration: 6000,
        });
      } else {
        toast.success(`✅ AUTHENTIC: ${file!.name} verified safe (${analysisResult.confidence}%)`, {
          description: "Cleared for all platforms. No action required.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Analysis Failed", { description: "Could not communicate with the Python backend API." });
    } finally {
      setAnalyzing(false);
    }
  };

  const fileIcon = file?.type.startsWith("video") ? FileVideo :
    file?.type.startsWith("audio") ? FileAudio : Image;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            <span className="gradient-text">Analyze</span> Media
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Upload video, audio, or image — results auto-sync to all dashboards</p>
        </div>

        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="glass-card rounded-xl p-16 text-center cursor-pointer hover:glow-border transition-all duration-300 scan-line"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-foreground font-medium">Drop media file here or click to upload</p>
            <p className="text-sm text-muted-foreground mt-2">Supports MP4, AVI, WAV, MP3, JPG, PNG · Max 500MB</p>
            <input id="file-input" type="file" className="hidden" accept="video/*,audio/*,image/*"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                {React.createElement(fileIcon, { className: "w-6 h-6 text-primary" })}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground font-mono">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type}</p>
              </div>
              {!analyzing && !result && (
                <button onClick={runAnalysis}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Start Analysis
                </button>
              )}
              <button onClick={() => { setFile(null); setResult(null); }}
                className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
                Clear
              </button>
            </div>

            {analyzing && (
              <div className="glass-card rounded-xl p-10 text-center scan-line">
                <Loader2 className="w-10 h-10 text-primary mx-auto mb-4 animate-spin" />
                <p className="text-foreground font-medium">Running deepfake detection engine...</p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">Analyzing face swap · voice clone · synthetic artifacts</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className={`glass-card rounded-xl p-6 ${result.confidence > 70 ? "glow-border" : ""}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {result.confidence > 70 ? (
                      <AlertTriangle className="w-8 h-8 text-destructive" />
                    ) : result.confidence > 30 ? (
                      <AlertTriangle className="w-8 h-8 text-warning" />
                    ) : (
                      <CheckCircle className="w-8 h-8 text-success" />
                    )}
                    <div>
                      <p className={`text-lg font-semibold ${result.confidence > 70 ? "text-destructive" : result.confidence > 30 ? "text-warning" : "text-success"}`}>
                        {result.verdict}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Overall confidence: {result.confidence}%
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <ThreatIndicator level={result.faceSwap > 70 ? "critical" : result.faceSwap > 40 ? "high" : "low"} score={result.faceSwap} label="Face Swap Detection" />
                    <ThreatIndicator level={result.voiceClone > 60 ? "high" : result.voiceClone > 30 ? "medium" : "low"} score={result.voiceClone} label="Voice Cloning" />
                    <ThreatIndicator level={result.synthetic > 50 ? "medium" : "low"} score={result.synthetic} label="Synthetic Artifacts" />
                  </div>
                </div>

                <div className="glass-card rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Model Fingerprint
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Fingerprint ID</p>
                      <p className="font-mono text-primary">{result.fingerprint}</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Model Family</p>
                      <p className="font-mono text-foreground">GAN-StyleTransfer v3</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Noise Pattern</p>
                      <p className="font-mono text-foreground">DCT-Freq Anomaly</p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Synced To</p>
                      <p className="font-mono text-success">All Dashboards ✓</p>
                    </div>
                  </div>
                </div>

                {/* Quick Navigation */}
                <div className="glass-card rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-3">Case auto-synced. View in:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Results", path: "/results" },
                      { label: "Police Command", path: "/police" },
                      { label: "Forensics", path: "/forensics" },
                      { label: "Courtroom", path: "/courtroom" },
                      { label: "Propagation", path: "/propagation" },
                    ].map(link => (
                      <button key={link.path} onClick={() => navigate(link.path)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono">
                        {link.label} →
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analyze;
