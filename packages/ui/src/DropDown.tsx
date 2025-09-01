import React from "react";

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-slate-600">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="border border-slate-300 rounded-lg px-4 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 transition appearance-none"
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
