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
    inline-flex items-center justify-center font-semibold py-2 px-4 rounded-lg 
    transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
  `;
  
  const combinedClassName = `${baseClasses} ${className || 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 focus:ring-indigo-500'}`;

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
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {selectedQuestion ? (
          <motion.div key="submissions-view" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <button onClick={() => setSelectedQuestion(null)} className="flex items-center gap-2 font-semibold text-slate-600 hover:text-indigo-600 mb-6">
              <ArrowLeft size={20} />
              Back to All Questions
            </button>
            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200/50 mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Question:</h2>
                <p className="whitespace-pre-wrap text-slate-700">{selectedQuestion.description}</p>
                {selectedQuestion.imageUrl && <img onClick={() => setZoomedImageUrl(selectedQuestion.imageUrl)} src={selectedQuestion.imageUrl} alt="Question" className="max-w-md rounded-lg mt-4 cursor-pointer hover:opacity-80 transition" />}
            </div>
             <h3 className="text-2xl font-bold text-slate-800 mb-4">Submissions ({selectedQuestion.submissions.length})</h3>
             <div className="space-y-4">
                {selectedQuestion.submissions.map((s: any) => (
                  <div key={s.id} className="p-4 bg-white rounded-xl shadow-md border border-slate-200/80">
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="font-bold text-slate-800">{s.student.user.name}</p>
                              <p className="whitespace-pre-wrap text-slate-600 mt-2">{s.answerText}</p>
                          </div>
                          {s.status === 'PENDING' ? <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Pending</span>
                           : s.status === 'APPROVED' ? <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Approved</span>
                           : <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Disapproved</span>
                          }
                      </div>
                      {s.answerImageUrl && <img onClick={() => setZoomedImageUrl(s.answerImageUrl)} src={s.answerImageUrl} alt="Answer" className="max-w-xs rounded-lg mt-3 cursor-pointer hover:opacity-80 transition" />}
                      {s.status === 'PENDING' && (
                          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2">
                              <Button onClick={() => handleStatusClick(s.id, 'APPROVED')} className="bg-green-500 hover:bg-green-600 text-white shadow-green-500/20 focus:ring-green-500 !py-1.5 !px-3 text-sm" isLoading={updatingSubmissionId === s.id} disabled={!!updatingSubmissionId}><Check size={16} className="mr-1"/> Approve</Button>
                              <Button onClick={() => handleStatusClick(s.id, 'DISAPPROVED')} className="bg-red-500 hover:bg-red-600 text-white shadow-red-500/20 focus:ring-red-500 !py-1.5 !px-3 text-sm" isLoading={updatingSubmissionId === s.id} disabled={!!updatingSubmissionId}><X size={16} className="mr-1"/> Disapprove</Button>
                          </div>
                      )}
                  </div>
                ))}
                {selectedQuestion.submissions.length === 0 && <p className="text-slate-500">No submissions yet for this question.</p>}
             </div>
          </motion.div>
        ) : (
          <motion.div key="questions-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-slate-800">Community Questions</h1>
                <p className="text-slate-500">Post questions for your mentees and review their submissions.</p>
            </motion.div>
            <form onSubmit={handleSubmit} className="p-6 mt-8 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/50 space-y-4">
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ask a new question..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required disabled={isCreating} />
                <input type="file" accept="image/*" onChange={handleImageChange} disabled={isCreating} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                {imagePreview && <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg" />}
                <Button type="submit" isLoading={isCreating}><Upload size={18} className="mr-2"/> {isCreating ? 'Posting...' : 'Post Question'}</Button>
            </form>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((q) => (
                <motion.div key={q.id} variants={itemVariants} onClick={() => setSelectedQuestion(q)} className="bg-white rounded-xl shadow-md border border-slate-200/80 p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                    <div>
                        <p className="whitespace-pre-wrap text-slate-700 line-clamp-4">{q.description}</p>
                        {q.imageUrl && <img onClick={(e) => { e.stopPropagation(); setZoomedImageUrl(q.imageUrl); }} src={q.imageUrl} alt="Question" className="w-full h-40 object-cover rounded-lg mt-4 cursor-pointer hover:opacity-80 transition" />}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-sm font-medium text-slate-500">
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
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.img
                    layoutId={zoomedImageUrl}
                    src={zoomedImageUrl}
                    alt="Zoomed view"
                    className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking the image
                />
                 <button onClick={() => setZoomedImageUrl(null)} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition">
                    <X size={24}/>
                 </button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}