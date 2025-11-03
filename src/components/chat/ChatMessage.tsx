"use client";
import { memo } from "react";

interface ChatMessageProps {
  message: any;
  isOwn: boolean;
  formatTime: (date: string) => string;
  senderName?: string;
}

const ChatMessage = memo(function ChatMessage({
  message,
  isOwn,
  formatTime,
  senderName,
}: ChatMessageProps) {
  const isBot = message.senderType === "bot";

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}
      >
        {!isOwn && (
          <span className="text-xs text-gray-400 px-3">
            {isBot
              ? "Bot"
              : senderName || message.sender?.first_name || "Usuario"}
          </span>
        )}
        <div
          className={`px-3 py-2 rounded-xl ${
            isOwn
              ? "bg-[#07D9D9] text-[#010440] rounded-br-sm"
              : isBot
              ? "bg-purple-500/20 text-white border border-purple-500/30 rounded-bl-sm"
              : "bg-white/10 text-white rounded-bl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <span
            className={`text-xs mt-1 block ${isOwn ? "text-[#010440]/60" : "text-gray-400"}`}
          >
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
