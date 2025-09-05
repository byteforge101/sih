
import { Role } from '@prisma/client';
import { z } from 'zod';

export const SignUpSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    role: z.nativeEnum(Role),
    rollNumber: z.string().optional(),
    enrollmentYear: z.coerce.number().optional(),
    department: z.string().optional(),
    phoneNumber: z.string().optional(),
  }).refine(data => {
      if (data.role === 'STUDENT' && (!data.rollNumber || !data.enrollmentYear)) {
          return false;
      }
      return true;
  }, { message: 'Roll Number and Enrollment Year are required for students.', path: ['rollNumber'] })
  .refine(data => {
      if (data.role === 'MENTOR' && !data.department) {
          return false;
      }
      return true;
  }, { message: 'Department is required for mentors.', path: ['department'] })
  .refine(data => {
      if (data.role === 'GUARDIAN' && !data.phoneNumber) {
          return false;
      }
      return true;
  }, { message: 'Phone number is required for guardians.', path: ['phoneNumber'] });