// Chatbot.tsx (The @repo/ui component)
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, Loader2, Search } from 'lucide-react';

export interface SearchResult {
  text: string;
  sources: Array<{ uri: string; title: string }>;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  sources: Array<{ uri: string; title: string }>;
}

interface ChatbotProps {
  onSearchKnowledgeBase: (
    userQuery: string
  ) => Promise<SearchResult>;
}

export function Chatbot({ onSearchKnowledgeBase }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX APPLIED: Changed scrollByID to the correct function: scrollIntoView
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    const userMessage: Message = { role: 'user', text: userQuery, sources: [] };
    
    // 1. Add user message
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Call the simple search function
      const searchResult: SearchResult = await onSearchKnowledgeBase(userQuery);
      
      const modelMessage: Message = {
        role: 'model',
        text: searchResult.text.trim() || 'I couldn\'t find a direct answer in the knowledge base. Please try rephrasing your question.',
        sources: searchResult.sources || [],
      };

      // 3. Add the result message
      setMessages((prev) => [...prev, modelMessage]);

    } catch (error) {
      console.error("Knowledge base search failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Sorry, the knowledge base search failed due to an internal error.',
          sources: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg"
        aria-label="Open chatbot"
      >
        <Bot size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border"
          >
            <header className="p-4 bg-slate-50 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bot className="text-blue-600" />
                <h2 className="font-bold text-slate-800">Learnova Search Assistant</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-200">
                <X size={20} className="text-slate-600" />
              </button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-full h-fit"><Bot size={16} /></div>
                  <div className="p-3 bg-slate-100 rounded-lg max-w-xs">
                    <p className="text-sm">Hello! How may I help you. What are you looking for?</p>
                  </div>
                </div>

                {messages.map((msg, index) => (
                  <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'model' && <div className="p-2 bg-blue-600 text-white rounded-full h-fit self-start"><Bot size={16} /></div>}
                    <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      {(msg.sources?.length ?? 0) > 0 && (
                        <div className="mt-3 border-t pt-2">
                          <h4 className="text-xs font-bold flex items-center gap-1 mb-1"><Search size={12} /> Sources:</h4>
                          <ul className="space-y-1">
                            {msg.sources?.map((source, i) => (
                              <li key={i}>
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-blue-400 truncate block">
                                  {source.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && <div className="p-2 bg-slate-200 rounded-full h-fit self-start"><User size={16} /></div>}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-center">
                    <Loader2 className="animate-spin text-slate-400" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t bg-slate-50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Search..."
                  className="w-full p-3 pr-12 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-300"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}