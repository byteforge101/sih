'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This is the function our page will call to save the attendance
export async function markAttendance(
  studentRollNumbers: string[],
  courseSessionId: string
) {
  if (!studentRollNumbers || studentRollNumbers.length === 0) {
    return { error: 'No students to mark attendance for.' };
  }
  if (!courseSessionId) {
    return { error: 'Course session is not specified.' };
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        rollNumber: { in: studentRollNumbers },
      },
      select: {
        id: true,
      },
    });

    if (students.length === 0) {
      return { error: 'None of the provided roll numbers correspond to valid students.' };
    }

    const studentIds = students.map((s) => s.id);

    // Use a transaction to mark all students at once
    const transaction = studentIds.map((studentId) =>
      // 'upsert' is perfect here. It creates a record if it doesn't exist,
      // or updates it if it does. This prevents duplicate attendance records.
      prisma.attendanceRecord.upsert({
        where: {
          studentId_courseSessionId: {
            studentId,
            courseSessionId,
          },
        },
        update: {
          status: 'PRESENT',
          date: new Date(),
        },
        create: {
          studentId,
          courseSessionId,
          status: 'PRESENT',
          date: new Date(),
        },
      })
    );

    await prisma.$transaction(transaction);

    return { success: `Successfully marked ${students.length} student(s) as present.` };
  } catch (error) {
    console.error('Failed to mark attendance:', error);
    return { error: 'A database error occurred.' };
  }
}