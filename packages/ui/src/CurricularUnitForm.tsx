"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDetails } from "./getdetes";
import { useEffect, useState } from "react";
import { z } from "zod";
import React from 'react';

// --- ZOD SCHEMA IS UNCHANGED ---
const schema = z.object({
    curricular_units_1st_sem_credited: z.number().int().min(0, "Cannot be negative"),
    curricular_units_1st_sem_enrolled: z.number().int().min(0, "Cannot be negative"),
    curricular_units_1st_sem_evaluations: z.number().int().min(0, "Cannot be negative"),
    curricular_units_1st_sem_approved: z.number().int().min(0, "Cannot be negative"),
    curricular_units_1st_sem_grade: z.number().min(0, "Cannot be negative"),
    curricular_units_1st_sem_without_evaluations: z.number().int().min(0, "Cannot be negative"),
    curricular_units_2nd_sem_credited: z.number().int().min(0, "Cannot be negative"),
    curricular_units_2nd_sem_enrolled: z.number().int().min(0, "Cannot be negative"),
    curricular_units_2nd_sem_evaluations: z.number().int().min(0, "Cannot be negative"),
    curricular_units_2nd_sem_approved: z.number().int().min(0, "Cannot be negative"),
    curricular_units_2nd_sem_grade: z.number().min(0, "Cannot be negative"),
    curricular_units_2nd_sem_without_evaluations: z.number().int().min(0, "Cannot be negative"),
});

type CurricularFormValues = z.infer<typeof schema>;

// --- STYLING CHANGE: CustomInputField restyled for Aurora UI. Structure and props are identical. ---
const CustomInputField = React.forwardRef<HTMLInputElement, { label: string; name: string; error?: string }>(
    ({ label, name, error, ...props }, ref) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-400">{label}</label>
        <input
            id={name}
            type="number"
            ref={ref}
            name={name}
            {...props}
            className={`mt-1 block w-full rounded-lg bg-slate-800/50 border ${error ? 'border-rose-500' : 'border-slate-700'} px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition`}
        />
        {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
));

// --- FUNCTIONALITY IS UNCHANGED ---
export function CurricularUnitForm({ studentId, onClose, updateAction }: { studentId: string; onClose: () => void; updateAction: (studentId: string, data: any) => Promise<any>; }) {
    const [isLoading, setIsLoading] = useState(true);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CurricularFormValues>({ resolver: zodResolver(schema) });

    useEffect(() => {
        const fetchStudentData = async () => {
            setIsLoading(true);
            const result = await getDetails(studentId);
            if (result.success && result.data) {
                // Sanitize the data: convert nulls to 0 for form population
                const defaultValues = {
                    ...result.data,
                    curricular_units_1st_sem_credited: result.data.curricular_units_1st_sem_credited ?? 0,
                    curricular_units_1st_sem_enrolled: result.data.curricular_units_1st_sem_enrolled ?? 0,
                    curricular_units_1st_sem_evaluations: result.data.curricular_units_1st_sem_evaluations ?? 0,
                    curricular_units_1st_sem_approved: result.data.curricular_units_1st_sem_approved ?? 0,
                    curricular_units_1st_sem_grade: result.data.curricular_units_1st_sem_grade ?? 0,
                    curricular_units_1st_sem_without_evaluations: result.data.curricular_units_1st_sem_without_evaluations ?? 0,
                    curricular_units_2nd_sem_credited: result.data.curricular_units_2nd_sem_credited ?? 0,
                    curricular_units_2nd_sem_enrolled: result.data.curricular_units_2nd_sem_enrolled ?? 0,
                    curricular_units_2nd_sem_evaluations: result.data.curricular_units_2nd_sem_evaluations ?? 0,
                    curricular_units_2nd_sem_approved: result.data.curricular_units_2nd_sem_approved ?? 0,
                    curricular_units_2nd_sem_grade: result.data.curricular_units_2nd_sem_grade ?? 0,
                    curricular_units_2nd_sem_without_evaluations: result.data.curricular_units_2nd_sem_without_evaluations ?? 0,
                };
                reset(defaultValues);
            } else if (!result.success) {
               alert("Failed to load existing student data.");
            }
            setIsLoading(false);
        };
        fetchStudentData();
    }, [studentId, reset]);

    const onSubmit = async (data: CurricularFormValues) => {
        const result = await updateAction(studentId, data);
        if (result.success) {
            alert(result.message);
            onClose();
        } else {
            alert(result.message);
        }
    };

    return (
        // --- STYLING CHANGE: Modal backdrop updated for Aurora UI ---
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />
            {/* --- STYLING CHANGE: Modal panel restyled for Aurora UI --- */}
            <div className="relative z-10 aurora-bg p-8 rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all">
                {/* --- STYLING CHANGE: Header text and close button colors updated --- */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Predict Dropout Risk</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                
                {isLoading ? (
                    // --- STYLING CHANGE: Loading text color updated ---
                    <div className="flex justify-center items-center h-64">
                        <p className="text-slate-400">Loading student data...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* --- STYLING CHANGE: Fieldset border and legend color updated --- */}
                        <fieldset className="p-4 border border-slate-700 rounded-lg">
                            <legend className="text-lg font-semibold text-cyan-400 px-2">1st Semester</legend>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <CustomInputField label="Credited" {...register("curricular_units_1st_sem_credited", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_credited?.message} />
                                <CustomInputField label="Enrolled" {...register("curricular_units_1st_sem_enrolled", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_enrolled?.message} />
                                <CustomInputField label="Evaluations" {...register("curricular_units_1st_sem_evaluations", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_evaluations?.message} />
                                <CustomInputField label="Approved" {...register("curricular_units_1st_sem_approved", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_approved?.message} />
                                <CustomInputField label="Grade" {...register("curricular_units_1st_sem_grade", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_grade?.message} />
                                <CustomInputField label="w/o Evals" {...register("curricular_units_1st_sem_without_evaluations", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_without_evaluations?.message} />
                            </div>
                        </fieldset>

                        {/* --- STYLING CHANGE: Fieldset border and legend color updated --- */}
                        <fieldset className="p-4 border border-slate-700 rounded-lg">
                            <legend className="text-lg font-semibold text-cyan-400 px-2">2nd Semester</legend>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <CustomInputField label="Credited" {...register("curricular_units_2nd_sem_credited", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_credited?.message} />
                                <CustomInputField label="Enrolled" {...register("curricular_units_2nd_sem_enrolled", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_enrolled?.message} />
                                <CustomInputField label="Evaluations" {...register("curricular_units_2nd_sem_evaluations", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_evaluations?.message} />
                                <CustomInputField label="Approved" {...register("curricular_units_2nd_sem_approved", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_approved?.message} />
                                <CustomInputField label="Grade" {...register("curricular_units_2nd_sem_grade", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_grade?.message} />
                                <CustomInputField label="w/o Evals" {...register("curricular_units_2nd_sem_without_evaluations", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_without_evaluations?.message} />
                            </div>
                        </fieldset>

                        {/* --- STYLING CHANGE: Buttons restyled for Aurora UI --- */}
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 font-semibold transition-colors">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 font-semibold disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                {isSubmitting ? "Predicting..." : "Predict"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}