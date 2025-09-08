'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import prisma from '@repo/prisma/client';
import { revalidatePath } from 'next/cache';

export async function addMentee(studentId: string) {
    const session = await getServerSession(authOptions);
    const mentorId = session?.user?.id;

    if (!mentorId) {
        return { error: 'Mentor not authenticated' };
    }

    try {
        const mentor = await prisma.mentor.findUnique({
            where: { userId: mentorId },
        });

        if (!mentor) {
            return { error: 'Mentor profile not found' };
        }

        await prisma.student.update({
            where: { id: studentId },
            data: {
                mentorId: mentor?.id,
            },
        });

        revalidatePath('/mainapp/dashboard');
        return { success: true };

    } catch (error) {
        console.error('Error adding mentee:', error);
        return { error: 'Failed to add mentee' };
    }
}