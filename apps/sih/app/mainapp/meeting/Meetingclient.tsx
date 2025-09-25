'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMeeting } from '../../../actions/meeting/meetings';

export default function MeetingClient({ meetings, userRole }: { meetings: any[]; userRole: string }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const router = useRouter();

  const handleCreateMeeting = async () => {
    if (!title || !startTime) {
      alert('Please provide a title and start time.');
      return;
    }
    await createMeeting(title, new Date(startTime));
    setTitle('');
    setStartTime('');
  };

  return (
    <div>
      {userRole === 'MENTOR' && (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Schedule a New Meeting</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Meeting Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-grow border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleCreateMeeting}
              className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg shadow hover:bg-blue-800 transition"
            >
              Create Meeting
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Meetings</h2>
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{meeting.title}</h3>
                <p className="text-sm text-slate-500">
                  Scheduled for: {new Date(meeting.startTime).toLocaleString()} by {meeting.mentor.user.name}
                </p>
              </div>
              <button
                onClick={() => router.push(`/mainapp/meeting/${meeting.id}`)}
                className="px-5 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition"
              >
                {userRole === 'MENTOR' ? 'Start Meeting' : 'Join Meeting'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}