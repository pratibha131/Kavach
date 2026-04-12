import { Fingerprint, Link2, Inbox } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useCases } from "@/contexts/CaseContext";

const Fingerprints = () => {
  const { cases } = useCases();

  // Group cases by fingerprint
  const fpMap = new Map<string, { fingerprint: string; model: string; cases: number; severity: string; firstSeen: string; lastSeen: string }>();
  cases.forEach(c => {
    const existing = fpMap.get(c.fingerprint);
    if (existing) {
      existing.cases++;
      existing.lastSeen = c.timestamp;
      if (c.severity === "critical") existing.severity = "critical";
    } else {
      fpMap.set(c.fingerprint, {
        fingerprint: c.fingerprint,
        model: c.modelFamily,
        cases: 1,
        severity: c.severity,
        firstSeen: c.timestamp,
        lastSeen: c.timestamp,
      });
    }
  });
  const fingerprints = Array.from(fpMap.values());

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Model <span className="gradient-text">Fingerprints</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Unique AI model signatures · Live from analysis</p>
        </div>

        {fingerprints.length === 0 ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-foreground font-medium">No fingerprints yet</p>
            <p className="text-sm text-muted-foreground mt-1">Analyze media to extract AI model fingerprints</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {fingerprints.map((fp) => (
              <div key={fp.fingerprint} className="glass-card rounded-xl p-5 hover:glow-border transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-primary" />
                    <span className="font-mono text-primary text-sm font-semibold">{fp.fingerprint}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md font-mono capitalize ${
                    fp.severity === "critical" ? "bg-destructive/20 text-destructive" :
                    fp.severity === "suspicious" ? "bg-warning/20 text-warning" :
                    "bg-success/20 text-success"
                  }`}>{fp.severity}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model</span>
                    <span className="text-foreground">{fp.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Linked Cases</span>
                    <span className="flex items-center gap-1 text-foreground"><Link2 className="w-3 h-3" /> {fp.cases}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground font-mono">
                  <span>First: {fp.firstSeen.substring(0, 10)}</span>
                  <span>Last: {fp.lastSeen.substring(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Fingerprints;
