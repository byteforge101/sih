import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "@repo/prisma/client";
import { updateStudentDetails } from "../../../actions/student/update-student-details.ts";

export default async function StudentDetailsPage() {
  const session = await getServerSession(authOptions);
  const student = await prisma.student.findFirst({
    where: {
      userId: session?.user?.id,
    },
    include: {
      user: true,
    },
  });

  return (
    <div className="flex justify-center items-center min-h-full p-4 bg-gradient-to-br from-blue-50 to-green-50">
      {/* Increased max-width for larger screens */}
      <div className="w-full max-w-6xl bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
        <div className="p-6 border-b border-white/30">
          <h1 className="text-2xl font-bold text-gray-800">Your Details</h1>
          <p className="mt-1 text-sm text-gray-600">
            Please fill in your details to get a predicted exam score.
          </p>
        </div>
        <form action={updateStudentDetails}>
          {/* Using a 3-column grid on large screens to prevent scrolling */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Input fields with inset feel and glossy highlights */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                defaultValue={student?.age ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                defaultValue={student?.gender ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="study_hours_per_day" className="block text-sm font-medium text-gray-700">
                Study Hours Per Day
              </label>
              <input
                id="study_hours_per_day"
                name="study_hours_per_day"
                type="number"
                defaultValue={student?.study_hours_per_day ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label htmlFor="social_media_hours" className="block text-sm font-medium text-gray-700">
                Social Media Hours
              </label>
              <input
                id="social_media_hours"
                name="social_media_hours"
                type="number"
                defaultValue={student?.social_media_hours ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label htmlFor="part_time_job" className="block text-sm font-medium text-gray-700">
                Part-time Job
              </label>
              <select
                id="part_time_job"
                name="part_time_job"
                defaultValue={student?.part_time_job ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="attendance_percentage" className="block text-sm font-medium text-gray-700">
                Attendance Percentage
              </label>
              <input
                id="attendance_percentage"
                name="attendance_percentage"
                type="number"
                defaultValue={student?.attendance_percentage ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label htmlFor="sleep_hours" className="block text-sm font-medium text-gray-700">
                Sleep Hours
              </label>
              <input
                id="sleep_hours"
                name="sleep_hours"
                type="number"
                defaultValue={student?.sleep_hours ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label htmlFor="diet_quality" className="block text-sm font-medium text-gray-700">
                Diet Quality
              </label>
              <select
                id="diet_quality"
                name="diet_quality"
                defaultValue={student?.diet_quality ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div>
              <label htmlFor="exercise_hours" className="block text-sm font-medium text-gray-700">
                Exercise Hours
              </label>
              <input
                id="exercise_hours"
                name="exercise_hours"
                type="number"
                defaultValue={student?.exercise_hours ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div className="lg:col-span-2">
              <label htmlFor="parental_education_level" className="block text-sm font-medium text-gray-700">
                Parental Education Level
              </label>
              <select
                id="parental_education_level"
                name="parental_education_level"
                defaultValue={student?.parental_education_level ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="None">None</option>
                <option value="High School">High School</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
             <div>
              <label htmlFor="mental_health" className="block text-sm font-medium text-gray-700">
                Mental Health (0-10)
              </label>
              <input
                id="mental_health"
                name="mental_health"
                type="number"
                min="0"
                max="10"
                defaultValue={student?.mental_health ?? ""}
                className="mt-1 block w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            {student?.predictedscore && (
              <div className="md:col-span-2 lg:col-span-3 p-4 bg-cyan-500/10 rounded-lg">
                <label className="block text-sm font-medium text-cyan-800">
                  Predicted Exam Score
                </label>
                <p className="text-3xl font-bold text-cyan-700 mt-1">
                  {student.predictedscore.toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end p-6 bg-white/20 border-t border-white/30">
            {/* Glossy, bubble-like button */}
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-b from-cyan-400 to-cyan-500 text-white font-bold rounded-full shadow-lg border-b-4 border-cyan-700 hover:from-cyan-500 hover:to-cyan-600 active:border-cyan-500 active:translate-y-px transition-all duration-150"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}