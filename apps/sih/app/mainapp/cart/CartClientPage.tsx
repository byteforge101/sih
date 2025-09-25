'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShoppingCart, X, Package } from 'lucide-react';
import { removeFromCart, createOrder, getCart, getOrders } from '../../../actions/store/actions';

type Product = {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
};

type CartItem = {
    id: string;
    quantity: number;
    product: Product;
};

type Cart = {
    id: string;
    items: CartItem[];
};

type OrderItem = {
    id: string;
    quantity: number;
    price: number;
    product: Product;
}

type Order = {
    id: string;
    totalPoints: number;
    createdAt: Date;
    items: OrderItem[];
}

export default function CartClientPage({ initialCart, initialOrders }: { initialCart: Cart | null, initialOrders: Order[] }) {
    const [cart, setCart] = useState(initialCart);
    const [orders, setOrders] = useState(initialOrders);
    const [isPending, startTransition] = useTransition();

    const totalPoints = cart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;

    const handleRemove = (cartItemId: string) => {
        startTransition(async () => {
            await removeFromCart(cartItemId);
            const updatedCart = await getCart();
            setCart(updatedCart);
        });
    };

    const handlePurchase = () => {
        startTransition(async () => {
            try {
                await createOrder();
                const updatedCart = await getCart();
                const updatedOrders = await getOrders();
                setCart(updatedCart);
                setOrders(updatedOrders);
            } catch (error: any) {
                alert(error.message);
            }
        });
    };

    return (
        <div className="space-y-10 p-4 md:p-8 text-white min-h-screen">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-black text-white bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">My Cart & Orders</h1>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-3xl font-bold text-white">Shopping Cart</h2>
                    <AnimatePresence>
                        {cart?.items.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-10 bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                                <ShoppingCart size={48} className="mx-auto text-gray-400" />
                                <p className="mt-4 text-gray-300 text-lg">Your cart is empty.</p>
                            </motion.div>
                        ) : (
                            cart?.items.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                                    className="flex items-center gap-6 bg-white/8 backdrop-blur-2xl p-4 rounded-2xl shadow-xl border border-white/20"
                                >
                                    <img src={item.product.images?.[0]?.url} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl shadow-lg border border-white/10" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg text-white">{item.product.name}</h3>
                                        <div className="flex items-center gap-1.5 text-yellow-200 font-semibold mt-1">
                                            <Award size={16} />
                                            <span>{item.product.price} Points</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-400">Quantity</p>
                                        <p className="font-bold text-lg text-white">{item.quantity}</p>
                                    </div>
                                    <button onClick={() => handleRemove(item.id)} className="p-3 bg-white/10 backdrop-blur-lg rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300">
                                        <X size={20} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1 sticky top-24">
                    <div className="bg-white/8 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/20">
                        <h3 className="text-2xl font-bold border-b border-white/20 pb-4 text-white">Summary</h3>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-300">Subtotal</span>
                                <span className="font-semibold text-white">{totalPoints} Points</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-4 border-t border-white/20">
                                <span className="text-white">Total</span>
                                <span className="text-white">{totalPoints} Points</span>
                            </div>
                        </div>
                        <button
                            onClick={handlePurchase}
                            disabled={isPending || !cart?.items.length}
                            className="mt-6 w-full inline-flex items-center justify-center font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-lg border shadow-xl bg-white/15 border-white/25 text-white hover:bg-white/25 shadow-white/10 hover:scale-105 focus:ring-white/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Processing..." : "Purchase"}
                        </button>
                    </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-3 mt-12">
                     <h2 className="text-3xl font-bold text-white mb-6">Order History</h2>
                     <div className="space-y-6">
                        {orders.length === 0 ? (
                             <div className="text-center p-10 bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                                <Package size={48} className="mx-auto text-gray-400" />
                                <p className="mt-4 text-gray-300 text-lg">You haven't placed any orders yet.</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/8 backdrop-blur-2xl p-6 rounded-2xl shadow-xl border border-white/20">
                                    <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-4">
                                        <div>
                                            <p className="font-bold text-lg text-white">Order #{order.id.substring(0, 8)}</p>
                                            <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">Total</p>
                                            <p className="font-bold text-lg text-yellow-200">{order.totalPoints} Points</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <img src={item.product.images?.[0]?.url} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg shadow-md border border-white/10" />
                                                <div>
                                                    <p className="font-semibold text-white">{item.product.name}</p>
                                                    <p className="text-sm text-gray-400">{item.quantity} x {item.price} Points</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
}