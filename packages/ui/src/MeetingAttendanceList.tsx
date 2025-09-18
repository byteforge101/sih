"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";

type Attendee = {
    rollNumber: string;
    name: string;
    timestamp: Date;
};

interface MeetingAttendanceListProps {
    getAttendance: () => Promise<Attendee[]>;
}

export const MeetingAttendanceList = ({ getAttendance }: MeetingAttendanceListProps) => {
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            const data = await getAttendance();
            setAttendees(data);
        } catch (error) {
            console.error("Failed to fetch attendance:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
        const interval = setInterval(fetchAttendance, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 border rounded-lg bg-white shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Meeting Attendees ({attendees.length})</h2>
                <Button onClick={fetchAttendance} disabled={isLoading}>
                    {isLoading ? "Refreshing..." : "Refresh"}
                </Button>
            </div>
            <div className="max-h-60 overflow-y-auto">
                {attendees.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {attendees.map((attendee) => (
                            <li key={attendee.rollNumber} className="py-2 flex justify-between">
                                <span>{attendee.name} ({attendee.rollNumber})</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(attendee.timestamp).toLocaleTimeString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500">No attendees yet.</p>
                )}
            </div>
        </div>
    );
};