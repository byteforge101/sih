import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-slate-300 rounded-lg px-4 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
      />
    </div>
  );
};

export default InputField;
