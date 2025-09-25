'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Edit, Clock, CheckCircle, XCircle, Building2, Tag, Award, Hash, X, FileImage } from 'lucide-react';

// --- Self-contained Button Component ---
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
interface StudentCommunityProjectsProps {
  projects: any[];
  handleSubmitAnswer: (formData: FormData) => Promise<void>;
}

export default function StudentCommunityProjects({ projects, handleSubmitAnswer }: StudentCommunityProjectsProps) {
  const [answerText, setAnswerText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selectedProject) {
        dialogRef.current?.showModal();
    } else {
        dialogRef.current?.close();
    }
  }, [selectedProject]);

  const handleOpenModal = (project: any) => {
    if (project.submissions.length === 0) {
        setSelectedProject(project);
    }
  };

  const handleCloseModal = () => {
    setAnswerText('');
    setImage(null);
    setImagePreview(null);
    setSelectedProject(null);
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
    if (!selectedProject) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('answerText', answerText);
    if (image) {
      formData.append('image', image);
    }
    formData.append('projectId', selectedProject.id);
    
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
        <h1 className="text-3xl font-bold text-slate-800">Community Projects</h1>
        <p className="text-slate-500">Participate in community projects and earn rewards by contributing your solutions.</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {!projects && <p>Loading projects...</p>}
        {projects && projects.map((p) => {
            const submission = p.submissions[0];
            const status = submission ? submission.status : 'NOT_ANSWERED';
            
            return (
                <motion.div 
                    key={p.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-md border border-slate-200/80 p-6"
                >
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <Hash size={16} className="text-slate-500" />
                            <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">{p.projectId}</span>
                        </div>
                        <StatusBadge status={status} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{p.title}</h3>
                    
                    {/* Meta Information Row */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">
                            <Building2 size={14} />
                            {p.organization}
                        </div>
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                            <Tag size={14} />
                            {p.domain}
                        </div>
                        {p.reward && (
                            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm font-medium">
                                <Award size={14} />
                                {p.reward} points reward
                            </div>
                        )}
                        {p.imageUrl && (
                            <div className="flex items-center gap-1 text-slate-500">
                                <FileImage size={14} />
                                <span className="text-xs">Image attached</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Description */}
                    <p className="text-slate-700 mb-4 line-clamp-3">{p.description}</p>
                    
                    {/* Project Image */}
                    {p.imageUrl && (
                        <div className="mb-4">
                            <img 
                                onClick={() => setZoomedImageUrl(p.imageUrl)} 
                                src={p.imageUrl} 
                                alt="Project" 
                                className="max-w-sm h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition" 
                            />
                        </div>
                    )}
                    
                    {/* User Submission (if exists) */}
                    {submission && (
                       <div className="mt-4 p-4 bg-slate-50 rounded-lg border space-y-2">
                            <p className="font-semibold text-sm text-slate-600">Your Submission:</p>
                            {submission.answerText && <p className="text-slate-800 text-sm whitespace-pre-wrap">{submission.answerText}</p>}
                            {submission.answerImageUrl && (
                                <img 
                                    onClick={() => setZoomedImageUrl(submission.answerImageUrl)} 
                                    src={submission.answerImageUrl} 
                                    alt="Your submitted answer" 
                                    className="max-w-xs rounded-md cursor-pointer hover:opacity-80 transition" 
                                />
                            )}
                       </div>
                    )}
                    
                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <Button 
                            onClick={() => handleOpenModal(p)} 
                            disabled={!!submission} 
                            className="w-full"
                        >
                           {submission ? `Status: ${status}` : 'Participate in Project'}
                        </Button>
                    </div>
                </motion.div>
            )
        })}
      </motion.div>

      {/* Modal Dialog */}
      <dialog ref={dialogRef} onClose={handleCloseModal} className="p-0 rounded-2xl shadow-2xl backdrop:bg-black/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <AnimatePresence>
        {selectedProject && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-2xl font-bold text-slate-800">Submit Your Solution</h2>
                         <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-slate-100">
                            <X size={20} className="text-slate-500"/>
                         </button>
                    </div>
                    
                    {/* Project Details in Modal */}
                    <div className="bg-slate-50 p-4 rounded-lg mb-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <Hash size={16} className="text-slate-500" />
                            <span className="font-mono text-slate-600">{selectedProject.projectId}</span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">{selectedProject.title}</h3>
                        
                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-1 text-blue-600 text-sm">
                                <Building2 size={12} />
                                {selectedProject.organization}
                            </div>
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                                <Tag size={12} />
                                {selectedProject.domain}
                            </div>
                            {selectedProject.reward && (
                                <div className="flex items-center gap-1 text-yellow-600 text-sm">
                                    <Award size={12} />
                                    {selectedProject.reward} points
                                </div>
                            )}
                        </div>
                        
                        <p className="text-slate-700 whitespace-pre-wrap">{selectedProject.description}</p>
                        
                        {selectedProject.details && (
                            <div className="pt-3 border-t border-slate-200">
                                <p className="font-semibold text-slate-800 mb-2">Additional Details:</p>
                                <p className="text-slate-600 whitespace-pre-wrap">{selectedProject.details}</p>
                            </div>
                        )}
                        
                        {selectedProject.imageUrl && (
                            <img 
                                onClick={() => setZoomedImageUrl(selectedProject.imageUrl)} 
                                src={selectedProject.imageUrl} 
                                alt="Project" 
                                className="max-w-full rounded-lg cursor-pointer hover:opacity-80 transition" 
                            />
                        )}
                    </div>
                    
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea 
                            value={answerText} 
                            onChange={(e) => setAnswerText(e.target.value)} 
                            placeholder="Describe your solution, approach, or contribution to this project..." 
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                            rows={6} 
                            disabled={isSubmitting} 
                            required
                        />
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            disabled={isSubmitting} 
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg" />}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button 
                                type='button' 
                                onClick={handleCloseModal} 
                                className="bg-slate-200 text-slate-700 hover:bg-slate-300 shadow-none focus:ring-slate-400" 
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isSubmitting}>
                                <Send size={16} className="mr-2"/>
                                {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
      </dialog>
      
      {/* Image Zoom Modal */}
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
