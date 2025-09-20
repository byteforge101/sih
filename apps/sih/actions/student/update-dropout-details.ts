// apps/sih/actions/student/update-student-details.ts

"use server";

import prisma from "@repo/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

// Define a type for the incoming form data for better type safety
type StudentProfileData = {
    application_mode: string;
    course: string;
    attendances: string;
    previous_qualification: string;
    mothers_qualification: string;
    fathers_qualification: string;
    mothers_occupation: string;
    fathers_occupation: string;
    displaced: string;
    debtor: string;
    tuition_fees_up_to_date: string;
    gender: string;
    scholarship_holder: string;
    age_at_enrollment: number;
    international: string;
};

export async function updateDropoutDetails(data: StudentProfileData) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("Unauthorized: You must be logged in to update details.");
    }

    if (session.user.role !== "STUDENT") {
        throw new Error("Forbidden: Only students can update their profile.");
    }

    try {
        await prisma.student.update({
            where: { userId: session.user.id },
            data: {
                ...data,
                profileCompleted: true, // Mark the profile as completed
            },
        });
        return { success: true, message: "Profile updated successfully!" };
    } catch (error) {
        console.error("Failed to update student details:", error);
        return { success: false, message: "Failed to update profile." };
    }
}