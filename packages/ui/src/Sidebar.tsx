import React, { useState } from "react";

// Example Icon component (replace with a real icon library like react-icons)
interface IconProps {
  name: string;
}

const Icon: React.FC<IconProps> = ({ name }) => (
  <span className="mr-3">{name ? name.charAt(0) : "?"}</span>
);

const Sidebar: React.FC = () => {
  const [activeLink, setActiveLink] = useState<string>("Dashboard");

  const links: string[] = ["Dashboard", "Students", "Upload", "Notifications", "Chatbot"];

  return (
    <div className="w-64 h-screen bg-violet-900 text-slate-200 flex flex-col p-4">
      <h2 className="font-bold text-2xl text-white mb-8 px-2">Eduvance</h2>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            onClick={() => setActiveLink(link)}
            className={`flex items-center px-4 py-3 rounded-lg font-medium transition ${
              activeLink === link
                ? "bg-violet-600 text-white"
                : "hover:bg-indigo-800 hover:text-white"
            }`}
          >
            <Icon name={link} />
            {link}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
