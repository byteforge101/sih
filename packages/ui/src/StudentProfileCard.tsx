// packages/ui/src/StudentProfileCard.tsx

import React from 'react';

// A helper component for each detail item
const DetailItem = ({ label, value, Icon }: { label: string; value: string; Icon:any}) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-indigo-500" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-base font-semibold text-gray-800">{value || 'Not Provided'}</p>
        </div>
    </div>
);

// A helper for section titles
const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-200 pb-2 mb-6">{title}</h3>
);

export const StudentProfileCard = ({ student }: { student: any }) => {
    // Mock Icons - replace with a real icon library like react-icons or heroicons
    const AcademicCapIcon = () => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l-9-5m9 5l9-5" />
        </svg>
    );
    const UserGroupIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.813M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.813m0 0A7.5 7.5 0 1112 5.5a7.5 7.5 0 014.5 13.5m-9 0h9" /></svg>;
    const InformationCircleIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const CheckCircleIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Your Profile</h2>
                <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    <CheckCircleIcon />
                    <span className="text-sm font-semibold">Verified</span>
                </div>
            </div>

            {/* Academic Information Section */}
            <div className="mb-10">
                <SectionTitle title="Academic Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DetailItem label="Application Mode" value={student.application_mode} Icon={AcademicCapIcon} />
                    <DetailItem label="Course" value={student.course} Icon={AcademicCapIcon} />
                    <DetailItem label="Attendance" value={student.attendances} Icon={AcademicCapIcon} />
                    <DetailItem label="Previous Qualification" value={student.previous_qualification} Icon={AcademicCapIcon} />
                </div>
            </div>

            {/* Family Information Section */}
            <div className="mb-10">
                <SectionTitle title="Family Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <DetailItem label="Mother's Qualification" value={student.mothers_qualification} Icon={UserGroupIcon} />
                    <DetailItem label="Father's Qualification" value={student.fathers_qualification} Icon={UserGroupIcon} />
                    <DetailItem label="Mother's Occupation" value={student.mothers_occupation} Icon={UserGroupIcon} />
                    <DetailItem label="Father's Occupation" value={student.fathers_occupation} Icon={UserGroupIcon} />
                </div>
            </div>

            {/* Additional Information Section */}
            <div>
                <SectionTitle title="Additional Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
    );
};