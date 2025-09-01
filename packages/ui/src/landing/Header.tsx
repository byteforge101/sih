
'use client';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-800">Student Success AI</h1>
        </motion.div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-blue-600">Pillars</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Features</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Impact</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">FAQ</a>
        </nav>
        <div className="hidden md:block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Dashboard Login
          </motion.button>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 bg-white shadow-lg rounded-lg p-4 mx-6"
        >
            <a href="#" className="block py-2 text-gray-600 hover:text-blue-600">Pillars</a>
            <a href="#" className="block py-2 text-gray-600 hover:text-blue-600">Features</a>
            <a href="#" className="block py-2 text-gray-600 hover:text-blue-600">Impact</a>
            <a href="#" className="block py-2 text-gray-600 hover:text-blue-600">FAQ</a>
            <button className="w-full mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
              Dashboard Login
            </button>
        </motion.div>
      )}
    </header>
  );
}