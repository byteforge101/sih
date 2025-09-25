'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Send, Edit, Clock, CheckCircle, XCircle, FileImage, X } from 'lucide-react';

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

// --- Status Badge Component ---
const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles: { [key: string]: { icon: React.ReactNode; text: string; classes: string } } = {
        PENDING: { icon: <Clock size={14} />, text: 'Pending Review', classes: 'bg-yellow-100 text-yellow-800' },
        APPROVED: { icon: <CheckCircle size={14} />, text: 'Approved', classes: 'bg-green-100 text-green-800' },
        DISAPPROVED: { icon: <XCircle size={14} />, text: 'Disapproved', classes: 'bg-red-100 text-red-800' },
        NOT_ANSWERED: { icon: <Edit size={14} />, text: 'Not Answered', classes: 'bg-slate-100 text-slate-800' },
    };

    const currentStatus = statusStyles[status] || statusStyles.NOT_ANSWERED;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${currentStatus?.classes}`}>
            {currentStatus?.icon}
            {currentStatus?.text}
        </div>
    );
};


// --- Main Component ---
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
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-slate-800">Community Questions</h1>
        <p className="text-slate-500">Answer questions from your mentor to earn rewards.</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!questions && <p>Loading questions...</p>}
        {questions && questions.map((q) => {
            const submission = q.submissions[0];
            const status = submission ? submission.status : 'NOT_ANSWERED';
            return (
                <motion.div 
                    key={q.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-md border border-slate-200/80 p-6 flex flex-col justify-between"
                >
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <StatusBadge status={status} />
                             {q.imageUrl && <FileImage size={18} className="text-slate-400"  aria-label="Image Attached"/>}
                        </div>
                        <p className="whitespace-pre-wrap text-slate-700 line-clamp-5 mb-4">{q.description}</p>
                        {q.imageUrl && (
                            <div className="mb-4 overflow-hidden rounded-lg">
                                <img onClick={() => setZoomedImageUrl(q.imageUrl)} src={q.imageUrl} alt="Question" className="w-full h-40 object-cover cursor-pointer hover:opacity-80 transition" />
                            </div>
                        )}
                        {submission && (
                           <div className="mt-4 p-3 bg-slate-50 rounded-lg border space-y-2">
                                <p className="font-semibold text-sm text-slate-600">Your Answer:</p>
                                {submission.answerText && <p className="text-slate-800 text-sm">{submission.answerText}</p>}
                                {submission.answerImageUrl && (
                                    <img onClick={() => setZoomedImageUrl(submission.answerImageUrl)} src={submission.answerImageUrl} alt="Your submitted answer" className="max-w-xs rounded-md cursor-pointer hover:opacity-80 transition" />
                                )}
                           </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <Button onClick={() => handleOpenModal(q)} disabled={!!submission} className="w-full">
                           {submission ? `Status: ${status}` : 'Answer Question'}
                        </Button>
                    </div>
                </motion.div>
            )
        })}
      </motion.div>

      <dialog 
        ref={dialogRef} 
        onClose={handleCloseModal} 
        // FIX: Add classes to force center alignment (often needed due to browser defaults/CSS)
        className="p-0 rounded-2xl shadow-2xl backdrop:bg-black/50 w-full max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <AnimatePresence>
        {selectedQuestion && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-2xl font-bold text-slate-800">Submit Your Answer</h2>
                         <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-slate-100">
                            <X size={20} className="text-slate-500"/>
                         </button>
                    </div>
                    <p className="text-slate-600 mb-4 border-l-4 border-indigo-200 pl-4">{selectedQuestion.description}</p>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="Type your answer here..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" rows={5} disabled={isSubmitting} />
                        <input type="file" accept="image/*" onChange={handleImageChange} disabled={isSubmitting} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg" />}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type='button' onClick={handleCloseModal} className="bg-slate-200 text-slate-700 hover:bg-slate-300 shadow-none focus:ring-slate-400" disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" isLoading={isSubmitting}><Send size={16} className="mr-2"/>{isSubmitting ? 'Submitting...' : 'Submit Answer'}</Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
      </dialog>
      
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
                    onClick={(e) => e.stopPropagation()}
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