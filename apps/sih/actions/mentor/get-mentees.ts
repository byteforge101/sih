"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/prisma/client";


export async function getMentees() {
  const session = await getServerSession(authOptions);

  
  if (session?.user?.role !== "MENTOR") {
    
    throw new Error("Unauthorized: This action is restricted to mentors.");
  }

  
  const mentor = await prisma.mentor.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!mentor) {
   
    return []; 
  }

  
  const mentees = await prisma.student.findMany({
    where: {
      mentorId: mentor.id,
    },
    include: {
      user: true, 
    },
    orderBy: {
      user: {
        name: 'asc' 
      }
    }
  });

  return mentees;
}