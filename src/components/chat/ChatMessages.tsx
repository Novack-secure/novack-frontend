"use client";
import { memo, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ChatMessage from "./ChatMessage";
import type { Message } from "@/lib/services/websocket.service";

interface ChatMessagesProps {
  messages: Message[];
  hasMoreMessages: boolean;
  isLoadingMore: boolean;
  isLoadingMessages?: boolean;
  loadMoreMessages: () => void;
  isOwnMessage: (message: Message) => boolean;
  formatTime: (date: string) => string;
}

const ChatMessages = memo(function ChatMessages({
  messages,
  hasMoreMessages,
  isLoadingMore,
  isLoadingMessages = false,
  loadMoreMessages,
  isOwnMessage,
  formatTime,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  // Auto-scroll only on new messages
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length]);

  // Show loading skeleton
  if (isLoadingMessages) {
    return (
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[70%] space-y-2">
                {i % 2 !== 0 && (
                  <Skeleton className="h-3 w-20 bg-white/10" />
                )}
                <div className="space-y-1">
                  <Skeleton className="h-16 w-64 rounded-xl bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No hay mensajes</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-3">
        {/* Load More Button */}
        {hasMoreMessages && (
          <div className="flex justify-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={loadMoreMessages}
              disabled={isLoadingMore}
              className="text-xs border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Cargar mensajes anteriores"
              )}
            </Button>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwn={isOwnMessage(message)}
            formatTime={formatTime}
            senderName={message.sender?.first_name}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
});

export default ChatMessages;
