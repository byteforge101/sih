
'use client';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero-gradient pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight"
        >
          AI-Based Drop-out Prediction <br /> and <span className="text-blue-600">Counseling System</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-gray-600"
        >
          [cite_start]A lightweight, explainable platform that uses existing resources to predict student drop-out risk before it's too late. [cite: 5, 6]
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">
            Request a Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}