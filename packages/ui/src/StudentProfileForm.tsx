// packages/ui/src/StudentProfileForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
    application_mode: z.string().min(1, "This field is required"),
    course: z.string().min(1, "This field is required"),
    attendances: z.string().min(1, "This field is required"),
    previous_qualification: z.string().min(1, "This field is required"),
    mothers_qualification: z.string().min(1, "This field is required"),
    fathers_qualification: z.string().min(1, "This field is required"),
    mothers_occupation: z.string().min(1, "This field is required"),
    fathers_occupation: z.string().min(1, "This field is required"),
    displaced: z.string().min(1, "This field is required"),
    debtor: z.string().min(1, "This field is required"),
    tuition_fees_up_to_date: z.string().min(1, "This field is required"),
    gender: z.string().min(1, "This field is required"),
    scholarship_holder: z.string().min(1, "This field is required"),
    age_at_enrollment: z.number().int().positive("Age must be a positive number"),
    international: z.string().min(1, "This field is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface StudentProfileFormProps {
    applicationModes: string[];
    courses: string[];
    attendanceRegimes: string[];
    previousQualifications: string[];
    parentQualifications: string[];
    parentOccupations: string[];
    genders: string[];
    yesNoOptions: string[];
    updateAction: (data: ProfileFormValues) => Promise<any>;
}

export function StudentProfileForm({
    applicationModes,
    courses,
    attendanceRegimes,
    previousQualifications,
    parentQualifications,
    parentOccupations,
    genders,
    yesNoOptions,
    updateAction,
}: StudentProfileFormProps) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    const onSubmit = async (data: ProfileFormValues) => {
        const result = await updateAction(data);
        if (result.success) {
            alert(result.message);
            router.push("/mainapp/dashboard");
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    // Reusable styles for form elements
    const inputStyle = "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm";
    const labelStyle = "block text-sm font-medium text-gray-600";
    const sectionTitleStyle = "text-lg font-semibold text-gray-800 border-b pb-2 mb-6";
    const errorStyle = "mt-2 text-sm text-red-600";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 p-8 bg-gray-50 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Complete Your Profile</h2>

            {/* Academic Information Section */}
            <fieldset className="space-y-6">
                <legend className={sectionTitleStyle}>Academic Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="application_mode" className={labelStyle}>Application Mode</label>
                        <select id="application_mode" {...register("application_mode")} className={inputStyle}>
                            <option value="">Select an option</option>
                            {applicationModes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                        </select>
                        {errors.application_mode && <p className={errorStyle}>{errors.application_mode.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="course" className={labelStyle}>Course</label>
                        <select id="course" {...register("course")} className={inputStyle}>
                            <option value="">Select a course</option>
                            {courses.map(course => <option key={course} value={course}>{course}</option>)}
                        </select>
                        {errors.course && <p className={errorStyle}>{errors.course.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="attendances" className={labelStyle}>Attendance</label>
                        <select id="attendances" {...register("attendances")} className={inputStyle}>
                             <option value="">Select attendance type</option>
                            {attendanceRegimes.map(regime => <option key={regime} value={regime}>{regime}</option>)}
                        </select>
                        {errors.attendances && <p className={errorStyle}>{errors.attendances.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="previous_qualification" className={labelStyle}>Previous Qualification</label>
                        <select id="previous_qualification" {...register("previous_qualification")} className={inputStyle}>
                            <option value="">Select a qualification</option>
                            {previousQualifications.map(qual => <option key={qual} value={qual}>{qual}</option>)}
                        </select>
                        {errors.previous_qualification && <p className={errorStyle}>{errors.previous_qualification.message}</p>}
                    </div>
                </div>
            </fieldset>

            {/* Family Information Section */}
            <fieldset className="space-y-6">
                <legend className={sectionTitleStyle}>Family Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="mothers_qualification" className={labelStyle}>Mother's Qualification</label>
                        <select id="mothers_qualification" {...register("mothers_qualification")} className={inputStyle}>
                            <option value="">Select a qualification</option>
                            {parentQualifications.map(qual => <option key={qual} value={qual}>{qual}</option>)}
                        </select>
                        {errors.mothers_qualification && <p className={errorStyle}>{errors.mothers_qualification.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="fathers_qualification" className={labelStyle}>Father's Qualification</label>
                        <select id="fathers_qualification" {...register("fathers_qualification")} className={inputStyle}>
                             <option value="">Select a qualification</option>
                            {parentQualifications.map(qual => <option key={qual} value={qual}>{qual}</option>)}
                        </select>
                        {errors.fathers_qualification && <p className={errorStyle}>{errors.fathers_qualification.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="mothers_occupation" className={labelStyle}>Mother's Occupation</label>
                        <select id="mothers_occupation" {...register("mothers_occupation")} className={inputStyle}>
                            <option value="">Select an occupation</option>
                            {parentOccupations.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                        </select>
                        {errors.mothers_occupation && <p className={errorStyle}>{errors.mothers_occupation.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="fathers_occupation" className={labelStyle}>Father's Occupation</label>
                        <select id="fathers_occupation" {...register("fathers_occupation")} className={inputStyle}>
                            <option value="">Select an occupation</option>
                            {parentOccupations.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                        </select>
                        {errors.fathers_occupation && <p className={errorStyle}>{errors.fathers_occupation.message}</p>}
                    </div>
                </div>
            </fieldset>

            {/* Additional Information Section */}
            <fieldset className="space-y-6">
                <legend className={sectionTitleStyle}>Additional Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="gender" className={labelStyle}>Gender</label>
                        <select id="gender" {...register("gender")} className={inputStyle}>
                            <option value="">Select gender</option>
                            {genders.map(gender => <option key={gender} value={gender}>{gender}</option>)}
                        </select>
                        {errors.gender && <p className={errorStyle}>{errors.gender.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="age_at_enrollment" className={labelStyle}>Age at Enrollment</label>
                        <input id="age_at_enrollment" type="number" {...register("age_at_enrollment", { valueAsNumber: true })} className={inputStyle} />
                        {errors.age_at_enrollment && <p className={errorStyle}>{errors.age_at_enrollment.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="international" className={labelStyle}>International Student</label>
                        <select id="international" {...register("international")} className={inputStyle}>
                             <option value="">Select an option</option>
                            {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                        {errors.international && <p className={errorStyle}>{errors.international.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="displaced" className={labelStyle}>Displaced</label>
                        <select id="displaced" {...register("displaced")} className={inputStyle}>
                            <option value="">Select an option</option>
                            {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                        {errors.displaced && <p className={errorStyle}>{errors.displaced.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="scholarship_holder" className={labelStyle}>Scholarship Holder</label>
                        <select id="scholarship_holder" {...register("scholarship_holder")} className={inputStyle}>
                            <option value="">Select an option</option>
                            {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                        {errors.scholarship_holder && <p className={errorStyle}>{errors.scholarship_holder.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="debtor" className={labelStyle}>Debtor</label>
                        <select id="debtor" {...register("debtor")} className={inputStyle}>
                            <option value="">Select an option</option>
                            {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                        {errors.debtor && <p className={errorStyle}>{errors.debtor.message}</p>}
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                         <label htmlFor="tuition_fees_up_to_date" className={labelStyle}>Tuition Fees Up To Date</label>
                        <select id="tuition_fees_up_to_date" {...register("tuition_fees_up_to_date")} className={inputStyle}>
                            <option value="">Select an option</option>
                            {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                        {errors.tuition_fees_up_to_date && <p className={errorStyle}>{errors.tuition_fees_up_to_date.message}</p>}
                    </div>
                </div>
            </fieldset>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105 duration-300 ease-in-out"
            >
                {isSubmitting ? "Submitting Profile..." : "Submit Profile"}
            </button>
        </form>
    );
}