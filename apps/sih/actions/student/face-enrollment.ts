'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import prisma from '@repo/prisma/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function enrollStudentFace(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  // 1. Authenticate and authorize the user
  if (!session?.user || (session.user as any).role !== 'STUDENT') {
    throw new Error('Not authorized or not a student.');
  }

  // 2. Get the student's roll number from the database
  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    select: { rollNumber: true }
  });

  if (!student?.rollNumber) {
    throw new Error('Could not find student roll number.');
  }

  // 3. Add the roll number to the form data
  formData.append('roll_number', student.rollNumber);
  
  // 4. Send the data to the Python API
  try {
    const response = await fetch(`${API_BASE_URL}/enroll`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Enrollment failed on the server.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Enrollment API error:", error);
    throw new Error(`Failed to enroll: ${error.message}`);
  }
}