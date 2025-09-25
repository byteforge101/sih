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
    <header className="bg-white/8 backdrop-blur-2xl m-4 rounded-3xl p-4 flex justify-between items-center sticky top-4 z-30 border border-white/20 shadow-2xl shadow-black/30">
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={toggleSidebar}
          className="lg:hidden p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <Menu />
        </motion.button>
        <div className="relative hidden md:block">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-3 pr-4 pl-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 shadow-sm"
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border shadow-lg bg-yellow-500/20 backdrop-blur-sm text-yellow-200 border-yellow-500/30 cursor-pointer"
                >
                  <Award size={16} />
                  <span>{rewardPoints}</span>
                </motion.div>
              )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <Bell />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-white">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-300 capitalize">
                  {String((session.user as any).role).toLowerCase()}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex items-center justify-center text-xl font-bold border-2 border-white/20 shadow-lg cursor-pointer"
              >
                {userInitials}
              </motion.div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()}
              className="inline-flex items-center justify-center gap-2 font-bold py-2.5 px-5 rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-lg border shadow-md bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30 hover:text-red-100"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signIn()}
            className="inline-flex items-center justify-center font-bold py-2.5 px-6 rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-lg border shadow-xl bg-white/15 border-white/25 text-white hover:bg-white/25 shadow-white/10 focus:ring-white/30"
          >
            <LogIn size={18} />
            <span className="font-semibold">Login</span>
          </motion.button>
        )}
      </div>
    </header>
  );
}

