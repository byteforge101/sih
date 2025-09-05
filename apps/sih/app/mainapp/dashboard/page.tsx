import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { redirect } from 'next/navigation';

import { getStudentDashboardData } from '../../../actions/student/get-student-data';
import { getMentorDashboardData } from '../../../actions/mentor/get-mentor-data';
import { getGuardianDashboardData } from '../../../actions/guardian/get-guardian-ata';


import StudentDashboard from '@repo/ui/dashboard/student-dashboard';
import MentorDashboard from '@repo/ui/dashboard/mentor-dashboard';
import GuardianDashboard from '@repo/ui/dashboard/guardian-dashboard';
import AdminDashboard from '@repo/ui/dashboard/admin-dashboard';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth');
    }

    const userRole = (session.user as any).role;

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

    return <div>{renderDashboard()}</div>;
}

// Data loader components to handle async operations gracefully
async function StudentDashboardLoader() {
    const data = await getStudentDashboardData();
    return <StudentDashboard data={data} />;
}

async function MentorDashboardLoader() {
    const data = await getMentorDashboardData();
    return <MentorDashboard data={data} />;
}

async function GuardianDashboardLoader() {
    const data = await getGuardianDashboardData();
    return <GuardianDashboard data={data} />;
}


