'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Briefcase,
  Smartphone,
  Hash,
  Calendar,
  Eye,
  EyeOff,
  GraduationCap,
  LucideIcon,
} from 'lucide-react';

// A simple SVG for the Google icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.64C34.311 4.764 29.492 2.5 24 2.5C11.318 2.5 1.5 12.318 1.5 25s9.818 22.5 22.5 22.5c11.936 0 21.64-8.736 22.446-20.417l.165-1.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691c3.84-2.48 8.481-4.119 13.694-4.119c3.059 0 5.842 1.154 7.961 3.039l5.841-5.841C34.311 4.764 29.492 2.5 24 2.5C16.318 2.5 9.818 6.318 6.306 11.691l4.438 3.00z"
    />
    <path
      fill="#4CAF50"
      d="M24 47.5c5.492 0 10.311-2.264 13.802-6.14l-5.841-5.841c-2.119 1.885-4.902 3.039-7.961 3.039c-5.223 0-9.654-3.343-11.303-8H4.554c.806 11.682 10.514 20.417 22.446 20.417l.054-.001z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.082 5.571l5.841 5.841C40.098 35.618 43.309 30.686 43.611 25.083l-.001-5z"
    />
  </svg>
);

const images = [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  Icon: LucideIcon;
  placeholder: string;
  type: string;
}

const formVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

const InputWithIcon = ({ Icon, ...props }: InputWithIconProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
        <Icon className="text-slate-400" size={20} />
      </div>
      <input 
        {...props}
        className="w-full pl-8 pr-4 py-3 bg-transparent border-b-2 border-slate-300 focus:border-indigo-500 focus:outline-none transition"
      />
    </div>
  );
};

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl min-h-[70vh] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden"
      >
        {/* Decorative Panel */}
        <div className="hidden md:block relative">
            <AnimatePresence>
                <motion.div
                    key={imageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${images[imageIndex]})` }}
                />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 to-indigo-700/80" />
            
            <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                <div>
                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm w-fit">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <GraduationCap size={32} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Student Success AI</h1>
                    </div>
                    <p className="mt-8 text-indigo-100 text-lg leading-relaxed font-light backdrop-blur-[2px]">
                        Empowering institutions with AI to predict student success and foster growth. Welcome to the future of education.
                    </p>
                </div>
                <div className="text-sm text-indigo-300">
                    &copy; {new Date().getFullYear()} Student Success AI.
                </div>
            </div>
        </div>

        {/* Form Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
            <div className="w-full">
                 <div className="relative mx-auto mb-10 w-fit bg-slate-100 p-1.5 rounded-full flex items-center gap-2">
                    <button
                    onClick={() => setIsSignUp(false)}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                        !isSignUp ? 'text-white' : 'text-slate-600'
                    }`}
                    >
                    Sign In
                    </button>
                    {!isSignUp && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-indigo-600 shadow-lg rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                    )}
                    <button
                    onClick={() => setIsSignUp(true)}
                    className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                        isSignUp ? 'text-white' : 'text-slate-600'
                    }`}
                    >
                    Sign Up
                    </button>
                    {isSignUp && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-indigo-600 shadow-lg rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                    )}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                    key={isSignUp ? 'signup' : 'signin'}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.3 }}
                    >
                    {isSignUp ? <SignUpForm /> : <SignInForm />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

type UserRole = 'STUDENT' | 'MENTOR' | 'GUARDIAN';

const SignUpForm = () => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
       <motion.div variants={formVariants} initial="hidden" animate="visible" custom={0} className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
        <p className="text-slate-500 mt-2">Join us to improve student success.</p>
      </motion.div>
      <form className="space-y-4">
        <motion.div variants={formVariants} initial="hidden" animate="visible" custom={1}><InputWithIcon Icon={User} type="text" placeholder="Full Name" /></motion.div>
        <motion.div variants={formVariants} initial="hidden" animate="visible" custom={2}><InputWithIcon Icon={Mail} type="email" placeholder="Email Address" /></motion.div>
        <motion.div variants={formVariants} initial="hidden" animate="visible" custom={3} className="relative">
            <InputWithIcon 
                Icon={Lock} 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
            />
            <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </motion.div>

        <motion.div variants={formVariants} initial="hidden" animate="visible" custom={4}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">I am a...</label>
            <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 bg-white border-b-2 border-slate-300 focus:border-indigo-500 focus:outline-none transition appearance-none"
            >
                <option value="STUDENT">Student</option>
                <option value="MENTOR">Mentor</option>
                <option value="GUARDIAN">Guardian</option>
            </select>
        </motion.div>
        
        <AnimatePresence>
        {role === 'STUDENT' && (
            <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
            >
                <InputWithIcon Icon={Hash} type="text" placeholder="Roll Number" />
                <InputWithIcon Icon={Calendar} type="number" placeholder="Enrollment Year (e.g., 2023)" />
            </motion.div>
        )}
        {role === 'MENTOR' && (
             <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
            >
                <InputWithIcon Icon={Briefcase} type="text" placeholder="Department" />
            </motion.div>
        )}
        {role === 'GUARDIAN' && (
             <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
            >
                <InputWithIcon Icon={Smartphone} type="tel" placeholder="Phone Number" />
            </motion.div>
        )}
        </AnimatePresence>


        <motion.button variants={formVariants} initial="hidden" animate="visible" custom={5} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Create Account
        </motion.button>
      </form>
    </div>
  );
};

const SignInForm = () => {
  return (
    <div className="space-y-6">
      <motion.div variants={formVariants} initial="hidden" animate="visible" custom={0} className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
        <p className="text-slate-500 mt-2">Sign in to continue to your dashboard.</p>
      </motion.div>
      <form className="space-y-4">
        <motion.div variants={formVariants} initial="hidden" animate="visible" custom={1}><InputWithIcon Icon={Mail} type="email" placeholder="email@example.com" /></motion.div>
        <motion.div variants={formVariants} initial="hidden" animate="visible" custom={2}><InputWithIcon Icon={Lock} type="password" placeholder="Password" /></motion.div>

        <motion.button variants={formVariants} initial="hidden" animate="visible" custom={3} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign In
        </motion.button>

        <motion.div variants={formVariants} initial="hidden" animate="visible" custom={4} className="flex items-center my-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
        </motion.div>

        <motion.button variants={formVariants} initial="hidden" animate="visible" custom={5} type="button" className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <GoogleIcon />
            Sign in with Google
        </motion.button>
      </form>
    </div>
  );
};

export default AuthPage;
