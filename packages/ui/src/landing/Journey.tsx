
'use client';
import { motion } from 'framer-motion';

const steps = [
  { number: '01', title: 'Browse Courses', description: 'Explore our wide range of courses.' },
  { number: '02', title: 'Enroll & Learn', description: 'Sign up and start your journey.' },
  { number: '03', title: 'Earn Certificate', description: 'Get certified upon completion.' },
  { number: '04', title: 'Advance Career', description: 'Apply new skills and grow.' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Journey() {
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
            Your Learning Journey In 4 Simple Steps
        </motion.h2>
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={itemVariants} className="text-center">
              <div className="text-5xl font-bold text-blue-200 mb-2">{step.number}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}