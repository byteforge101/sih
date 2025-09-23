export function RiskBadge({ riskLevel }: { riskLevel: "low" | "medium" | "high" }) {
  // --- STYLING CHANGE: Updated for dark theme and glowing effect ---
  const riskStyles = {
    low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    high: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${riskStyles[riskLevel]}`}>
      {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
    </span>
  );
}