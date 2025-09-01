
'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Free Plan',
    price: '$0',
    features: ['Access to basic courses', 'Limited project files', 'Email support'],
    isPopular: false,
  },
  {
    name: 'Trainer Plan',
    price: '$29',
    features: ['Access to all courses', 'Downloadable project files', 'Priority email support', 'Certificates of completion', 'Exclusive community access'],
    isPopular: true,
  },
  {
    name: 'Pro Plan',
    price: '$59',
    features: ['All Trainer Plan features', '1-on-1 mentorship sessions', 'Career guidance & portfolio review'],
    isPopular: false,
  },
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

export default function Pricing() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
            Choose What Works For You
        </motion.h2>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 mb-12 max-w-xl mx-auto"
        >
            Find a price that fits your learning goals, schedule, and budget.
        </motion.p>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {pricingTiers.map((tier) => (
            <motion.div 
              key={tier.name} 
              variants={itemVariants} 
              className={`rounded-xl p-8 shadow-lg text-left transition-transform duration-300 ${tier.isPopular ? 'bg-blue-600 text-white transform lg:scale-110' : 'bg-slate-50'}`}
            >
              <h3 className="text-2xl font-bold">{tier.name}</h3>
              <p className={`text-4xl font-extrabold my-4 ${tier.isPopular ? 'text-white' : 'text-gray-800'}`}>{tier.price}<span className="text-lg font-normal">/month</span></p>
              <ul className="space-y-4 my-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className={`w-5 h-5 mr-2 flex-shrink-0 ${tier.isPopular ? 'text-white' : 'text-blue-600'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-semibold ${tier.isPopular ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                Choose Plan
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}