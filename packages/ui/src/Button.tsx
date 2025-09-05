"use client";

import * as React from "react";

// Define the properties (props) that our Button component can accept.
// We extend the standard HTML button attributes for maximum flexibility.
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ children, className, ...rest }: ButtonProps) => {
  // Combine the base styles with any additional styles passed in via the className prop.
  // This makes the button customizable.
  const combinedClassName = `
    bg-blue-500 text-white font-bold py-2 px-4 rounded 
    transition-colors duration-200
    hover:bg-blue-700 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className || ""} 
  `;

  return (
    // The 'rest' props allow us to pass any standard button attribute
    // like 'type', 'onClick', 'disabled', etc.
    <button className={combinedClassName.trim()} {...rest}>
      {children}
    </button>
  );
};
