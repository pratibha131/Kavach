import { Shield, AlertTriangle, FileText, Fingerprint, Activity, Globe } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/StatCard";
import DetectionChart from "@/components/DetectionChart";
import ThreatIndicator from "@/components/ThreatIndicator";
import { useCases } from "@/contexts/CaseContext";

const Dashboard = () => {
  const { cases } = useCases();
  const criticalCount = cases.filter(c => c.severity === "critical").length;
  const fingerprintCount = new Set(cases.map(c => c.fingerprint)).size;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Threat <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time deepfake detection & forensic intelligence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Shield} label="Total Scans" value={String(cases.length || "0")} change="Live" changeType="positive" />
          <StatCard icon={AlertTriangle} label="Deepfakes Detected" value={String(criticalCount)} change={criticalCount > 0 ? "Action needed" : "Clear"} changeType={criticalCount > 0 ? "negative" : "positive"} />
          <StatCard icon={Fingerprint} label="Model Fingerprints" value={String(fingerprintCount)} change="Unique" changeType="positive" />
          <StatCard icon={FileText} label="Forensic Reports" value={String(cases.length)} change="Auto-generated" changeType="neutral" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <DetectionChart />
          </div>
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Threat Levels</h3>
            {cases.length > 0 ? (
              <>
                <ThreatIndicator level={cases[0]?.faceSwap > 70 ? "critical" : "medium"} score={cases[0]?.faceSwap || 0} label="Face Swap (Latest)" />
                <ThreatIndicator level={cases[0]?.voiceClone > 60 ? "high" : "low"} score={cases[0]?.voiceClone || 0} label="Voice Clone (Latest)" />
                <ThreatIndicator level={cases[0]?.synthetic > 50 ? "medium" : "low"} score={cases[0]?.synthetic || 0} label="Synthetic (Latest)" />
              </>
            ) : (
              <>
                <ThreatIndicator level="low" score={0} label="Face Swap" />
                <ThreatIndicator level="low" score={0} label="Voice Cloning" />
                <ThreatIndicator level="low" score={0} label="Synthetic Artifacts" />
              </>
            )}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Cases analyzed:</span>
                <span className="text-xs font-mono text-primary">{cases.length}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Globe className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">Critical alerts:</span>
                <span className="text-xs font-mono text-destructive">{criticalCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Cases */}
        {cases.length > 0 && (
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Recent Analysis (Live)</h3>
            <div className="space-y-3">
              {cases.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm text-foreground font-mono">{c.fileName}</p>
                    <p className="text-xs text-muted-foreground">{c.id} · {c.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-md font-mono capitalize ${
                      c.severity === "critical" ? "bg-destructive/20 text-destructive" :
                      c.severity === "suspicious" ? "bg-warning/20 text-warning" :
                      "bg-success/20 text-success"
                    }`}>{c.severity}</span>
                    <span className={`text-xs px-2 py-1 rounded-md font-mono ${
                      c.action === "remove" ? "bg-destructive/20 text-destructive" :
                      c.action === "monitor" ? "bg-warning/20 text-warning" :
                      "bg-success/20 text-success"
                    }`}>{c.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
