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

    // This function will now control the entire timing sequence.
    const handleAddToCart = async (productId: string) => {
        startTransition(async () => {
            const startTime = Date.now();
            
            // This time controls the duration of the '...' and ensures a smooth transition.
            const MINIMUM_VISUAL_TIME = 800; 

            // 1. Run the core action to add the item to the cart.
            await addToCart(productId);

            // 2. Fetch the updated cart state.
            const updatedCart = await getCart();
            
            const elapsedTime = Date.now() - startTime;
            const delayNeeded = Math.max(0, MINIMUM_VISUAL_TIME - elapsedTime);
            
            // 3. CRITICAL: Wait for the required delay BEFORE updating the cart state.
            // This is the promise that the child component's 'finally' block is waiting on.
            await new Promise(resolve => setTimeout(resolve, delayNeeded));

            // 4. Update cart state. This happens immediately AFTER the delay,
            // which ensures the 'Added to Cart' message appears smoothly.
            setCart(updatedCart);
        });
    };

    const isMentor = userRole === 'MENTOR';
    const productIdsInCart = cart?.items.map(item => item.productId) || [];

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Reward Store</h1>
                    <p className="text-slate-500 mt-2">Spend your well-earned points on exclusive goodies and merch.</p>
                </div>
                {isMentor && (
                    <Link href="/mainapp/store/add-product">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/40 transition-all duration-300"
                        >
                            <PlusCircle size={20} />
                            <span>Add New Item</span>
                        </motion.div>
                    </Link>
                )}
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
                                    <div className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 bg-blue-100 p-2 rounded-lg">
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