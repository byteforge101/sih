
'use client';
import { motion, Variants } from 'framer-motion';
import { HeartPulse, Code, Languages, PenTool } from 'lucide-react';

const categories = [
  { icon: HeartPulse, title: 'Health & Wellness', color: 'bg-green-100', textColor: 'text-green-700' },
  { icon: Code, title: 'Technology & Development', color: 'bg-blue-100', textColor: 'text-blue-700' },
  { icon: Languages, title: 'Language & Communication', color: 'bg-purple-100', textColor: 'text-purple-700' },
  { icon: PenTool, title: 'Design & Creativity', color: 'bg-orange-100', textColor: 'text-orange-700' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

export default function Categories() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-blue-600">Categories</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Professionally Aligned Learning Categories
          </h2>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {categories.map((cat) => (
            <motion.div key={cat.title} variants={itemVariants}>
              <div className={`p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${cat.color} ${cat.textColor}`}>
                <cat.icon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold">{cat.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}