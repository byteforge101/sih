'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Send, Edit, Clock, CheckCircle, XCircle, FileImage, X } from 'lucide-react';

// Ultra-modern glass Button component
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

// Enhanced glass Status Badge
const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles: { [key: string]: { icon: React.ReactNode; text: string; classes: string } } = {
        PENDING: { icon: <Clock size={14} />, text: 'Pending Review', classes: 'bg-yellow-500/20 backdrop-blur-sm text-yellow-200 border-yellow-500/30' },
        APPROVED: { icon: <CheckCircle size={14} />, text: 'Approved', classes: 'bg-green-500/20 backdrop-blur-sm text-green-200 border-green-500/30' },
        DISAPPROVED: { icon: <XCircle size={14} />, text: 'Disapproved', classes: 'bg-red-500/20 backdrop-blur-sm text-red-200 border-red-500/30' },
        NOT_ANSWERED: { icon: <Edit size={14} />, text: 'Not Answered', classes: 'bg-gray-500/20 backdrop-blur-sm text-gray-200 border-gray-500/30' },
    };

    const currentStatus = statusStyles[status] || statusStyles.NOT_ANSWERED;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border shadow-lg ${currentStatus?.classes}`}>
            {currentStatus?.icon}
            {currentStatus?.text}
        </div>
    );
};

interface StudentCommunityQsProps {
  questions: any[];
  handleSubmitAnswer: (formData: FormData) => Promise<void>;
}

export default function StudentCommunityQs({ questions, handleSubmitAnswer }: StudentCommunityQsProps) {
  const [answerText, setAnswerText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selectedQuestion) {
        dialogRef.current?.showModal();
    } else {
        dialogRef.current?.close();
    }
  }, [selectedQuestion]);

  const handleOpenModal = (question: any) => {
    if (question.submissions.length === 0) {
        setSelectedQuestion(question);
    }
  };

  const handleCloseModal = () => {
    setAnswerText('');
    setImage(null);
    setImagePreview(null);
    setSelectedQuestion(null);
  };

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
    if (!selectedQuestion) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('answerText', answerText);
    if (image) {
      formData.append('image', image);
    }
    formData.append('questionId', selectedQuestion.id);
    
    try {
      await handleSubmitAnswer(formData);
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-10 p-4">
      {/* Glass header section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8"
      >
        <h1 className="text-4xl font-black text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
          Community Questions
        </h1>
        <p className="text-gray-300 text-lg font-medium">Answer questions from your mentor to earn rewards.</p>
      </motion.div>

      {/* Glass question cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!questions && (
          <div className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 text-center">
            <p className="text-white text-lg">Loading questions...</p>
          </div>
        )}
        {questions && questions.map((q) => {
            const submission = q.submissions[0];
            const status = submission ? submission.status : 'NOT_ANSWERED';
            return (
                <motion.div 
                    key={q.id}
                    variants={itemVariants}
                    className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-black/30 p-8 flex flex-col justify-between hover:shadow-3xl hover:shadow-black/40 hover:scale-[1.02] transition-all duration-500 group"
                >
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <StatusBadge status={status} />
                            {q.imageUrl && <FileImage size={20} className="text-gray-400 group-hover:text-gray-300 transition-colors" aria-label="Image Attached"/>}
                        </div>
                        <p className="whitespace-pre-wrap text-gray-200 text-lg font-medium line-clamp-5 mb-6 group-hover:text-white transition-colors">{q.description}</p>
                        {q.imageUrl && (
                            <div className="mb-6 overflow-hidden rounded-2xl border border-white/20 shadow-lg">
                                <img onClick={() => setZoomedImageUrl(q.imageUrl)} src={q.imageUrl} alt="Question" className="w-full h-40 object-cover cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" />
                            </div>
                        )}
                        {submission && (
                           <div className="mt-6 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 space-y-3 shadow-xl">
                                <p className="font-bold text-sm text-gray-300 uppercase tracking-wide">Your Answer:</p>
                                {submission.answerText && <p className="text-white text-base font-medium">{submission.answerText}</p>}
                                {submission.answerImageUrl && (
                                    <img onClick={() => setZoomedImageUrl(submission.answerImageUrl)} src={submission.answerImageUrl} alt="Your submitted answer" className="max-w-xs rounded-xl cursor-pointer hover:opacity-80 transition border border-white/20 shadow-lg" />
                                )}
                           </div>
                        )}
                    </div>
                    <div className="mt-8">
                        <Button onClick={() => handleOpenModal(q)} disabled={!!submission} className="w-full text-lg">
                           {submission ? `Status: ${status}` : 'Answer Question'}
                        </Button>
                    </div>
                </motion.div>
            )
        })}
      </motion.div>

      {/* Centered glass modal dialog */}
      <dialog 
        ref={dialogRef} 
        onClose={handleCloseModal} 
        className="p-0 rounded-3xl shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm w-full max-w-2xl bg-white/8 backdrop-blur-2xl border border-white/20 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ margin: 0 }}
      >
        <AnimatePresence>
        {selectedQuestion && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                         <h2 className="text-3xl font-black text-white bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Submit Your Answer</h2>
                         <button onClick={handleCloseModal} className="p-3 bg-white/15 backdrop-blur-lg rounded-2xl hover:bg-white/25 border border-white/20 shadow-xl hover:scale-110 transition-all duration-300">
                            <X size={24} className="text-white"/>
                         </button>
                    </div>
                    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 mb-8 shadow-xl">
                      <p className="text-gray-200 text-lg font-medium border-l-4 border-white/30 pl-6">{selectedQuestion.description}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Your Answer</label>
                          <textarea 
                            value={answerText} 
                            onChange={(e) => setAnswerText(e.target.value)} 
                            placeholder="Type your answer here..." 
                            className="w-full p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 shadow-lg text-lg" 
                            rows={6} 
                            disabled={isSubmitting} 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Upload Image (Optional)</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            disabled={isSubmitting} 
                            className="w-full p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white/20 file:text-white hover:file:bg-white/30 file:backdrop-blur-sm file:border file:border-white/20 file:shadow-lg transition-all duration-300"
                          />
                        </div>
                        
                        {imagePreview && (
                          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4 shadow-xl">
                            <img src={imagePreview} alt="Preview" className="max-w-xs rounded-xl border border-white/20 shadow-lg" />
                          </div>
                        )}
                        
                        <div className="flex justify-end gap-4 pt-6">
                            <Button 
                              type='button' 
                              onClick={handleCloseModal} 
                              className="bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:text-white shadow-lg hover:scale-105" 
                              disabled={isSubmitting}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" isLoading={isSubmitting} className="bg-gradient-to-r from-white/20 to-gray-200/20">
                              <Send size={18} className="mr-2"/>
                              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
      </dialog>
      
      {/* Enhanced image zoom modal */}
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
                    onClick={(e) => e.stopPropagation()}
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