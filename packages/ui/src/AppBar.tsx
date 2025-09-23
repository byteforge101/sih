"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, Menu, Search, Bell, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "./SidebarContext";

export default function AppBar({
  session,
  rewardPoints,
}: {
  session: Session | null;
  rewardPoints?: number | null;
}) {
  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("");
  const { toggle: toggleSidebar } = useSidebar();

  return (
    // --- REVAMPED: Glassmorphism header with aurora effect ---
    <header className="aurora-bg m-4 rounded-2xl p-4 flex justify-between items-center sticky top-4 z-30">
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--surface-rgb), 1)' }}
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-full transition-colors"
        >
          <Menu className="text-slate-300" />
        </motion.button>
        {/* --- REVAMPED: Futuristic search input --- */}
        <div className="relative hidden md:block">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            size={20}
          />
          <input
            type="text"
            placeholder="Search modules, mentees..."
            className="pl-11 pr-4 py-2.5 w-72 rounded-full bg-slate-800/50 border border-slate-700 focus:bg-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30 outline-none transition-all duration-300 placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
            className="flex items-center gap-4"
          >
            {(session?.user as any)?.role === "STUDENT" &&
              rewardPoints !== null && (
                // --- REVAMPED: Glowing reward points badge ---
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(250, 204, 21, 0.5)' }}
                  className="flex items-center gap-2 bg-amber-400/10 text-amber-300 px-4 py-2 rounded-full text-sm font-semibold border border-amber-400/20 cursor-pointer"
                >
                  <Award size={16} />
                  <span>{rewardPoints}</span>
                </motion.div>
              )}
            <motion.button
              whileHover={{ scale: 1.1, color: '#fff', textShadow: '0 0 8px #fff' }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-800/50 transition-colors"
            >
              <Bell />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-slate-200">
                  {session.user.name}
                </p>
                <p className="text-xs text-slate-400 capitalize">
                  {String((session.user as any).role).toLowerCase()}
                </p>
              </div>
              {/* --- REVAMPED: Enhanced user avatar with a glow effect --- */}
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--glow-primary)' }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-600 text-white flex items-center justify-center text-xl font-bold border-2 border-slate-800/80 shadow-lg cursor-pointer"
              >
                {userInitials}
              </motion.div>
            </div>
            {/* --- REVAMPED: More dynamic logout button --- */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundPosition: '100% 0' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()}
              className="px-5 py-2.5 flex items-center gap-2 bg-gradient-to-r from-red-500/40 via-red-500/80 to-red-500/40 text-white rounded-lg transition-all duration-300 bg-size-200 bg-pos-0"
              style={{ backgroundSize: '200% 100%' }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px var(--glow-primary)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signIn()}
            className="px-6 py-2.5 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300"
          >
            <LogIn size={18} />
            <span className="font-semibold">Login</span>
          </motion.button>
        )}
      </div>
    </header>
  );
}