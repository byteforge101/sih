"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, Menu, Search, Bell, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "./SidebarContext"; // <-- 1. Import the new hook

export default function AppBar({
  session,
  rewardPoints,
  // The 'onMenuClick' prop is no longer needed
}: {
  session: Session | null;
  rewardPoints?: number | null;
}) {
  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("");
  const { toggle: toggleSidebar } = useSidebar(); // <-- 2. Get the toggle action from context

  return (
    <header className="bg-white/60 backdrop-blur-xl border-b border-slate-200/30 p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-2">
        {/* --- THIS IS THE KEY CHANGE --- */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar} // <-- 3. Connect the button to the context's toggle action
          className="lg:hidden p-2 rounded-full hover:bg-slate-200/50 transition-colors"
        >
          <Menu className="text-slate-700" />
        </motion.button>
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 rounded-full bg-slate-100/80 border border-transparent focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            {(session?.user as any)?.role === "STUDENT" &&
              rewardPoints !== null && (
                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                  <Award size={16} />
                  <span>{rewardPoints}</span>
                </div>
              )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-full hover:bg-slate-200/50 transition-colors"
            >
              <Bell className="text-slate-600" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-slate-800">
                  {session.user.name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {String((session.user as any).role).toLowerCase()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xl font-bold border-2 border-white shadow-lg">
                {userInitials}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()}
              className="px-4 py-2 flex items-center gap-2 bg-white text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md border border-slate-200/80"
            >
              <LogOut size={18} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => signIn()}
            className="px-6 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300"
          >
            <LogIn size={18} />
            <span className="font-semibold">Login</span>
          </motion.button>
        )}
      </div>
    </header>
  );
}
