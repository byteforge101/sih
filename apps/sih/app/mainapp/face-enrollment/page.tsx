'use client';

import { useSession } from "next-auth/react";
import { EnrollStudentFace } from "@repo/ui";
import { enrollStudentFace } from "../../../actions/student/face-enrollment";
import { motion } from "framer-motion";

export default function FaceEnrollmentPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="text-center p-8 text-white">Loading...</div>;
    }

    if ((session?.user as any)?.role !== 'STUDENT') {
        return (
            <div className="text-center p-6 bg-red-500/20 backdrop-blur-sm text-red-200 border border-red-500/30 rounded-2xl shadow-lg max-w-md mx-auto">
                <p className="font-bold text-base">This feature is only available for students.</p>
            </div>
        );
    }
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl shadow-black/30 p-6"
        >
            <h1 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">Face Enrollment</h1>
            <p className="text-gray-300 text-base font-medium mb-6">
                Enroll your face for our smart attendance system. Your roll number will be automatically linked.
            </p>
            <EnrollStudentFace handleEnroll={enrollStudentFace} />
        </motion.div>
    );
}

