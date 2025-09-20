import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import SessionProviderWrapper from "./Sessionprovider";
import { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learnova",
  description: "Student Attendance and Engagement System",
};

export default async function RootLayout({
  children,
  session,

  
}: {
  children: React.ReactNode;
  session: any;
}) {
  
  return (
    <html lang="en">
      <body className={geist.className} suppressHydrationWarning>
        <SessionProviderWrapper session={session}>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
