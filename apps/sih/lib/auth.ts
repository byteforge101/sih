import NextAuth, { AuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@repo/prisma/client';
import bcrypt from 'bcrypt';


export const authOptions: AuthOptions = {
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            student: true,
            mentor: true,
            guardian: true,
          },
        });

        if (!user || !user.password) {
          console.log('No user found or no password');
          throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          console.log('Invalid password');
          throw new Error('Invalid credentials');
        }
        console.log('User authenticated:', user);
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
  
    async signIn({ user, account }) {
      
      if (account?.provider === 'credentials') {
        return true;
      }
      
     
      if (account?.provider === 'google') {
        if (!user.email) return false; 

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

      
        return !!existingUser;
      }

    
      return false;
    },
    
    async jwt({ token, user, profile, account }) {
      if (account) {
      
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
          include: { student: true, mentor: true, guardian: true }
        });
        
        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.role = dbUser.role;

          if (dbUser.student) {
            token.rollNumber = dbUser.student.rollNumber;
            token.enrollmentYear = dbUser.student.enrollmentYear;
          }
          if (dbUser.mentor) {
            token.department = dbUser.mentor.department as any;
          }
          if (dbUser.guardian) {
            token.phoneNumber = dbUser.guardian.phoneNumber as any;
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;

        if (token.rollNumber) session.user.rollNumber = token.rollNumber;
        if (token.enrollmentYear) session.user.enrollmentYear = token.enrollmentYear;
        if (token.department) session.user.department = token.department;
        if (token.phoneNumber) session.user.phoneNumber = token.phoneNumber;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET ,
  debug: process.env.NODE_ENV === "development",
  pages: {
    error: '/auth/error',
    signIn: '/auth',
  },

};
