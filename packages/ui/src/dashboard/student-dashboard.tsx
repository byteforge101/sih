'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, BookOpen, BarChart2, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- TYPES AND LOGIC ARE UNCHANGED ---
type StudentDashboardData = {
    student: {
        user: { name: string };
        isAtRisk: boolean;
    };
    stats: {
        attendancePercentage: number;
        cgpa: string;
        overdueFees: string;
        totalCourses: number;
    };
    hasFaceEncoding?: boolean;
};

// --- STYLING CHANGE: StatCard restyled for Aurora UI ---
const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`aurora-bg group rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-${color}-500/20`}
    >
        <div className={`p-3 rounded-full bg-gradient-to-br from-${color}-500 to-${color}-600`}>
            <Icon className="text-white" size={24} />
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </motion.div>
);

// --- FUNCTIONALITY IS UNCHANGED ---
export default function StudentDashboard({ data }: { data: StudentDashboardData }) {
    const { student, stats, hasFaceEncoding } = data;
    const [showEnrollmentPrompt, setShowEnrollmentPrompt] = useState(false);

    useEffect(() => {
        if (!hasFaceEncoding) {
            setShowEnrollmentPrompt(true);
        }
    }, [hasFaceEncoding]);

    return (
        <div className="space-y-8">
            {/* --- STYLING CHANGE: Enrollment Prompt Modal restyled for Aurora UI --- */}
            {showEnrollmentPrompt && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aurora-bg p-8 rounded-2xl shadow-xl text-center max-w-md mx-4"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-white">Enroll Your Face</h2>
                        <p className="text-slate-400 mb-6">
                            Enable smart attendance by enrolling your face. It only takes a moment.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/mainapp/face-enrollment" className="px-5 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 font-semibold shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105">
                                Enroll Now
                            </Link>
                            <button onClick={() => setShowEnrollmentPrompt(false)} className="px-5 py-2 bg-slate-700 text-slate-200 rounded-xl hover:bg-slate-600 font-semibold transition-all transform hover:scale-105">
                                Maybe Later
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* --- STYLING CHANGE: Header text colors updated --- */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-slate-100">Welcome back, <span className="text-cyan-400">{student.user.name.split(' ')[0]}</span>!</h1>
                <p className="text-slate-400 mt-2 text-lg">Here's your academic snapshot.</p>
            </motion.div>

            {/* --- STYLING CHANGE: At-Risk banner restyled for Aurora UI --- */}
            {student.isAtRisk && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-rose-500/50 to-red-600/50 border border-rose-500/50 text-white rounded-2xl shadow-lg shadow-rose-500/20 flex items-center gap-4"
                >
                    <AlertTriangle size={28}/>
                    <div>
                        <h3 className="font-bold">You're At-Risk!</h3>
                        <p className="text-sm text-rose-200">Your profile shows warning signs. Please connect with your mentor soon.</p>
                    </div>
                </motion.div>
            )}

            {/* --- STYLING CHANGE: StatCard colors updated --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Attendance" value={`${stats.attendancePercentage}%`} icon={CheckCircle} color="emerald" />
                <StatCard title="Current CGPA" value={stats.cgpa} icon={BarChart2} color="sky" />
                <StatCard title="Overdue Fees" value={`$${stats.overdueFees}`} icon={DollarSign} color="rose" />
                <StatCard title="Enrolled Courses" value={stats.totalCourses} icon={BookOpen} color="violet" />
            </div>
        </div>
    );
}