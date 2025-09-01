
'use client';
import { motion, Variants } from 'framer-motion';
import { UploadCloud, Rss, UserCheck, MessageSquareHeart } from 'lucide-react';


const features = [
  { icon: UploadCloud, title: "Auto-Ingest Spreadsheets", description: "Easily upload existing data for attendance, scores, and fees." },
  { icon: Rss, title: "Rule-Based Thresholds", description: "Transparent, customizable rules flag at-risk students automatically." },
  { icon: UserCheck, title: "Timely Alerts", description: "Mentors and guardians are notified instantly of any warning signs." },
  { icon: MessageSquareHeart, title: "Counseling Support", description: "Provides a framework for guidance and student recovery." },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring' } }
};

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12"
        >
            Dashboard Features for Early Intervention
        </motion.h2>
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <div className="bg-slate-50 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow flex flex-col sm:flex-row items-center gap-6">
                <div className="text-blue-600 bg-blue-100 p-4 rounded-full">
                    <feature.icon className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                    <p className="text-gray-500 mt-1">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}