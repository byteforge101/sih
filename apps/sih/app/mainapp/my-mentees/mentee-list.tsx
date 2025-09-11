"use client";

import { useState } from "react";
import { Prisma } from "@prisma/client";

// Define a detailed type for the mentee data, including the user relation.
type MenteeWithUser = Prisma.StudentGetPayload<{
  include: { user: true };
}>;

// A helper component to render key-value pairs in the modal.
function DetailItem({ label, value, isAtRisk }: { label: string; value: string | number | null | undefined; isAtRisk?: boolean }) {
  const valueClass = isAtRisk ? 'text-red-600 font-bold' : 'text-gray-800';
  return (
    <div className="p-2 rounded-lg bg-white/30">
      <p className="font-semibold text-gray-600">{label}</p>
      <p className={valueClass}>{value ?? 'Not provided'}</p>
    </div>
  );
}

export function MenteeList({ mentees }: { mentees: MenteeWithUser[] }) {
  const [selectedStudent, setSelectedStudent] = useState<MenteeWithUser | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mentees.map((student) => (
          <div
            key={student.id}
            className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-5 transition-transform hover:scale-105"
          >
            {student.isAtRisk && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                At Risk
              </span>
            )}
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-bold text-gray-800">{student.user.name}</h2>
              <p className="text-sm text-gray-600">Roll: {student.rollNumber}</p>
              <div className="mt-auto pt-4">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="w-full px-6 py-2 bg-gradient-to-b from-cyan-400 to-cyan-500 text-white font-bold rounded-full shadow-lg border-b-4 border-cyan-700 hover:from-cyan-500 hover:to-cyan-600 active:border-cyan-500 active:translate-y-px transition-all duration-150"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mentees.length === 0 && (
        <div className="text-center py-12 col-span-full">
          <p className="text-gray-500">You have not been assigned any mentees yet.</p>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="p-5 border-b border-white/40">
              <h2 className="text-2xl font-bold text-gray-800">{selectedStudent.user.name}'s Details</h2>
              <p className="text-sm text-gray-600">A complete overview of the student's record.</p>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                <DetailItem label="Email" value={selectedStudent.user.email} />
                <DetailItem label="Roll Number" value={selectedStudent.rollNumber} />
                <DetailItem label="Age" value={selectedStudent.age} />
                <DetailItem label="Gender" value={selectedStudent.gender} />
                <DetailItem label="Attendance" value={`${selectedStudent.attendance_percentage}%`} />
                <DetailItem label="Predicted Score" value={selectedStudent.predictedscore?.toFixed(2) ?? 'N/A'} isAtRisk={selectedStudent.isAtRisk} />
                <DetailItem label="Study Hours/Day" value={selectedStudent.study_hours_per_day} />
                <DetailItem label="Social Media Hours" value={selectedStudent.social_media_hours} />
                <DetailItem label="Sleep Hours" value={selectedStudent.sleep_hours} />
                <DetailItem label="Exercise Hours" value={selectedStudent.exercise_hours} />
                <DetailItem label="Diet Quality" value={selectedStudent.diet_quality} />
                <DetailItem label="Part-time Job" value={selectedStudent.part_time_job} />
                <DetailItem label="Parental Education" value={selectedStudent.parental_education_level} />
                <DetailItem label="Mental Health Score" value={`${selectedStudent.mental_health}/10`} />
              </div>
            </div>
            <div className="flex justify-end p-4 bg-white/30 border-t border-white/40">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-full shadow-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}