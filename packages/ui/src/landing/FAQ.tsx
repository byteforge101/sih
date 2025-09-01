
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "How does the system detect at-risk students?", a: "It auto-ingests spreadsheets of attendance, scores, and fee records and applies transparent, rule-based thresholds to flag students in a clear, color-coded view. [cite: 8, 9, 10]" },
  { q: "Is the facial recognition attendance system mandatory?", a: "It is consent-based and designed to reduce proxy marking. [cite_start]The system includes fallback options to ensure reliable tracking for everyone. [cite: 12, 14]" },
  { q: "What are 'confusion hotspots'?", a: "The system analyzes student facial reactions and quick polls during a lecture to create heatmaps on the lecture timeline, showing where students are most confused. [cite_start]This helps teachers improve delivery. [cite: 16, 17]" },
  { q: "How does the Community-Linked Learning work?", a: "It bridges classroom learning with real-world local problems from partners like village councils and industries. [cite_start]Students can earn recognition and micro-scholarships for solving these issues. [cite: 22, 25]" },
];

const AccordionItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-left"
      >
        <span className="text-lg font-semibold text-gray-800">{q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-600">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10"
        >
            Frequently Asked Questions
        </motion.h2>
        <div>
          {faqs.map((faq, i) => (
             <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
             >
              <AccordionItem q={faq.q} a={faq.a} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}