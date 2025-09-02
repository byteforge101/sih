import { PrismaClient, Role, AttendanceStatus, FeeStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clean up existing data in the correct order to avoid foreign key constraint errors
  await prisma.reward.deleteMany();
  await prisma.studentProject.deleteMany();
  await prisma.communityProject.deleteMany();
  await prisma.communityPartner.deleteMany();
  await prisma.counselingSession.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.feeRecord.deleteMany();
  await prisma.scoreRecord.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.courseSession.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.user.deleteMany();

  // --- USER CREATION ---
  const hashedPassword = await bcrypt.hash('password123', 12);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const mentorUser1 = await prisma.user.create({
    data: {
      email: 'mentor1@example.com',
      name: 'Dr. Anjali Sharma',
      password: hashedPassword,
      role: Role.MENTOR,
    },
  });

  const mentorUser2 = await prisma.user.create({
    data: {
      email: 'mentor2@example.com',
      name: 'Prof. Vikram Singh',
      password: hashedPassword,
      role: Role.MENTOR,
    },
  });

  const guardianUser1 = await prisma.user.create({
    data: {
      email: 'guardian1@example.com',
      name: 'Mr. Ramesh Kumar',
      password: hashedPassword,
      role: Role.GUARDIAN,
    },
  });
  
  const guardianUser2 = await prisma.user.create({
    data: {
        email: 'guardian2@example.com',
        name: 'Mrs. Sunita Devi',
        password: hashedPassword,
        role: Role.GUARDIAN
    }
  })

  const studentUser1 = await prisma.user.create({
    data: {
      email: 'student1@example.com',
      name: 'Rohan Kumar',
      password: hashedPassword,
      role: Role.STUDENT,
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
        email: 'student2@example.com',
        name: 'Priya Sharma',
        password: hashedPassword,
        role: Role.STUDENT
    }
  });

  const studentUser3 = await prisma.user.create({
    data: {
        email: 'student3@example.com',
        name: 'Amit Patel',
        password: hashedPassword,
        role: Role.STUDENT
    }
  })

  // --- PROFILE CREATION ---

  const mentor1 = await prisma.mentor.create({
    data: {
      userId: mentorUser1.id,
      department: 'Computer Science',
    },
  });
  
  const mentor2 = await prisma.mentor.create({
    data: {
        userId: mentorUser2.id,
        department: 'Electronics'
    }
  })

  const guardian1 = await prisma.guardian.create({
    data: {
      userId: guardianUser1.id,
      phoneNumber: '9876543210',
    },
  });

  const guardian2 = await prisma.guardian.create({
    data: {
        userId: guardianUser2.id,
        phoneNumber: '8765432109'
    }
  })


  const student1 = await prisma.student.create({
    data: {
      userId: studentUser1.id,
      rollNumber: 'CS101',
      enrollmentYear: 2022,
      isAtRisk: true,
      mentorId: mentor1.id,
      guardianId: guardian1.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
        userId: studentUser2.id,
        rollNumber: 'EC202',
        enrollmentYear: 2021,
        isAtRisk: false,
        mentorId: mentor2.id,
        guardianId: guardian2.id
    }
  })
  
  const student3 = await prisma.student.create({
    data: {
        userId: studentUser3.id,
        rollNumber: 'CS103',
        enrollmentYear: 2022,
        isAtRisk: false,
        mentorId: mentor1.id,
        guardianId: guardian1.id
    }
  })

  // --- ACADEMIC & FINANCIAL DATA ---

  const courseCS101 = await prisma.course.create({
    data: {
      name: 'Introduction to Programming',
      courseCode: 'CS101',
      description: 'A beginner course on programming fundamentals.',
    },
  });

  const courseEC201 = await prisma.course.create({
    data: {
        name: 'Digital Circuits',
        courseCode: 'EC201',
        description: 'Learn the fundamentals of digital logic and circuits.'
    }
  })

  const session1CS101 = await prisma.courseSession.create({
    data: {
        courseId: courseCS101.id,
        topic: "Variables and Data Types",
        startTime: new Date('2024-08-01T09:00:00Z'),
        endTime: new Date('2024-08-01T10:30:00Z')
    }
  })

  const session2CS101 = await prisma.courseSession.create({
    data: {
        courseId: courseCS101.id,
        topic: 'Control Flow',
        startTime: new Date('2024-08-03T09:00:00Z'),
        endTime: new Date('2024-08-03T10:30:00Z')
    }
  })

  // --- RECORDS FOR STUDENT 1 (AT-RISK) ---
  
  await prisma.attendanceRecord.createMany({
    data: [
        { studentId: student1.id, courseSessionId: session1CS101.id, date: new Date('2024-08-01T09:00:00Z'), status: AttendanceStatus.ABSENT},
        { studentId: student1.id, courseSessionId: session2CS101.id, date: new Date('2024-08-03T09:00:00Z'), status: AttendanceStatus.LATE},
    ]
  })

  await prisma.scoreRecord.create({
    data: {
        studentId: student1.id,
        courseId: courseCS101.id,
        assessmentType: 'Quiz 1',
        score: 3,
        maxScore: 10,
        date: new Date('2024-08-05T09:00:00Z')
    }
  })

  await prisma.feeRecord.create({
    data: {
        studentId: student1.id,
        amount: 15000,
        dueDate: new Date('2024-07-31T09:00:00Z'),
        status: FeeStatus.OVERDUE
    }
  })
  
  // --- RECORDS FOR STUDENT 2 & 3 (NOT AT-RISK) ---
  await prisma.attendanceRecord.createMany({
    data: [
        { studentId: student2.id, courseSessionId: session1CS101.id, date: new Date('2024-08-01T09:00:00Z'), status: AttendanceStatus.PRESENT},
        { studentId: student3.id, courseSessionId: session1CS101.id, date: new Date('2024-08-01T09:00:00Z'), status: AttendanceStatus.PRESENT},
    ]
  })
  
  await prisma.scoreRecord.createMany({
    data: [
        {studentId: student2.id, courseId: courseEC201.id, assessmentType: 'Lab Exam', score: 85, maxScore: 100, date: new Date()},
        {studentId: student3.id, courseId: courseCS101.id, assessmentType: 'Quiz 1', score: 9, maxScore: 10, date: new Date('2024-08-05T09:00:00Z')}
    ]
  })
  
  await prisma.feeRecord.createMany({
    data: [
        {studentId: student2.id, amount: 20000, dueDate: new Date(), status: FeeStatus.PAID, paidDate: new Date()},
        {studentId: student3.id, amount: 15000, dueDate: new Date(), status: FeeStatus.DUE}
    ]
  })


  // --- COMMUNICATION & SUPPORT ---

  await prisma.counselingSession.create({
    data: {
        studentId: student1.id,
        mentorId: mentor1.id,
        date: new Date(),
        notes: 'Initial session to discuss attendance and recent quiz score. Student seems disengaged. Plan to follow up next week.'
    }
  })

  await prisma.notification.createMany({
    data: [
        { userId: studentUser1.id, message: "You have an upcoming fee payment due.", type: NotificationType.FEE_REMINDER},
        { userId: mentorUser1.id, message: `A counseling session with Rohan Kumar is scheduled for tomorrow.`, type: NotificationType.COUNSELING_SESSION},
        { userId: guardianUser1.id, message: "Rohan's attendance has dropped below 75%.", type: NotificationType.ACADEMIC_ALERT}
    ]
  })

  // --- COMMUNITY ENGAGEMENT ---

  const communityPartner = await prisma.communityPartner.create({
    data: {
        name: "Green Earth Foundation",
        type: "NGO"
    }
  })

  const communityProject = await prisma.communityProject.create({
    data: {
        title: "Tree Plantation Drive",
        description: "A local initiative to increase green cover in the city.",
        status: "Active",
        partnerId: communityPartner.id,
    }
  })

  const studentProject = await prisma.studentProject.create({
    data: {
        studentId: student2.id,
        communityProjectId: communityProject.id,
        role: "Volunteer Coordinator",
        contributionNotes: "Organized a team of 20 volunteers for the drive."
    }
  })

  await prisma.reward.create({
    data: {
        studentId: student2.id,
        communityProjectId: communityProject.id,
        description: "Eco-Warrior Certificate",
        amount: 500,
        dateAwarded: new Date()
    }
  })

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });