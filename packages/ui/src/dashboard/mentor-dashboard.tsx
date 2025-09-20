'use client';

import { motion } from 'framer-motion';
import { Users, AlertTriangle, MessageSquare, Calendar, Search, UserPlus, CheckCircle } from 'lucide-react';
import { useState, useEffect, useTransition } from 'react';
import { useDebounce } from 'use-debounce';

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
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-slate-800">Mentor Dashboard</h1>
                <p className="text-slate-500">Overview of your mentees and activities.</p>
            </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Mentees" value={stats.totalMentees} icon={Users} color="from-blue-400 to-cyan-500" />
                <StatCard title="At-Risk Students" value={stats.isAtRiskStudents} icon={AlertTriangle} color="from-red-400 to-rose-500" />
                <StatCard title="Upcoming Sessions" value={stats.upcomingSessions} icon={Calendar} color="from-purple-400 to-violet-500" />
            </div>

            {/* Search Section */}
            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200/50">
                <h2 className="font-bold text-xl mb-4">Find Students</h2>
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for students by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-full bg-slate-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
                <div className="mt-4 space-y-2 min-h-[50px]">
                    {isSearching && <p className="text-slate-500 text-sm">Searching...</p>}
                    {!isSearching && searchResults.map((student) => (
                        <div key={student.id} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                            <p className="font-semibold">{student.user.name}</p>
                            {(student.mentor?.id === data.mentor?.id) ? (
                                <div className="flex items-center gap-2 text-green-600 font-semibold">
                                    <CheckCircle size={20} />
                                    <span>Mentee</span>
                                </div>
                            ) : (student.mentor?.id) ? (
                                <div className="flex items-center gap-2 text-red-600 font-semibold">
                                    <CheckCircle size={20} />
                                    <span>taken</span>
                                </div>
                            ) :(
                                <button
                                    onClick={() => handleAddMentee(student.id)}
                                    disabled={isAdding}
                                    className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-800 disabled:opacity-50"
                                >
                                    <UserPlus size={16} />
                                    <span>{isAdding ? 'please wait...' : 'Add Mentee'}</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200/50">
                <h2 className="font-bold text-xl mb-4">At-Risk Mentees</h2>
                <div className="space-y-3">
                    {mentor.mentees.filter((m: any) => m.isAtRisk).map((mentee: any) => (
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