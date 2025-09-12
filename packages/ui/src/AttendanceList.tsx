'use client';

import { Button } from './Button';
import { ClipboardList, X } from 'lucide-react';

interface AttendanceListProps {
  presentStudents: Set<string>;
  onSubmit: () => void;
  onClear: () => void;
  isSubmitting: boolean;
  submitMessage: string;
}

export const AttendanceList = ({
  presentStudents,
  onSubmit,
  onClear,
  isSubmitting,
  submitMessage,
}: AttendanceListProps) => {
  const messageIsError = submitMessage.startsWith('❌');
  
  return (
    <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-lg flex flex-col">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-blue-500" size={28} />
          <h2 className="text-xl font-bold text-slate-800">
            Attendance
          </h2>
        </div>
        <span className="bg-blue-100 text-blue-700 font-bold text-lg rounded-full h-8 w-8 flex items-center justify-center">
          {presentStudents.size}
        </span>
      </div>
      
      <div className="flex-1 space-y-2 overflow-y-auto mb-4 pr-2">
        {Array.from(presentStudents).sort().map(rollNumber => (
          <div key={rollNumber} className="bg-slate-50 border border-slate-200 text-slate-700 p-3 rounded-lg font-mono text-sm shadow-sm">
            {rollNumber}
          </div>
        ))}
        {presentStudents.size === 0 && <p className="text-slate-500 text-center mt-8">No students recognized yet...</p>}
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex gap-2">
          {/* --- THIS IS THE CORRECTED BUTTON STYLE --- */}
          <Button 
            onClick={onClear} 
            disabled={isSubmitting || presentStudents.size === 0} 
            className="w-1/2 bg-red-600 text-blue-600 font-semibold border border-blue-500 hover:bg-red-700"
          >
             <X size={16} className="mr-1"/> Clear List
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting || presentStudents.size === 0} className="w-1/2 bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
          </Button>
        </div>
        {submitMessage && (
          <p className={`text-center font-semibold p-2 rounded-md ${
            messageIsError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {submitMessage}
          </p>
        )}
      </div>
    </div>
  );
};