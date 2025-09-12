'use client';

import { useState, useCallback } from 'react';
import { FaceRecognizer, AttendanceList } from '@repo/ui';
import { markAttendance } from '@/actions/attendance/actions'; // <-- This path is now cleaner and more robust
import { motion } from 'framer-motion';
import { Camera, Clock } from 'lucide-react';

// In a real app, you would fetch this from the database based on the page URL or a dropdown.
// For now, we are hardcoding a REAL ID that you get from your database.
const CURRENT_COURSE_SESSION = {
  id: 'cmfh8f1kf0001e5srjqz1nfwg', // <-- PASTE THE REAL ID HERE
  topic: 'Dummy Topic', // You can update this to match your session
};

export default function TakeAttendancePage() {
  const [presentStudents, setPresentStudents] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleFaceRecognized = useCallback((rollNumber: string) => {
    if (!isSubmitting) {
      setPresentStudents((prevSet) => {
        if (prevSet.has(rollNumber)) {
          return prevSet;
        }
        const newSet = new Set(prevSet);
        newSet.add(rollNumber);
        return newSet;
      });
    }
  }, [isSubmitting]);

  const handleSubmitAttendance = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    const result = await markAttendance(Array.from(presentStudents), CURRENT_COURSE_SESSION.id);

    if (result.error) {
      setSubmitMessage(`❌ Error: ${result.error}`);
    } else {
      setSubmitMessage(`✅ Success: ${result.success}`);
    }

    setIsSubmitting(false);
  };
  
  const handleClearList = () => {
    setPresentStudents(new Set());
    setSubmitMessage('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Real-Time Attendance</h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2">
          <Clock size={14} /> 
          <span>
            Taking attendance for: <span className="font-semibold text-blue-600">{CURRENT_COURSE_SESSION.topic}</span>
          </span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg">
           <div className="flex items-center gap-3 border-b pb-4 mb-4">
             <Camera className="text-blue-500" size={28} />
             <h2 className="text-xl font-bold text-slate-800">Recognition Feed</h2>
           </div>
           <FaceRecognizer onFaceRecognized={handleFaceRecognized} />
        </div>
        
        <AttendanceList
          presentStudents={presentStudents}
          onSubmit={handleSubmitAttendance}
          onClear={handleClearList}
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
        />
      </div>
    </motion.div>
  );
}