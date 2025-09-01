// src/app/components/Features.tsx
'use client';
import { motion, Variants } from 'framer-motion';
import { UploadCloud, Rss, UserCheck, MessageSquareHeart } from 'lucide-react';

// We've added color classes to each feature object for unique styling.
const features = [
  { 
    icon: UploadCloud, 
    title: "Auto-Ingest Spreadsheets", 
    description: "Easily upload existing data for attendance, scores, and fees.",
    colorClasses: { 
      bg: 'bg-cyan-50', 
      text: 'text-cyan-600', 
      shadow: 'hover:shadow-cyan-500/10' 
    } 
  },
  { 
    icon: Rss, 
    title: "Rule-Based Thresholds", 
    description: "Transparent, customizable rules flag at-risk students automatically.",
    colorClasses: { 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-600', 
      shadow: 'hover:shadow-emerald-500/10' 
    } 
  },
  { 
    icon: UserCheck, 
    title: "Timely Alerts", 
    description: "Mentors and guardians are notified instantly of any warning signs.",
    colorClasses: { 
      bg: 'bg-amber-50', 
      text: 'text-amber-600', 
      shadow: 'hover:shadow-amber-500/10' 
    } 
  },
  { 
    icon: MessageSquareHeart, 
    title: "Counseling Support", 
    description: "Provides a framework for guidance and student recovery.",
    colorClasses: { 
      bg: 'bg-rose-50', 
      text: 'text-rose-600', 
      shadow: 'hover:shadow-rose-500/10' 
    } 
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

// Changed animation from slide-in-x to slide-in-y for a smoother grid reveal.
const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

export default function Features() {
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Dashboard Features for Early Intervention
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            A proactive toolkit designed to turn data into decisive action for student success.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          // Changed from a single column list to a responsive grid.
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              {/* Card design is upgraded with gradients, borders, and dynamic colored shadows. */}
              <div className={`p-8 h-full rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${feature.colorClasses.shadow}`}>
                <div className="flex flex-col items-center text-center">
                  {/* The icon now uses the unique color assigned to it. */}
                  <div className={`p-4 rounded-full mb-6 ${feature.colorClasses.bg}`}>
                    <feature.icon className={`w-8 h-8 ${feature.colorClasses.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}