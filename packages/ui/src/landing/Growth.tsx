
'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Growth() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row items-center gap-12"
        >
          <div className="lg:w-1/2">
            <div className="w-full h-80 bg-gray-200 rounded-lg shadow-lg">
              {/* Placeholder for an engaging image */}
            </div>
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Gateway To Personal And Professional Growth
            </h2>
            <p className="text-gray-600 mb-8">
              We are dedicated to providing an unparalleled learning experience that is accessible, high-quality, and impactful.
            </p>
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Accessibility</h3>
                  <p className="text-gray-500">Learn from anywhere, at any time.</p>
                </div>
              </div>
               <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Quality</h3>
                  <p className="text-gray-500">Courses taught by industry experts.</p>
                </div>
              </div>
               <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Impact</h3>
                  <p className="text-gray-500">Gain practical skills for real-world success.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}