import React from "react";

interface PrimaryButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-violet-600 text-white rounded-lg shadow hover:bg-violet-700 transition ${className}`}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
