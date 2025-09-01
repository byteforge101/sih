import React, { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState<string>("");

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center space-x-3 p-4 bg-white border-t"
    >
      <input
        type="text"
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        }
        placeholder="Type your message..."
        className="flex-grow border border-slate-300 rounded-lg px-4 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-sm hover:bg-violet-700 transition"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
