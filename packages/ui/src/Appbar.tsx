'use client';

import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut, Menu, Search, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppBar({ 
  session,
  onMenuClick 
}: { 
  session: Session | null;
  onMenuClick?: () => void; 
}) {
  const userInitials = session?.user?.name?.split(' ').map((n) => n[0]).join('');

  return (
    <header className="bg-white/60 backdrop-blur-xl border-b border-slate-200/30 p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onMenuClick} className="lg:hidden p-2 rounded-full hover:bg-slate-200/50 transition-colors">
            <Menu className="text-slate-700"/>
        </motion.button>
        <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-64 rounded-full bg-slate-100/80 border border-transparent focus:bg-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50 outline-none transition-all" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-full hover:bg-slate-200/50 transition-colors">
                <Bell className="text-slate-600" />
            </motion.button>
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="font-semibold text-slate-800">{session.user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{String((session.user as any).role).toLowerCase()}</p>
               </div>
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 text-white flex items-center justify-center text-xl font-bold border-2 border-white shadow-lg">
                {userInitials}
               </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => signOut()} className="px-4 py-2 flex items-center gap-2 bg-white text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md border border-slate-200/80">
              <LogOut size={18}/>
            </motion.button>
          </motion.div>
        ) : (
          <motion.button initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onClick={() => signIn()} className="px-6 py-2 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300">
            <LogIn size={18} />
            <span className="font-semibold">Login</span>
          </motion.button>
        )}
      </div>
    </header>
  );
}

