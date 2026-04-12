import { Globe, TrendingUp, MapPin, Clock, ArrowRight, Inbox } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCases } from "@/contexts/CaseContext";

const Propagation = () => {
  const { cases } = useCases();

  const spreadData = [
    { hour: "0h", shares: 2 }, { hour: "2h", shares: 5 }, { hour: "4h", shares: 12 },
    { hour: "6h", shares: 28 }, { hour: "8h", shares: 67 }, { hour: "10h", shares: 134 },
    { hour: "12h", shares: 89 }, { hour: "14h", shares: 45 }, { hour: "16h", shares: 23 },
  ];

  const trackingCases = cases.filter(c => c.severity !== "authentic");

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Propagation <span className="gradient-text">Tracking</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track deepfake spread across platforms · Live from analysis</p>
        </div>

        {trackingCases.length > 0 && (
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Spread Velocity — {trackingCases[0]?.fileName}
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={spreadData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="hour" stroke="hsl(215, 20%, 55%)" fontSize={12} label={{ value: 'Time (Hours)', position: 'insideBottom', offset: -15, fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} label={{ value: 'Total Shares', angle: -90, position: 'insideLeft', offset: 10, fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(222, 41%, 9%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 92%)", fontSize: 12 }} />
                <Bar dataKey="shares" fill="hsl(190, 100%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {trackingCases.length === 0 ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-foreground font-medium">No propagation data</p>
            <p className="text-sm text-muted-foreground mt-1">Analyze deepfake media to track its spread</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trackingCases.map((item) => (
              <div key={item.id} className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-mono text-foreground">{item.fileName}</p>
                      <p className="text-xs text-muted-foreground">{item.id} · {item.verdict}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md font-mono ${
                    item.spreadStatus === "Active" ? "bg-destructive/20 text-destructive" :
                    item.spreadStatus === "Contained" ? "bg-success/20 text-success" :
                    "bg-warning/20 text-warning"
                  }`}>{item.spreadStatus}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Platforms</p>
                      <p className="font-mono text-foreground">{item.platforms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Shares</p>
                      <p className="font-mono text-foreground">{item.totalShares.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">First Seen</p>
                      <p className="font-mono text-xs text-foreground">{item.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Severity</p>
                      <p className={`font-mono text-xs capitalize ${item.severity === "critical" ? "text-destructive" : "text-warning"}`}>{item.severity}</p>
                    </div>
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

export default Propagation;
