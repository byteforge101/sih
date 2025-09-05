'use client';

import { useState } from 'react';
import { Button, EnrollStudentFace, FaceRecognizer } from '@repo/ui';

// Define the modes our application can be in
type Mode = 'IDLE' | 'ENROLL' | 'RECOGNIZE';

export default function Page() {
  const [mode, setMode] = useState<Mode>('IDLE');

  const renderContent = () => {
    switch (mode) {
      case 'ENROLL':
        return (
          <div>
            <Button onClick={() => setMode('IDLE')} className="mb-4 bg-gray-500 hover:bg-gray-700">
              &larr; Back to Menu
            </Button>
            <EnrollStudentFace />
          </div>
        );
      case 'RECOGNIZE':
        return (
          <div>
            <Button onClick={() => setMode('IDLE')} className="mb-4 bg-gray-500 hover:bg-gray-700">
              &larr; Back to Menu
            </Button>
            <FaceRecognizer />
          </div>
        );
      case 'IDLE':
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Choose an Action</h2>
            <div className="flex justify-center gap-6">
              <Button onClick={() => setMode('ENROLL')} className="px-8 py-4 text-lg">
                Enroll New Student
              </Button>
              <Button onClick={() => setMode('RECOGNIZE')} className="px-8 py-4 text-lg bg-green-600 hover:bg-green-800">
                Start Live Recognition
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Facial Recognition System</h1>
      <div className="mt-12">
        {renderContent()}
      </div>
    </main>
  );
}