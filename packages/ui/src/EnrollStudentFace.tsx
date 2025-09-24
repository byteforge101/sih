"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

// --- Glass Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}
  
const Button: React.FC<ButtonProps> = ({ children, className, isLoading, ...rest }) => {
    const baseClasses = `
      inline-flex items-center justify-center font-semibold py-2 px-4 rounded-xl 
      transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-lg border shadow-lg
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

// --- API Configuration ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const IS_SECURE = API_BASE_URL.startsWith("https");

const getWebSocketUrl = (path: string) => {
  const protocol = IS_SECURE ? "wss://" : "ws://";
  const domain = API_BASE_URL.replace(/^https?:\/\//, '');
  return `${protocol}${domain}${path}`;
};

type Status =
  | "IDLE"
  | "ANALYZING"
  | "CAPTURED"
  | "ENROLLING"
  | "SUCCESS"
  | "ERROR";

interface EnrollStudentFaceProps {
    handleEnroll: (formData: FormData) => Promise<{ message: string }>;
}

export const EnrollStudentFace = ({ handleEnroll }: EnrollStudentFaceProps) => {
  const webcamRef = useRef<Webcam>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("IDLE");
  const [message, setMessage] = useState(
    "Click 'Start Auto-Capture' to begin."
  );

  const captureAndLock = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setStatus("CAPTURED");
      setMessage("✅ High-quality face captured! Ready to enroll.");
      socketRef.current?.close();
    }
  }, [webcamRef]);

  const startAnalysis = useCallback(() => {
    setStatus("ANALYZING");
    setMessage("Starting analysis... Please look at the camera.");

    const ws = new WebSocket(getWebSocketUrl("/ws/analyze_face"));
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Analysis WebSocket connected");
      const intervalId = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN && webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) ws.send(imageSrc);
        } else {
          clearInterval(intervalId);
        }
      }, 500);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.face_found) {
        setMessage(
          `Face detected. Confidence: ${Math.round(data.confidence * 100)}%. Hold still...`
        );
        if (data.confidence > 0.99) {
          captureAndLock();
        }
      } else {
        setMessage("Looking for a face... Make sure you are well-lit.");
      }
    };

    ws.onclose = () => console.log("Analysis WebSocket disconnected");
    ws.onerror = (error) => {
      console.error("Analysis WebSocket error:", error);
      setStatus("ERROR");
      setMessage("Could not connect to analysis service.");
    };
  }, [captureAndLock]);

  const onEnrollSubmit = async () => {
    if (!capturedImage) return;
    setStatus("ENROLLING");
    setMessage("Enrolling your face...");

    try {
      const imageBlob = await fetch(capturedImage).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", imageBlob, `enrollment.jpg`);
      
      const result = await handleEnroll(formData);

      setStatus("SUCCESS");
      setMessage(`✅ Success! ${result.message}`);
      setCapturedImage(null);
      setTimeout(() => setStatus("IDLE"), 5000);
    } catch (error: any) {
      setStatus("ERROR");
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  useEffect(() => {
    return () => socketRef.current?.close();
  }, []);

  const reset = () => {
    setStatus("IDLE");
    setCapturedImage(null);
    setMessage("Click 'Start Auto-Capture' to begin.");
    socketRef.current?.close();
  };

  const getStatusColor = () => {
    switch (status) {
        case "SUCCESS": return "text-green-300";
        case "ERROR": return "text-red-300";
        default: return "text-gray-300";
    }
  }

  return (
    <div className="bg-white/5  backdrop-blur-lg p-4 rounded-xl shadow-inner border border-white/10">
      <div className="flex flex-col md:flex-row gap-4">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-xl w-full md:w-1/2 shadow-md border border-white/20 aspect-square  object-cover"
          mirrored={true}
        />
        <div className="w-full md:w-1/2 aspect-square">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured student"
              className="rounded-xl w-full h-full object-cover shadow-md border border-white/20"
            />
          ) : (
            <div className="w-full h-full bg-black/20 rounded-xl flex items-center justify-center text-center p-2 border border-white/20">
              <p className="text-gray-300 text-base">{message}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {status === "IDLE" && (
          <Button onClick={startAnalysis}>Start Auto-Capture</Button>
        )}
        {status === "ANALYZING" && (
          <Button onClick={reset} className="bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30">
            Cancel
          </Button>
        )}
        {status === "CAPTURED" && (
          <>
            <Button
              onClick={onEnrollSubmit}
              className="bg-green-500/20 border-green-500/30 text-green-200 hover:bg-green-500/30"
            >
              Enroll This Photo
            </Button>
            <Button
              onClick={reset}
              className="bg-yellow-500/20 border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/30"
            >
              Try Again
            </Button>
          </>
        )}
        {(status === "ENROLLING" || status === "SUCCESS" || status === "ERROR") && (
          <Button onClick={reset}>Enroll Another</Button>
        )}
      </div>
       {(status === "ENROLLING" || status === "SUCCESS" || status === "ERROR") && (
        <p className={`mt-4 text-center text-base font-semibold ${getStatusColor()}`}>{message}</p>
      )}
    </div>
  );
};

