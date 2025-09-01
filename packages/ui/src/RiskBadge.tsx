import React from "react";

type RiskLevel = "High" | "Medium" | "Low";

interface RiskBadgeProps {
  level: RiskLevel | string; // allowing extra strings as fallback
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const styles: Record<RiskLevel, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
        styles[level as RiskLevel] || "bg-gray-100 text-gray-700"
      }`}
    >
      {level}
    </span>
  );
};

export default RiskBadge;

