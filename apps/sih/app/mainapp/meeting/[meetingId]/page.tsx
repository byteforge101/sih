'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MeetingRoom from '../Meeting';
import { useEffect, useState } from 'react';

export default function MeetingInstancePage() {
    const params = useParams();
    const { data: session, status } = useSession();
    const meetingId = params.meetingId as string;
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user) {
            setUserRole((session.user as any).role);
        }
    }, [session]);

    if (status === 'loading' || !userRole) {
        return <div className="p-8 text-center">Loading meeting...</div>;
    }

    return <MeetingRoom meetingId={meetingId} userRole={userRole} />;
}