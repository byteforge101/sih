"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the data that our context will provide
interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

// Create the context with a default value
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Create a custom hook for easy access to the context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Create the Provider component
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const value = { isOpen, toggle, close };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
