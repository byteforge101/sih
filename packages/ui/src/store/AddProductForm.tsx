'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { UploadCloud, Image, X, Award } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
        >
            {pending ? "Adding Product..." : "Add Product"}
        </button>
    );
}

export function AddProductForm({ addProductAction }: { addProductAction: (formData: FormData) => Promise<void> }) {
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
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
            <form action={addProductAction} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                    <input type="text" name="name" id="name" required className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-800 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea name="description" id="description" rows={4} required className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-800 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1.5">Price (in Reward Points)</label>
                    <div className="relative">
                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Award className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="number" name="price" id="price" required className="block w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-gray-800 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Images</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-300" />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label htmlFor="images" className="relative cursor-pointer rounded-md bg-white font-semibold text-cyan-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-cyan-600 focus-within:ring-offset-2 hover:text-cyan-500">
                                    <span>Upload files</span>
                                    <input id="images" name="images" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} required />
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
                            <motion.div key={index} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative aspect-square">
                                <img src={src} alt={`Preview ${index + 1}`} className="h-full w-full object-cover rounded-md" />
                            </motion.div>
                        ))}
                    </div>
                )}
                <div className="pt-4">
                   <SubmitButton />
                </div>
            </form>
        </motion.div>
    );
}