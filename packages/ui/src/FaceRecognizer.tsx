"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";

// --- API Configuration ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const IS_SECURE = API_BASE_URL.startsWith("https");

const getWebSocketUrl = (path: string) => {
  const protocol = IS_SECURE ? "wss://" : "ws://";
  const domain = API_BASE_URL.replace(/^https?:\/\//, '');
  return `${protocol}${domain}${path}`;
};
// -------------------------

type ConnectionStatus = "Connecting..." | "Connected" | "Disconnected";

// Use NEXT_PUBLIC_API_URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const FaceRecognizer = () => {
  const webcamRef = useRef<Webcam>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [recognizedName, setRecognizedName] = useState<string>("...");
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("Connecting...");

  const connectWebSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState < 2) {
      return;
    }

    setConnectionStatus("Connecting...");
    const ws = new WebSocket(getWebSocketUrl("/ws/recognize"));
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus("Connected");
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(captureAndSendFrame, 500);
    };

    ws.onmessage = (event) => setRecognizedName(event.data);

    ws.onclose = () => {
      console.log(
        "WebSocket disconnected. Attempting to reconnect in 3 seconds..."
      );
      setConnectionStatus("Disconnected");
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = () => {
      console.log("WebSocket connection attempt failed, will retry...");
    };
  }, []);

  const captureAndSendFrame = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        socketRef.current.send(imageSrc);
      }
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case "Connected":
        return { text: "● CONNECTED", color: "bg-green-600" };
      case "Disconnected":
        return { text: "● DISCONNECTED", color: "bg-red-600" };
      case "Connecting...":
        return { text: "● CONNECTING...", color: "bg-yellow-500" };
    }
  };
  const statusIndicator = getStatusIndicator();

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Live Recognition</h2>
      <div className="relative w-[640px] mx-auto">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
          className="rounded-md"
          mirrored={true}
        />
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded-md text-2xl font-mono">
          {recognizedName}
        </div>
        <div
          className={`absolute bottom-4 left-4 p-2 rounded-md text-white text-sm ${statusIndicator.color}`}
        >
          {statusIndicator.text}
        </div>
      </div>
    </div>
  );
};