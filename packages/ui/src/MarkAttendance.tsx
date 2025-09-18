"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "./Button";

const API_BASE_URL = "http://localhost:8000";
const IS_SECURE = API_BASE_URL.startsWith("https");

const getWebSocketUrl = (path: string) => {
    const protocol = IS_SECURE ? "wss://" : "ws://";
    const domain = API_BASE_URL.replace(/^https?:\/\//, "");
    return `${protocol}${domain}${path}`;
};

interface MarkAttendanceProps {
    meetingId: string;
}

export const MarkAttendance = ({ meetingId }: MarkAttendanceProps) => {
    const webcamRef = useRef<Webcam>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState<"IDLE" | "ACTIVE" | "ERROR">("IDLE");
    const [message, setMessage] = useState("Click 'Start Attendance' to begin.");

    const connectWebSocket = useCallback(() => {
        const ws = new WebSocket(getWebSocketUrl(`/ws/mark_attendance/${meetingId}`));
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("Attendance WebSocket connected");
            const intervalId = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN && webcamRef.current) {
                    const imageSrc = webcamRef.current.getScreenshot();
                    if (imageSrc) ws.send(imageSrc);
                } else {
                    clearInterval(intervalId);
                }
            }, 1000); // Send frame every second
        };

        ws.onmessage = (event) => {
            setMessage(event.data);
        };

        ws.onclose = () => console.log("Attendance WebSocket disconnected");
        ws.onerror = (error) => {
            console.error("Attendance WebSocket error:", error);
            setStatus("ERROR");
            setMessage("Connection to attendance service failed.");
        };
    }, [meetingId]);

    const startAttendance = () => {
        setStatus("ACTIVE");
        setMessage("Starting attendance process...");
        connectWebSocket();
    };

    const stopAttendance = () => {
        setStatus("IDLE");
        setMessage("Attendance process stopped.");
        socketRef.current?.close();
    };

    useEffect(() => {
        return () => socketRef.current?.close();
    }, []);

    return (
        <div className="p-4 border rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-bold mb-4">Live Attendance Marking</h2>
            <div className="flex flex-col md:flex-row gap-4">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="rounded-md w-full md:w-1/2"
                    mirrored={true}
                />
                <div className="w-full md:w-1/2 h-full bg-gray-200 rounded-md flex items-center justify-center text-center p-4">
                    <p className="text-slate-600">{message}</p>
                </div>
            </div>
            <div className="mt-4 flex justify-center gap-4">
                {status === "IDLE" && (
                    <Button onClick={startAttendance}>Start Attendance</Button>
                )}
                {status === "ACTIVE" && (
                    <Button onClick={stopAttendance} className="bg-red-500 hover:bg-red-700">
                        Stop Attendance
                    </Button>
                )}
            </div>
        </div>
    );
};