import { Role } from '@prisma/client';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: Role;
      rollNumber?: string;
      enrollmentYear?: number;
      department?: string;
      phoneNumber?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
      role: Role;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and sent to the `session` callback. */
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
    rollNumber?: string;
    enrollmentYear?: number;
    department?: string;
    phoneNumber?: string;
  }
}

