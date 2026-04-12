import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CaseProvider } from "@/contexts/CaseContext";
import Index from "./pages/Index.tsx";
import Analyze from "./pages/Analyze.tsx";
import Results from "./pages/Results.tsx";
import Fingerprints from "./pages/Fingerprints.tsx";
import Forensics from "./pages/Forensics.tsx";
import Propagation from "./pages/Propagation.tsx";
import Honeypot from "./pages/Honeypot.tsx";
import PoliceDashboard from "./pages/PoliceDashboard.tsx";
import ForensicLab from "./pages/ForensicLab.tsx";
import Courtroom from "./pages/Courtroom.tsx";
import NarrativeAnalyzer from "./pages/NarrativeAnalyzer.tsx";
import VideoKYC from "./pages/VideoKYC.tsx";
import RedTeam from "./pages/RedTeam.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CaseProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/results" element={<Results />} />
            <Route path="/fingerprints" element={<Fingerprints />} />
            <Route path="/forensics" element={<Forensics />} />
            <Route path="/propagation" element={<Propagation />} />
            <Route path="/honeypot" element={<Honeypot />} />
            <Route path="/police" element={<PoliceDashboard />} />
            <Route path="/forensic-lab" element={<ForensicLab />} />
            <Route path="/courtroom" element={<Courtroom />} />
            <Route path="/narrative" element={<NarrativeAnalyzer />} />
            <Route path="/video-kyc" element={<VideoKYC />} />
            <Route path="/red-team" element={<RedTeam />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CaseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
