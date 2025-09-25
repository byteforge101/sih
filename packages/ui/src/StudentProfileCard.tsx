import React from 'react';

// A helper component for each detail item - REDESIGNED
const DetailItem = ({ label, value, Icon }: { label: string; value: string | number; Icon: any }) => (
    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4 transition-all duration-300 hover:shadow-md hover:border-blue-300">
        <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-2">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-base font-bold text-gray-900">{value || <span className="font-normal italic text-gray-400">Not Provided</span>}</p>
        </div>
    </div>
);

// A helper for section titles - REDESIGNED
const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
);

export const StudentProfileCard = ({ student ,className=''}: { student: any,className?: string }) => {
    // Better, more modern SVG Icons from Heroicons library
    const AcademicCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
    const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.813M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.813m0 0A7.5 7.5 0 1112 5.5a7.5 7.5 0 014.5 13.5m-9 0h9" /></svg>;
    const InformationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

    return (
        <div className={`bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl w-full border border-gray-100 mt-8 ${className}`}>
            {/* --- Header with Gradient --- */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 rounded-xl shadow-lg shadow-blue-500/30 -mt-16 mb-12 flex justify-between items-center">
                <h2 className="text-4xl font-extrabold text-white tracking-tight">{student.user?.name}</h2>
                <div className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                    <CheckCircleIcon />
                    <span className="text-sm font-semibold">Verified</span>
                </div>
            </div>

            {/* --- Content Sections --- */}
            <div className="space-y-12">
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

                {/* Additional Information Section */}
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