'use server';

import prisma from '@repo/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createCommunityQuestion(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'MENTOR') {
    throw new Error('Not authorized or not a mentor.');
  }

  const description = formData.get('description') as string;
  const image = formData.get('image') as File;

  if (!description) {
    throw new Error('Description is required.');
  }

  const mentor = await prisma.mentor.findUnique({
    where: { userId: session.user.id },
  });

  if (!mentor) {
    throw new Error('Mentor not found.');
  }

  let imageUrl: string | null = null;
  if (image && image.size > 0) {
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
    const fileName = `${Date.now()}-${image.name}`;
    
    // Log the actual error from Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, image);

    if (error) {
      console.error("Supabase upload error:", error); // <-- ADD THIS LINE
      throw new Error(`Failed to upload image: ${error.message}`); // <-- MODIFIED ERROR
    }
    imageUrl = data.path;
  }

  await prisma.communityQuestion.create({
    data: {
      description,
      imageUrl,
      mentorId: mentor.id,
    },
  });

  revalidatePath('/mainapp/community-qs');
}

export async function getMentorCommunityQuestions() {
  const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'MENTOR') {
        throw new Error('Not authorized or not a mentor.');
    }

    const mentor = await prisma.mentor.findUnique({
        where: { userId: session.user.id },
    });

    if (!mentor) {
        return [];
    }

  return prisma.communityQuestion.findMany({
    where: { mentorId: mentor.id },
    include: {
      submissions: {
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getStudentCommunityQuestions() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
        throw new Error('Not authorized or not a student.');
    }

    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
    });

    if (!student || !student.mentorId) {
        return [];
    }

    return prisma.communityQuestion.findMany({
        where: { mentorId: student.mentorId },
        include: {
            submissions: {
                where: { studentId: student.id },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}


export async function createCommunityQuestionSubmission(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'STUDENT') {
    throw new Error('Not authorized or not a student.');
  }

  const answerText = formData.get('answerText') as string;
  const image = formData.get('image') as File;
  const questionId = formData.get('questionId') as string;

  if (!answerText && (!image || image.size === 0)) {
    throw new Error('An answer (text or image) is required.');
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
  });

  if (!student) {
    throw new Error('Student not found.');
  }

  let answerImageUrl: string | null = null;
  if (image && image.size > 0) {
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
    const fileName = `${Date.now()}-${image.name}`;

    // Log the actual error from Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, image);

    if (error) {
      console.error("Supabase upload error:", error); // <-- ADD THIS LINE
      throw new Error(`Failed to upload image: ${error.message}`); // <-- MODIFIED ERROR
    }
    answerImageUrl = data.path;
  }

  await prisma.communityQuestionSubmission.create({
    data: {
      answerText,
      answerImageUrl,
      studentId: student.id,
      communityQuestionId: questionId,
    },
  });

  revalidatePath('/mainapp/community-qs');
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: 'APPROVED' | 'DISAPPROVED'
) {
  const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'MENTOR') {
        throw new Error('Not authorized or not a mentor.');
    }

  const submission = await prisma.communityQuestionSubmission.update({
    where: { id: submissionId },
    data: { status },
  });

  if (status === 'APPROVED') {
    await prisma.student.update({
      where: { id: submission.studentId },
      data: {
        rewardPoints: {
          increment: 10, // Or any other amount
        },
      },
    });
  }

  revalidatePath('/mainapp/community-qs');
}

export async function getStudentRewards() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
        return null;
    }

    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
        select: { rewardPoints: true },
    });

    return student?.rewardPoints;
}