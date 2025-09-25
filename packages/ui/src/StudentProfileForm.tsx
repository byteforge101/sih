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

// Ultra-modern glass styles for premium aesthetic
const labelStyle = "block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide group-hover:text-white transition-colors duration-300";
const inputStyle = "w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl";
const selectStyle = "w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl";
const errorStyle = "mt-2 text-sm text-red-300 font-medium";
const fieldsetStyles = "bg-white/8 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl shadow-black/30 hover:shadow-3xl hover:shadow-black/40 transition-all duration-700";

// Enhanced icon components for section headings
const AcademicCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.813M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.813m0 0A7.5 7.5 0 1112 5.5a7.5 7.5 0 014.5 13.5m-9 0h9" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12" noValidate>
            <div className="space-y-10">
                {/* Academic Information Section */}
                <fieldset className={fieldsetStyles}>
                    <div className="flex items-center gap-4 mb-8 text-white group">
                        <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/20 shadow-xl group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                            <AcademicCapIcon />
                        </div>
                        <legend className="text-2xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                            Academic Profile
                        </legend>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="group">
                            <label htmlFor="application_mode" className={labelStyle}>Application Mode</label>
                            <select id="application_mode" {...register("application_mode")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select an option</option>
                                {applicationModes.map(mode => <option key={mode} value={mode} className="bg-gray-800">{mode}</option>)}
                            </select>
                            {errors.application_mode && <p className={errorStyle}>{errors.application_mode.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="course" className={labelStyle}>Course</label>
                            <select id="course" {...register("course")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select a course</option>
                                {courses.map(course => <option key={course} value={course} className="bg-gray-800">{course}</option>)}
                            </select>
                            {errors.course && <p className={errorStyle}>{errors.course.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="attendances" className={labelStyle}>Attendance</label>
                            <select id="attendances" {...register("attendances")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select attendance type</option>
                                {attendanceRegimes.map(regime => <option key={regime} value={regime} className="bg-gray-800">{regime}</option>)}
                            </select>
                            {errors.attendances && <p className={errorStyle}>{errors.attendances.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="previous_qualification" className={labelStyle}>Previous Qualification</label>
                            <select id="previous_qualification" {...register("previous_qualification")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select a qualification</option>
                                {previousQualifications.map(qual => <option key={qual} value={qual} className="bg-gray-800">{qual}</option>)}
                            </select>
                            {errors.previous_qualification && <p className={errorStyle}>{errors.previous_qualification.message}</p>}
                        </div>
                    </div>
                </fieldset>

                {/* Family Information Section */}
                <fieldset className={fieldsetStyles}>
                    <div className="flex items-center gap-4 mb-8 text-white group">
                        <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/20 shadow-xl group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                            <UserGroupIcon />
                        </div>
                        <legend className="text-2xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                            Family Background
                        </legend>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="group">
                            <label htmlFor="mothers_qualification" className={labelStyle}>Mother's Qualification</label>
                            <select id="mothers_qualification" {...register("mothers_qualification")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select a qualification</option>
                                {parentQualifications.map(qual => <option key={qual} value={qual} className="bg-gray-800">{qual}</option>)}
                            </select>
                            {errors.mothers_qualification && <p className={errorStyle}>{errors.mothers_qualification.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="fathers_qualification" className={labelStyle}>Father's Qualification</label>
                            <select id="fathers_qualification" {...register("fathers_qualification")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select a qualification</option>
                                {parentQualifications.map(qual => <option key={qual} value={qual} className="bg-gray-800">{qual}</option>)}
                            </select>
                            {errors.fathers_qualification && <p className={errorStyle}>{errors.fathers_qualification.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="mothers_occupation" className={labelStyle}>Mother's Occupation</label>
                            <select id="mothers_occupation" {...register("mothers_occupation")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select an occupation</option>
                                {parentOccupations.map(occ => <option key={occ} value={occ} className="bg-gray-800">{occ}</option>)}
                            </select>
                            {errors.mothers_occupation && <p className={errorStyle}>{errors.mothers_occupation.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="fathers_occupation" className={labelStyle}>Father's Occupation</label>
                            <select id="fathers_occupation" {...register("fathers_occupation")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select an occupation</option>
                                {parentOccupations.map(occ => <option key={occ} value={occ} className="bg-gray-800">{occ}</option>)}
                            </select>
                            {errors.fathers_occupation && <p className={errorStyle}>{errors.fathers_occupation.message}</p>}
                        </div>
                    </div>
                </fieldset>

                {/* Additional Information Section */}
                <fieldset className={fieldsetStyles}>
                    <div className="flex items-center gap-4 mb-8 text-white group">
                        <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/20 shadow-xl group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                            <ClipboardIcon />
                        </div>
                        <legend className="text-2xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                            Personal & Financial Details
                        </legend>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
                        <div className="group">
                            <label htmlFor="gender" className={labelStyle}>Gender</label>
                            <select id="gender" {...register("gender")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select gender</option>
                                {genders.map(gender => <option key={gender} value={gender} className="bg-gray-800">{gender}</option>)}
                            </select>
                            {errors.gender && <p className={errorStyle}>{errors.gender.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="age_at_enrollment" className={labelStyle}>Age at Enrollment</label>
                            <input id="age_at_enrollment" type="number" {...register("age_at_enrollment", { valueAsNumber: true })} className={inputStyle} />
                            {errors.age_at_enrollment && <p className={errorStyle}>{errors.age_at_enrollment.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="international" className={labelStyle}>International Student</label>
                            <select id="international" {...register("international")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select an option</option>
                                {yesNoOptions.map(option => <option key={option} value={option} className="bg-gray-800">{option}</option>)}
                            </select>
                            {errors.international && <p className={errorStyle}>{errors.international.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="displaced" className={labelStyle}>Displaced</label>
                            <select id="displaced" {...register("displaced")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select an option</option>
                                {yesNoOptions.map(option => <option key={option} value={option} className="bg-gray-800">{option}</option>)}
                            </select>
                            {errors.displaced && <p className={errorStyle}>{errors.displaced.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="scholarship_holder" className={labelStyle}>Scholarship Holder</label>
                            <select id="scholarship_holder" {...register("scholarship_holder")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select an option</option>
                                {yesNoOptions.map(option => <option key={option} value={option} className="bg-gray-800">{option}</option>)}
                            </select>
                            {errors.scholarship_holder && <p className={errorStyle}>{errors.scholarship_holder.message}</p>}
                        </div>
                        <div className="group">
                            <label htmlFor="debtor" className={labelStyle}>Debtor</label>
                            <select id="debtor" {...register("debtor")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select an option</option>
                                {yesNoOptions.map(option => <option key={option} value={option} className="bg-gray-800">{option}</option>)}
                            </select>
                            {errors.debtor && <p className={errorStyle}>{errors.debtor.message}</p>}
                        </div>
                        <div className="md:col-span-2 group">
                            <label htmlFor="tuition_fees_up_to_date" className={labelStyle}>Tuition Fees Up To Date</label>
                            <select id="tuition_fees_up_to_date" {...register("tuition_fees_up_to_date")} className={selectStyle}>
                                <option value="" className="bg-gray-800">Select an option</option>
                                {yesNoOptions.map(option => <option key={option} value={option} className="bg-gray-800">{option}</option>)}
                            </select>
                            {errors.tuition_fees_up_to_date && <p className={errorStyle}>{errors.tuition_fees_up_to_date.message}</p>}
                        </div>
                    </div>
                </fieldset>
            </div>

            {/* Ultra-modern glass submit button */}
            <div className="pt-8">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 px-8 bg-gradient-to-r from-white/20 to-gray-200/20 backdrop-blur-2xl text-white font-black rounded-3xl border border-white/30 shadow-2xl hover:from-white/30 hover:to-gray-200/30 hover:shadow-3xl hover:shadow-white/10 hover:border-white/50 hover:scale-[1.02] transition-all duration-500 uppercase tracking-wider text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isSubmitting ? "Submitting Profile..." : "Submit Profile"}
                </button>
            </div>
        </form>
    );
}