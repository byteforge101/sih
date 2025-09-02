"use client";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
export default function SessionProviderWrapper({ children, session}: { children: React.ReactNode, session: any}) {
    
    return <SessionProvider session={session }>{children}</SessionProvider>;
}
