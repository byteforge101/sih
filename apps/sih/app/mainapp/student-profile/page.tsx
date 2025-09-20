// apps/sih/app/mainapp/student-profile/page.tsx

import { StudentProfileForm } from "@repo/ui/StudentProfileForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "@repo/prisma/client";
import { updateDropoutDetails } from "../../../actions/student/update-dropout-details"; // Import the action
import { StudentProfileCard } from "@repo/ui/StudentProfileCard";

export default async function StudentProfile() {
    const session = await getServerSession(authOptions);
   if (!session?.user) {
        return <div>Unauthorized</div>;
    }
    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
    });

    if (!student) {
        return <div>Student not found</div>;
    }

    if (student.profileCompleted) {
        return (
            <StudentProfileCard student={student} />
        );
    }

    // Hardcoded dropdown options
    const applicationModes = ["1st phase—general contingent", "Ordinance No. 612/93", /* ...other options... */];
    const courses = ["Biofuel Production Technologies", "Animation and Multimedia Design", /* ...other options... */];
    const attendanceRegimes = ["Daytime", "Evening"];
    const previousQualifications = ["Secondary education", "Higher education—bachelor’s degree", /* ...other options... */];
    const parentQualifications = ["Secondary Education—12th Year of Schooling or Equivalent", "Higher Education—bachelor’s degree", /* ...other options... */];
    const parentOccupations = ["Student", "Teachers", "Administrative staff", /* ...other options... */];
    const genders = ["Male", "Female"];
    const yesNoOptions = ["Yes", "No"];


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>
            <StudentProfileForm
                applicationModes={applicationModes}
                courses={courses}
                attendanceRegimes={attendanceRegimes}
                previousQualifications={previousQualifications}
                parentQualifications={parentQualifications}
                parentOccupations={parentOccupations}
                genders={genders}
                yesNoOptions={yesNoOptions}
                updateAction={updateDropoutDetails} // Pass the action as a prop
            />
        </div>
    );
}