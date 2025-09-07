'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { checkEncoding } from '../../../actions/student/check-encoding';
import Link from 'next/link';

import { StudentDashboardLoader, MentorDashboardLoader, GuardianDashboardLoader } from './Componets';
export default function DashboardPage() {
    const { data: session } = useSession();
    const [showPopup, setShowPopup] = useState(false);
    const userRole = (session?.user as any)?.role;

    useEffect(() => {
        async function verifyEncoding() {
            if (userRole === 'STUDENT') {
                const { encoding } = await checkEncoding();
                if (encoding === false) {
                    setShowPopup(true);
                }
            }
        }
        verifyEncoding();
    }, [userRole]);

    const renderDashboard = () => {
        switch (userRole) {
            case 'STUDENT':
                return <StudentDashboardLoader />;
            case 'MENTOR':
                return <MentorDashboardLoader />;
            case 'GUARDIAN':
                return <GuardianDashboardLoader />;
            default:
                return <div className="text-center p-8">Invalid user role. Please contact support.</div>;
        }
    };

    return (
        <div className={showPopup ? 'relative' : 'relative'}>
            {renderDashboard()}
            {showPopup && (
    <> 
        <div className="absolute inset-0 h-full w-full opacity-50 bg-white bg-opacity-50 filter blur-xs z-200"> </div>
        
        <div className="absolute inset-0 ">
        <div className=" flex items-center justify-center z-100">
            <div className="bg-white p-8 rounded-lg text-center  shadow-lg z-1000">
                <h2 className="text-2xl font-bold mb-4">Face Enrollment Required</h2>
                <p>Please complete your face enrollment to continue.</p>
                <Link
                    href="/mainapp/face-enrollment"
                    className="text-blue-500 underline mt-4 block"
                >
                    Go to Enrollment Page
                </Link>
                <button
                    onClick={() => setShowPopup(false)}
                    className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>

        </div>



    </>
)}

        </div>
    );
}


// Data loader components to handle async operations gracefully

