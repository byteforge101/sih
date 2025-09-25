'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, ShoppingCart } from 'lucide-react';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
  addToCartAction: (productId: string) => Promise<void>;
  isMentor: boolean;
};

export const ProductCard = ({ product, addToCartAction, isMentor }: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartAction(product.id);
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link href={`/mainapp/store/${product.id}`} className="block">
        <div className="relative w-full aspect-[4/3] bg-white/5 rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-black/30 group-hover:shadow-3xl group-hover:shadow-black/40 transition-all duration-500 hover:scale-[1.02]">
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
             <div className="w-full h-full bg-black/20 flex items-center justify-center text-gray-400">No Image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">{product.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border shadow-lg bg-yellow-500/20 backdrop-blur-sm text-yellow-200 border-yellow-500/30">
              <Award size={16} />
              <span>{product.price} Points</span>
            </div>
            {!isMentor && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-3 bg-white/15 backdrop-blur-lg rounded-2xl hover:bg-white/25 border border-white/20 shadow-xl transition-all duration-300 text-white"
              >
                <ShoppingCart size={20} />
              </motion.button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};