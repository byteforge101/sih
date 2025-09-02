'use client';
import { motion, Variants } from 'framer-motion';
import { LayoutDashboard, UserIcon, Smile, Box, Globe } from 'lucide-react';
import React from 'react';

const pillars = [
  {
    number: '01',
    title: 'Early Intervention Dashboard',
    description: 'Flags at-risk students using attendance, scores, and fees data.',
    icon: <LayoutDashboard size={32} />,
  },
  {
    number: '02',
    title: 'Facial Recognition Attendance',
    description: 'Reduces proxy marking and ensures reliable engagement tracking.',
    icon: <UserIcon size={32} />,
  },
  {
    number: '03',
    title: 'Lecture Sentiment Heatmaps',
    description: 'Visualizes "confusion hotspots" on lecture timelines.',
    icon: <Smile size={32} />,
  },
  {
    number: '04',
    title: 'AI-Powered 3D Whiteboard',
    description: 'Converts teacher gestures into interactive 3D diagrams.',
    icon: <Box size={32} />,
  },
  {
    number: '05',
    title: 'Community-Linked Learning',
    description: 'Bridges learning with real-world local problems.',
    icon: <Globe size={32} />,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

export default function Pillars() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-16"
        >
          Our Five <span className="bg-gradient-to-r from-blue-500 to-yellow-400 bg-clip-text text-transparent">Futuristic Pillars</span>
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 max-md:flex-col"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.number}
              variants={itemVariants}
              className="relative group bg-slate-50/70 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute -top-2 -right-2 text-8xl font-black text-slate-200/50 group-hover:text-slate-300/60 transition-colors duration-300">
                {pillar.number}
              </div>
              <div className="relative z-10 mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-100 to-blue-100 text-blue-600 shadow-inner">
                {pillar.icon}
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-600">{pillar.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
