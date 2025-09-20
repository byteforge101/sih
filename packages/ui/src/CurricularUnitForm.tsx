"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDetails } from "./getdetes";
import { useEffect, useState } from "react";
import { z } from "zod";
import React from 'react';

// Zod schema for validation
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

// Reusable custom input field component
const CustomInputField = React.forwardRef<HTMLInputElement, { label: string; name: string; error?: string }>(
    ({ label, name, error, ...props }, ref) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600">{label}</label>
        <input
            id={name}
            type="number"
            ref={ref}
            name={name}
            {...props}
            className={`mt-1 block w-full pl-3 pr-3 py-2 text-base border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-gray-50`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
));

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Predict Dropout Risk</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500">Loading student data...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <fieldset className="p-4 border rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">1st Semester</legend>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <CustomInputField label="Credited" {...register("curricular_units_1st_sem_credited", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_credited?.message} />
                                <CustomInputField label="Enrolled" {...register("curricular_units_1st_sem_enrolled", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_enrolled?.message} />
                                <CustomInputField label="Evaluations" {...register("curricular_units_1st_sem_evaluations", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_evaluations?.message} />
                                <CustomInputField label="Approved" {...register("curricular_units_1st_sem_approved", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_approved?.message} />
                                <CustomInputField label="Grade" {...register("curricular_units_1st_sem_grade", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_grade?.message} />
                                <CustomInputField label="w/o Evals" {...register("curricular_units_1st_sem_without_evaluations", { valueAsNumber: true })} error={errors.curricular_units_1st_sem_without_evaluations?.message} />
                            </div>
                        </fieldset>

                        <fieldset className="p-4 border rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">2nd Semester</legend>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <CustomInputField label="Credited" {...register("curricular_units_2nd_sem_credited", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_credited?.message} />
                                <CustomInputField label="Enrolled" {...register("curricular_units_2nd_sem_enrolled", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_enrolled?.message} />
                                <CustomInputField label="Evaluations" {...register("curricular_units_2nd_sem_evaluations", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_evaluations?.message} />
                                <CustomInputField label="Approved" {...register("curricular_units_2nd_sem_approved", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_approved?.message} />
                                <CustomInputField label="Grade" {...register("curricular_units_2nd_sem_grade", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_grade?.message} />
                                <CustomInputField label="w/o Evals" {...register("curricular_units_2nd_sem_without_evaluations", { valueAsNumber: true })} error={errors.curricular_units_2nd_sem_without_evaluations?.message} />
                            </div>
                        </fieldset>

                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold disabled:bg-gray-400">
                                {isSubmitting ? "Predicting..." : "Predict"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}