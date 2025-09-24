import db from "@repo/prisma/client";

// Ultra-modern glass DetailItem with enhanced aesthetics
const DetailItem = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div className="bg-white/8 backdrop-blur-lg rounded-2xl p-4 border border-white/15 hover:bg-white/12 hover:border-white/25 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-white/5 group hover:scale-[1.02]">
        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide group-hover:text-gray-300 transition-colors duration-300">{label}</p>
        <p className="text-base font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
            {value ?? <span className="text-gray-500 italic font-medium">Not Available</span>}
        </p>
    </div>
);

// Ultra-modern glass SectionTitle with enhanced visual impact
const SectionTitle = ({ title }: { title: string }) => (
    <div className="col-span-full mb-6">
        <div className="relative">
            <h3 className="text-2xl font-black text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-sm">
                {title}
            </h3>
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-white/30 via-white/60 to-white/30 rounded-full"></div>
            <div className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
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
        <div className="p-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
                <p className="text-rose-400 text-lg">Student not found.</p>
            </div>
        </div>
    );
  }

  return (
    // Transparent outer container
    <div className="p-4 sm:p-6 lg:p-8">
        {/* Ultra-modern main glass container */}
        <div className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8 sm:p-10 hover:shadow-3xl hover:shadow-black/40 transition-all duration-700">
            
            {/* Enhanced header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-white via-gray-50 to-gray-200 bg-clip-text text-transparent drop-shadow-lg">
                        {student.user.name}
                    </h1>
                    <p className="text-gray-300 text-base font-medium tracking-wide">{student.user.email}</p>
                </div>
                
                {student.isAtRisk && (
                    <div className="flex items-center space-x-3 bg-red-500/15 backdrop-blur-lg text-red-200 px-8 py-4 rounded-full border border-red-500/25 shadow-2xl shadow-red-500/10 hover:bg-red-500/20 transition-all duration-300">
                        <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-lg"></span>
                        </span>
                        <span className="text-base font-black tracking-wider">AT RISK</span>
                    </div>
                )}
            </div>

            {/* Enhanced Predicted Score Card */}
            {student.predictedscore != null && (
                <div className="mb-10 bg-gradient-to-br from-blue-500/15 via-purple-500/15 to-indigo-500/15 backdrop-blur-lg p-8 rounded-3xl border border-white/25 shadow-2xl hover:shadow-3xl hover:shadow-blue-500/10 transition-all duration-500 group">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">Predicted Score</h3>
                    <p className="text-6xl font-black bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-lg">
                        {student.predictedscore.toFixed(2)}
                    </p>
                </div>
            )}
            
            <div className="space-y-12">
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