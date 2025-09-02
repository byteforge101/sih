'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const AuthErrorPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-blue-500/10 p-8 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-5">
          <h3 className="text-2xl font-bold text-gray-800">
            Authentication Error
          </h3>
          <div className="mt-2">
            <p className="text-sm text-slate-500">
              Oops! Something went wrong while trying to sign you in. Please return to the login page and try again.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <button
            type="button"
            onClick={() => router.push('/auth')}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go back to Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthErrorPage;