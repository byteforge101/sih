import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import AppBar from "@repo/ui/AppBar";
import Sidebar from "@repo/ui/Sidebar";
import MobileSidebar from "@repo/ui/MobileSidebar";
import { getStudentRewards } from "../../actions/community/actions";
import { SidebarProvider } from "@repo/ui/SidebarContext"; // <-- 1. Import the provider

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  let rewardPoints = null;
  if ((session?.user as any)?.role === "STUDENT") {
    rewardPoints = await getStudentRewards();
  }

  return (
    // 2. Wrap the entire layout content with the SidebarProvider.
    // This makes the sidebar state available to all child components.
    <SidebarProvider>
      <div className="flex h-screen bg-slate-100">
        {/* --- Desktop Sidebar --- */}
        <div className="hidden lg:flex">
          <Sidebar session={session} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <AppBar session={session} rewardPoints={rewardPoints} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>

        {/* --- Mobile Sidebar (Drawer) --- */}
        <MobileSidebar session={session} />
      </div>
    </SidebarProvider>
  );
}
