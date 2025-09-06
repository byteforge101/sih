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

const getHttpUrl = (path: string) => {
  return `${API_BASE_URL}${path}`;
};
// -------------------------

type Status =
  | "IDLE"
  | "ANALYZING"
  | "CAPTURED"
  | "ENROLLING"
  | "SUCCESS"
  | "ERROR";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const EnrollStudentFace = () => {
  const webcamRef = useRef<Webcam>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [rollNumber, setRollNumber] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("IDLE");
  const [message, setMessage] = useState(
    "Enter a roll number and start auto-capture."
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
    if (!rollNumber) {
      setMessage("Please enter a roll number first.");
      return;
    }
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
  }, [rollNumber, captureAndLock]);

  const handleEnroll = async () => {
    if (!capturedImage || !rollNumber) return;

    setStatus("ENROLLING");
    setMessage("Enrolling student...");

    try {
      const imageBlob = await fetch(capturedImage).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", imageBlob, `${rollNumber}.jpg`);
      formData.append("roll_number", rollNumber);

      const response = await fetch("http://localhost:8000/enroll", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Enrollment failed.");
      }

      const result = await response.json();
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
    setMessage("Enter a roll number and start auto-capture.");
    socketRef.current?.close();
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Smart Student Enrollment</h2>
      <div className="mb-4">
        <label htmlFor="rollNumber" className="block mb-1">
          Student Roll Number
        </label>
        <input
          id="rollNumber"
          type="text"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
          placeholder="e.g., CS101"
          className="p-2 border rounded w-full"
          disabled={status !== "IDLE"}
        />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-md"
            mirrored={true}
          />
        </div>
        <div className="w-1/2">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured student"
              className="rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-center p-4">
              <p>{message}</p>
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
              onClick={handleEnroll}
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
        {(status === "ENROLLING" ||
          status === "SUCCESS" ||
          status === "ERROR") && (
          <Button onClick={reset}>Enroll Another</Button>
        )}
      </div>
      {(status === "ENROLLING" ||
        status === "SUCCESS" ||
        status === "ERROR") && (
        <p className="mt-4 text-center font-bold">{message}</p>
      )}
    </div>
  );
};