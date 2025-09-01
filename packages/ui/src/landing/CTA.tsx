
'use client';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="py-20">
        <div className="container mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="bg-orange-100 rounded-lg p-10 md:p-16 text-center"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Ready To Start Learning?
                </h2>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                    Join thousands of learners who are unlocking their potential with Eduvance. Your new career is just a course away.
                </p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">
                    Join For Free
                </button>
            </motion.div>
        </div>
    </section>
  );
}