import React from "react";
import RiskBadge from "./RiskBadge";

interface ProfileCardProps {
  name: string;
  rollNo: string | number;
  dept: string;
  image?: string;
  risk: "High" | "Medium" | "Low" | string; // matches RiskBadge flexibility
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, rollNo, dept, image, risk }) => {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm flex items-center space-x-6">
      <img
        src={image || "https://via.placeholder.com/150"} // Placeholder image
        alt={name}
        className="w-20 h-20 rounded-full border-4 border-slate-100 object-cover"
      />
      <div>
        <h2 className="font-bold text-xl text-slate-800">{name}</h2>
        <p className="text-sm text-slate-500 font-medium">
          {rollNo} | {dept}
        </p>
        <div className="mt-2">
          <RiskBadge level={risk} />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
