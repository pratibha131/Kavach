import { AlertTriangle, CheckCircle, Video, Image, Mic, Eye, Inbox } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useCases } from "@/contexts/CaseContext";

const typeIcons = { video: Video, image: Image, audio: Mic };

const Results = () => {
  const { cases } = useCases();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Detection <span className="gradient-text">Results</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">All analyzed media with detection verdicts · Live synced from Analyze page</p>
        </div>

        {cases.length === 0 ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-foreground font-medium">No cases yet</p>
            <p className="text-sm text-muted-foreground mt-1">Upload and analyze media on the Analyze page to see results here</p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-medium">Case ID</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">File</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Verdict</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Confidence</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Severity</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Action</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Fingerprint</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((r) => {
                    const TypeIcon = typeIcons[r.fileType];
                    const isCritical = r.severity === "critical";
                    const isSuspicious = r.severity === "suspicious";
                    return (
                      <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="p-4 font-mono text-primary">{r.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-foreground text-xs">{r.fileName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                            isCritical ? "bg-destructive/20 text-destructive" :
                            isSuspicious ? "bg-warning/20 text-warning" :
                            "bg-success/20 text-success"
                          }`}>
                            {isCritical ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            {r.verdict}
                          </span>
                        </td>
                        <td className="p-4 font-mono">{r.confidence}%</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-md font-mono capitalize ${
                            isCritical ? "bg-destructive/20 text-destructive" :
                            isSuspicious ? "bg-warning/20 text-warning" :
                            "bg-success/20 text-success"
                          }`}>{r.severity}</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-md font-mono capitalize ${
                            r.action === "remove" ? "bg-destructive/20 text-destructive" :
                            r.action === "monitor" ? "bg-warning/20 text-warning" :
                            "bg-success/20 text-success"
                          }`}>{r.action === "remove" ? "🚫 Remove" : r.action === "monitor" ? "👁 Monitor" : "✅ Safe"}</span>
                        </td>
                        <td className="p-4 font-mono text-accent text-xs">{r.fingerprint}</td>
                        <td className="p-4 text-muted-foreground font-mono text-xs">{r.timestamp}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Results;
