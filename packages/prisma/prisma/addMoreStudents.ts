import { PrismaClient, Role, AttendanceStatus, FeeStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start adding new students...');

  // --- IMPORTANT: We are NOT deleting existing data in this script ---

  // --- 1. Find the existing Mentor: Dr. Anjali Sharma ---
  const anjaliSharmaMentor = await prisma.mentor.findFirst({
    where: {
      user: {
        email: 'mentor1@example.com',
      },
    },
    include: {
        user: true // Include user data to confirm name
    }
  });

  if (!anjaliSharmaMentor) {
    throw new Error('Could not find mentor Dr. Anjali Sharma (mentor1@example.com). Please run the initial seed script first.');
  }

  console.log(`Found Mentor: ${anjaliSharmaMentor.user.name} (ID: ${anjaliSharmaMentor.id})`);

  // --- 2. Find an existing Course to add records for ---
  const cs101Course = await prisma.course.findUnique({
    where: { courseCode: 'CS101' },
  });
  
  if (!cs101Course) {
    throw new Error('Could not find course with code CS101. Please run the initial seed script first.');
  }

  // Find a course session to add attendance records against
  const session1CS101 = await prisma.courseSession.findFirst({
    where: { courseId: cs101Course.id }
  })

  if (!session1CS101) {
    throw new Error('Could not find any session for course CS101. Please run the initial seed script first.');
  }


  // --- 3. Create a new Student (Sanjay Verma) and their Guardian ---
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Guardian User & Profile
  const guardianUser3 = await prisma.user.create({
    data: {
      email: 'guardian3@example.com',
      name: 'Mr. Ashok Verma',
      password: hashedPassword,
      role: Role.GUARDIAN,
    },
  });

  const guardian3 = await prisma.guardian.create({
    data: {
      userId: guardianUser3.id,
      phoneNumber: '9988776655',
    },
  });

  // Student User & Profile
  const studentUser4 = await prisma.user.create({
    data: {
      email: 'student4@example.com',
      name: 'Sanjay Verma',
      password: hashedPassword,
      role: Role.STUDENT,
    },
  });

  const student4 = await prisma.student.create({
    data: {
      userId: studentUser4.id,
      rollNumber: 'CS104',
      enrollmentYear: 2023,
      isAtRisk: true, // Let's make this student at-risk
      mentorId: anjaliSharmaMentor.id, // Assigning to Dr. Anjali Sharma
      guardianId: guardian3.id,
    },
  });
  console.log(`Created student: Sanjay Verma`);


  // --- 4. Populate related data for Sanjay Verma ---
  
  // Attendance (poor)
  await prisma.attendanceRecord.create({
      data: { studentId: student4.id, courseSessionId: session1CS101.id, date: session1CS101.startTime, status: AttendanceStatus.ABSENT}
  })

  // Score (low)
  await prisma.scoreRecord.create({
    data: {
      studentId: student4.id,
      courseId: cs101Course.id,
      assessmentType: 'Quiz 1',
      score: 2,
      maxScore: 10,
      date: new Date('2024-08-05T09:00:00Z'),
    },
  });

  // Fee (overdue)
  await prisma.feeRecord.create({
    data: {
      studentId: student4.id,
      amount: 15000,
      dueDate: new Date('2024-08-15T09:00:00Z'),
      status: FeeStatus.OVERDUE,
    },
  });

  // Notification for the new at-risk student's mentor
  await prisma.notification.create({
    data: {
        userId: anjaliSharmaMentor.userId,
        message: "Sanjay Verma (CS104) has been flagged as a potential at-risk student due to low scores.",
        type: NotificationType.ACADEMIC_ALERT
    }
  })

  console.log(`Added academic and financial records for Sanjay Verma.`);


  // --- 5. Create another Student (Meena Iyer) and their Guardian ---
  
  // Guardian User & Profile
  const guardianUser4 = await prisma.user.create({
    data: {
      email: 'guardian4@example.com',
      name: 'Mrs. Lakshmi Iyer',
      password: hashedPassword,
      role: Role.GUARDIAN,
    },
  });

  const guardian4 = await prisma.guardian.create({
    data: {
      userId: guardianUser4.id,
      phoneNumber: '8877665544',
    },
  });

  // Student User & Profile
  const studentUser5 = await prisma.user.create({
    data: {
      email: 'student5@example.com',
      name: 'Meena Iyer',
      password: hashedPassword,
      role: Role.STUDENT,
    },
  });

  const student5 = await prisma.student.create({
    data: {
      userId: studentUser5.id,
      rollNumber: 'CS105',
      enrollmentYear: 2023,
      isAtRisk: false, // This student is doing well
      mentorId: anjaliSharmaMentor.id, // Also assigned to Dr. Anjali Sharma
      guardianId: guardian4.id,
    },
  });
  console.log(`Created student: Meena Iyer`);
  
  // --- 6. Populate related data for Meena Iyer ---

  // Attendance (good)
  await prisma.attendanceRecord.create({
      data: { studentId: student5.id, courseSessionId: session1CS101.id, date: session1CS101.startTime, status: AttendanceStatus.PRESENT}
  })

  // Score (high)
  await prisma.scoreRecord.create({
    data: {
      studentId: student5.id,
      courseId: cs101Course.id,
      assessmentType: 'Quiz 1',
      score: 10,
      maxScore: 10,
      date: new Date('2024-08-05T09:00:00Z'),
    },
  });

  // Fee (paid)
  await prisma.feeRecord.create({
    data: {
      studentId: student5.id,
      amount: 15000,
      dueDate: new Date('2024-08-15T09:00:00Z'),
      status: FeeStatus.PAID,
      paidDate: new Date()
    },
  });

  console.log(`Added academic and financial records for Meena Iyer.`);
  console.log('Finished adding new students.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });