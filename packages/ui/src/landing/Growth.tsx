
'use client';
import { motion } from 'framer-motion';
import { GraduationCap, Rocket, Users } from 'lucide-react';

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
              {/* Placeholder for an impact-related image */}
            </div>
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Transforming Institutes into Hubs of Innovation
            </h2>
            <p className="text-gray-600 mb-8">
              [cite_start]Our platform enables early academic rescue, immersive learning, and social responsibility for a measurable societal impact. [cite: 27]
            </p>
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Early Academic Rescue</h3>
                  <p className="text-gray-500">Prevent failures before they happen.</p>
                </div>
              </div>
               <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Immersive Learning</h3>
                  [cite_start]<p className="text-gray-500">Engage students with low-cost, high-tech tools. [cite: 20]</p>
                </div>
              </div>
               <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Social Responsibility</h3>
                  [cite_start]<p className="text-gray-500">Connect students with community problems. [cite: 22]</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}