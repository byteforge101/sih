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
    // The main container now uses the full screen with padding
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-green-50">
      {/* A grid layout for larger screens to create two distinct panels */}
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-16">
        
        {/* Left Panel: Informational and sticky on large screens */}
        <div className="lg:col-span-2 lg:sticky lg:top-8 self-start">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Student Profile
          </h1>
          <p className="mt-4 text-gray-600">
            Welcome, <span className="font-semibold">{session?.user?.name ?? "Student"}</span>.
            Your academic success is influenced by various lifestyle factors.
            Please keep your information up-to-date to receive the most accurate exam score prediction.
          </p>

          {/* Display the predicted score here for better visibility if it exists */}
          {student?.predictedscore && (
            <div className="mt-8 rounded-2xl border-2 border-cyan-500 bg-cyan-50 p-6 shadow-lg">
              <p className="text-sm font-semibold text-cyan-800">
                PREDICTED EXAM SCORE
              </p>
              <p className="mt-2 text-5xl font-bold tracking-tight text-cyan-700">
                {student.predictedscore.toFixed(2)}
              </p>
              <p className="mt-2 text-xs text-cyan-600">
                This prediction is based on the data you provided. Keep it updated for accuracy.
              </p>
            </div>
          )}
        </div>

        {/* Right Panel: The form itself, now in a styled container */}
        <div className="lg:col-span-3">
          <form
            action={updateStudentDetails}
            className="rounded-2xl border border-white/50 bg-white/60 p-1 shadow-2xl backdrop-blur-xl"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800">Your Details</h2>
              <p className="mt-1 text-sm text-gray-600">
                Fill in your details to get a predicted exam score.
              </p>
            </div>

            {/* Form fields with a subtle border */}
            <div className="grid grid-cols-1 gap-6 border-t border-white/50 p-6 sm:grid-cols-2">
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  defaultValue={student?.age ?? ""}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={student?.gender ?? ""}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Study Hours */}
              <div>
                <label htmlFor="study_hours_per_day" className="block text-sm font-medium text-gray-700">
                  Study Hours Per Day
                </label>
                <input
                  id="study_hours_per_day"
                  name="study_hours_per_day"
                  type="number"
                  defaultValue={student?.study_hours_per_day ?? ""}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Social Media Hours */}
              <div>
                <label htmlFor="social_media_hours" className="block text-sm font-medium text-gray-700">
                  Social Media Hours
                </label>
                <input
                  id="social_media_hours"
                  name="social_media_hours"
                  type="number"
                  defaultValue={student?.social_media_hours ?? ""}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              
              {/* Part-time Job */}
              <div>
                <label htmlFor="part_time_job" className="block text-sm font-medium text-gray-700">
                  Part-time Job
                </label>
                <select
                  id="part_time_job"
                  name="part_time_job"
                  defaultValue={student?.part_time_job ?? ""}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="" disabled>Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Attendance */}
              <div>
                <label htmlFor="attendance_percentage" className="block text-sm font-medium text-gray-700">
                  Attendance Percentage
                </label>
                <input
                  id="attendance_percentage"
                  name="attendance_percentage"
                  type="number"
                  defaultValue={student?.attendance_percentage ?? ""}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Sleep Hours */}
              <div>
                <label htmlFor="sleep_hours" className="block text-sm font-medium text-gray-700">
                  Sleep Hours
                </label>
                <input
                  id="sleep_hours"
                  name="sleep_hours"
                  type="number"
                  defaultValue={student?.sleep_hours ?? ""}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Diet Quality */}
              <div>
                <label htmlFor="diet_quality" className="block text-sm font-medium text-gray-700">
                  Diet Quality
                </label>
                <select
                  id="diet_quality"
                  name="diet_quality"
                  defaultValue={student?.diet_quality ?? ""}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="" disabled>Select</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              {/* Exercise Hours */}
              <div>
                <label htmlFor="exercise_hours" className="block text-sm font-medium text-gray-700">
                  Exercise Hours
                </label>
                <input
                  id="exercise_hours"
                  name="exercise_hours"
                  type="number"
                  defaultValue={student?.exercise_hours ?? ""}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Mental Health */}
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
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Parental Education Level - spanning two columns */}
              <div className="sm:col-span-2">
                <label htmlFor="parental_education_level" className="block text-sm font-medium text-gray-700">
                  Parental Education Level
                </label>
                <select
                  id="parental_education_level"
                  name="parental_education_level"
                  defaultValue={student?.parental_education_level ?? ""}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="" disabled>Select</option>
                  <option value="None">None</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>

            {/* Form submission button */}
            <div className="flex justify-end border-t border-white/50 bg-white/20 p-6">
              <button
                type="submit"
                className="transform rounded-full border-b-4 border-cyan-700 bg-gradient-to-b from-cyan-400 to-cyan-500 px-6 py-2 font-bold text-white shadow-lg transition-all duration-150 hover:from-cyan-500 hover:to-cyan-600 active:translate-y-px active:border-cyan-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}