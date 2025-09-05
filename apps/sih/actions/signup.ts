'use server';

import bcrypt from 'bcrypt';
import prisma from '@repo/prisma/client'; 
import { SignUpSchema } from '@repo/zod';



export async function createAccount(formData: unknown) {
  const validatedFields = SignUpSchema.safeParse(formData);

  if (!validatedFields.success) {
    // Return a flattened error object for easier frontend handling
    return { error: 'Invalid fields provided.', details: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password, role, ...rest } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'An account with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role,
            }
        });

        switch (role) {
            case 'STUDENT':
                await tx.student.create({
                    data: {
                        userId: user.id,
                        rollNumber: rest.rollNumber!,
                        enrollmentYear: rest.enrollmentYear!,
                    }
                });
                break;
            case 'MENTOR':
                await tx.mentor.create({
                    data: {
                        userId: user.id,
                        department: rest.department!
                    }
                });
                break;
            case 'GUARDIAN':
                await tx.guardian.create({
                    data: {
                        userId: user.id,
                        phoneNumber: rest.phoneNumber!,
                    }
                });
                break;
        }
    });

    return { success: 'Account created successfully! Signing you in...' };

  } catch (error) {
    console.error('[ACCOUNT_CREATION_ERROR]', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
