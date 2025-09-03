// In apps/sih/app/mainapp/meeting/MeetingRoom.tsx

'use client';

import React, { useEffect, useRef } from 'react';

export default function MeetingRoom() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // We don't need the useState for the stream anymore for this part.
  
  useEffect(() => {
    let localStream: MediaStream | null = null;

    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        localStream = mediaStream; // Store the stream in a local variable
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    getMedia();

    // Cleanup function
    return () => {
      if (localStream) {
        // Stop all tracks in the stream when the component unmounts
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // --- CHANGE IS HERE: Empty dependency array ensures this runs only ONCE. ---

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Video Meeting</h1>
      <div className="bg-black rounded-lg shadow-lg w-full max-w-2xl mx-auto aspect-video overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>
  );
}