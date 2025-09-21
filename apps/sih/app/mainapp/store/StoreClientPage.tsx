'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@repo/ui/store/ProductCard';
import { addToCart, getCart } from '../../../actions/store/actions';

import { useTransition, useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

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
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-gray-800">Reward Store</h1>
                <p className="text-slate-500 mt-2">Spend your well-earned points on exclusive goodies and merch.</p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
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
                                    <div className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-green-600 bg-green-100 p-2 rounded-lg">
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