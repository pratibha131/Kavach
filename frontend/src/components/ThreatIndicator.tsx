interface ThreatIndicatorProps {
  level: "low" | "medium" | "high" | "critical";
  score: number;
  label?: string;
}

const ThreatIndicator = ({ level, score, label }: ThreatIndicatorProps) => {
  const colors = {
    low: "bg-success",
    medium: "bg-warning",
    high: "bg-destructive",
    critical: "bg-destructive",
  };

  const textColors = {
    low: "text-success",
    medium: "text-warning",
    high: "text-destructive",
    critical: "text-destructive",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${colors[level]} transition-all duration-700`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      <span className={`text-sm font-mono font-semibold ${textColors[level]}`}>
        {score}%
      </span>
    </div>
  );
};

export default ThreatIndicator;
