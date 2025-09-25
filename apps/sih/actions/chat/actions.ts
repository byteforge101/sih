'use server';

import { knowledgeBase } from '@/lib/knowledge-base';

interface ChatHistory {
  role: 'user' | 'model';
  parts: { text: string }[];
}
export interface RagResponse {
  text: string;
  sources: Array<{ uri: string; title: string }>;
}

// --- searchWeb helper function ---
async function searchWeb(query: string): Promise<{ context: string, sources: RagResponse['sources'] }> {
  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    });
    if (!response.ok) return { context: "No context found.", sources: [] };
    const data = await response.json();
    const snippets = data.organic?.map((res: any) => res.snippet).join('\n') || "No context found.";
    const sources = data.organic?.slice(0, 3).map((res: any) => ({
      uri: res.link,
      title: res.title,
    })) || [];
    return { context: snippets, sources };
  } catch (error) {
    console.error("Search API error:", error);
    return { context: "Failed to fetch search results.", sources: [] };
  }
}

// --- searchKnowledgeBase helper function ---
function searchKnowledgeBase(query: string): string {
  const queryWords = query.toLowerCase().split(/\s+/);
  const bestMatch = knowledgeBase.find(item =>
    item.keywords.some(kw => queryWords.includes(kw))
  );
  return bestMatch ? bestMatch.answer : "";
}

// --- Main RAG Function with streaming ---
export async function getRagResponse(
  history: ChatHistory[],
  userQuery: string,
  onToken?: (token: string) => void // callback for progressive tokens
): Promise<RagResponse> {
  const llmApiUrl = process.env.LLM_API_URL;
  if (!llmApiUrl || !process.env.SERPER_API_KEY) {
    return { text: "Error: API URLs are not configured correctly.", sources: [] };
  }

  // 1. Check internal KB first
  const internalContext = searchKnowledgeBase(userQuery);
  if (internalContext) return { text: internalContext, sources: [] };

  // 2. If not found, search web
  const { context: webContext, sources } = await searchWeb(userQuery);

  // 3. Build prompt
  const prompt = `
Based on the following context, provide a helpful and concise answer to the user's question.
If the context is not relevant, answer based on general knowledge.

Context:
---
${webContext}
---

Question: ${userQuery}
`;

  // 4. Call self-hosted LLM API with streaming
  try {
    const response = await fetch(`${llmApiUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Self-hosted LLM request failed:", response.status, errorData);
      return {
        text: `Sorry, there was an issue with the AI model server: ${errorData.detail || 'Unknown Error'}`,
        sources: [],
      };
    }

    // Stream the response text token by token
    const reader = response.body?.getReader();
    if (!reader) return { text: "No response body.", sources: [] };

    let text = "";
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      text += chunk;
      if (onToken) onToken(chunk); // callback to frontend
    }

    return { text, sources };
  } catch (error) {
    console.error("Error calling self-hosted LLM API:", error);
    return { text: "Error: Could not connect to the chat service.", sources: [] };
  }
}
