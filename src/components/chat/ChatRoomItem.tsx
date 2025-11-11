"use client";
import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Bot, MessageCircle } from "lucide-react";
import type { ChatRoom } from "@/lib/services/websocket.service";

interface ChatRoomItemProps {
  room: ChatRoom;
  isActive: boolean;
  onClick: () => void;
  getInitials: (name: string) => string;
  getOtherParticipantName: (room: ChatRoom) => string | null;
}

const ChatRoomItem = memo(function ChatRoomItem({
  room,
  isActive,
  onClick,
  getInitials,
  getOtherParticipantName,
}: ChatRoomItemProps) {
  const displayName =
    getOtherParticipantName(room) || room.name || "Chat";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-[#0386D9]/10 border border-[#0386D9]/30"
          : "hover:bg-white/5"
      }`}
    >
      <Avatar className="h-9 w-9 border border-[#0386D9]/30">
        <AvatarFallback className="bg-[#0386D9] text-[#010440] text-xs font-bold">
          {room.roomType === "group" ? (
            <Users className="w-4 h-4" />
          ) : room.roomType === "supplier" ? (
            <Bot className="w-4 h-4" />
          ) : room.roomType === "private" ? (
            <MessageCircle className="w-4 h-4" />
          ) : (
            getInitials(displayName)
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {displayName}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {room.lastMessage?.content || "Sin mensajes"}
        </p>
      </div>
      {room.unreadCount && room.unreadCount > 0 && (
        <Badge className="h-4 px-1.5 text-xs bg-[#0386D9] text-[#010440]">
          {room.unreadCount}
        </Badge>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.room.id === nextProps.room.id &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.room.unreadCount === nextProps.room.unreadCount &&
    prevProps.room.lastMessage?.content === nextProps.room.lastMessage?.content
  );
});

export default ChatRoomItem;
