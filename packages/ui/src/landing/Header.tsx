// src/app/components/Header.tsx
'use client';
import { motion, Variants } from 'framer-motion';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { name: 'Pillars', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Impact', href: '#' },
  { name: 'FAQ', href: '#' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mobileMenuVariants:Variants = {
    open: {
      clipPath: `circle(150% at 90% 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2
      }
    },
    closed: {
      clipPath: "circle(0% at 90% 40px)",
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const listItemVariants:Variants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled ? 'bg-white/80 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a href="#" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-gray-700 bg-clip-text text-transparent">
              Student Success AI
            </h1>
          </a>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="relative text-gray-600 font-medium group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          >
            Dashboard Login
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        variants={mobileMenuVariants}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        className="md:hidden absolute top-0 right-0 h-screen w-full bg-white/95 backdrop-blur-lg"
      >
        <motion.ul 
          variants={{
            open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
            closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
          }}
          className="flex flex-col items-center justify-center h-full gap-8"
        >
          {navLinks.map((link) => (
            <motion.li key={link.name} variants={listItemVariants}>
              <a href={link.href} onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-gray-700 hover:text-blue-500">
                {link.name}
              </a>
            </motion.li>
          ))}
          <motion.li variants={listItemVariants}>
             <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-xl">
               Dashboard Login
             </button>
          </motion.li>
        </motion.ul>
      </motion.div>
    </header>
  );
}