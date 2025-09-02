
'use client';
import { motion } from 'framer-motion';

const steps = [
    { name: 'Data Ingestion', description: 'Upload scattered data like attendance and test scores. [cite: 5, 8]', isPopular: false },
    { name: 'AI-Powered Analysis', description: 'The system applies rules to identify early warning signs and flags at-risk students. [cite: 9, 10]', isPopular: true },
    { name: 'Intervention & Support', description: 'Mentors receive alerts and provide counseling to ensure student recovery. [cite: 10, 11]', isPopular: false },
  ];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function HowItWorks() {
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
            A Simple, Effective Process
        </motion.h2>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex  justify-center gap-4 max-md:flex-col"
        >
          {steps.map((step) => (
            <motion.div 
              key={step.name} 
              variants={itemVariants} 
              className={`rounded-xl p-8 shadow-lg text-left transition-transform duration-300 ${step.isPopular ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              <h3 className="text-2xl font-bold">{step.name}</h3>
              <p className={`my-4 ${step.isPopular ? 'text-blue-100' : 'text-gray-600'}`}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}