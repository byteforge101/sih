// File: packages/ui/index.tsx
"use client";
export * from "./src/Button";
export * from "./src/EnrollStudentFace"; // <-- Add this line
export * from "./src/FaceRecognizer"; // <-- Add this line
export * from "./src/AttendanceList";
export * from "./src/CurricularUnitForm";

export * from "./src/Chatbot";
export { default as MentorCommunityProjects } from './src/community/MentorCommunityProjects';
export { default as StudentCommunityProjects } from './src/community/StudentCommunityProjects';
