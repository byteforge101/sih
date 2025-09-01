
'use client';
import { motion } from 'framer-motion';

const posts = [
  { title: 'Balancing Work And Study: A Guide For Devs', excerpt: 'Discover tips, tools, and techniques for lifelong learning...' },
  { title: 'How to Choose the Right Online Course For You', excerpt: 'A step-by-step guide to finding your perfect course.' },
  { title: '2025 Skill Forward: The Top 10 Skills You Need', excerpt: 'Stay ahead of the curve with these in-demand skills.' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};


export default function Blog() {
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
          Insights & Ideas From Eduvance
        </motion.h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }} 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {posts.map((post) => (
            <motion.div key={post.title} variants={itemVariants} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <a href="#" className="font-semibold text-blue-600 hover:underline">Read More →</a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}