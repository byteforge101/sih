import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { getMeetings } from '../../../actions/meeting/meetings';
import MeetingClient from './Meetingclient';

export default async function MeetingPage() {
  const session = await getServerSession(authOptions);
  const meetings = await getMeetings();
  const userRole = (session?.user as any)?.role;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Video Meetings</h1>
      <MeetingClient meetings={meetings} userRole={userRole} />
    </div>
  );
}