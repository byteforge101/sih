import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import AppBar from "@repo/ui/AppBar";
import Sidebar from "@repo/ui/Sidebar";
import MobileSidebar from "@repo/ui/MobileSidebar";
import { getStudentRewards } from "../../actions/community/actions";
import { SidebarProvider } from "@repo/ui/SidebarContext";

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
    <SidebarProvider>
      {/* --- NEW: Video Background Element --- */}
      <div className="video-background-container">
        <video autoPlay loop muted>
          {/* Make sure this path matches your video file in the public folder */}
          <source src="/videos/mainapp-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Remove the 'main-app-background' class from this div */}
      <div className="flex min-h-screen w-full">
        {/* --- Desktop Sidebar --- */}
        <div className="hidden lg:block">
          <Sidebar session={session} />
        </div>

        <div className="flex-1 flex flex-col w-full">
          <AppBar session={session} rewardPoints={rewardPoints} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>

        {/* --- Mobile Sidebar (Drawer) --- */}
        <MobileSidebar session={session} />
      </div>
    </SidebarProvider>
  );
}