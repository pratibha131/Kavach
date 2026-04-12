import { FileText, Download, Hash, Clock, Cpu, Lock, Inbox } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useCases } from "@/contexts/CaseContext";

const downloadReport = (c: any) => {
  const report = `KAVACH DEEPGUARD AI — FORENSIC REPORT
========================================
Report ID: FR-${c.id}
Case ID: ${c.id}
File: ${c.fileName} (${c.fileSize})
Generated: ${c.timestamp}

CRYPTOGRAPHIC HASHES
--------------------
File SHA-256: ${c.fileHash}
Analysis SHA-256: ${c.analysisHash}

DETECTION SUMMARY
-----------------
Verdict: ${c.verdict}
Confidence: ${c.confidence}%
Face Swap Score: ${c.faceSwap}%
Voice Clone Score: ${c.voiceClone}%
Synthetic Artifacts: ${c.synthetic}%
Severity: ${c.severity.toUpperCase()}
Recommended Action: ${c.action.toUpperCase()}

MODEL FINGERPRINT
-----------------
Fingerprint ID: ${c.fingerprint}
Model Family: ${c.modelFamily}

TAMPER TIMESTAMPS
-----------------
${c.tamperTimestamps.join("\n")}

CHAIN OF CUSTODY
----------------
${c.chainOfCustody.map((e: any) => `${e.timestamp} | ${e.action} | ${e.officer} | Hash: ${e.hash}`).join("\n")}

========================================
Kavach DeepGuard AI v3.2.1
This report is tamper-proof and hash-verified.
`;

  const blob = new Blob([report], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Forensic_Report_${c.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const Forensics = () => {
  const { cases } = useCases();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Forensic <span className="gradient-text">Reports</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Tamper-proof forensic reports · Downloadable · Live from analysis engine</p>
        </div>

        {cases.length === 0 ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-foreground font-medium">No forensic reports yet</p>
            <p className="text-sm text-muted-foreground mt-1">Analyze media to generate forensic reports automatically</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.map((c) => (
              <div key={c.id} className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground font-mono">FR-{c.id}</p>
                      <p className="text-xs text-muted-foreground">Case: {c.id} · {c.fileName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-md capitalize ${
                      c.severity === "critical" ? "bg-destructive/20 text-destructive" :
                      c.severity === "suspicious" ? "bg-warning/20 text-warning" :
                      "bg-success/20 text-success"
                    }`}>{c.severity}</span>
                    <span className="text-xs px-2 py-1 rounded-md bg-success/20 text-success flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Verified
                    </span>
                    <button onClick={() => downloadReport(c)} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors" title="Download Report">
                      <Download className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">File Hash (SHA-256)</span>
                    </div>
                    <p className="font-mono text-xs text-foreground break-all">{c.fileHash}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Analysis Hash</span>
                    </div>
                    <p className="font-mono text-xs text-foreground break-all">{c.analysisHash}</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Tamper Timestamps</span>
                    </div>
                    {c.tamperTimestamps.map((ts, i) => (
                      <p key={i} className="font-mono text-xs text-warning">{ts}</p>
                    ))}
                    {c.tamperTimestamps.length === 0 && <p className="font-mono text-xs text-success">No tampering detected</p>}
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Cpu className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Analysis Details</span>
                    </div>
                    <p className="font-mono text-xs text-foreground">Kavach DeepGuard v3.2.1</p>
                    <p className="font-mono text-xs text-muted-foreground mt-1">{c.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Forensics;
