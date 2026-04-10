import React, { createContext, useContext, useState, useCallback } from "react";

export type CaseSeverity = "critical" | "suspicious" | "authentic";
export type CaseAction = "remove" | "monitor" | "safe" | "pending";

export interface AnalyzedCase {
  id: string;
  fileName: string;
  fileType: "video" | "audio" | "image";
  fileSize: string;
  timestamp: string;
  verdict: string;
  confidence: number;
  faceSwap: number;
  voiceClone: number;
  synthetic: number;
  fingerprint: string;
  modelFamily: string;
  severity: CaseSeverity;
  action: CaseAction;
  // Hashes
  fileHash: string;
  analysisHash: string;
  // Narrative
  transcript?: string;
  scamMatches?: { pattern: string; confidence: number; source: string; category: string }[];
  narrativeRisk?: number;
  keywords?: string[];
  // Propagation
  platforms: number;
  totalShares: number;
  spreadStatus: "Active" | "Contained" | "Monitoring";
  // Honeypot
  honeypotTriggered: boolean;
  honeypotTriggers: number;
  // KYC
  kycFlagged: boolean;
  // Red Team
  redTeamDetected: boolean;
  redTeamConfidence: number;
  // Forensic
  tamperTimestamps: string[];
  // Chain of custody
  chainOfCustody: { timestamp: string; action: string; officer: string; hash: string }[];
}

interface CaseContextType {
  cases: AnalyzedCase[];
  addCase: (c: AnalyzedCase) => void;
  updateCaseAction: (id: string, action: CaseAction) => void;
  getCasesByVerdict: (severity: CaseSeverity) => AnalyzedCase[];
}

const CaseContext = createContext<CaseContextType | null>(null);

export const useCases = () => {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCases must be used within CaseProvider");
  return ctx;
};

// Helper to compute severity
export const computeSeverity = (confidence: number, verdict: string): CaseSeverity => {
  if (verdict.toLowerCase().includes("authentic") || confidence < 30) return "authentic";
  if (confidence >= 70) return "critical";
  return "suspicious";
};

// Helper to compute recommended action
export const computeAction = (severity: CaseSeverity): CaseAction => {
  if (severity === "critical") return "remove";
  if (severity === "suspicious") return "monitor";
  return "safe";
};

// Generate pseudo hash
const genHash = () => {
  const chars = "0123456789abcdef";
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join("");
};

export const buildCaseFromAnalysis = (
  file: File,
  result: { verdict: string; confidence: number; faceSwap: number; voiceClone: number; synthetic: number; fingerprint: string }
): AnalyzedCase => {
  const severity = computeSeverity(result.confidence, result.verdict);
  const action = computeAction(severity);
  const now = new Date();
  const fileType = file.type.startsWith("video") ? "video" : file.type.startsWith("audio") ? "audio" : "image";

  return {
    id: `DF-${now.getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
    fileName: file.name,
    fileType: fileType as "video" | "audio" | "image",
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    timestamp: now.toISOString().replace("T", " ").substring(0, 19),
    verdict: result.verdict,
    confidence: result.confidence,
    faceSwap: result.faceSwap,
    voiceClone: result.voiceClone,
    synthetic: result.synthetic,
    fingerprint: result.fingerprint,
    modelFamily: "GAN-StyleTransfer v3",
    severity,
    action,
    fileHash: `sha256:${genHash()}`,
    analysisHash: `sha256:${genHash()}`,
    transcript: severity === "critical" 
      ? `"Congratulations! You have been selected for a special investment scheme. Send money immediately to secure your spot. Guaranteed 300% returns within 30 days..."` 
      : undefined,
    scamMatches: severity === "critical" ? [
      { pattern: "Guaranteed returns claim", confidence: 96.2, source: "SEBI Alert DB", category: "Financial Fraud" },
      { pattern: "Urgency pressure tactic", confidence: 91.3, source: "RBI Scam Patterns", category: "Social Engineering" },
    ] : undefined,
    narrativeRisk: severity === "critical" ? 94 : severity === "suspicious" ? 52 : 8,
    keywords: severity === "critical" ? ["guaranteed returns", "send money", "limited time", "investment"] : [],
    platforms: Math.floor(Math.random() * 10) + 1,
    totalShares: Math.floor(Math.random() * 5000),
    spreadStatus: severity === "critical" ? "Active" : severity === "suspicious" ? "Monitoring" : "Contained",
    honeypotTriggered: Math.random() > 0.6,
    honeypotTriggers: Math.floor(Math.random() * 8),
    kycFlagged: severity === "critical",
    redTeamDetected: Math.random() > 0.3,
    redTeamConfidence: 60 + Math.random() * 35,
    tamperTimestamps: severity !== "authentic" 
      ? [`00:${String(Math.floor(Math.random() * 30)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} - 00:${String(Math.floor(Math.random() * 30) + 30).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`]
      : [],
    chainOfCustody: [
      { timestamp: now.toISOString().replace("T", " ").substring(0, 19), action: "Evidence uploaded", officer: "User Upload", hash: genHash().substring(0, 12) },
      { timestamp: new Date(now.getTime() + 1000).toISOString().replace("T", " ").substring(0, 19), action: "Analysis initiated", officer: "Kavach AI Engine", hash: genHash().substring(0, 12) },
      { timestamp: new Date(now.getTime() + 3000).toISOString().replace("T", " ").substring(0, 19), action: "Analysis completed", officer: "Kavach AI Engine", hash: genHash().substring(0, 12) },
      { timestamp: new Date(now.getTime() + 4000).toISOString().replace("T", " ").substring(0, 19), action: "Report sealed", officer: "System", hash: genHash().substring(0, 12) },
    ],
  };
};

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<AnalyzedCase[]>([]);

  const addCase = useCallback((c: AnalyzedCase) => {
    setCases(prev => [c, ...prev]);
  }, []);

  const updateCaseAction = useCallback((id: string, action: CaseAction) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, action } : c));
  }, []);

  const getCasesByVerdict = useCallback((severity: CaseSeverity) => {
    return cases.filter(c => c.severity === severity);
  }, [cases]);

  return (
    <CaseContext.Provider value={{ cases, addCase, updateCaseAction, getCasesByVerdict }}>
      {children}
    </CaseContext.Provider>
  );
};
