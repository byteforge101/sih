"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/prisma/client";

export async function checkEncoding() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
        return { encoding: true }; // Not a student, so no need to check
    }

    const student = await prisma.student.findUnique({
        where: { id: (session.user as any).id },
        
    
    }) as any;

    return { encoding: !!student?.encoding };
}