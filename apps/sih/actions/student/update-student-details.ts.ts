"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/prisma/client";
import { revalidatePath } from "next/cache";

const schema = z.object({
  age: z.coerce.number(),
  gender: z.string(),
  study_hours_per_day: z.coerce.number(),
  social_media_hours: z.coerce.number(),
  part_time_job: z.string(),
  attendance_percentage: z.coerce.number(),
  sleep_hours: z.coerce.number(),
  diet_quality: z.string(),
  exercise_hours: z.coerce.number(),
  parental_education_level: z.string(),
  mental_health: z.coerce.number(),
});

const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function updateStudentDetails(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("You must be logged in to update your details.");
  }

  const parsed = schema.parse(Object.fromEntries(formData.entries()));

  const response = await fetch(`${url}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsed),
  });

  const { predicted_exam_score } = await response.json();

  // Determine if the student is at risk based on the predicted score.


  await prisma.student.update({
    where: {
      userId: session.user.id,
    },
    data: {
      ...parsed,
      predictedscore: predicted_exam_score,
      // Update the isAtRisk field accordingly.
    },
  });

  revalidatePath("/mainapp/student-details");
}