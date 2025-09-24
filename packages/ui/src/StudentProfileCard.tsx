import React from 'react';

// Ultra-modern glass DetailItem component
const DetailItem = ({ label, value, Icon }: { label: string; value: string | number; Icon: any }) => (
    <div className="bg-white/8 backdrop-blur-lg p-5 rounded-2xl border border-white/15 flex items-center space-x-4 transition-all duration-500 hover:bg-white/12 hover:border-white/25 hover:scale-[1.02] shadow-lg hover:shadow-2xl hover:shadow-white/5 group">
        <div className="flex-shrink-0 bg-white/15 backdrop-blur-sm text-white rounded-full p-3 border border-white/20 shadow-xl group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
            <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 group-hover:text-gray-300 transition-colors duration-300">{label}</p>
            <p className="text-base font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
                {value || <span className="font-medium italic text-gray-500">Not Provided</span>}
            </p>
        </div>
    </div>
);

// Ultra-modern glass SectionTitle component
const SectionTitle = ({ title }: { title: string }) => (
    <div className="mb-8">
        <h3 className="text-3xl font-black text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-sm">
            {title}
        </h3>
        <div className="h-0.5 bg-gradient-to-r from-white/30 via-white/60 to-white/30 rounded-full"></div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-1"></div>
    </div>
);

export const StudentProfileCard = ({ student, className = '' }: { student: any, className?: string }) => {
    // Enhanced SVG Icons
    const AcademicCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
    const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.813M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.813m0 0A7.5 7.5 0 1112 5.5a7.5 7.5 0 014.5 13.5m-9 0h9" /></svg>;
    const InformationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

    return (
        <div className={`bg-white/8 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl shadow-black/30 w-full border border-white/20 mt-8 hover:shadow-3xl hover:shadow-black/40 transition-all duration-700 ${className}`}>
            {/* Ultra-modern glass header */}
            <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/25 -mt-16 mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:shadow-3xl hover:shadow-white/5 transition-all duration-500 group">
                <div>
                    <h2 className="text-5xl font-black bg-gradient-to-r from-white via-gray-50 to-gray-200 bg-clip-text text-transparent drop-shadow-lg tracking-tight group-hover:from-gray-100 group-hover:to-white transition-all duration-300">
                        {student.user?.name}
                    </h2>
                    <p className="text-gray-300 text-lg font-medium mt-2 group-hover:text-gray-200 transition-colors duration-300">Student Profile</p>
                </div>
                <div className="flex items-center space-x-3 bg-emerald-500/20 backdrop-blur-lg text-emerald-200 px-6 py-3 rounded-full border border-emerald-400/30 shadow-xl group-hover:bg-emerald-500/30 group-hover:scale-105 transition-all duration-300">
                    <CheckCircleIcon />
                    <span className="text-sm font-bold uppercase tracking-wide">Verified</span>
                </div>
            </div>

            {/* Content sections with enhanced spacing */}
            <div className="space-y-16">
                {/* Academic Information Section */}
                <div>
                    <SectionTitle title="Academic Profile" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DetailItem label="Application Mode" value={student.application_mode} Icon={AcademicCapIcon} />
                        <DetailItem label="Course" value={student.course} Icon={AcademicCapIcon} />
                        <DetailItem label="Attendance" value={student.attendances} Icon={AcademicCapIcon} />
                        <DetailItem label="Previous Qualification" value={student.previous_qualification} Icon={AcademicCapIcon} />
                    </div>
                </div>

                {/* Family Information Section */}
                <div>
                    <SectionTitle title="Family Background" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <DetailItem label="Mother's Qualification" value={student.mothers_qualification} Icon={UserGroupIcon} />
                        <DetailItem label="Father's Qualification" value={student.fathers_qualification} Icon={UserGroupIcon} />
                        <DetailItem label="Mother's Occupation" value={student.mothers_occupation} Icon={UserGroupIcon} />
                        <DetailItem label="Father's Occupation" value={student.fathers_occupation} Icon={UserGroupIcon} />
                    </div>
                </div>

                {/* Personal & Financial Details Section */}
                <div>
                    <SectionTitle title="Personal & Financial Details" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DetailItem label="Gender" value={student.gender} Icon={InformationCircleIcon} />
                        <DetailItem label="Age at Enrollment" value={student.age_at_enrollment} Icon={InformationCircleIcon} />
                        <DetailItem label="International" value={student.international} Icon={InformationCircleIcon} />
                        <DetailItem label="Displaced" value={student.displaced} Icon={InformationCircleIcon} />
                        <DetailItem label="Scholarship Holder" value={student.scholarship_holder} Icon={InformationCircleIcon} />
                        <DetailItem label="Debtor" value={student.debtor} Icon={InformationCircleIcon} />
                        <DetailItem label="Tuition Fees Up To Date" value={student.tuition_fees_up_to_date} Icon={InformationCircleIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
};