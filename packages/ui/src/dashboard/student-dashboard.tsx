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

// --- STYLING CHANGE: StatCard restyled for Glass UI ---
const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-6 flex items-center gap-4"
    >
        <div className={`p-3 rounded-full bg-white/10 border border-white/20`}>
            <Icon className={`text-${color}-300`} size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-300">{title}</p>
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
        <div className="space-y-10 p-4 md:p-8 text-white">
            {/* --- STYLING CHANGE: Enrollment Prompt Modal restyled for Glass UI --- */}
            {showEnrollmentPrompt && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex justify-center items-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8 text-center max-w-md mx-auto"
                    >
                        <h2 className="text-3xl font-black text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">Enroll Your Face</h2>
                        <p className="text-gray-300 text-lg mb-8">
                            Enable smart attendance by enrolling your face. It only takes a moment.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/mainapp/face-enrollment" className="inline-flex items-center justify-center font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-lg border shadow-xl bg-white/15 border-white/25 text-white hover:bg-white/25 shadow-white/10 hover:scale-105 focus:ring-white/30">
                                Enroll Now
                            </Link>
                            <button onClick={() => setShowEnrollmentPrompt(false)} className="inline-flex items-center justify-center font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-lg border shadow-xl bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:text-white shadow-lg hover:scale-105">
                                Maybe Later
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* --- STYLING CHANGE: Header text restyled --- */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-black text-white bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">Welcome back, <span className="text-sky-300">{student.user.name.split(' ')[0]}</span>!</h1>
                <p className="text-gray-300 text-lg font-medium mt-2">Here's your academic snapshot.</p>
            </motion.div>

            {/* --- STYLING CHANGE: At-Risk banner restyled for Glass UI --- */}
            {student.isAtRisk && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-white rounded-2xl shadow-lg flex items-center gap-4"
                >
                    <AlertTriangle size={28} className="text-red-300"/>
                    <div>
                        <h3 className="font-bold text-lg">You're At-Risk!</h3>
                        <p className="text-sm text-red-200">Your profile shows warning signs. Please connect with your mentor soon.</p>
                    </div>
                </motion.div>
            )}

            {/* --- STYLING CHANGE: StatCard colors updated --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Attendance" value={`${stats.attendancePercentage}%`} icon={CheckCircle} color="emerald" />
                <StatCard title="Current CGPA" value={stats.cgpa} icon={BarChart2} color="sky" />
                <StatCard title="Overdue Fees" value={`$${stats.overdueFees}`} icon={DollarSign} color="red" />
                <StatCard title="Enrolled Courses" value={stats.totalCourses} icon={BookOpen} color="violet" />
            </div>
        </div>
    );
}

