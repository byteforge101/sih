'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowLeft, Check, X, MessageSquare, Image as ImageIcon, Building2, Tag, Award, Hash } from 'lucide-react';

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
interface MentorCommunityProjectsProps {
  projects: any[];
  handleCreateProject: (formData: FormData) => Promise<void>;
  handleStatusUpdate: (submissionId: string, status: 'APPROVED' | 'DISAPPROVED') => Promise<void>;
}

export default function MentorCommunityProjects({ projects, handleCreateProject, handleStatusUpdate }: MentorCommunityProjectsProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    organization: '',
    domain: '',
    details: '',
    reward: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingSubmissionId, setUpdatingSubmissionId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    setIsCreating(true);
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    
    if (image) {
      data.append('image', image);
    }
    
    try {
      await handleCreateProject(data);
      setFormData({
        projectId: '',
        title: '',
        description: '',
        organization: '',
        domain: '',
        details: '',
        reward: '',
      });
      setImage(null);
      setImagePreview(null);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusClick = async (submissionId: string, status: 'APPROVED' | 'DISAPPROVED') => {
    setUpdatingSubmissionId(submissionId);
    try {
        await handleStatusUpdate(submissionId, status);
        setSelectedProject((prev: any) => ({
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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {selectedProject ? (
          <motion.div key="submissions-view" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 font-semibold text-slate-600 hover:text-indigo-600 mb-6">
              <ArrowLeft size={20} />
              Back to All Projects
            </button>
            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200/50 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Hash size={16} className="text-slate-500" />
                  <span className="text-sm font-mono text-slate-600">{selectedProject.projectId}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedProject.title}</h2>
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Building2 size={14} />
                    {selectedProject.organization}
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <Tag size={14} />
                    {selectedProject.domain}
                  </div>
                  {selectedProject.reward && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Award size={14} />
                      {selectedProject.reward} points
                    </div>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-slate-700 mb-4">{selectedProject.description}</p>
                {selectedProject.details && (
                  <div className="bg-slate-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-slate-800 mb-2">Project Details:</h3>
                    <p className="whitespace-pre-wrap text-slate-600">{selectedProject.details}</p>
                  </div>
                )}
                {selectedProject.imageUrl && <img onClick={() => setZoomedImageUrl(selectedProject.imageUrl)} src={selectedProject.imageUrl} alt="Project" className="max-w-md rounded-lg cursor-pointer hover:opacity-80 transition" />}
            </div>
             <h3 className="text-2xl font-bold text-slate-800 mb-4">Submissions ({selectedProject.submissions.length})</h3>
             <div className="space-y-4">
                {selectedProject.submissions.map((s: any) => (
                  <div key={s.id} className="p-4 bg-white rounded-xl shadow-md border border-slate-200/80">
                      <div className="flex justify-between items-start">
                          <div className="flex-1">
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
                {selectedProject.submissions.length === 0 && <p className="text-slate-500">No submissions yet for this project.</p>}
             </div>
          </motion.div>
        ) : (
          <motion.div key="projects-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-slate-800">Community Projects</h1>
                <p className="text-slate-500">Create and manage community projects for your mentees.</p>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="p-6 mt-8 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    placeholder="Project ID (e.g., PROJ-001)"
                    className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                    disabled={isCreating}
                  />
                  <input
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    placeholder="Organization"
                    className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                    disabled={isCreating}
                  />
                </div>
                
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Project Title"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                  disabled={isCreating}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    placeholder="Domain (e.g., Technology, Healthcare)"
                    className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                    disabled={isCreating}
                  />
                  <input
                    name="reward"
                    type="number"
                    value={formData.reward}
                    onChange={handleInputChange}
                    placeholder="Reward Points (optional)"
                    className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    disabled={isCreating}
                  />
                </div>
                
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Project Description"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  rows={3}
                  required
                  disabled={isCreating}
                />
                
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  placeholder="Additional Project Details (optional)"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  rows={3}
                  disabled={isCreating}
                />
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isCreating}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {imagePreview && <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg" />}
                <Button type="submit" isLoading={isCreating}><Upload size={18} className="mr-2"/> {isCreating ? 'Creating...' : 'Create Project'}</Button>
            </form>
            
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8 space-y-4">
                {projects.map((p) => (
                <motion.div key={p.id} variants={itemVariants} onClick={() => setSelectedProject(p)} className="bg-white rounded-xl shadow-md border border-slate-200/80 p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <Hash size={16} className="text-slate-500" />
                        <span className="text-sm font-mono text-slate-600">{p.projectId}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MessageSquare size={16}/>
                        <span className="text-sm">{p.submissions.length} Submissions</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{p.title}</h3>
                    
                    <div className="flex flex-wrap gap-3 mb-3">
                      <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-sm">
                        <Building2 size={12} />
                        {p.organization}
                      </div>
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                        <Tag size={12} />
                        {p.domain}
                      </div>
                      {p.reward && (
                        <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
                          <Award size={12} />
                          {p.reward} pts
                        </div>
                      )}
                    </div>
                    
                    <p className="text-slate-700 line-clamp-2">{p.description}</p>
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