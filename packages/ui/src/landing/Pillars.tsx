
'use client';
import { motion } from 'framer-motion';

const pillars = [
  { number: '1', title: 'Early Intervention Dashboard', description: 'Flags at-risk students using attendance, scores, and fees data.' },
  { number: '2', title: 'Facial Recognition Attendance', description: 'Reduces proxy marking and ensures reliable engagement tracking.' },
  { number: '3', title: 'Lecture Sentiment Heatmaps', description: 'Visualizes "confusion hotspots" on lecture timelines.' },
  { number: '4', title: 'AI-Powered 3D Whiteboard', description: 'Converts teacher gestures into interactive 3D diagrams.' },
  { number: '5', title: 'Community-Linked Learning', description: 'Bridges learning with real-world local problems.' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Pillars() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6 text-center">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
        >
            Five Futuristic Pillars
        </motion.h2>
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
        >
          {pillars.map((pillar) => (
            <motion.div key={pillar.number} variants={itemVariants} className="text-center p-4">
              <div className="text-5xl font-bold text-blue-600 mb-2">{pillar.number}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{pillar.title}</h3>
              <p className="text-gray-500">{pillar.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}