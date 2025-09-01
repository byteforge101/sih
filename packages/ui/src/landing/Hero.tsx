// src/app/components/Hero.tsx
'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-gradient pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container mx-auto px-6 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            For Public Institutes
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight tracking-tight"
        >
          AI-Based Drop-out Prediction <br /> and {' '}
          <div className="relative inline-block mt-2 md:mt-0">
            <span className="bg-gradient-to-r from-blue-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Counseling System
            </span>
            {/* Wavy underline SVG */}
            <svg
              className="absolute left-0 w-full -bottom-1.5 md:-bottom-2"
              viewBox="0 0 329 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M3 15.5C30.3333 9.5 102.3 -4.5 164.5 9C226.7 22.5 296.667 17.5 326 15.5"
                stroke="#3b82f6" // This is blue-500
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8, type: "spring" }}
              />
            </svg>
          </div>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 max-w-2xl mx-auto text-lg text-gray-700"
        >
          [cite_start]A lightweight, explainable platform that uses existing resources to predict student drop-out risk before it's too late. [cite: 5, 6]
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Request a Demo
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-semibold text-gray-700 hover:text-gray-900 transition-colors"
          >
            Learn More
          </motion.button>
        </motion.div>
        
      </div>
    </section>
  );
}