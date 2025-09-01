
'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Student Success AI</h2>
            <p className="text-gray-400">Enabling early academic rescue and immersive learning.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Project Pillars</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Dashboard</a></li>
              <li><a href="#" className="hover:text-white">Sentiment Heatmaps</a></li>
              <li><a href="#" className="hover:text-white">Community Learning</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Problem Statement</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">SIH ID: SIH25102</h3>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Student Success AI. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}