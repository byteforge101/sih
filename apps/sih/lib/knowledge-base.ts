// knowledge-base.ts

interface Knowledge {
  keywords: string[]; // A list of keywords that will trigger this answer
  answer: string;
}

export const knowledgeBase: Knowledge[] = [
  {
    keywords: ["attendance", "mark", "file", "present", "log"],
    answer: "In our system, only Mentors are authorized to log student attendance. They can do this by navigating to the attendance page on their dashboard, which uses a real-time facial recognition feature to automatically list present students."
  },
  {
    keywords: ["chatbot", "help", "who", "what", "are", "you"],
    answer: "I am the Learnova Assistant, an AI-powered helper for this platform. I can answer questions about how the system works or search the web for general information."
  },
  {
    keywords: ["enroll", "face", "facial", "recognition", "biometric"],
    answer: "Facial recognition enrollment is handled by an administrator or mentor. The system uses a smart capture feature to find a high-quality photo and securely save a student's facial data to their profile."
  },
  {
    keywords: ["rewards", "points", "community"],
    answer: "Students can earn reward points by participating in community projects. These points are displayed in the main application AppBar."
  },
];