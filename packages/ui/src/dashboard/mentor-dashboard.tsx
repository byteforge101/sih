'use client';

import { motion } from 'framer-motion';
import { Users, AlertTriangle, MessageSquare, Calendar, Search, UserPlus, CheckCircle } from 'lucide-react';
import { useState, useEffect, useTransition } from 'react';
import { useDebounce } from 'use-debounce';

// --- TYPES ARE UNCHANGED ---
type MentorDashboardData = any;
type StudentSearchResult = {
  id: string;
  mentor: {
    id: string;
  }|null;
  user: {
    name: string;
  };
};

// --- STYLING CHANGE: StatCard restyled for Aurora UI, but structure is identical ---
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
export default function MentorDashboard({
  data,
  searchStudentsAction,
  addMenteeAction,
}: {
  data: MentorDashboardData;
  searchStudentsAction: (query: string) => Promise<StudentSearchResult[]>;
  addMenteeAction: (studentId: string) => Promise<{ success?: boolean; error?: string }>;
}) {
    const { mentor, stats } = data;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([]);
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const [isSearching, startSearchTransition] = useTransition();
    const [isAdding, startAddTransition] = useTransition();
    const [searchNow, setSearchNow] = useState<boolean>(false);

    const menteeIds = new Set(mentor.mentees.map((m: any) => m.id));

    useEffect(() => {
        if (debouncedQuery.trim()) {
            startSearchTransition(async () => {
                const results = await searchStudentsAction(debouncedQuery);
                setSearchResults(results);
            });
        } else {
            setSearchResults([]);
        }
    }, [debouncedQuery, searchStudentsAction, searchNow]);

    const handleAddMentee = (studentId: string) => {
        startAddTransition(async () => {
            await addMenteeAction(studentId);
            setSearchNow((prev) => !prev);
        });
    };
    
    return (
        <div className="space-y-8">
             {/* --- STYLING CHANGE: Header text colors updated --- */}
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-slate-100">Mentor Dashboard</h1>
                <p className="text-slate-400 mt-2 text-lg">Overview of your mentees and activities.</p>
            </motion.div>

             {/* --- STYLING CHANGE: StatCard colors updated to single-word props --- */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Mentees" value={stats.totalMentees} icon={Users} color="sky" />
                <StatCard title="At-Risk Students" value={stats.isAtRiskStudents} icon={AlertTriangle} color="rose" />
                <StatCard title="Upcoming Sessions" value={stats.upcomingSessions} icon={Calendar} color="violet" />
            </div>

            {/* --- STYLING CHANGE: Search Section restyled for Aurora UI --- */}
            <div className="aurora-bg p-6 rounded-2xl">
                <h2 className="font-bold text-xl mb-4 text-white">Find Students</h2>
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                    <input
                        type="text"
                        placeholder="Search for students by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-800/50 border border-slate-700 focus:bg-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30 outline-none transition-all duration-300 placeholder-slate-500 text-white"
                    />
                </div>
                <div className="mt-4 space-y-2 min-h-[50px]">
                    {isSearching && <p className="text-slate-400 text-sm">Searching...</p>}
                    {!isSearching && searchResults.map((student) => (
                        <div key={student.id} className="p-3 bg-slate-800/50 rounded-lg flex justify-between items-center border border-slate-700">
                            <p className="font-semibold text-slate-200">{student.user.name}</p>
                            {(student.mentor?.id === data.mentor?.id) ? (
                                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                                    <CheckCircle size={20} />
                                    <span>Mentee</span>
                                </div>
                            ) : (student.mentor?.id) ? (
                                <div className="flex items-center gap-2 text-rose-400 font-semibold">
                                    <CheckCircle size={20} />
                                    <span>Taken</span>
                                </div>
                            ) :(
                                <button
                                    onClick={() => handleAddMentee(student.id)}
                                    disabled={isAdding}
                                    className="text-sm text-cyan-400 font-semibold flex items-center gap-1 hover:text-cyan-300 disabled:opacity-50 transition-colors"
                                >
                                    <UserPlus size={16} />
                                    <span>{isAdding ? 'Adding...' : 'Add Mentee'}</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- STYLING CHANGE: At-Risk Mentees section restyled for Aurora UI --- */}
            <div className="aurora-bg p-6 rounded-2xl">
                <h2 className="font-bold text-xl mb-4 text-white">At-Risk Mentees</h2>
                <div className="space-y-3">
                    {mentor.mentees.filter((m: any) => m.isAtRisk).map((mentee: any) => (
                        <div key={mentee.id} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex justify-between items-center">
                            <p className="font-semibold text-rose-200">{mentee.user.name}</p>
                            <button className="text-sm text-rose-300 font-semibold hover:text-white transition-colors">View Profile</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}