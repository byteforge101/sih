
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "Can I get a job after completing a course?", a: "Many of our students have successfully transitioned into new roles after completing our courses. We provide career guidance and portfolio reviews in our Pro Plan to help you succeed." },
  { q: "Can I learn at my own pace?", a: "Absolutely! All our courses are self-paced, allowing you to learn on a schedule that works for you." },
  { q: "What kind of support is available?", a: "We offer email support for all plans, priority support for the Trainer Plan, and 1-on-1 mentorship for the Pro Plan." },
  { q: "Are certificates internationally recognized?", a: "Our certificates are highly regarded by industry professionals and can be a valuable addition to your resume and LinkedIn profile." },
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
            Frequently Asked Question
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