'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { UploadCloud, X, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
    const { pending } = useFormStatus();
    const disabled = isSubmitting || pending;

    return (
        <button
            type="submit"
            disabled={disabled}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
        >
            {disabled ? "Adding Product..." : "Add Product"}
        </button>
    );
}

export function AddProductForm({ addProductAction }: { addProductAction: (formData: FormData) => Promise<{ productId: string }> }) {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length === 0) return;

        const newPreviews = newFiles.map(file => URL.createObjectURL(file));

        // Correctly appends new files to the existing array
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
        setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    const removeImage = (indexToRemove: number) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        setPreviews(prevPreviews => {
            const newPreviews = [...prevPreviews];
            const previewToRemove = newPreviews[indexToRemove];
            if (previewToRemove) {
                URL.revokeObjectURL(previewToRemove);
            }
            newPreviews.splice(indexToRemove, 1);
            return newPreviews;
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (files.length === 0) {
            alert("Please upload at least one image.");
            return;
        }
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.delete('images'); // Remove default file input
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            const result = await addProductAction(formData);
            if (result && result.productId) {
                alert("Product added successfully!");
                formRef.current?.reset();
                setFiles([]);
                setPreviews([]);
                router.push(`/mainapp/store/${result.productId}`);
            } else {
                // This will catch cases where the action completes but doesn't return the expected ID
                throw new Error("Action did not return a product ID.");
            }
        } catch (error) {
            console.error("Failed to add product:", error);
            alert(`Failed to add product. Please try again. \nError: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200/50"
        >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>
            <p className="text-gray-500 mb-8">Fill out the details below to add a new item to the reward store.</p>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                    <input type="text" name="name" id="name" required className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea name="description" id="description" rows={4} required className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1.5">Price (in Reward Points)</label>
                    <div className="relative">
                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Award className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="number" name="price" id="price" required className="block w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Images</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-300" />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label htmlFor="images" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                                    <span>Upload files</span>
                                    <input ref={fileInputRef} id="images" name="images" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                {previews.length > 0 && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {previews.map((src, index) => (
                            <motion.div key={src} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative aspect-square">
                                <img src={src} alt={`Preview ${index + 1}`} className="h-full w-full object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                >
                                    <X size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
                <div className="pt-4">
                   <SubmitButton isSubmitting={isSubmitting} />
                </div>
            </form>
        </motion.div>
    );
}