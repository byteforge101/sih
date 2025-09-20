'use client';

import { motion } from 'framer-motion';
import { Users, UserCheck, AlertTriangle, FolderKanban } from 'lucide-react';

type AdminDashboardData = any;

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

export default function AdminDashboard({ data }: { data: AdminDashboardData }) {
    const { stats, recentSignups } = data;
    return (
         <div className="space-y-8">
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-slate-800">Administrator Dashboard</h1>
                <p className="text-slate-500">Institute-wide overview.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="from-blue-400 to-cyan-500" />
                <StatCard title="Total Mentors" value={stats.totalMentors} icon={UserCheck} color="from-green-400 to-emerald-500" />
                <StatCard title="At-Risk Students" value={stats.isAtRiskStudents} icon={AlertTriangle} color="from-red-400 to-rose-500" />
                <StatCard title="Community Projects" value={stats.totalProjects} icon={FolderKanban} color="from-purple-400 to-violet-500" />
            </div>

            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200/50">
                <h2 className="font-bold text-xl mb-4">Recent User Sign-ups</h2>
                 <div className="space-y-2">
                    {recentSignups.map((user: any) => (
                        <div key={user.id} className="p-2 bg-slate-50 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <p className="text-sm font-medium text-slate-600 capitalize">{user.role.toLowerCase()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
