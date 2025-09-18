// apps/sih/actions/student/check-encoding.ts

'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import prisma from '@repo/prisma/client';

export async function checkEncoding() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'STUDENT') {
    throw new Error('Not authorized or not a student.');
  }

  const userId = session.user.id;

  const result: { exists: boolean }[] = await prisma.$queryRawUnsafe(
    `SELECT ("encoding" IS NOT NULL) as "exists" FROM "Student" WHERE "userId" = $1`,
    userId
  );

  
  const hasEncoding = result[0]?.exists ?? false;

  return { hasEncoding };
}