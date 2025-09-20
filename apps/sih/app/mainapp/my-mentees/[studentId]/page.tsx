import db from "@repo/prisma/client";

// A helper component for displaying each piece of data
const DetailItem = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">
            {value ?? <span className="text-gray-400 italic">Not Available</span>}
        </p>
    </div>
);

// A helper for section titles - Updated with new color
const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-xl font-bold text-gray-900 border-b-2 border-cyan-200 pb-2 mb-6 col-span-full">{title}</h3>
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
    return <div className="p-8 text-center text-red-500">Student not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
            {/* --- Header --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">{student.user.name}</h1>
                    <p className="text-md text-gray-500 mt-1">{student.user.email}</p>
                </div>
                {student.isAtRisk && (
                     <div className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-bold">AT RISK</span>
                    </div>
                )}
            </div>

            {/* --- Predicted Score Card - Updated with new gradient --- */}
            {student.predictedscore != null && (
                 <div className="mb-8 bg-gradient-to-r from-cyan-400 to-emerald-500 p-6 rounded-lg shadow-lg shadow-cyan-500/30 text-white">
                    <h3 className="text-xl font-bold">Predicted Score</h3>
                    <p className="text-4xl font-extrabold">{student.predictedscore.toFixed(2)}</p>
                 </div>
            )}
            
            {/* --- Main Details Grid --- */}
            <div className="space-y-10">
                {/* Academic Profile */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                    <SectionTitle title="Academic Profile" />
                    <DetailItem label="Course" value={student.course} />
                    <DetailItem label="Application Mode" value={student.application_mode} />
                    <DetailItem label="Attendance" value={student.attendances} />
                    <DetailItem label="Previous Qualification" value={student.previous_qualification} />
                </section>
                
                {/* Lifestyle & Wellbeing */}
                 <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                    <SectionTitle title="Lifestyle & Wellbeing" />
                    <DetailItem label="Study Hours/Day" value={student.study_hours_per_day} />
                    <DetailItem label="Social Media Hours/Day" value={student.social_media_hours} />
                    <DetailItem label="Sleep Hours/Day" value={student.sleep_hours} />
                    <DetailItem label="Exercise Hours/Week" value={student.exercise_hours} />
                    <DetailItem label="Diet Quality" value={student.diet_quality} />
                    <DetailItem label="Mental Health Score" value={student.mental_health} />
                    <DetailItem label="Part-Time Job" value={student.part_time_job} />
                    <DetailItem label="Attendance Percentage" value={student.attendance_percentage} />
                </section>

                {/* Semester 1 Performance */}
                <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-6">
                     <SectionTitle title="1st Semester Performance" />
                     <DetailItem label="Credited Units" value={student.curricular_units_1st_sem_credited} />
                     <DetailItem label="Enrolled Units" value={student.curricular_units_1st_sem_enrolled} />
                     <DetailItem label="Evaluations" value={student.curricular_units_1st_sem_evaluations} />
                     <DetailItem label="Approved Units" value={student.curricular_units_1st_sem_approved} />
                     <DetailItem label="Grade" value={student.curricular_units_1st_sem_grade?.toFixed(2)} />
                     <DetailItem label="Units w/o Evals" value={student.curricular_units_1st_sem_without_evaluations} />
                </section>

                {/* Semester 2 Performance */}
                 <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-6">
                     <SectionTitle title="2nd Semester Performance" />
                     <DetailItem label="Credited Units" value={student.curricular_units_2nd_sem_credited} />
                     <DetailItem label="Enrolled Units" value={student.curricular_units_2nd_sem_enrolled} />
                     <DetailItem label="Evaluations" value={student.curricular_units_2nd_sem_evaluations} />
                     <DetailItem label="Approved Units" value={student.curricular_units_2nd_sem_approved} />
                     <DetailItem label="Grade" value={student.curricular_units_2nd_sem_grade?.toFixed(2)} />
                     <DetailItem label="Units w/o Evals" value={student.curricular_units_2nd_sem_without_evaluations} />
                </section>
                
                {/* Personal & Financial */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                    <SectionTitle title="Personal & Financial" />
                    <DetailItem label="Age" value={student.age} />
                    <DetailItem label="Gender" value={student.gender} />
                    <DetailItem label="Age at Enrollment" value={student.age_at_enrollment} />
                    <DetailItem label="International Student" value={student.international} />
                    <DetailItem label="Scholarship Holder" value={student.scholarship_holder} />
                    <DetailItem label="Debtor" value={student.debtor} />
                    <DetailItem label="Tuition Fees Up To Date" value={student.tuition_fees_up_to_date} />
                    <DetailItem label="Displaced" value={student.displaced} />
                </section>

                {/* Family Background */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
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