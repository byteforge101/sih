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
    <div className="p-4 sm:p-6 lg:p-8">
      {userRole === 'MENTOR' && (
        <div className="mb-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl shadow-black/20 p-6">
          <h2 className="text-2xl font-bold mb-6 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Schedule a New Meeting
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Meeting Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-grow bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
            />
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
            />
            <button
              onClick={handleCreateMeeting}
              className="px-6 py-3 bg-gradient-to-r from-white/20 to-gray-200/20 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/30 shadow-lg hover:from-white/30 hover:to-gray-200/30 hover:shadow-xl hover:shadow-white/20 hover:border-white/50 transition-all duration-300"
            >
              Create Meeting
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl shadow-black/20 p-6">
        <h2 className="text-2xl font-bold mb-6 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Upcoming Meetings
        </h2>
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div 
              key={meeting.id} 
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-white mb-1">{meeting.title}</h3>
                <p className="text-sm text-gray-300">
                  Scheduled for: {new Date(meeting.startTime).toLocaleString()} by {meeting.mentor.user.name}
                </p>
              </div>
              <button
                onClick={() => router.push(`/mainapp/meeting/${meeting.id}`)}
                className="px-6 py-3 bg-white/15 backdrop-blur-lg text-white font-bold rounded-2xl border border-white/25 shadow-2xl hover:bg-white/20 hover:shadow-3xl hover:shadow-white/10 hover:border-white/40 hover:scale-[1.02] transition-all duration-500 whitespace-nowrap group"
              >
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-gray-100 group-hover:to-white transition-all duration-300">
                  {userRole === 'MENTOR' ? 'Start Meeting' : 'Join Meeting'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}