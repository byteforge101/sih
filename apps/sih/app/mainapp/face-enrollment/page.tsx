'use client';

import { useSession } from "next-auth/react";
import { EnrollStudentFace } from "@repo/ui";
import { enrollStudentFace } from "../../../actions/student/face-enrollment";
import { motion } from "framer-motion";

export default function FaceEnrollmentPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="text-center p-8">Loading...</div>;
    }

    if ((session?.user as any)?.role !== 'STUDENT') {
        return (
            <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">
                <p>This feature is only available for students.</p>
            </div>
        );
    }
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Face Enrollment</h1>
            <p className="text-slate-500 mb-6">
                Enroll your face for our smart attendance system. Your roll number will be automatically linked.
            </p>
            <EnrollStudentFace handleEnroll={enrollStudentFace} />
        </motion.div>
    );
}