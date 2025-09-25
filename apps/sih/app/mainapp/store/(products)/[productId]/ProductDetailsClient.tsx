'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Award } from 'lucide-react';
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
        <div className="min-h-screen text-white p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8"
            >
                {/* Image Slider */}
                <div className="relative aspect-square w-full bg-black/20 rounded-2xl overflow-hidden shadow-lg border border-white/10">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                            <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/15 backdrop-blur-lg rounded-full text-white hover:bg-white/25 transition-all duration-300 shadow-xl border border-white/20">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/15 backdrop-blur-lg rounded-full text-white hover:bg-white/25 transition-all duration-300 shadow-xl border border-white/20">
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl lg:text-5xl font-black text-white bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">{product.name}</h1>
                    <p className="mt-6 text-gray-300 text-lg leading-relaxed">{product.description}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-bold border shadow-lg bg-yellow-500/20 backdrop-blur-sm text-yellow-200 border-yellow-500/30 mt-8 w-fit">
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
                                className="w-full inline-flex items-center justify-center font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-lg border shadow-xl bg-white/15 border-white/25 text-white hover:bg-white/25 shadow-white/10 focus:ring-white/30 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
                            >
                                <ShoppingCart size={22} className="mr-3" />
                                {isPending ? "Adding..." : "Add to Cart"}
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}