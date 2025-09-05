'use client';

import { motion } from 'framer-motion';
import { Users, AlertTriangle, MessageSquare, Calendar } from 'lucide-react';

type MentorDashboardData = any;

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


export default function MentorDashboard({ data }: { data: MentorDashboardData }) {
    const { mentor, stats } = data;
    
    return (
        <div className="space-y-8">
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-slate-800">Mentor Dashboard</h1>
                <p className="text-slate-500">Overview of your mentees and activities.</p>
            </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Mentees" value={stats.totalMentees} icon={Users} color="from-blue-400 to-cyan-500" />
                <StatCard title="At-Risk Students" value={stats.atRiskStudents} icon={AlertTriangle} color="from-red-400 to-rose-500" />
                <StatCard title="Upcoming Sessions" value={stats.upcomingSessions} icon={Calendar} color="from-purple-400 to-violet-500" />
            </div>

            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200/50">
                <h2 className="font-bold text-xl mb-4">At-Risk Mentees</h2>
                <div className="space-y-3">
                    {mentor.mentees.map((mentee: any) => (
                        <div key={mentee.id} className="p-3 bg-red-50 rounded-lg flex justify-between items-center">
                            <p className="font-semibold">{mentee.user.name}</p>
                            <button className="text-sm text-red-600 font-semibold">View Profile</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
