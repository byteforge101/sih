"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  BookOpen,
  HeartHandshake,
  Shield,
  GraduationCap,
  LucideIcon,
  X,
  Video,
  HelpCircle,
} from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "./SidebarContext"; // <-- 1. Import the new hook

const studentLinks = [
  { href: "/mainapp/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mainapp/profile", label: "My Profile", icon: User },
  { href: "/mainapp/courses", label: "My Courses", icon: BookOpen },
  { href: "/mainapp/meeting", label: "Meetings", icon: Video },
  { href: "/mainapp/community-qs", label: "Community Qs", icon: HelpCircle },
  {
    href: "/mainapp/projects",
    label: "Community Projects",
    icon: HeartHandshake,
  },
];
const mentorLinks = [
  { href: "/mainapp/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mainapp/mentees", label: "My Mentees", icon: Users },
  { href: "/mainapp/counseling", label: "Counseling", icon: HeartHandshake },
  { href: "/mainapp/meeting", label: "Meetings", icon: Video },
  { href: "/mainapp/community-qs", label: "Community Qs", icon: HelpCircle },
];
const guardianLinks = [
  { href: "/mainapp/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mainapp/wards", label: "My Wards", icon: Shield },
];
const adminLinks = [
  {
    href: "/mainapp/dashboard",
    label: "Admin Dashboard",
    icon: LayoutDashboard,
  },
  { href: "/mainapp/students", label: "Manage Students", icon: Users },
  { href: "/mainapp/mentors", label: "Manage Mentors", icon: GraduationCap },
];

const mobileNavVariants = {
  open: { x: 0 },
  closed: { x: "-100%" },
};

export default function MobileSidebar({
  session,
}: {
  session: Session | null;
}) {
  // --- THIS IS THE KEY CHANGE ---
  // 2. Get the state and the close action from our shared context
  const { isOpen, close: closeSidebar } = useSidebar();
  // The old `useState` is now removed!

  const pathname = usePathname();
  let navLinks: { href: string; label: string; icon: LucideIcon }[] = [];

  switch ((session?.user as any)?.role) {
    case "STUDENT":
      navLinks = studentLinks;
      break;
    case "MENTOR":
      navLinks = mentorLinks;
      break;
    case "GUARDIAN":
      navLinks = guardianLinks;
      break;
    case "ADMIN":
      navLinks = adminLinks;
      break;
    default:
      navLinks = [];
      break;
  }

  return (
    <>
      {/* 3. The floating "Open Menu" button has been completely REMOVED! */}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar} // <-- 4. Use the close action from context for the overlay
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            <motion.aside
              variants={mobileNavVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-100 to-cyan-50 shadow-lg z-50 lg:hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-200/50">
                <div className="flex items-center gap-2">
                  <GraduationCap size={28} className="text-cyan-500" />
                  <span className="text-xl font-bold text-cyan-700">
                    EduVance
                  </span>
                </div>
                <button
                  onClick={closeSidebar}
                  className="p-1 rounded-full hover:bg-white transition-colors"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    // 5. Also close the sidebar when a navigation link is clicked
                    <Link
                      href={link.href}
                      key={link.label}
                      onClick={closeSidebar}
                    >
                      <div
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${
                          isActive
                            ? "bg-cyan-500 text-white"
                            : "text-slate-500 hover:bg-white"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="ml-4 font-semibold">{link.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
