
'use client';
import { motion, Variants } from 'framer-motion';

const courses = [
  { title: "FullStack Web Development Bootcamp", instructor: "Brad Traversy", price: 199, rating: 4.8 },
  { title: "Advanced UI/UX Design Masterclass", instructor: "Zander White", price: 129, rating: 4.9 },
  { title: "Digital Marketing Strategy for 2025", instructor: "Mariah Grey", price: 99, rating: 4.7 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring' } }
};

export default function TopPicks() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12"
        >
            Top Picks To Kickstart Your Learning
        </motion.h2>
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
        >
          {courses.map((course) => (
            <motion.div key={course.title} variants={itemVariants}>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/3 h-48 bg-gray-200 rounded-md">
                    {/* Placeholder for course image */}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                    <p className="text-gray-500 mt-1">By {course.instructor}</p>
                    <div className="flex items-center mt-3">
                        <span className="text-yellow-500 font-bold">{course.rating} ⭐</span>
                        <span className="text-gray-400 ml-2">(1,234 reviews)</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mt-4">${course.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}