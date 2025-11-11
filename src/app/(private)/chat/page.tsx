"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Search,
  Send,
  Users,
  Bot,
  MessageCircle,
  UserPlus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import ContactList from "@/components/chat/ContactList";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatRoomItem from "@/components/chat/ChatRoomItem";
import ChatMessages from "@/components/chat/ChatMessages";
import { ChatRoom } from "@/lib/services/websocket.service";

export default function ChatPage() {
  const { user } = useAuth();
  const {
    isConnected,
    isLoading,
    isLoadingMessages,
    rooms,
    currentRoom,
    messages,
    hasMoreMessages,
    isLoadingMore,
    joinRoom,
    sendMessage,
    loadMoreMessages,
  } = useWebSocket();

  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sanitizePrivateRoomName = useCallback(
    (roomName?: string | null): string | null => {
      if (!roomName) return null;

      const normalize = (value: string) =>
        value
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

      const cleaned = roomName.replace(/^chat privado:\s*/i, "").trim();
      if (!cleaned) return null;

      const userFullName = `${user?.first_name || ""} ${
        user?.last_name || ""
      }`.trim();
      const parts = cleaned
        .split("-")
        .map((part) => part.trim())
        .filter(Boolean);

      if (userFullName) {
        const normalizedUser = normalize(userFullName);
        const isUserMatch = (part: string) => {
          const normalizedPart = normalize(part);
          return (
            normalizedPart.includes(normalizedUser) ||
            normalizedUser.includes(normalizedPart)
          );
        };
        const other = parts.find((part) => !isUserMatch(part));
        if (other) return other;
      }

      return parts[0] || cleaned;
    },
    [user?.first_name, user?.last_name]
  );

  // Obtener el nombre del otro participante en chat privado (memoizado)
  const getOtherParticipantName = useCallback(
    (room: ChatRoom): string | null => {
      if (room.roomType === "private" && room.participants) {
        const otherParticipant = room.participants.find(
          (p) => p.id !== user?.id
        );
        if (otherParticipant) {
          const name = `${otherParticipant.first_name || ""} ${
            otherParticipant.last_name || ""
          }`.trim();
          return name || otherParticipant.email || null;
        }
      }
      if (room.roomType === "private") {
        return sanitizePrivateRoomName(room.name);
      }
      return room.name || null;
    },
    [user?.id, sanitizePrivateRoomName]
  );

  const getInitials = useCallback((name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }, []);

  const formatTime = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }, []);

  type Message = {
    senderId: string;
    senderType: string;
  };

  const isOwnMessage = useCallback(
    (message: Message) => {
      return message.senderId === user?.id && message.senderType === "employee";
    },
    [user?.id]
  );

  // Auto-focus en el input
  useEffect(() => {
    if (currentRoom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentRoom]);

  // Memoizar el handler de join room
  const handleJoinRoom = useCallback(
    (room: ChatRoom) => {
      joinRoom(room);
    },
    [joinRoom]
  );

  // Filtrar salas (memoizado)
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const roomName = getOtherParticipantName(room) || room.name || "";
      return roomName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [rooms, searchQuery, getOtherParticipantName]);

  // Enviar mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentRoom || !isConnected) return;

    const messageToSend = messageInput.trim();
    setMessageInput("");
    setIsSending(true);

    try {
      await sendMessage(messageToSend);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setMessageInput(messageToSend);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-3 pl-2 overflow-hidden">
      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-3 h-full min-h-0">
        {/* LEFT SIDEBAR */}
        <div className="col-span-3 flex flex-col gap-3 min-h-0">
          {/* Connection Status */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-sm text-gray-300">
                {isConnected ? "Conectado" : "Desconectado"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowContacts(!showContacts)}
              className={`h-7 w-7 p-0 ${
                showContacts
                  ? "bg-[#0386D9]/10 text-[#0386D9]"
                  : "text-gray-400 hover:text-[#0386D9]"
              }`}
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>

          {/* Contact List */}
          {showContacts && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <div className="p-3 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0386D9]" />
                  Contactos
                </h3>
              </div>
              <div className="max-h-[350px]">
                <ContactList
                  onRoomCreated={() => setShowContacts(false)}
                  onClose={() => setShowContacts(false)}
                />
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#0386D9]"
            />
          </div>

          {/* Rooms List */}
          <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden min-h-0">
            <ScrollArea className="h-full p-3">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <Skeleton className="size-9 rounded-full bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-3/4 bg-white/10" />
                        <Skeleton className="h-2.5 w-1/2 bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">
                    {searchQuery ? "Sin resultados" : "No hay chats"}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredRooms.map((room) => (
                    <ChatRoomItem
                      key={room.id}
                      room={room}
                      isActive={currentRoom?.id === room.id}
                      onClick={() => handleJoinRoom(room)}
                      getInitials={getInitials}
                      getOtherParticipantName={getOtherParticipantName}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* RIGHT AREA - Chat */}
        <div className="col-span-9 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col min-h-0">
          {currentRoom ? (
            <>
              {/* Chat Header */}
              <div className="h-14 bg-white/5 border-b border-white/10 flex items-center px-4 gap-3">
                <Avatar className="h-9 w-9 border-2 border-[#0386D9]/30">
                  <AvatarFallback className="bg-[#0386D9] text-[#010440] text-xs font-bold">
                    {currentRoom.roomType === "group" ? (
                      <Users className="w-4 h-4" />
                    ) : currentRoom.roomType === "supplier" ? (
                      <Bot className="w-4 h-4" />
                    ) : currentRoom.roomType === "private" ? (
                      <MessageCircle className="w-4 h-4" />
                    ) : (
                      getInitials(currentRoom.name || "U")
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    {currentRoom.roomType === "private"
                      ? getOtherParticipantName(currentRoom) || "Chat privado"
                      : getOtherParticipantName(currentRoom) ||
                        currentRoom.name ||
                        "Chat"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {currentRoom.roomType === "supplier"
                      ? "Bot IA"
                      : currentRoom.roomType === "group"
                      ? `${currentRoom.participants?.length || 0} miembros`
                      : "En línea"}
                  </p>
                </div>
              </div>

              {/* Messages Area */}
              <ChatMessages
                messages={messages}
                hasMoreMessages={hasMoreMessages}
                isLoadingMore={isLoadingMore}
                isLoadingMessages={isLoadingMessages}
                loadMoreMessages={loadMoreMessages}
                isOwnMessage={isOwnMessage}
                formatTime={formatTime}
              />

              {/* Input Area */}
              <div className="p-3 border-t border-white/10 bg-white/5">
                <form className="flex gap-2" onSubmit={handleSendMessage}>
                  <Input
                    ref={inputRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={!isConnected || isSending}
                    className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#0386D9]"
                    placeholder={
                      !isConnected
                        ? "Conectando..."
                        : isSending
                        ? "Enviando..."
                        : "Escribe un mensaje..."
                    }
                  />
                  <Button
                    type="submit"
                    disabled={!isConnected || !messageInput.trim() || isSending}
                    className="h-9 px-3 bg-[#0386D9] hover:bg-[#0270BE] text-[#010440]"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-base font-semibold text-white mb-2">
                  Selecciona un chat
                </p>
                <p className="text-sm text-gray-400">
                  o crea uno nuevo con un contacto
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
