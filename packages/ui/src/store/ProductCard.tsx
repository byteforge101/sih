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
        <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
             <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">No Image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">{product.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              <Award size={16} />
              <span>{product.price} Points</span>
            </div>
            {!isMentor && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-2 rounded-full bg-white text-gray-500 shadow-md hover:bg-cyan-500 hover:text-white transition-all"
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