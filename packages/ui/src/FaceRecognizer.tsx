'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';

// Define the shape of the data we expect from the backend
interface FaceResult {
  name: string;
  box: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}
type ConnectionStatus = 'Connecting...' | 'Connected' | 'Disconnected';

// Helper function to create the WebSocket URL
const getWebSocketUrl = (path: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
  const wsHost = apiUrl.replace(/^https?:\/\//, '');
  return `${wsProtocol}://${wsHost}${path}`;
};


export const FaceRecognizer = ({
  onFaceRecognized,
}: {
  onFaceRecognized?: (rollNumber: string) => void;
}) => {
  const webcamRef = useRef<Webcam>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // The state now holds an array of face results, not just one name
  const [faces, setFaces] = useState<FaceResult[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('Connecting...');

  const connectWebSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState < 2) return;
    setConnectionStatus('Connecting...');
    const ws = new WebSocket(getWebSocketUrl('/ws/recognize'));
    socketRef.current = ws;
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('Connected');
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(captureAndSendFrame, 500);
    };
    ws.onmessage = (event) => {
      const results: FaceResult[] = JSON.parse(event.data);
      setFaces(results);
      
      // Call the callback for each valid face found
      results.forEach(face => {
        if (face.name !== 'Unknown' && face.name !== 'No face detected' && face.name !== '...') {
          onFaceRecognized?.(face.name);
        }
      });
    };
    ws.onclose = () => {
      console.log('WebSocket disconnected. Attempting to reconnect...');
      setConnectionStatus('Disconnected');
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimeout(connectWebSocket, 3000);
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [onFaceRecognized]); // Added prop to dependency array

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
      case 'Connected': return { text: '● CONNECTED', color: 'bg-green-600' };
      case 'Disconnected': return { text: '● DISCONNECTED', color: 'bg-red-600' };
      case 'Connecting...': return { text: '● CONNECTING...', color: 'bg-yellow-500' };
    }
  };
  const statusIndicator = getStatusIndicator();

  // --- THIS IS THE MISSING PART THAT HAS BEEN ADDED BACK ---
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Live Recognition (Multi-Face)</h2>
      <div className="relative w-[640px] h-[480px] mx-auto">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
          className="rounded-md absolute"
          mirrored={true}
        />
        {/* We map over the faces array and draw a box and label for each one */}
        {faces.map((face, index) => (
          <div
            key={index}
            className="absolute border-2 border-green-400"
            style={{
              left: `${face.box.x}px`,
              top: `${face.box.y}px`,
              width: `${face.box.w}px`,
              height: `${face.box.h}px`,
            }}
          >
            <div className="absolute -top-7 left-0 bg-green-400 text-black px-2 py-1 text-sm font-bold">
              {face.name}
            </div>
          </div>
        ))}
        <div className={`absolute bottom-4 left-4 p-2 rounded-md text-white text-sm ${statusIndicator.color}`}>
          {statusIndicator.text}
        </div>
      </div>
    </div>
  );
};