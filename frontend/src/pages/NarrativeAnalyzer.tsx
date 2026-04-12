import { Brain, Search, Database, MessageSquare, Shield, AlertTriangle, CheckCircle, Inbox } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useCases } from "@/contexts/CaseContext";

const NarrativeAnalyzer = () => {
  const { cases } = useCases();
  const casesWithNarrative = cases.filter(c => c.transcript);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            RAG <span className="gradient-text">Narrative Analyzer</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered transcript analysis · Auto-populated from analyzed cases</p>
        </div>

        <div className="glass-card rounded-xl p-4 border-l-4" style={{ borderLeftColor: "hsl(260 80% 60%)" }}>
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">How RAG Narrative Analysis Works</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Video Upload", "Audio Extraction", "Speech-to-Text", "RAG Query", "Pattern Match", "Risk Score"].map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-xs px-2 py-1 rounded bg-secondary/80 text-foreground font-mono">{s}</span>
                    {i < 5 && <span className="text-primary text-xs">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {cases.length === 0 ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-foreground font-medium">No narrative data</p>
            <p className="text-sm text-muted-foreground mt-1">Analyze media on the Analyze page — critical cases auto-generate narratives</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stat-card">
                <p className="text-2xl font-semibold text-foreground">{cases.length}</p>
                <p className="text-sm text-muted-foreground">Total Cases</p>
              </div>
              <div className="stat-card">
                <p className="text-2xl font-semibold text-destructive">{casesWithNarrative.length}</p>
                <p className="text-sm text-muted-foreground">Scam Narratives Found</p>
              </div>
              <div className="stat-card">
                <p className="text-2xl font-semibold text-warning">
                  {casesWithNarrative.length > 0 ? Math.round(casesWithNarrative.reduce((s, c) => s + (c.narrativeRisk || 0), 0) / casesWithNarrative.length) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Risk Score</p>
              </div>
            </div>

            {/* Case narratives */}
            {cases.map(c => (
              <div key={c.id} className="glass-card rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {c.severity === "critical" ? <AlertTriangle className="w-5 h-5 text-destructive" /> : 
                     c.severity === "suspicious" ? <AlertTriangle className="w-5 h-5 text-warning" /> :
                     <CheckCircle className="w-5 h-5 text-success" />}
                    <div>
                      <p className="text-sm font-mono text-primary">{c.id}</p>
                      <p className="text-xs text-muted-foreground">{c.fileName} · {c.verdict}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-md capitalize ${
                      c.severity === "critical" ? "bg-destructive/20 text-destructive" :
                      c.severity === "suspicious" ? "bg-warning/20 text-warning" :
                      "bg-success/20 text-success"
                    }`}>{c.severity}</span>
                    {c.narrativeRisk !== undefined && (
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        c.narrativeRisk > 70 ? "border-destructive" : c.narrativeRisk > 40 ? "border-warning" : "border-success"
                      }`}>
                        <span className={`text-xs font-mono font-bold ${
                          c.narrativeRisk > 70 ? "text-destructive" : c.narrativeRisk > 40 ? "text-warning" : "text-success"
                        }`}>{c.narrativeRisk}</span>
                      </div>
                    )}
                  </div>
                </div>

                {c.transcript ? (
                  <>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-primary" /> Extracted Transcript
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed italic">{c.transcript}</p>
                    </div>
                    {c.keywords && c.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {c.keywords.map((kw, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive font-mono">{kw}</span>
                        ))}
                      </div>
                    )}
                    {c.scamMatches && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1">
                          <Search className="w-3 h-3 text-warning" /> RAG Pattern Matches
                        </h4>
                        {c.scamMatches.map((m, i) => (
                          <div key={i} className="p-3 bg-secondary/50 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="text-sm text-foreground">"{m.pattern}"</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                <Database className="w-3 h-3 inline mr-1" />
                                {m.source} · <span className="text-warning">{m.category}</span>
                              </p>
                            </div>
                            <span className="text-lg font-mono font-semibold text-destructive">{m.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground py-2">No scam narrative detected for this content</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NarrativeAnalyzer;
