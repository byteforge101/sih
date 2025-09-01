import React from "react";

interface ChatBubbleStudentProps {
  message: string | React.ReactNode;
}

const ChatBubbleStudent: React.FC<ChatBubbleStudentProps> = ({ message }) => {
  return (
    <div className="flex justify-end my-2">
      <div className="bg-violet-600 text-white p-3 rounded-xl rounded-br-lg max-w-md">
        {message}
      </div>
    </div>
  );
};

export default ChatBubbleStudent;
