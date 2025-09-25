// ChatbotContainer.tsx
'use client';

// Assuming @repo/ui exports Chatbot and SearchResult
import { Chatbot as ChatbotUI, SearchResult } from '@repo/ui'; 
import { knowledgeBase } from '@/lib/knowledge-base'; // Adjust path if necessary

// --- Define Types for Local Search ---
// These types ensure consistency between the knowledge base and the UI's expected output.

interface Knowledge {
    keywords: string[]; 
    answer: string;
}

interface LocalSearchResult {
    text: string;
    sources: Array<{ uri: string; title: string }>; // Required by ChatbotUI
}

// Assume '@/lib/knowledge-base' exports:
// export const knowledgeBase: Knowledge[] = [ ... ];


/**
 * Searches the local knowledge base array based on user query keywords.
 * This simulates the keyword-search capability.
 */
const searchKnowledgeBase = async (userQuery: string): Promise<LocalSearchResult> => {
    // 1. Sanitize and break the query into lowercase words, filtering out short common words
    const queryWords = userQuery.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    
    // 2. Perform the keyword search
    for (const item of knowledgeBase) {
        // Check if ANY keyword in the knowledge item is present in the user's query words
        const hasMatch = item.keywords.some(keyword => queryWords.includes(keyword));

        if (hasMatch) {
            // Found a match: return the answer and empty sources array
            return {
                text: item.answer,
                sources: [], // No external sources for local data
            };
        }
    }

    // 3. Fallback if no match is found
    return {
        text: 'I couldn\'t find a direct match in the knowledge base for those keywords. Please try rephrasing your question.',
        sources: [],
    };
};


/**
 * Client-side wrapper that passes the keyword-search function to the Chatbot UI.
 */
export function ChatbotContainer() {
  // Pass the local search function to the component
  return <ChatbotUI onSearchKnowledgeBase={searchKnowledgeBase} />;
}