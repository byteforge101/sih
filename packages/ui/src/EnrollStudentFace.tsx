"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "./Button";

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

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">Smart Face Enrollment</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-md w-full md:w-1/2"
          mirrored={true}
        />
        <div className="w-full md:w-1/2">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured student"
              className="rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-center p-4">
              <p className="text-slate-600">{message}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        {status === "IDLE" && (
          <Button onClick={startAnalysis}>Start Auto-Capture</Button>
        )}
        {status === "ANALYZING" && (
          <Button onClick={reset} className="bg-red-500 hover:bg-red-700">
            Cancel
          </Button>
        )}
        {status === "CAPTURED" && (
          <>
            <Button
              onClick={onEnrollSubmit}
              className="bg-green-500 hover:bg-green-700"
            >
              Enroll This Photo
            </Button>
            <Button
              onClick={reset}
              className="bg-yellow-500 hover:bg-yellow-700"
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
        <p className="mt-4 text-center font-bold">{message}</p>
      )}
    </div>
  );
};