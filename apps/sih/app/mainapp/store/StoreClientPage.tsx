'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@repo/ui/store/ProductCard';
import { addToCart, getCart } from '../../../actions/store/actions';

import { useTransition, useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, PlusCircle } from 'lucide-react';

type Product = {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
};

type Cart = {
    items: { productId: string }[];
} | null;

export default function StoreClientPage({ products, userRole }: { products: Product[], userRole: string }) {
    const [isPending, startTransition] = useTransition();
    const [cart, setCart] = useState<Cart>(null);


    useEffect(() => {
        
        const fetchCart = async () => {
            const cartData = await getCart();
            setCart(cartData);
        };
        if (userRole === 'STUDENT') {
            fetchCart();
        }
    }, [userRole]);

    // FIX: Made the handleAddToCart function async
    const handleAddToCart = async (productId: string) => {
        startTransition(async () => {
            await addToCart(productId);
            const updatedCart = await getCart();
            setCart(updatedCart);
            

        });
    };

    const isMentor = userRole === 'MENTOR';
    const productIdsInCart = cart?.items.map(item => item.productId) || [];

    return (
        <div className="space-y-10 p-4 md:p-8 text-white">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">Reward Store</h1>
                    <p className="text-gray-300 text-lg font-medium mt-2">Spend your well-earned points on exclusive goodies and merch.</p>
                </div>
                {isMentor && (
                    <Link href="/mainapp/store/add-product">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center justify-center font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-lg border shadow-xl bg-white/15 border-white/25 text-white hover:bg-white/25 shadow-white/10 focus:ring-white/30"
                        >
                            <PlusCircle size={20} className="mr-2" />
                            <span>Add New Item</span>
                        </motion.div>
                    </Link>
                )}
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                    }
                }}
                initial="hidden"
                animate="visible"
            >
                {products.map(product => {
                    const isInCart = productIdsInCart.includes(product.id);
                    return (
                        <div key={product.id}>
                            <ProductCard
                                product={product}
                                addToCartAction={handleAddToCart}
                                isMentor={isMentor}
                            />
                            {isInCart && (
                                <Link href="/mainapp/cart">
                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-green-200 bg-green-500/20 backdrop-blur-sm p-3 rounded-2xl border border-green-500/30 shadow-lg">
                                        <CheckCircle size={16} />
                                        <span>Added to Cart</span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    )
                })}
            </motion.div>
        </div>
    );
}