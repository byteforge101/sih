import React from "react";

interface ChatBubbleBotProps {
  message: string | React.ReactNode;
}

const ChatBubbleBot: React.FC<ChatBubbleBotProps> = ({ message }) => {
  return (
    <div className="flex justify-start my-2">
      <div className="bg-slate-200 text-slate-800 p-3 rounded-xl rounded-bl-lg max-w-md">
        {message}
      </div>
    </div>
  );
};

export default ChatBubbleBot;
