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

// Reusable styles for a consistent and modern look
const labelStyle = "block text-sm font-semibold text-gray-700 mb-1.5";
const inputStyle = "block w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-800 placeholder-gray-400 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 sm:text-sm transition duration-200";
const errorStyle = "mt-2 text-sm text-red-600";
const fieldsetStyles = "bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200/80 shadow-sm";

// Icon components for section headings
const AcademicCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.813M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.813m0 0A7.5 7.5 0 1112 5.5a7.5 7.5 0 014.5 13.5m-9 0h9" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;


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
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    const onSubmit = async (data: ProfileFormValues) => {
        const result = await updateAction(data);
        alert(result.message); 
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
            <div className="space-y-8">
                {/* Academic Information Section */}
                <fieldset className={fieldsetStyles}>
                    <div className="flex items-center gap-3 mb-6 text-cyan-600">
                        <AcademicCapIcon />
                        <legend className="text-xl font-bold">Academic Profile</legend>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                <fieldset className={fieldsetStyles}>
                     <div className="flex items-center gap-3 mb-6 text-cyan-600">
                        <UserGroupIcon />
                        <legend className="text-xl font-bold">Family Background</legend>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                <fieldset className={fieldsetStyles}>
                    <div className="flex items-center gap-3 mb-6 text-cyan-600">
                        <ClipboardIcon />
                        <legend className="text-xl font-bold">Personal & Financial Details</legend>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
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
                        <div className="md:col-span-2">
                            <label htmlFor="tuition_fees_up_to_date" className={labelStyle}>Tuition Fees Up To Date</label>
                            <select id="tuition_fees_up_to_date" {...register("tuition_fees_up_to_date")} className={inputStyle}>
                                <option value="">Select an option</option>
                                {yesNoOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            {errors.tuition_fees_up_to_date && <p className={errorStyle}>{errors.tuition_fees_up_to_date.message}</p>}
                        </div>
                    </div>
                </fieldset>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-cyan-400 to-emerald-500 hover:from-cyan-500 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                >
                    {isSubmitting ? "Submitting Profile..." : "Submit Profile"}
                </button>
            </div>
        </form>
    );
}