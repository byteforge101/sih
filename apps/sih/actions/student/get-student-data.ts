'use server';

import prisma from '@repo/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

export async function getStudentDashboardData() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
        throw new Error('Not authorized or not a student.');
    }

    const studentData = await prisma.student.findUnique({
        where: { userId: session.user.id },
        include: {
            user: true,
            attendance: {
                orderBy: { date: 'desc' },
                take: 5,
            },
            scores: {
                orderBy: { date: 'desc' },
                take: 5,
                include: { course: true }
            },
            fees: {
                orderBy: { dueDate: 'desc' },
            },
            counselingSessions: {
                orderBy: { date: 'desc' },
                take: 1,
                include: { mentor: { include: { user: true } } }
            }
        }
    });

    if (!studentData) {
        throw new Error('Student data not found.');
    }

    const totalCourses = await prisma.course.count(); // Example metric
    const overdueFees = studentData.fees.filter(fee => fee.status === 'OVERDUE').length;

    return {
        student: studentData,
        stats: {
            attendancePercentage: 85, // Placeholder - needs calculation logic
            cgpa: 8.2, // Placeholder - needs calculation logic
            overdueFees,
            totalCourses
        }
    };
}
