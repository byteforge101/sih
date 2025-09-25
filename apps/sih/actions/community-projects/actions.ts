'use server';

import prisma from '@repo/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createCommunityProject(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'MENTOR') {
    throw new Error('Not authorized or not a mentor.');
  }

  const projectId = formData.get('projectId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const organization = formData.get('organization') as string;
  const domain = formData.get('domain') as string;
  const details = formData.get('details') as string;
  const reward = formData.get('reward') as string;
  const image = formData.get('image') as File;

  if (!projectId || !title || !description || !organization || !domain) {
    throw new Error('All required fields must be filled.');
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
    const fileName = `projects/${Date.now()}-${image.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, image);

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    imageUrl = data.path;
  }

  await prisma.communityProject.create({
    data: {
      projectId,
      title,
      description,
      organization,
      domain,
      details,
      reward: reward ? parseInt(reward) : null,
      imageUrl,
      mentorId: mentor.id,
    },
  });

  revalidatePath('/mainapp/community-projects');
}

export async function getMentorCommunityProjects() {
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

  return prisma.communityProject.findMany({
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

export async function getStudentCommunityProjects() {
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

  return prisma.communityProject.findMany({
    where: { mentorId: student.mentorId },
    include: {
      submissions: {
        where: { studentId: student.id },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createCommunityProjectSubmission(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'STUDENT') {
    throw new Error('Not authorized or not a student.');
  }

  const answerText = formData.get('answerText') as string;
  const image = formData.get('image') as File;
  const projectId = formData.get('projectId') as string;

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
    const fileName = `project-submissions/${Date.now()}-${image.name}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, image);

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    answerImageUrl = data.path;
  }

  await prisma.communityProjectSubmission.create({
    data: {
      answerText,
      answerImageUrl,
      studentId: student.id,
      communityProjectId: projectId,
    },
  });

  revalidatePath('/mainapp/community-projects');
}

export async function updateProjectSubmissionStatus(
  submissionId: string,
  status: 'APPROVED' | 'DISAPPROVED'
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'MENTOR') {
    throw new Error('Not authorized or not a mentor.');
  }

  const submission = await prisma.communityProjectSubmission.update({
    where: { id: submissionId },
    data: { status },
  });

  if (status === 'APPROVED') {
    // Get the project to check if it has a reward
    const project = await prisma.communityProject.findUnique({
      where: { id: submission.communityProjectId },
    });

    const rewardPoints = project?.reward || 15; // Default reward

    await prisma.student.update({
      where: { id: submission.studentId },
      data: {
        rewardPoints: {
          increment: rewardPoints,
        },
      },
    });
  }

  revalidatePath('/mainapp/community-projects');
}
