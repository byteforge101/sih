'use server';

import prisma from '@repo/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

export async function getMeetingAttendance(meetingId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'MENTOR') {
    throw new Error('Not authorized or not a mentor.');
  }

  const attendance = await prisma.meetingAttendance.findMany({
    where: {
      meetingId: meetingId,
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
    },
  });

  return attendance.map((att) => ({
    rollNumber: att.student.rollNumber,
    name: att.student.user.name,
    timestamp: att.timestamp,
  }));
}