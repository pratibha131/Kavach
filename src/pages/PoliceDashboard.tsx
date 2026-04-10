import { useState } from "react";
import { Shield, AlertTriangle, MapPin, TrendingUp, Clock, Users, Ban, Eye, CheckCircle, Inbox } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { useCases, CaseAction } from "@/contexts/CaseContext";
import { toast } from "sonner";

const categoryData = [
  { name: "Financial Fraud", value: 42, color: "hsl(330 80% 60%)" },
  { name: "Political Misinfo", value: 28, color: "hsl(220 90% 60%)" },
  { name: "Identity Theft", value: 18, color: "hsl(190 100% 50%)" },
  { name: "Harassment", value: 12, color: "hsl(260 80% 60%)" },
];

const severityColor = (s: string) =>
  s === "critical" ? "bg-destructive/20 text-destructive" :
  s === "suspicious" ? "bg-warning/20 text-warning" :
  "bg-success/20 text-success";

const PoliceDashboard = () => {
  const { cases, updateCaseAction } = useCases();
  const [triageFilter, setTriageFilter] = useState("all");

  const filtered = triageFilter === "all" ? cases : cases.filter(c => c.severity === triageFilter);
  const criticalCount = cases.filter(c => c.severity === "critical").length;
  const suspiciousCount = cases.filter(c => c.severity === "suspicious").length;
  const authenticCount = cases.filter(c => c.severity === "authentic").length;

  const handleAction = (id: string, action: CaseAction, fileName: string) => {
    updateCaseAction(id, action);
    if (action === "remove") {
      toast.error(`🚫 ${fileName} — Removal order issued to all platforms`, { duration: 5000 });
    } else if (action === "monitor") {
      toast.warning(`👁 ${fileName} — Added to active monitoring`, { duration: 4000 });
    } else {
      toast.success(`✅ ${fileName} — Cleared as safe`, { duration: 4000 });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Police <span className="gradient-text">Command Center</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Punjab Police · Live case triage from analysis engine</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-destructive/20 text-destructive font-mono animate-pulse">● LIVE</span>
            <span className="text-xs text-muted-foreground font-mono">{cases.length} cases</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: AlertTriangle, label: "Critical (Remove Now)", value: String(criticalCount), color: "text-destructive" },
            { icon: Eye, label: "Suspicious (Monitor)", value: String(suspiciousCount), color: "text-warning" },
            { icon: CheckCircle, label: "Authentic (Safe)", value: String(authenticCount), color: "text-success" },
            { icon: Shield, label: "Total Cases", value: String(cases.length), color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Crime Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Crime Categories</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(222 30% 14%)", 
                    border: "1px solid hsl(222 30% 25%)", 
                    borderRadius: "8px", 
                    color: "hsl(210 40% 92%)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                  }} 
                  itemStyle={{ color: "hsl(210 40% 92%)", fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryData.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-xs text-muted-foreground">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Guide */}
          <div className="lg:col-span-2 glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">🚨 Police Action Protocol</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm font-semibold text-destructive">🔴 CRITICAL (Confidence ≥ 70%)</p>
                <p className="text-xs text-muted-foreground mt-1">Immediate removal from all platforms. File FIR. Trace origin. Issue takedown notices to social media platforms. Alert Cyber Cell.</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-semibold text-warning">🟡 SUSPICIOUS (Confidence 30-70%)</p>
                <p className="text-xs text-muted-foreground mt-1">Place under monitoring. If content causes severe harm → escalate to Critical and remove. Otherwise keep monitoring and gather more evidence.</p>
              </div>
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm font-semibold text-success">🟢 AUTHENTIC (Confidence &lt; 30%)</p>
                <p className="text-xs text-muted-foreground mt-1">Content is verified as genuine. Safe to remain on platforms. No action required.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Triage */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Case Triage Queue</h3>
            <div className="flex gap-1">
              {["all", "critical", "suspicious", "authentic"].map(f => (
                <button key={f} onClick={() => setTriageFilter(f)}
                  className={`text-xs px-2 py-1 rounded-md capitalize transition-colors ${triageFilter === f ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <Inbox className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No cases. Analyze media to populate this queue.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(c => (
                <div key={c.id} className="p-4 rounded-lg bg-secondary/50 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-primary">{c.id}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${severityColor(c.severity)}`}>{c.severity}</span>
                      <span className="text-xs font-mono text-muted-foreground">{c.confidence}%</span>
                    </div>
                    <p className="text-sm text-foreground mt-1 truncate">{c.fileName}</p>
                    <p className="text-xs text-muted-foreground">{c.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.severity === "critical" && (
                      <button onClick={() => handleAction(c.id, "remove", c.fileName)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                          c.action === "remove" ? "bg-destructive/30 text-destructive" : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        }`}>
                        <Ban className="w-3 h-3" /> {c.action === "remove" ? "Removed ✓" : "Remove All"}
                      </button>
                    )}
                    {c.severity === "suspicious" && (
                      <>
                        <button onClick={() => handleAction(c.id, "monitor", c.fileName)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            c.action === "monitor" ? "bg-warning/30 text-warning" : "bg-warning/10 text-warning hover:bg-warning/20"
                          }`}>
                          {c.action === "monitor" ? "Monitoring ✓" : "Monitor"}
                        </button>
                        <button onClick={() => handleAction(c.id, "remove", c.fileName)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                          Escalate
                        </button>
                      </>
                    )}
                    {c.severity === "authentic" && (
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-success/20 text-success font-medium">✅ Safe</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoliceDashboard;
