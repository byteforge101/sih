import NextAuth, { AuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
          throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    /**
     * This callback is used to control if a user is allowed to sign in.
     */
    async signIn({ user, account }) {
      // Allow sign in for credentials provider
      if (account?.provider === 'credentials') {
        return true;
      }
      
      // For Google provider, check if the email exists in the database
      if (account?.provider === 'google') {
        if (!user.email) return false; // Should not happen with Google

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If user exists, allow sign in. If not, prevent it.
        return !!existingUser;
      }

      // Deny by default for any other providers
      return false;
    },
    
    async jwt({ token, user, account }) {
      if (account && user) {
        // On initial sign-in (for any provider), fetch the complete user profile
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };