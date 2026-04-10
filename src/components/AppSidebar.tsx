import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield, LayoutDashboard, Upload, Fingerprint, FileText,
  Globe, Target, ChevronLeft, ChevronRight, Siren, Microscope,
  Scale, Brain, Video, Swords
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
      { icon: Siren, label: "Police Command", path: "/police" },
    ],
  },
  {
    label: "Detection",
    items: [
      { icon: Upload, label: "Analyze Media", path: "/analyze" },
      { icon: Shield, label: "Detection Results", path: "/results" },
      { icon: Brain, label: "Narrative Analyzer", path: "/narrative" },
      { icon: Video, label: "Video KYC", path: "/video-kyc" },
    ],
  },
  {
    label: "Forensics",
    items: [
      { icon: Microscope, label: "Forensic Lab", path: "/forensic-lab" },
      { icon: Fingerprint, label: "Model Fingerprints", path: "/fingerprints" },
      { icon: FileText, label: "Forensic Reports", path: "/forensics" },
      { icon: Scale, label: "Courtroom (BSA)", path: "/courtroom" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { icon: Globe, label: "Propagation", path: "/propagation" },
      { icon: Target, label: "Honeypot System", path: "/honeypot" },
      { icon: Swords, label: "Red-Team Agent", path: "/red-team" },
    ],
  },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center pulse-glow">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-sm font-semibold text-foreground">Kavach</h1>
            <p className="text-[10px] text-muted-foreground font-mono">DEEPGUARD AI</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-2 px-2 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-3">
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3 py-1.5 font-semibold">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary glow-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                    {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4 mx-auto" /> : <ChevronLeft className="w-4 h-4 mx-auto" />}
      </button>
    </aside>
  );
};

export default AppSidebar;
