import React from "react";

type StatCardColor = "red" | "yellow" | "green";

interface StatCardProps {
  title: string;
  value: string | number;
  color?: StatCardColor;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  const colorVariants: Record<StatCardColor | "default", string> = {
    red: "border-red-500",
    yellow: "border-yellow-500",
    green: "border-green-500",
    default: "border-violet-500",
  };

  return (
    <div
      className={`bg-white p-5 rounded-xl shadow-sm border-t-4 ${
        color ? colorVariants[color] : colorVariants.default
      }`}
    >
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
};

export default StatCard;
