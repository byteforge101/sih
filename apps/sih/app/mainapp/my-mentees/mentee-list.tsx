"use client";

import { useState } from 'react';
import { CurricularUnitForm } from '@repo/ui/CurricularUnitForm';
import { updateMentorDropoutDetails } from '../../../actions/student/update-mentor-dropout-details';
import Link from 'next/link';

// --- STYLING CHANGE: SVG fill/stroke colors updated for dark theme. Functionality is identical. ---
const DetailsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PredictIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.466V19a2 2 0 11-4 0v-.534c0-.836.337-1.631.93-2.22l.548-.547z" /></svg>;

// --- LOGIC IS UNCHANGED ---
export function MenteeList({ mentees }: { mentees: any[] }) {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const handleUpdateDropoutDetails = async (formData: any) => {
        if (!selectedStudentId) return;
        return await updateMentorDropoutDetails(selectedStudentId, formData);
    };

    const getRiskStyles = (isAtRisk: boolean) => {
        return isAtRisk
            ? {
                badge: "bg-rose-500/10 text-rose-300 border-rose-500/20",
                highlight: "border-rose-500/30",
              }
            : {
                badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
                highlight: "border-emerald-500/20",
              };
    };

    return (
        <div>
            {/* --- STYLING CHANGE: Grid layout for cards updated --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mentees.map((mentee) => {
                    const riskStyles = getRiskStyles(mentee.isAtRisk);
                    return (
                        // --- STYLING CHANGE: Card restyled with Aurora UI ---
                        <div
                            key={mentee.id}
                            className={`aurora-bg rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 border ${riskStyles.highlight}`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-white">{mentee.user.name}</h3>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${riskStyles.badge}`}>
                                        {mentee.isAtRisk ? "At Risk" : "On Track"}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400">ID: {mentee.id}</p>
                            </div>
                            <div className="mt-6 flex gap-3">
                                {/* --- STYLING CHANGE: Buttons restyled for Aurora UI --- */}
                                <Link
                                    href={`/mainapp/my-mentees/${mentee.id}`}
                                    className="flex-1 text-center bg-slate-700/50 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center"
                                >
                                    <DetailsIcon/>
                                    Details
                                </Link>
                                <button
                                    onClick={() => setSelectedStudentId(mentee.id)}
                                    className="flex-1 text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
                                >
                                    <PredictIcon/>
                                    Predict
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
            
            {/* --- LOGIC IS UNCHANGED --- */}
            {selectedStudentId && (
                <CurricularUnitForm
                    studentId={selectedStudentId}
                    onClose={() => setSelectedStudentId(null)}
                    updateAction={handleUpdateDropoutDetails}
                />
            )}
        </div>
    );
}