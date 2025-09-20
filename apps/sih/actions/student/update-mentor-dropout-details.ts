// apps/sih/actions/student/update-dropout-details.ts

"use server";

import  db  from "@repo/prisma/client";
import { revalidatePath } from "next/cache";
import Prisma from "@repo/prisma/client";

export async function updateMentorDropoutDetails(studentId: string, data: any) {
  try {
    const studentdetails = await Prisma.student.findUnique({
        where: {
          id: studentId,
        },
     
      });
      console.log("this is data" + JSON.stringify({
        course: studentdetails?.course,
        application_mode: studentdetails?.application_mode,
        attendance: studentdetails?.attendances,
        previous_qualification: studentdetails?.previous_qualification,
        mothers_qualification: studentdetails?.mothers_qualification,
        fathers_qualification: studentdetails?.fathers_qualification,
        mothers_occupation: studentdetails?.mothers_occupation,
        fathers_occupation: studentdetails?.fathers_occupation,
        displaced: studentdetails?.displaced,
        debtor: studentdetails?.debtor,
        tuition_fees_up_to_date: studentdetails?.tuition_fees_up_to_date,
        gender: studentdetails?.gender,
        scholarship_holder: studentdetails?.scholarship_holder,
        age_at_enrollment: studentdetails?.age_at_enrollment,
        international: studentdetails?.international
      }));
    // Call the external prediction API
    const response = await fetch("https://priyanshu631-sih-facial-recognition-api.hf.space/dropout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({        course: studentdetails?.course,
        application_mode: studentdetails?.application_mode,
        attendance: studentdetails?.attendances,
        previous_qualification: studentdetails?.previous_qualification,
        mothers_qualification: studentdetails?.mothers_qualification,
        fathers_qualification: studentdetails?.fathers_qualification,
        mothers_occupation: studentdetails?.mothers_occupation,
        fathers_occupation: studentdetails?.fathers_occupation,
        displaced: studentdetails?.displaced,
        debtor: studentdetails?.debtor,
        tuition_fees_up_to_date: studentdetails?.tuition_fees_up_to_date,
        gender: studentdetails?.gender,
        scholarship_holder: studentdetails?.scholarship_holder,
        age_at_enrollment: studentdetails?.age_at_enrollment,
        international: studentdetails?.international,
        ...data}),
    });

    if (!response.ok) {
      throw new Error("Prediction API request failed");
    }

    const prediction = await response.json();

    // Update student with curricular data
    await db.student.update({
      where: { id: studentId },
      data: {
        ...data,
        isAtRisk: prediction.result === "Dropout", // Update isAtRisk status
      },
    });

    revalidatePath("/mainapp/my-mentees");
    return { success: true, message: "Prediction successful and data updated." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred." };
  }
}