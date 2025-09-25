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
    // Transparent outer container with no solid background
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8">
      {/* Ultra-modern grid layout with enhanced spacing */}
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-20">
        
        {/* Left Panel: Stunning glass information panel */}
        <div className="lg:col-span-2 lg:sticky lg:top-8 self-start">
          <div className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8 hover:shadow-3xl hover:shadow-black/40 transition-all duration-700">
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-gray-50 to-gray-200 bg-clip-text text-transparent drop-shadow-lg mb-6">
              Student Profile
            </h1>
            <p className="text-gray-200 text-lg leading-relaxed font-medium">
              Welcome, <span className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{session?.user?.name ?? "Student"}</span>.
              Your academic success is influenced by various lifestyle factors.
              Please keep your information up-to-date to receive the most accurate exam score prediction.
            </p>

            {/* Stunning predicted score card */}
            {student?.predictedscore && (
              <div className="mt-10 bg-gradient-to-br from-cyan-500/15 via-blue-500/15 to-purple-500/15 backdrop-blur-lg rounded-3xl border border-white/25 shadow-2xl p-8 hover:shadow-3xl hover:shadow-cyan-500/10 transition-all duration-500 group">
                <p className="text-sm font-bold text-cyan-200 uppercase tracking-wide mb-3 group-hover:text-cyan-100 transition-colors duration-300">
                  PREDICTED EXAM SCORE
                </p>
                <p className="text-7xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg mb-4">
                  {student.predictedscore.toFixed(2)}
                </p>
                <p className="text-sm text-cyan-200/80 font-medium leading-relaxed">
                  This prediction is based on the data you provided. Keep it updated for accuracy.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Ultra-modern glass form */}
        <div className="lg:col-span-3">
          <form
            action={updateStudentDetails}
            className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 overflow-hidden hover:shadow-3xl hover:shadow-black/40 transition-all duration-700"
          >
            {/* Form header with glass effect */}
            <div className="bg-white/5 backdrop-blur-sm border-b border-white/20 p-8">
              <h2 className="text-3xl font-black text-white mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Your Details
              </h2>
              <p className="text-gray-300 text-lg font-medium">
                Fill in your details to get a predicted exam score.
              </p>
            </div>

            {/* Form fields in gorgeous glass containers */}
            <div className="p-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                
                {/* Age */}
                <div className="group">
                  <label htmlFor="age" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    defaultValue={student?.age ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  />
                </div>

                {/* Gender */}
                <div className="group">
                  <label htmlFor="gender" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    defaultValue={student?.gender ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <option value="" disabled className="bg-gray-800">Select gender</option>
                    <option value="Male" className="bg-gray-800">Male</option>
                    <option value="Female" className="bg-gray-800">Female</option>
                  </select>
                </div>

                {/* Study Hours */}
                <div className="group">
                  <label htmlFor="study_hours_per_day" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Study Hours Per Day
                  </label>
                  <input
                    id="study_hours_per_day"
                    name="study_hours_per_day"
                    type="number"
                    defaultValue={student?.study_hours_per_day ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  />
                </div>

                {/* Social Media Hours */}
                <div className="group">
                  <label htmlFor="social_media_hours" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Social Media Hours
                  </label>
                  <input
                    id="social_media_hours"
                    name="social_media_hours"
                    type="number"
                    defaultValue={student?.social_media_hours ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  />
                </div>
                
                {/* Part-time Job */}
                <div className="group">
                  <label htmlFor="part_time_job" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Part-time Job
                  </label>
                  <select
                    id="part_time_job"
                    name="part_time_job"
                    defaultValue={student?.part_time_job ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <option value="" disabled className="bg-gray-800">Select</option>
                    <option value="Yes" className="bg-gray-800">Yes</option>
                    <option value="No" className="bg-gray-800">No</option>
                  </select>
                </div>

                {/* Attendance */}
                <div className="group">
                  <label htmlFor="attendance_percentage" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Attendance Percentage
                  </label>
                  <input
                    id="attendance_percentage"
                    name="attendance_percentage"
                    type="number"
                    defaultValue={student?.attendance_percentage ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  />
                </div>

                {/* Sleep Hours */}
                <div className="group">
                  <label htmlFor="sleep_hours" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Sleep Hours
                  </label>
                  <input
                    id="sleep_hours"
                    name="sleep_hours"
                    type="number"
                    defaultValue={student?.sleep_hours ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  />
                </div>

                {/* Diet Quality */}
                <div className="group">
                  <label htmlFor="diet_quality" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Diet Quality
                  </label>
                  <select
                    id="diet_quality"
                    name="diet_quality"
                    defaultValue={student?.diet_quality ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <option value="" disabled className="bg-gray-800">Select</option>
                    <option value="Good" className="bg-gray-800">Good</option>
                    <option value="Fair" className="bg-gray-800">Fair</option>
                    <option value="Poor" className="bg-gray-800">Poor</option>
                  </select>
                </div>

                {/* Exercise Hours */}
                <div className="group">
                  <label htmlFor="exercise_hours" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Exercise Hours
                  </label>
                  <input
                    id="exercise_hours"
                    name="exercise_hours"
                    type="number"
                    defaultValue={student?.exercise_hours ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  />
                </div>

                {/* Mental Health */}
                <div className="group">
                  <label htmlFor="mental_health" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Mental Health (0-10)
                  </label>
                  <input
                    id="mental_health"
                    name="mental_health"
                    type="number"
                    min="0"
                    max="10"
                    defaultValue={student?.mental_health ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  />
                </div>

                {/* Parental Education Level - spanning two columns */}
                <div className="sm:col-span-2 group">
                  <label htmlFor="parental_education_level" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    Parental Education Level
                  </label>
                  <select
                    id="parental_education_level"
                    name="parental_education_level"
                    defaultValue={student?.parental_education_level ?? ""}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <option value="" disabled className="bg-gray-800">Select</option>
                    <option value="None" className="bg-gray-800">None</option>
                    <option value="High School" className="bg-gray-800">High School</option>
                    <option value="Bachelor" className="bg-gray-800">Bachelor</option>
                    <option value="Master" className="bg-gray-800">Master</option>
                    <option value="PhD" className="bg-gray-800">PhD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stunning submit button section */}
            <div className="bg-white/5 backdrop-blur-sm border-t border-white/20 p-8 flex justify-end">
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-white/20 to-gray-200/20 backdrop-blur-lg text-white font-bold rounded-2xl border border-white/30 shadow-2xl hover:from-white/30 hover:to-gray-200/30 hover:shadow-3xl hover:shadow-white/10 hover:border-white/50 hover:scale-105 transition-all duration-500 uppercase tracking-wide text-sm"
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