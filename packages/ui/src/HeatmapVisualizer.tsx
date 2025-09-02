import React from "react";

interface Hotspot {
  time: string;
  confusion: number;
}

interface HeatmapVisualizerProps {
  hotspots: Hotspot[];
}

const HeatmapVisualizer: React.FC<HeatmapVisualizerProps> = ({ hotspots }) => (
  <div className="w-full bg-gray-200 rounded-lg p-4">
    <h2 className="font-semibold text-slate-700 mb-3">Confusion Heatmap Timeline</h2>
    <div className="flex items-center space-x-2">
      {hotspots.map((h, idx) => (
        <div
          key={idx}
          className={`flex-1 h-10 rounded ${
            h.confusion > 60
              ? "bg-red-500"
              : h.confusion > 30
              ? "bg-yellow-400"
              : "bg-green-400"
          }`}
          title={`${h.time} - ${h.confusion}% confused`}
        ></div>
      ))}
    </div>
    <div className="flex justify-between text-xs text-slate-500 mt-2">
      {hotspots.map((h, idx) => (
        <span key={idx}>{h.time}</span>
      ))}
    </div>
  </div>
);

export default HeatmapVisualizer;
