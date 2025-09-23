import db from "@repo/prisma/client";

// Glass aesthetic DetailItem with subtle transparency and blur
const DetailItem = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
        <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-white">
            {value ?? <span className="text-gray-500 italic">Not Available</span>}
        </p>
    </div>
);

// Glass aesthetic SectionTitle with subtle glow
const SectionTitle = ({ title }: { title: string }) => (
    <div className="col-span-full mb-4">
        <h3 className="text-lg font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
        </h3>
        <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent"></div>
    </div>
);

export default async function MenteeDetailsPage({ params }: { params: { studentId: string } }) {
  const student = await db.student.findUnique({
    where: { id: params.studentId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!student) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
                <p className="text-rose-400 text-lg">Student not found.</p>
            </div>
        </div>
    );
  }

  return (
    // Dark gradient background for the glass effect
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 sm:p-6 lg:p-8">
        {/* Main glass container with glassmorphism effect */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl shadow-black/50 p-6 sm:p-8">
            
            {/* Header section with user info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                        {student.user.name}
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">{student.user.email}</p>
                </div>
                
                {student.isAtRisk && (
                    <div className="flex items-center space-x-3 bg-red-500/20 backdrop-blur-sm text-red-200 px-6 py-3 rounded-full border border-red-500/30 shadow-lg">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-bold tracking-wide">AT RISK</span>
                    </div>
                )}
            </div>

            {/* Predicted Score Card with glass effect */}
            {student.predictedscore != null && (
                <div className="mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-2">Predicted Score</h3>
                    <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {student.predictedscore.toFixed(2)}
                    </p>
                </div>
            )}
            
            <div className="space-y-8">
                {/* Academic Profile Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SectionTitle title="Academic Profile" />
                    <DetailItem label="Course" value={student.course} />
                    <DetailItem label="Application Mode" value={student.application_mode} />
                    <DetailItem label="Attendance" value={student.attendances} />
                    <DetailItem label="Previous Qualification" value={student.previous_qualification} />
                </section>
                
                {/* Lifestyle & Wellbeing Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SectionTitle title="Lifestyle & Wellbeing" />
                    <DetailItem label="Study Hours/Day" value={student.study_hours_per_day} />
                    <DetailItem label="Social Media Hours/Day" value={student.social_media_hours} />
                    <DetailItem label="Sleep Hours/Day" value={student.sleep_hours} />
                    <DetailItem label="Exercise Hours/Week" value={student.exercise_hours} />
                    <DetailItem label="Diet Quality" value={student.diet_quality} />
                    <DetailItem label="Mental Health Score" value={student.mental_health} />
                    <DetailItem label="Part-Time Job" value={student.part_time_job ? "Yes" : "No"} />
                    <DetailItem label="Attendance Percentage" value={student.attendance_percentage} />
                </section>

                {/* 1st Semester Performance */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <SectionTitle title="1st Semester Performance" />
                    <DetailItem label="Credited Units" value={student.curricular_units_1st_sem_credited} />
                    <DetailItem label="Enrolled Units" value={student.curricular_units_1st_sem_enrolled} />
                    <DetailItem label="Evaluations" value={student.curricular_units_1st_sem_evaluations} />
                    <DetailItem label="Approved Units" value={student.curricular_units_1st_sem_approved} />
                    <DetailItem label="Grade" value={student.curricular_units_1st_sem_grade?.toFixed(2)} />
                    <DetailItem label="Units w/o Evals" value={student.curricular_units_1st_sem_without_evaluations} />
                </section>

                {/* 2nd Semester Performance */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <SectionTitle title="2nd Semester Performance" />
                    <DetailItem label="Credited Units" value={student.curricular_units_2nd_sem_credited} />
                    <DetailItem label="Enrolled Units" value={student.curricular_units_2nd_sem_enrolled} />
                    <DetailItem label="Evaluations" value={student.curricular_units_2nd_sem_evaluations} />
                    <DetailItem label="Approved Units" value={student.curricular_units_2nd_sem_approved} />
                    <DetailItem label="Grade" value={student.curricular_units_2nd_sem_grade?.toFixed(2)} />
                    <DetailItem label="Units w/o Evals" value={student.curricular_units_2nd_sem_without_evaluations} />
                </section>
                
                {/* Personal & Financial */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SectionTitle title="Personal & Financial" />
                    <DetailItem label="Age" value={student.age} />
                    <DetailItem label="Gender" value={student.gender} />
                    <DetailItem label="Age at Enrollment" value={student.age_at_enrollment} />
                    <DetailItem label="International Student" value={student.international ? "Yes" : "No"} />
                    <DetailItem label="Scholarship Holder" value={student.scholarship_holder ? "Yes" : "No"} />
                    <DetailItem label="Debtor" value={student.debtor ? "Yes" : "No"} />
                    <DetailItem label="Tuition Fees Up To Date" value={student.tuition_fees_up_to_date ? "Yes" : "No"} />
                    <DetailItem label="Displaced" value={student.displaced ? "Yes" : "No"} />
                </section>

                {/* Family Background */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SectionTitle title="Family Background" />
                    <DetailItem label="Parental Education Level" value={student.parental_education_level} />
                    <DetailItem label="Mother's Qualification" value={student.mothers_qualification} />
                    <DetailItem label="Father's Qualification" value={student.fathers_qualification} />
                    <DetailItem label="Mother's Occupation" value={student.mothers_occupation} />
                    <DetailItem label="Father's Occupation" value={student.fathers_occupation} />
                </section>
            </div>
        </div>
    </div>
  );
}