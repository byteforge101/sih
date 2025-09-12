'use client';

import { Button } from './Button';

interface AttendanceListProps {
  presentStudents: Set<string>;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitMessage: string;
}

export const AttendanceList = ({
  presentStudents,
  onSubmit,
  isSubmitting,
  submitMessage,
}: AttendanceListProps) => {
  return (
    <div className="w-full lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        Attendance ({presentStudents.size})
      </h2>
      <div className="space-y-2 h-64 overflow-y-auto mb-4">
        {Array.from(presentStudents).sort().map(rollNumber => (
          <div key={rollNumber} className="bg-green-100 text-green-800 p-2 rounded-md font-mono">
            {rollNumber}
          </div>
        ))}
        {presentStudents.size === 0 && <p className="text-gray-500">No students recognized yet...</p>}
      </div>
      <Button onClick={onSubmit} disabled={isSubmitting || presentStudents.size === 0} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
      </Button>
      {submitMessage && <p className="mt-4 text-center font-semibold">{submitMessage}</p>}
    </div>
  );
};