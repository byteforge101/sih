'use server';

import prisma from '@repo/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

export async function getMentorDashboardData() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'MENTOR') {
        throw new Error('Not authorized or not a mentor.');
    }

    const mentorData = await prisma.mentor.findUnique({
        where: { userId: session.user.id },
        include: {
            mentees: {
                where: { isAtRisk: true },
                include: { user: true }
            },
            counselingSessions: {
                orderBy: { date: 'desc' },
                take: 5,
                include: { student: { include: { user: true } } }
            }
        }
    });

    if (!mentorData) {
        throw new Error('Mentor data not found.');
    }

    const totalMentees = await prisma.student.count({
        where: { mentorId: mentorData.id }
    });

    return {
        mentor: mentorData,
        stats: {
            atRiskStudents: mentorData.mentees.length,
            totalMentees,
            upcomingSessions: 5, // Placeholder
        }
    };
}
