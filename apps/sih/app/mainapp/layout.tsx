import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import AppBar from '@repo/ui/Appbar';
import Sidebar from '@repo/ui/Sidebar';
import MobileSidebar from '@repo/ui/MobileSidebar';

// This is an async Server Component to fetch session data on the server.
export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the session data on the server to avoid a flash of unauthenticated content.
  const session = await getServerSession(authOptions);

  return (
    <div className="flex h-screen bg-slate-100">
      {/* --- Desktop Sidebar --- */}
      <div className="hidden lg:flex">
        <Sidebar session={session} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass session to both AppBars for user info and mobile toggle */}
        <AppBar session={session} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* --- Mobile Sidebar (Drawer) --- */}
      {/* This component will handle its own open/close state via a client-side store or context */}
       <MobileSidebar session={session} />
    </div>
  );
}

