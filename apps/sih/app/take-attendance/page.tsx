'use client';

import { useState, useCallback } from 'react';
import { FaceRecognizer, AttendanceList } from '@repo/ui';
import { markAttendance } from '../../actions/attendance/actions';

export default function TakeAttendancePage() {
  // A Set is used to automatically handle duplicate entries
  const [presentStudents, setPresentStudents] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // This callback is passed to the FaceRecognizer component.
  // It adds newly recognized students to our list.
  const handleFaceRecognized = useCallback((rollNumber: string) => {
    setPresentStudents((prevSet) => {
      // Create a new Set to trigger a state update in React
      const newSet = new Set(prevSet);
      newSet.add(rollNumber);
      return newSet;
    });
  }, []);

  // This function is called when the "Submit" button is clicked.
  const handleSubmitAttendance = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    // For this demo, we'll use a hardcoded courseSessionId.
    // In a real app, this would come from a dropdown or the page's context.
    const courseSessionId = 'clz0q1r2p000108l41234abcd'; // <-- REPLACE WITH A REAL ID

    const result = await markAttendance(Array.from(presentStudents), courseSessionId);

    if (result.error) {
      setSubmitMessage(`❌ Error: ${result.error}`);
    } else {
      setSubmitMessage(`✅ Success: ${result.success}`);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <FaceRecognizer onFaceRecognized={handleFaceRecognized} />
      </div>
      <AttendanceList
        presentStudents={presentStudents}
        onSubmit={handleSubmitAttendance}
        isSubmitting={isSubmitting}
        submitMessage={submitMessage}
      />
    </div>
  );
}