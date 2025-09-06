import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import AppBar from '@repo/ui/Appbar';
import Sidebar from '@repo/ui/Sidebar';
import MobileSidebar from '@repo/ui/MobileSidebar';
import { getStudentRewards } from '../../actions/community/actions';

// This is an async Server Component to fetch session data on the server.
export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the session data on the server to avoid a flash of unauthenticated content.
  const session = await getServerSession(authOptions);
  
  let rewardPoints = null;
  if ((session?.user as any)?.role === 'STUDENT') {
    rewardPoints = await getStudentRewards();
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* --- Desktop Sidebar --- */}
      <div className="hidden lg:flex">
        <Sidebar session={session} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pass session and rewardPoints to the AppBar */}
        <AppBar session={session} rewardPoints={rewardPoints} />
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