
'use client';
import { motion } from 'framer-motion';

export default function Testimonials() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center bg-orange-50 border-l-4 border-orange-400 p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">From a Mentor's Perspective</h2>
          <blockquote className="text-lg italic text-gray-700 leading-relaxed">
            [cite_start]“Previously, we could only identify struggling students after their end-term results. [cite: 4] This platform gives us clear, early warnings from scattered data, allowing us to provide timely counseling and support. It's a game-changer for student engagement and success.”
          </blockquote>
          <cite className="block font-semibold text-gray-600 mt-6 not-italic">
            - Dr. Anjali Sharma, Academic Mentor
          </cite>
        </motion.div>
      </div>
    </section>
  );
}