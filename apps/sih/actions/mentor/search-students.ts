'use server';

import prisma from '@repo/prisma/client';

export async function searchStudents(query: string) {
    if (!query) {
        return [];
    }

    try {
        const students = await prisma.student.findMany({
            where: {
                user: {
                    name: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                mentor: true,
            },
            take: 10, // Limit results for performance
        });
        return students;
    } catch (error) {
        console.error("Error searching students:", error);
        return [];
    }
}