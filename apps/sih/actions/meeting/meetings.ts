'use server';

import prisma from '@repo/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { revalidatePath } from 'next/cache';

export async function createMeeting(title: string, startTime: Date) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'MENTOR') {
    throw new Error('Not authorized or not a mentor.');
  }

  const mentor = await prisma.mentor.findUnique({
    where: { userId: session.user.id },
  });

  if (!mentor) {
    throw new Error('Mentor data not found.');
  }

  await prisma.meeting.create({
    data: {
      title,
      startTime,
      mentorId: mentor.id,
    },
  });

  revalidatePath('/mainapp/meeting');
}

export async function getMeetings() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('Not authorized.');
  }

  const userRole = (session.user as any).role;
  const userId = session.user.id;

  if (userRole === 'MENTOR') {
    return prisma.meeting.findMany({
      where: { mentor: { userId } },
      orderBy: { startTime: 'desc' },
      include: { mentor: { include: { user: true } } },
    });
  }

  if (userRole === 'STUDENT') {
    const student = await prisma.student.findUnique({
      where: { userId },
      select: { mentorId: true },
    });

    if (!student || !student.mentorId) {
      return [];
    }

    return prisma.meeting.findMany({
      where: { mentorId: student.mentorId },
      orderBy: { startTime: 'desc' },
      include: { mentor: { include: { user: true } } },
    });
  }

  return [];
}