'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowLeft, Check, X, MessageSquare, Image as ImageIcon } from 'lucide-react';

// --- Self-contained, restyled Button Component with Loader ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, isLoading, ...rest }) => {
  const baseClasses = `
    inline-flex items-center justify-center font-bold py-3 px-6 rounded-2xl 
    transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-lg border shadow-xl
  `;
  
  const combinedClassName = `${baseClasses} ${className || 'bg-white/15 border-white/25 text-white hover:bg-white/25 shadow-white/10 hover:scale-105 focus:ring-white/30'}`;

  return (
    <button className={combinedClassName.trim()} disabled={isLoading} {...rest}>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};


// --- Main Component ---
interface MentorCommunityQsProps {
  questions: any[];
  handleCreateQuestion: (formData: FormData) => Promise<void>;
  handleStatusUpdate: (submissionId: string, status: 'APPROVED' | 'DISAPPROVED') => Promise<void>;
}

export default function MentorCommunityQs({ questions, handleCreateQuestion, handleStatusUpdate }: MentorCommunityQsProps) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingSubmissionId, setUpdatingSubmissionId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData();
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }
    
    try {
      await handleCreateQuestion(formData);
      setDescription('');
      setImage(null);
      setImagePreview(null);
      if (e.target instanceof HTMLFormElement) {
          e.target.reset();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusClick = async (submissionId: string, status: 'APPROVED' | 'DISAPPROVED') => {
    setUpdatingSubmissionId(submissionId);
    try {
        await handleStatusUpdate(submissionId, status);
        setSelectedQuestion((prev: any) => ({
            ...prev,
            submissions: prev.submissions.map((sub: any) => 
                sub.id === submissionId ? { ...sub, status } : sub
            )
        }));
    } finally {
        setUpdatingSubmissionId(null);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };


  return (
    <div className="space-y-10 p-4 md:p-8 text-white">
      <AnimatePresence mode="wait">
        {selectedQuestion ? (
          <motion.div key="submissions-view" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <button onClick={() => setSelectedQuestion(null)} className="inline-flex items-center gap-2 font-bold text-gray-300 hover:text-white mb-8 transition-colors duration-300">
              <ArrowLeft size={20} />
              Back to All Questions
            </button>
            <div className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8 mb-8">
                <h2 className="text-lg font-bold text-gray-300 uppercase tracking-wider mb-4">Question:</h2>
                <p className="whitespace-pre-wrap text-gray-200 text-lg">{selectedQuestion.description}</p>
                {selectedQuestion.imageUrl && <img onClick={() => setZoomedImageUrl(selectedQuestion.imageUrl)} src={selectedQuestion.imageUrl} alt="Question" className="max-w-md rounded-2xl mt-4 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 border border-white/20 shadow-lg" />}
            </div>
             <h3 className="text-3xl font-black text-white mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">Submissions ({selectedQuestion.submissions.length})</h3>
             <div className="space-y-6">
                {selectedQuestion.submissions.map((s: any) => (
                  <div key={s.id} className="p-6 bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30">
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="font-bold text-white text-lg">{s.student.user.name}</p>
                              <p className="whitespace-pre-wrap text-gray-300 mt-2">{s.answerText}</p>
                          </div>
                          {s.status === 'PENDING' ? <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border shadow-lg bg-yellow-500/20 backdrop-blur-sm text-yellow-200 border-yellow-500/30">Pending</span>
                           : s.status === 'APPROVED' ? <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border shadow-lg bg-green-500/20 backdrop-blur-sm text-green-200 border-green-500/30">Approved</span>
                           : <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border shadow-lg bg-red-500/20 backdrop-blur-sm text-red-200 border-red-500/30">Disapproved</span>
                          }
                      </div>
                      {s.answerImageUrl && <img onClick={() => setZoomedImageUrl(s.answerImageUrl)} src={s.answerImageUrl} alt="Answer" className="max-w-xs rounded-xl mt-4 cursor-pointer hover:opacity-80 transition border border-white/20 shadow-lg" />}
                      {s.status === 'PENDING' && (
                          <div className="mt-6 pt-6 border-t border-white/20 flex items-center gap-4">
                              <Button onClick={() => handleStatusClick(s.id, 'APPROVED')} className="bg-green-500/20 border-green-500/30 text-green-200 hover:bg-green-500/30 !py-2 !px-4 text-sm" isLoading={updatingSubmissionId === s.id} disabled={!!updatingSubmissionId}><Check size={16} className="mr-1"/> Approve</Button>
                              <Button onClick={() => handleStatusClick(s.id, 'DISAPPROVED')} className="bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30 !py-2 !px-4 text-sm" isLoading={updatingSubmissionId === s.id} disabled={!!updatingSubmissionId}><X size={16} className="mr-1"/> Disapprove</Button>
                          </div>
                      )}
                  </div>
                ))}
                {selectedQuestion.submissions.length === 0 && <p className="text-gray-400">No submissions yet for this question.</p>}
             </div>
          </motion.div>
        ) : (
          <motion.div key="questions-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8">
                <h1 className="text-4xl font-black text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">Community Questions</h1>
                <p className="text-gray-300 text-lg font-medium">Post questions for your mentees and review their submissions.</p>
            </motion.div>
            <form onSubmit={handleSubmit} className="p-8 mt-10 bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 space-y-6">
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ask a new question..." className="w-full p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 shadow-lg text-lg" required disabled={isCreating} rows={4}/>
                <input type="file" accept="image/*" onChange={handleImageChange} disabled={isCreating} className="w-full p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white/20 file:text-white hover:file:bg-white/30 file:backdrop-blur-sm file:border file:border-white/20 file:shadow-lg transition-all duration-300"/>
                {imagePreview && <img src={imagePreview} alt="Preview" className="max-w-xs rounded-xl border border-white/20 shadow-lg" />}
                <Button type="submit" isLoading={isCreating} className="bg-gradient-to-r from-white/20 to-gray-200/20"><Upload size={18} className="mr-2"/> {isCreating ? 'Posting...' : 'Post Question'}</Button>
            </form>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {questions.map((q) => (
                <motion.div key={q.id} variants={itemVariants} onClick={() => setSelectedQuestion(q)} className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8 flex flex-col justify-between hover:shadow-3xl hover:shadow-black/40 hover:scale-[1.02] transition-all duration-500 group">
                    <div>
                        <p className="whitespace-pre-wrap text-gray-200 text-lg font-medium line-clamp-5 mb-6 group-hover:text-white transition-colors">{q.description}</p>
                        {q.imageUrl && <img onClick={(e) => { e.stopPropagation(); setZoomedImageUrl(q.imageUrl); }} src={q.imageUrl} alt="Question" className="w-full h-40 object-cover rounded-2xl mt-4 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 border border-white/20 shadow-lg" />}
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-sm font-bold text-gray-400 group-hover:text-gray-300 transition-colors">
                        <div className="flex items-center gap-1.5"><MessageSquare size={16}/><span>{q.submissions.length} Submissions</span></div>
                         <div className="flex items-center gap-1.5"><ImageIcon size={16}/><span>{q.imageUrl ? 'Image Attached' : 'No Image'}</span></div>
                    </div>
                </motion.div>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* --- Image Zoom Modal --- */}
      <AnimatePresence>
        {zoomedImageUrl && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setZoomedImageUrl(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            >
                <motion.img
                    layoutId={zoomedImageUrl}
                    src={zoomedImageUrl}
                    alt="Zoomed view"
                    className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border border-white/20"
                    onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking the image
                />
                 <button onClick={() => setZoomedImageUrl(null)} className="absolute top-6 right-6 p-3 bg-white/15 backdrop-blur-lg rounded-2xl text-white hover:bg-white/25 transition-all duration-300 shadow-xl border border-white/20">
                    <X size={28}/>
                 </button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}