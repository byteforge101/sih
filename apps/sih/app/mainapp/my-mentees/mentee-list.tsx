"use client";

import { useState } from 'react';
import { CurricularUnitForm } from '@repo/ui/CurricularUnitForm';
import { updateMentorDropoutDetails } from '../../../actions/student/update-mentor-dropout-details';
import Link from 'next/link';

// Icon components for buttons
const DetailsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PredictIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const AtRiskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const LowScoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const AcceptableScoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;


export function MenteeList({ mentees }: { mentees: any[] }) {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const handleUpdateDropoutDetails = async (studentId: string, data: any) => {
        return await updateMentorDropoutDetails(studentId, data);
    };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {mentees.map((mentee) => {
                    const name = mentee.user?.name || 'N/A';
                    const initials = name.split(' ').map((n: string) => n[0] || '').join('').substring(0, 2);
                    const hasPredictedScore = mentee.predictedscore != null;

                    return (
                        <div 
                            key={mentee.id} 
                            className="bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] flex flex-col justify-between"
                        >
                            <div className="flex items-start justify-between">
                                {/* Avatar and Name */}
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-500 text-white font-bold text-xl shadow-lg shadow-cyan-500/30">
                                        {initials}
                                    </div>
                                    <div>
                                        <p className="font-bold text-xl text-gray-800">{mentee.user?.name}</p>
                                        <p className="text-sm text-gray-500">{mentee.user?.email}</p>
                                    </div>
                                </div>
                                
                                {/* Status Badges */}
                                <div className="flex flex-col items-end gap-2">
                                    {mentee.isAtRisk && (
                                        <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            <AtRiskIcon />
                                            <span>At Risk</span>
                                        </div>
                                    )}
                                    {hasPredictedScore && mentee.predictedscore < 50 && (
                                        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            <LowScoreIcon />
                                            <span>Low Score</span>
                                        </div>
                                    )}
                                    {hasPredictedScore && mentee.predictedscore >= 50 && (
                                        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            <AcceptableScoreIcon />
                                            <span>Acceptable score</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 mt-6">
                                <Link 
                                    href={`/mainapp/my-mentees/${mentee.id}`} 
                                    className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center"
                                >
                                    <DetailsIcon/>
                                    Details
                                </Link>
                                <button
                                    onClick={() => setSelectedStudentId(mentee.id)}
                                    className="flex-1 text-center bg-gradient-to-r from-cyan-400 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
                                >
                                    <PredictIcon/>
                                    Predict
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
            
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