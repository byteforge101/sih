// src/app/components/CTA.tsx
'use client';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Variants for staggering the content inside the card
const contentContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3, // Delay after the main card animates in
    },
  },
};

const contentItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          // Upgraded to a dark gradient theme with relative positioning for background elements
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-gray-900 p-10 md:p-16 text-center"
        >
          {/* Animated decorative background blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-radial from-blue-500/30 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <motion.div 
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-purple-500/30 to-transparent rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"
            animate={{
              transform: ['translate(50%, 50%)', 'translate(40%, 60%)', 'translate(50%, 50%)'],
              transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
            }}
          />

          <motion.div
            variants={contentContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10"
          >
            <motion.h2
              variants={contentItemVariants}
              className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text"
            >
              Ready to Achieve Maximum Change?
            </motion.h2>
            
            <motion.p
              variants={contentItemVariants}
              className="text-slate-300 mb-8 max-w-xl mx-auto text-lg"
            >
              [cite_start]Transform your institute into a hub of innovation and measurable societal impact using your existing resources. [cite: 27]
            </motion.p>
            
            <motion.div variants={contentItemVariants}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 transition-all text-lg"
              >
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}