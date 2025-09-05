'use client';

import { motion } from 'framer-motion';
import { User, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

type GuardianDashboardData = any;

export default function GuardianDashboard({ data }: { data: GuardianDashboardData }) {
    const { guardian } = data;

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-slate-800">Guardian Portal</h1>
                <p className="text-slate-500">Academic overview of your wards.</p>
            </motion.div>

            <div className="space-y-6">
                {guardian.wards.map((ward: any) => (
                    <motion.div
                        key={ward.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200/50"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{ward.user.name}</h2>
                                <p className="text-slate-500">Roll No: {ward.rollNumber}</p>
                            </div>
                            {ward.isAtRisk ? (
                                <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold flex items-center gap-2">
                                    <AlertCircle size={16} /> At-Risk
                                </div>
                            ) : (
                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                                    <ShieldCheck size={16} /> On Track
                                </div>
                            )}
                        </div>
                        {/* Add more details here */}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
