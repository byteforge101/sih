import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import StudentDashboard from "@repo/ui/dashboard/student-dashboard";
import MentorDashboard from "@repo/ui/dashboard/mentor-dashboard";
import GuardianDashboard from "@repo/ui/dashboard/guardian-dashboard";
import AdminDashboard from "@repo/ui/dashboard/admin-dashboard";
import { getStudentDashboardData } from "../../../actions/student/get-student-data";
import { getMentorDashboardData } from "../../../actions/mentor/get-mentor-data";
import { getGuardianDashboardData } from "../../../actions/guardian/get-guardian-ata";
import { checkEncoding } from "../../../actions/student/check-encoding";
import { searchStudents } from "../../../actions/mentor/search-students";
import { addMentee } from "../../../actions/mentor/add-mentee";

export default async function Page() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole === 'STUDENT') {
        const studentData = await getStudentDashboardData();
        const { hasEncoding } = await checkEncoding(); 
        const dashboardData = {
            ...studentData, // This should contain 'student' and 'stats'
            hasFaceEncoding: hasEncoding
        };// Check for face encoding
        return <StudentDashboard data={dashboardData} />;
    }
    if (userRole === 'MENTOR') {
        const mentorData = await getMentorDashboardData();
        return <MentorDashboard data={mentorData} searchStudentsAction={searchStudents} addMenteeAction={addMentee} />;
    }
    if (userRole === 'GUARDIAN') {
        const guardianData = await getGuardianDashboardData();
        return <GuardianDashboard data={guardianData} />;
    }
 

    return (
        <div className="p-8 text-center text-red-500">
            <p>Error: Could not determine user role.</p>
        </div>
    );
}