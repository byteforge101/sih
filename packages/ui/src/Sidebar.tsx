'use client';

import { Session } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Store, ShoppingCart, User, Users, BookOpen, HeartHandshake, Shield, GraduationCap, ChevronLeft, ChevronRight, LucideIcon, Video, Camera, HelpCircle, ClipboardEdit
} from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- Data remains unchanged ---
const studentLinks = [
    { href: '/mainapp/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/mainapp/student-profile', label: 'My Profile', icon: User },
    { href: '/mainapp/student-details', label: 'My Details', icon: ClipboardEdit },
    { href: '/mainapp/courses', label: 'My Courses', icon: BookOpen },
    { href: '/mainapp/meeting', label: 'Meetings', icon: Video },
    { href: '/mainapp/community-qs', label: 'Mentor Qs', icon: HelpCircle },
    { href: '/mainapp/projects', label: 'Community Projects', icon: HeartHandshake },
    { href: '/mainapp/face-enrollment', label: 'Enroll Face', icon: Camera },
    { href: '/mainapp/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/mainapp/store', label: 'Store', icon: Store },
];
const mentorLinks = [
    { href: '/mainapp/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/mainapp/my-mentees', label: 'My Mentees', icon: Users },
    { href: '/mainapp/counseling', label: 'Counseling', icon: HeartHandshake },
    { href: '/mainapp/meeting', label: 'Meetings', icon: Video },
    { href: '/mainapp/community-qs', label: 'Community Qs', icon: HelpCircle },
    {href: '/take-attendance', label: 'take-attendance', icon: HelpCircle },
    { href: '/mainapp/store', label: 'Store', icon: Store }
];
const guardianLinks = [
    { href: '/mainapp/dashboard', label: 'Dashboard', icon: LayoutDashboard }, { href: '/mainapp/wards', label: 'My Wards', icon: Shield },
];
const adminLinks = [
    { href: '/mainapp/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard }, { href: '/mainapp/students', label: 'Manage Students', icon: Users }, { href: '/mainapp/mentors', label: 'Manage Mentors', icon: GraduationCap },
];

// --- REVAMPED: Smoother animation variants ---
const sidebarVariants: Variants = {
    collapsed: { width: '88px', transition: { duration: 0.5, ease: [0.3, 0, 0, 1] } },
    expanded: { width: '280px', transition: { duration: 0.5, ease: [0.3, 0, 0, 1] } }
};
const navItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1, x: 0, transition: { delay: i * 0.04, type: 'spring', stiffness: 120, damping: 18 }
    })
};
const textVariants: Variants = {
    hidden: { opacity: 0, filter: 'blur(5px)', x: -10 },
    visible: { opacity: 1, filter: 'blur(0px)', x: 0, transition: { duration: 0.2, delay: 0.2 } },
    exit: { opacity: 0, filter: 'blur(5px)', x: -10, transition: { duration: 0.15 } }
}
const logoTextVariants: Variants = {
    hidden: { opacity: 0, filter: 'blur(5px)', x: -20 },
    visible: { opacity: 1, filter: 'blur(0px)', x: 0, transition: { delay: 0.3, duration: 0.4 } },
    exit: { opacity: 0, filter: 'blur(5px)', x: -20, transition: { duration: 0.2 } }
}

export default function Sidebar({ session }: { session: Session | null }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  let navLinks: { href: string; label: string; icon: LucideIcon; }[] = [];

  switch ((session?.user as any)?.role) {
    case 'STUDENT': navLinks = studentLinks; break;
    case 'MENTOR': navLinks = mentorLinks; break;
    case 'GUARDIAN': navLinks = guardianLinks; break;
    case 'ADMIN': navLinks = adminLinks; break;
    default: navLinks = []; break;
  }

  return (
    // --- REVAMPED: Glassmorphism sidebar with consistent aurora styling ---
    <motion.aside
      variants={sidebarVariants}
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      className="aurora-bg m-4 rounded-2xl flex flex-col h-[calc(100vh-2rem)]"
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <AnimatePresence>
            {!isCollapsed && (
            <motion.div variants={logoTextVariants} initial="hidden" animate="visible" exit="exit" className="flex items-center gap-3 overflow-hidden">
                {/* --- REVAMPED: Glowing logo --- */}
                <motion.div
                    animate={{ rotate: [0, 10, -5, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
                    className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20"
                >
                    <GraduationCap size={28} className="text-white"/>
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-200 to-cyan-300 bg-clip-text text-transparent whitespace-nowrap">learnova</span>
            </motion.div>
            )}
          </AnimatePresence>
          {/* --- REVAMPED: Control button with better feedback --- */}
          <motion.button whileHover={{scale: 1.1, backgroundColor: 'rgba(var(--surface-rgb), 1)'}} whileTap={{scale: 0.9}} onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-full hover:bg-slate-800/80 transition-colors">
            {isCollapsed ? <ChevronRight size={18} className="text-slate-400"/> : <ChevronLeft size={18} className="text-slate-400"/>}
          </motion.button>
      </div>

      <motion.nav className="flex-1 px-4 py-4 space-y-2">
        {navLinks.map((link, i) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <motion.div key={link.href} custom={i} variants={navItemVariants} initial="hidden" animate="visible">
                <Link href={link.href} title={link.label} className="relative block">
                    {/* --- REVAMPED: Glowing active link indicator --- */}
                    {isActive && (
                      <motion.div
                        layoutId="active-link-glow"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-xl shadow-lg shadow-cyan-500/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.5 } }}
                      />
                    )}
                    <motion.div
                        whileHover={!isActive ? { scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' } : {}}
                        className="relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 group"
                    >
                        <Icon size={22} className={`transition-all duration-300 z-10 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-300'
                        }`} />
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span variants={textVariants} initial="hidden" animate="visible" exit="exit" className={`ml-4 font-semibold whitespace-nowrap overflow-hidden z-10 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                {link.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                    </motion.div>
                </Link>
            </motion.div>
          )
        })}
      </motion.nav>
    </motion.aside>
  );
}