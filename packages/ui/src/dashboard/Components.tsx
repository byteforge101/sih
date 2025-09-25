"use client";
import { Zap, LucideProps } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

// --- Type definitions remain unchanged ---
type Course = {
  id: string;
  title: string;
  description: string;
  progress: number;
};

type Reward = {
  id: string;
  title: string;
  points: number;
};

// --- REVAMPED: Aurora UI StatCard ---
export function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
  const colorVariants: { [key: string]: string } = {
    cyan: "shadow-cyan-500/20",
    amber: "shadow-amber-500/20",
    emerald: "shadow-emerald-500/20",
    rose: "shadow-rose-500/20",
    sky: "shadow-sky-500/20",
    violet: "shadow-violet-500/20",
    teal: "shadow-teal-500/20",
    fuchsia: "shadow-fuchsia-500/20",
  };

  const iconColorVariants: { [key: string]: string } = {
    cyan: "text-cyan-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    sky: "text-sky-400",
    violet: "text-violet-400",
    teal: "text-teal-400",
    fuchsia: "text-fuchsia-400",
  };

  return (
    <div className={`aurora-bg group rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${colorVariants[color]}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-slate-300 font-semibold">{title}</h3>
        <div className={iconColorVariants[color]}>{icon}</div>
      </div>
      <p className="text-4xl font-bold text-white mt-4">{value}</p>
    </div>
  );
}

// --- REVAMPED: Aurora UI CourseProgress ---
export function CourseProgress({ course }: { course: Course }) {
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 transition-all hover:bg-slate-800/80">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-slate-200">{course.title}</h4>
        <span className={`font-bold text-sm ${course.progress === 100 ? 'text-emerald-400' : 'text-cyan-400'}`}>{course.progress}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div
          className={`bg-gradient-to-r ${course.progress === 100 ? 'from-emerald-500 to-green-500' : 'from-cyan-500 to-blue-500'} h-2.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${course.progress}%` }}
        />
      </div>
    </div>
  );
}

// --- REVAMPED: Aurora UI RewardItem ---
export function RewardItem({ reward }: { reward: Reward }) {
  return (
    <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700 transition-colors hover:bg-slate-800/80">
      <div className="p-2 bg-amber-400/10 rounded-full">
        <Zap size={20} className="text-amber-400" />
      </div>
      <div>
        <p className="font-semibold text-slate-200">{reward.title}</p>
        <p className="text-sm text-amber-400">{reward.points} Points</p>
      </div>
    </div>
  );
}