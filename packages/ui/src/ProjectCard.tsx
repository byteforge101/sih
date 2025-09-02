import React from "react";

// 🔹 Define props for RewardBadge
interface RewardBadgeProps {
  reward: string;
}

const RewardBadge: React.FC<RewardBadgeProps> = ({ reward }) => (
  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
    🎖 {reward}
  </span>
);

// 🔹 Define props for ProjectCard
interface ProjectCardProps {
  title: string;
  category: string;
  reward: string;
  onParticipate: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  category,
  reward,
  onParticipate,
}) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 space-y-2 hover:shadow-lg transition">
      <h2 className="font-semibold text-lg text-slate-700">{title}</h2>
      <p className="text-sm text-slate-500">Category: {category}</p>
      <RewardBadge reward={reward} />
      <button
        onClick={onParticipate}
        className="mt-3 w-full bg-violet-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-violet-700"
      >
        Participate
      </button>
    </div>
  );
};

export default ProjectCard;
