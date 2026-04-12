import { Target, Eye, AlertTriangle, Plus, Inbox } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useCases } from "@/contexts/CaseContext";

const Honeypot = () => {
  const { cases } = useCases();

  const honeypotCases = cases.filter(c => c.honeypotTriggered);
  const totalTriggers = cases.reduce((sum, c) => sum + c.honeypotTriggers, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Deepfake <span className="gradient-text">Honeypot</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Trackable bait media detections · Live from analysis</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Deploy Honeypot
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card">
            <Target className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-semibold text-foreground">{cases.length}</p>
            <p className="text-sm text-muted-foreground">Total Analyzed</p>
          </div>
          <div className="stat-card">
            <Eye className="w-5 h-5 text-warning mb-2" />
            <p className="text-2xl font-semibold text-foreground">{totalTriggers}</p>
            <p className="text-sm text-muted-foreground">Honeypot Triggers</p>
          </div>
          <div className="stat-card">
            <AlertTriangle className="w-5 h-5 text-destructive mb-2" />
            <p className="text-2xl font-semibold text-foreground">{honeypotCases.length}</p>
            <p className="text-sm text-muted-foreground">Bait Media Reused</p>
          </div>
        </div>

        {cases.length === 0 ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-foreground font-medium">No honeypot data</p>
            <p className="text-sm text-muted-foreground mt-1">Analyze media to detect honeypot triggers</p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium">Case ID</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">File</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Severity</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Honeypot Triggered</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Triggers</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-4 font-mono text-primary">{c.id}</td>
                    <td className="p-4 font-mono text-foreground text-xs">{c.fileName}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-md font-mono capitalize ${
                        c.severity === "critical" ? "bg-destructive/20 text-destructive" :
                        c.severity === "suspicious" ? "bg-warning/20 text-warning" :
                        "bg-success/20 text-success"
                      }`}>{c.severity}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-mono ${c.honeypotTriggered ? "text-destructive" : "text-muted-foreground"}`}>
                        {c.honeypotTriggered ? "⚠ YES" : "No"}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-foreground">{c.honeypotTriggers}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{c.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Honeypot;
