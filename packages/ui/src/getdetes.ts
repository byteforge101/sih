"use server"
import prisma from "@repo/prisma/client";
export async function getDetails(studentId: string) {
    const details = await prisma.student.findUnique({ where: { id: studentId } });
    return {success: true, data: details};
}
