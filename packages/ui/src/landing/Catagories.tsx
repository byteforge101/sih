// src/app/components/Categories.tsx
'use client';
import { motion, Variants } from 'framer-motion';
import { HeartPulse, Code, Languages, PenTool, ArrowRight } from 'lucide-react';

// The data structure now includes classes for the unique color accents on each card.
const categories = [
  { 
    icon: HeartPulse, 
    title: 'Health & Wellness', 
    colorClasses: { 
      text: 'text-green-500', 
      shadow: 'hover:shadow-green-500/20',
      border: 'hover:border-green-500'
    } 
  },
  { 
    icon: Code, 
    title: 'Technology & Development', 
    colorClasses: { 
      text: 'text-blue-500', 
      shadow: 'hover:shadow-blue-500/20',
      border: 'hover:border-blue-500'
    } 
  },
  { 
    icon: Languages, 
    title: 'Language & Communication', 
    colorClasses: { 
      text: 'text-purple-500', 
      shadow: 'hover:shadow-purple-500/20',
      border: 'hover:border-purple-500'
    } 
  },
  { 
    icon: PenTool, 
    title: 'Design & Creativity', 
    colorClasses: { 
      text: 'text-orange-500', 
      shadow: 'hover:shadow-orange-500/20',
      border: 'hover:border-orange-500'
    } 
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
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
          className="text-center mb-16"
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
              {/* Upgraded card design with new hover effects and dynamic colors */}
              <div className={`group relative p-8 h-full rounded-xl bg-slate-50/50 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-transparent ${cat.colorClasses.border} ${cat.colorClasses.shadow}`}>
                <cat.icon className={`w-12 h-12 mb-4 transition-transform duration-300 group-hover:scale-110 ${cat.colorClasses.text}`} />
                <h3 className="text-xl font-bold text-gray-800">{cat.title}</h3>
                <div className="absolute bottom-8 left-8">
                  <div className="flex items-center gap-2 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className={cat.colorClasses.text}>Explore</span>
                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${cat.colorClasses.text}`} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}