// apps/sih/components/StudentDashboard.tsx

'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, BookOpen, BarChart2, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// (The component's types and the StatCard component remain the same)
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

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200/50 flex items-center gap-4`}
    >
        <div className={`p-3 rounded-full bg-gradient-to-br ${color}`}>
            <Icon className="text-white" size={24} />
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </motion.div>
);


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
            {/* Enrollment Prompt Modal with updated styling */}
            {showEnrollmentPrompt && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/80 backdrop-blur-lg border border-slate-200/50 p-8 rounded-2xl shadow-xl text-center max-w-md mx-4"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-slate-800">Enroll Your Face</h2>
                        <p className="text-slate-600 mb-6">
                            Enable smart attendance by enrolling your face. It only takes a moment.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/mainapp/face-enrollment" className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-md transition-transform transform hover:scale-105">
                                Enroll Now
                            </Link>
                            <button onClick={() => setShowEnrollmentPrompt(false)} className="px-5 py-2 bg-gray-200 text-slate-700 rounded-xl hover:bg-gray-300 font-semibold transition-transform transform hover:scale-105">
                                Maybe Later
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Existing Dashboard Content remains unchanged... */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-slate-800">Welcome back, {student.user.name.split(' ')[0]}!</h1>
                <p className="text-slate-500">Here's your academic snapshot.</p>
            </motion.div>

            {student.isAtRisk && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl shadow-lg flex items-center gap-4"
                >
                    <AlertTriangle size={28}/>
                    <div>
                        <h3 className="font-bold">You're At-Risk!</h3>
                        <p className="text-sm">Your profile shows warning signs. Please connect with your mentor soon.</p>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Attendance" value={`${stats.attendancePercentage}%`} icon={CheckCircle} color="from-green-400 to-emerald-500" />
                <StatCard title="Current CGPA" value={stats.cgpa} icon={BarChart2} color="from-blue-400 to-cyan-500" />
                <StatCard title="Overdue Fees" value={`₹${stats.overdueFees}`} icon={DollarSign} color="from-red-400 to-rose-500" />
                <StatCard title="Enrolled Courses" value={stats.totalCourses} icon={BookOpen} color="from-purple-400 to-violet-500" />
            </div>
        </div>
    );
}