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
  crimeCategory: string;
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



export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<AnalyzedCase[]>([]);

  // Fetch from Python backend
  const fetchCases = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/cases`);
      if (res.ok) {
        const data = await res.json();
        setCases(data);
      }
    } catch (e) {
      console.error("Failed to fetch cases from backend", e);
    }
  }, []);

  React.useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const addCase = useCallback((c: AnalyzedCase) => {
    setCases(prev => [c, ...prev]);
  }, []);

  const updateCaseAction = useCallback(async (id: string, action: CaseAction) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/cases/${id}/action`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      setCases(prev => prev.map(c => c.id === id ? { ...c, action } : c));
    } catch (e) {
      console.error("Failed to update case action", e);
    }
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
