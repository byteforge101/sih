'use server';

import prisma from '@repo/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

export async function getGuardianDashboardData() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'GUARDIAN') {
        throw new Error('Not authorized or not a guardian.');
    }

    const guardianData = await prisma.guardian.findUnique({
        where: { userId: session.user.id },
        include: {
            wards: {
                include: {
                    user: true,
                    attendance: { orderBy: { date: 'desc' }, take: 1 },
                    scores: { orderBy: { date: 'desc' }, take: 1 },
                    fees: { where: { status: 'OVERDUE' } }
                }
            }
        }
    });

    if (!guardianData) {
        throw new Error('Guardian data not found.');
    }

    return { guardian: guardianData };
}