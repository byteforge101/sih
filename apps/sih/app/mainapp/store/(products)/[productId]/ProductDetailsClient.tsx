'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, PlusCircle, Award } from 'lucide-react';
import { addToCart } from '../../../../../actions/store/actions';

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    images: { url: string }[];
};

export default function ProductDetailsClient({ product, userRole }: { product: Product, userRole: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPending, startTransition] = useTransition();

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    };

    const handleAddToCart = () => {
        startTransition(async () => {
            await addToCart(product.id);
        });
    };

    const isMentor = userRole === 'MENTOR';

    return (
        <div className="container mx-auto p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
            >
                {/* Image Slider */}
                <div className="relative aspect-square lg:aspect-[4/3] w-full bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="w-full h-full"
                    >
                        <img
                            src={product.images[currentIndex]?.url}
                            alt={`${product.name} image ${currentIndex + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    {product.images.length > 1 && (
                        <>
                            <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors">
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800">{product.name}</h1>
                    <p className="mt-4 text-gray-600 text-lg leading-relaxed">{product.description}</p>
                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-lg font-bold mt-8 w-fit">
                        <Award size={20} />
                        <span>{product.price} Points</span>
                    </div>

                    {!isMentor && (
                        <div className="mt-10 flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddToCart}
                                disabled={isPending}
                                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-60"
                            >
                                <PlusCircle size={22} />
                                {isPending ? "Adding..." : "Add to Cart"}
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}