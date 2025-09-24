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
        <div className="space-y-10 p-4 md:p-8 text-white">
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-black text-white bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">Mentor Dashboard</h1>
                <p className="text-gray-300 text-lg font-medium mt-2">Overview of your mentees and activities.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Mentees" value={stats.totalMentees} icon={Users} color="sky" />
                <StatCard title="At-Risk Students" value={stats.isAtRiskStudents} icon={AlertTriangle} color="red" />
                <StatCard title="Upcoming Sessions" value={stats.upcomingSessions} icon={Calendar} color="violet" />
            </div>

            <div className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-6">
                <h2 className="font-bold text-xl mb-4 text-white">Find Students</h2>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    <input
                        type="text"
                        placeholder="Search for students by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-4 pl-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 shadow-lg text-lg"
                    />
                </div>
                <div className="mt-4 space-y-2 min-h-[50px]">
                    {isSearching && <p className="text-gray-400 text-sm p-3">Searching...</p>}
                    {!isSearching && searchResults.map((student) => (
                        <div key={student.id} className="p-3 bg-white/5 backdrop-blur-sm rounded-xl flex justify-between items-center border border-white/10">
                            <p className="font-semibold text-gray-200">{student.user.name}</p>
                            {(student.mentor?.id === data.mentor?.id) ? (
                                <div className="flex items-center gap-2 text-green-300 font-semibold text-sm">
                                    <CheckCircle size={18} />
                                    <span>Mentee</span>
                                </div>
                            ) : (student.mentor?.id) ? (
                                <div className="flex items-center gap-2 text-red-300 font-semibold text-sm">
                                    <AlertTriangle size={18} />
                                    <span>Assigned</span>
                                </div>
                            ) :(
                                <button
                                    onClick={() => handleAddMentee(student.id)}
                                    disabled={isAdding}
                                    className="text-sm text-sky-300 font-semibold flex items-center gap-1.5 hover:text-sky-200 disabled:opacity-50 transition-colors"
                                >
                                    <UserPlus size={16} />
                                    <span>{isAdding ? 'Adding...' : 'Add Mentee'}</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-6">
                <h2 className="font-bold text-xl mb-4 text-white">At-Risk Mentees</h2>
                <div className="space-y-3">
                    {mentor.mentees.filter((m: any) => m.isAtRisk).map((mentee: any) => (
                        <div key={mentee.id} className="p-3 bg-red-500/20 backdrop-blur-sm rounded-xl flex justify-between items-center border border-red-500/30">
                            <p className="font-semibold text-red-200">{mentee.user.name}</p>
                            <button className="text-sm text-red-300 font-semibold hover:text-white transition-colors">View Profile</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

