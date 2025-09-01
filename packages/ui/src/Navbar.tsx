import React from "react";
import PrimaryButton from "./PrimaryButton";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      {/* Replace with your actual logo */}
      <h1 className="font-bold text-2xl text-slate-800">Eduvance</h1>
      
      <div className="hidden md:flex items-center space-x-8">
        <a
          href="#"
          className="font-medium text-slate-600 hover:text-violet-600 transition"
        >
          About
        </a>
        <a
          href="#"
          className="font-medium text-slate-600 hover:text-violet-600 transition"
        >
          Contact
        </a>
        <a
          href="#"
          className="font-medium text-slate-600 hover:text-violet-600 transition"
        >
          Login
        </a>
      </div>

      <PrimaryButton
        text="Sign Up"
        onClick={() => {}}
        className="hidden md:block py-2"
      />
    </nav>
  );
};

export default Navbar;
