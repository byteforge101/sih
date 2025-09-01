
'use client';
import { motion } from 'framer-motion';

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center bg-orange-50 border-l-4 border-orange-400 p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Proof In Every Story</h2>
          <blockquote className="text-lg italic text-gray-700 leading-relaxed">
            “Eduvance completely transformed how I approach learning. The courses are not just informative, they're incredibly engaging. Even with my full-time job, I was able to learn at my own pace.”
          </blockquote>
          <cite className="block font-semibold text-gray-600 mt-6 not-italic">
            - Melinda Syahmore
          </cite>
        </motion.div>
      </div>
    </section>
  );
}