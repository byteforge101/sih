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
        <div className="container mx-auto p-4 md:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-gray-800">My Cart & Orders</h1>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-700">Shopping Cart</h2>
                    <AnimatePresence>
                        {cart?.items.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 bg-white rounded-lg shadow">
                                <ShoppingCart size={48} className="mx-auto text-gray-300" />
                                <p className="mt-4 text-gray-500">Your cart is empty.</p>
                            </motion.div>
                        ) : (
                            cart?.items.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                                    className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md"
                                >
                                    <img src={item.product.images?.[0]?.url} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg text-gray-800">{item.product.name}</h3>
                                        <div className="flex items-center gap-1.5 text-yellow-800 font-semibold">
                                            <Award size={16} />
                                            <span>{item.product.price} Points</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">Quantity</p>
                                        <p className="font-bold text-lg">{item.quantity}</p>
                                    </div>
                                    <button onClick={() => handleRemove(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                                        <X size={20} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1 sticky top-24">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold border-b pb-4">Summary</h3>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold">{totalPoints} Points</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-4 border-t">
                                <span>Total</span>
                                <span>{totalPoints} Points</span>
                            </div>
                        </div>
                        <button
                            onClick={handlePurchase}
                            disabled={isPending || !cart?.items.length}
                            className="mt-6 w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition disabled:bg-gray-300"
                        >
                            {isPending ? "Processing..." : "Purchase"}
                        </button>
                    </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-3 mt-12">
                     <h2 className="text-2xl font-bold text-gray-700 mb-4">Order History</h2>
                     <div className="space-y-6">
                        {orders.length === 0 ? (
                             <div className="text-center p-8 bg-white rounded-lg shadow">
                                <Package size={48} className="mx-auto text-gray-300" />
                                <p className="mt-4 text-gray-500">You haven't placed any orders yet.</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-xl shadow-md">
                                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                                        <div>
                                            <p className="font-bold text-lg">Order #{order.id.substring(0, 8)}</p>
                                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-bold text-lg text-yellow-800">{order.totalPoints} Points</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <img src={item.product.images?.[0]?.url} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                                                <div>
                                                    <p className="font-semibold">{item.product.name}</p>
                                                    <p className="text-sm text-gray-500">{item.quantity} x {item.price} Points</p>
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