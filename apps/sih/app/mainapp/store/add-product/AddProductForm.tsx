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
            className="w-full inline-flex items-center justify-center font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-lg border shadow-xl bg-white/15 border-white/25 text-white hover:bg-white/25 shadow-white/10 hover:scale-105 focus:ring-white/30 disabled:opacity-60 disabled:cursor-not-allowed"
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
        formData.delete('images');
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
            className="max-w-3xl mx-auto bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8 md:p-10 text-white"
        >
            <h1 className="text-4xl font-black text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">Add New Product</h1>
            <p className="text-gray-300 text-lg font-medium mb-10">Fill out the details below to add a new item to the reward store.</p>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Product Name</label>
                    <input type="text" name="name" id="name" required className="w-full p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 shadow-lg text-lg" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Description</label>
                    <textarea name="description" id="description" rows={4} required className="w-full p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 shadow-lg text-lg" />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Price (in Reward Points)</label>
                    <div className="relative">
                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <Award className="h-6 w-6 text-gray-400" />
                        </div>
                        <input type="number" name="price" id="price" required className="w-full p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 shadow-lg text-lg pl-12" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Product Images</label>
                    <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 px-6 py-12 text-center bg-white/5 hover:border-white/40 transition-colors">
                        <div className="text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4 flex text-base leading-6 text-gray-400">
                                <label htmlFor="images" className="relative cursor-pointer rounded-md font-semibold text-white hover:text-gray-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-white/50 focus-within:ring-offset-2 focus-within:ring-offset-gray-900">
                                    <span>Upload files</span>
                                    <input ref={fileInputRef} id="images" name="images" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-sm leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                {previews.length > 0 && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {previews.map((src, index) => (
                            <motion.div key={src} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative aspect-square">
                                <img src={src} alt={`Preview ${index + 1}`} className="h-full w-full object-cover rounded-xl border-2 border-white/10" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500/80 backdrop-blur-sm border border-white/20 text-white rounded-full shadow-lg hover:bg-red-500 transition-all transform hover:scale-110"
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