'use client';

import { Session } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, User, Users, BookOpen, HeartHandshake, Shield, GraduationCap, ChevronLeft, ChevronRight, LucideIcon, Video, Camera, HelpCircle
} from 'lucide-react'; 
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const studentLinks = [
  { href: '/mainapp/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mainapp/profile', label: 'My Profile', icon: User },
  { href: '/mainapp/courses', label: 'My Courses', icon: BookOpen },
  { href: '/mainapp/meeting', label: 'Meetings', icon: Video },
  { href: '/mainapp/community-qs', label: 'Community Qs', icon: HelpCircle },
  { href: '/mainapp/projects', label: 'Community Projects', icon: HeartHandshake },
  { href: '/mainapp/face-enrollment', label: 'Enroll Face', icon: Camera }, 
];
const mentorLinks = [
  { href: '/mainapp/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mainapp/mentees', label: 'My Mentees', icon: Users },
  { href: '/mainapp/counseling', label: 'Counseling', icon: HeartHandshake },
  { href: '/mainapp/meeting', label: 'Meetings', icon: Video },
  { href: '/mainapp/community-qs', label: 'Community Qs', icon: HelpCircle },
];
const guardianLinks = [
  { href: '/mainapp/dashboard', label: 'Dashboard', icon: LayoutDashboard }, { href: '/mainapp/wards', label: 'My Wards', icon: Shield },
];
const adminLinks = [
  { href: '/mainapp/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard }, { href: '/mainapp/students', label: 'Manage Students', icon: Users }, { href: '/mainapp/mentors', label: 'Manage Mentors', icon: GraduationCap },
];

const sidebarVariants: Variants = {
    collapsed: { width: '80px', transition: { duration: 0.4, ease: [0.3, 0, 0.2, 1] } },
    expanded: { width: '280px', transition: { duration: 0.4, ease: [0.3, 0, 0.2, 1] } }
};
const navItemVariants: Variants = {
    hidden: { opacity: 0, x: -25 },
    visible: (i: number) => ({
        opacity: 1, x: 0, transition: { delay: i * 0.05, type: 'spring', stiffness: 100, damping: 15 }
    })
};
const textVariants: Variants = {
    hidden: { opacity: 0, x: -10, width: 0 },
    visible: { opacity: 1, x: 0, width: 'auto', transition: { duration: 0.2, delay: 0.15 } },
    exit: { opacity: 0, x: -10, width: 0, transition: { duration: 0.15 } }
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
    <motion.aside
      variants={sidebarVariants}
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      className="relative flex flex-col h-full bg-white/70 backdrop-blur-xl border-r border-slate-200/50 shadow-2xl shadow-cyan-500/5"
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-200/50">
          <AnimatePresence>
            {!isCollapsed && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {delay: 0.2}}} exit={{opacity: 0}} className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-full flex items-center justify-center shadow-inner-lg">
                    <GraduationCap size={24} className="text-white"/>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent whitespace-nowrap">EduVance</span>
            </motion.div>
            )}
          </AnimatePresence>
          <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-full bg-white/50 hover:bg-cyan-100/50 transition-colors shadow-sm border border-slate-200/50">
            {isCollapsed ? <ChevronRight size={18} className="text-slate-600"/> : <ChevronLeft size={18} className="text-slate-600"/>}
          </motion.button>
      </div>

      <motion.nav className="flex-1 px-4 py-4 space-y-2">
        {navLinks.map((link, i) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <motion.div key={link.label} custom={i} variants={navItemVariants} initial="hidden" animate="visible">
                <Link href={link.href} title={link.label} className="relative block">
                  <motion.div whileHover={{ scale: 1.02 }} className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                      isActive ? 'bg-gradient-to-r from-cyan-400 to-emerald-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-500 hover:bg-white hover:shadow-md'
                  }`}>
                    <Icon size={isCollapsed ? 24 : 20} className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-500'}`} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span variants={textVariants} initial="hidden" animate="visible" exit="exit" className="ml-4 font-semibold whitespace-nowrap overflow-hidden">
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