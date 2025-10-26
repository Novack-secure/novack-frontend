"use client";
import { useState, useEffect, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ContactList from "@/components/chat/ContactList";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPage() {
  const { user } = useAuth();
  const {
    isConnected,
    isLoading,
    rooms,
    currentRoom,
    messages,
    joinRoom,
    sendMessage,
  } = useWebSocket();

  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Obtener el nombre del otro participante en chat privado
  const getOtherParticipantName = (room: any) => {
    if (room.roomType === "private" && room.participants) {
      const otherParticipant = room.participants.find(
        (p: any) => p.id !== user?.id
      );
      if (otherParticipant) {
        return `${otherParticipant.first_name || ""} ${otherParticipant.last_name || ""}`.trim() || otherParticipant.email;
      }
    }
    return null;
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const isOwnMessage = (message: any) => {
    return message.senderId === user?.id && message.senderType === "employee";
  };

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus en el input
  useEffect(() => {
    if (currentRoom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentRoom]);

  // Filtrar salas
  const filteredRooms = rooms.filter((room) => {
    const roomName = getOtherParticipantName(room) || room.name || "";
    return roomName.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
                className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
              />
              <span className="text-sm text-gray-300">
                {isConnected ? "Conectado" : "Desconectado"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowContacts(!showContacts)}
              className={`h-7 w-7 p-0 ${showContacts ? "bg-[#07D9D9]/10 text-[#07D9D9]" : "text-gray-400 hover:text-[#07D9D9]"}`}
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>

          {/* Contact List */}
          {showContacts && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <div className="p-3 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#07D9D9]" />
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
              className="h-9 pl-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#07D9D9]"
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
                    <div
                      key={room.id}
                      onClick={() => joinRoom(room)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        currentRoom?.id === room.id
                          ? "bg-[#07D9D9]/10 border border-[#07D9D9]/30"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <Avatar className="h-9 w-9 border border-[#07D9D9]/30">
                        <AvatarFallback className="bg-[#07D9D9] text-[#010440] text-xs font-bold">
                          {room.roomType === "group" ? (
                            <Users className="w-4 h-4" />
                          ) : room.roomType === "supplier" ? (
                            <Bot className="w-4 h-4" />
                          ) : (
                            getInitials(
                              getOtherParticipantName(room) ||
                                room.name ||
                                "U"
                            )
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {getOtherParticipantName(room) ||
                            room.name ||
                            "Chat"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {room.lastMessage?.content || "Sin mensajes"}
                        </p>
                      </div>
                      {room.unreadCount && room.unreadCount > 0 && (
                        <Badge className="h-4 px-1.5 text-xs bg-[#07D9D9] text-[#010440]">
                          {room.unreadCount}
                        </Badge>
                      )}
                    </div>
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
                <Avatar className="h-9 w-9 border-2 border-[#07D9D9]/30">
                  <AvatarFallback className="bg-[#07D9D9] text-[#010440] text-xs font-bold">
                    {currentRoom.roomType === "group" ? (
                      <Users className="w-4 h-4" />
                    ) : currentRoom.roomType === "supplier" ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      getInitials(
                        getOtherParticipantName(currentRoom) ||
                          currentRoom.name ||
                          "U"
                      )
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    {getOtherParticipantName(currentRoom) ||
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
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">No hay mensajes</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const isOwn = isOwnMessage(message);
                      const isBot = message.senderType === "bot";

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}
                          >
                            {!isOwn && (
                              <span className="text-xs text-gray-400 px-3">
                                {isBot
                                  ? "Bot"
                                  : `${message.sender?.first_name || "Usuario"}`}
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
                              <p className="text-sm leading-relaxed">
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
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="p-3 border-t border-white/10 bg-white/5">
                <form className="flex gap-2" onSubmit={handleSendMessage}>
                  <Input
                    ref={inputRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={!isConnected || isSending}
                    className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#07D9D9]"
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
                    className="h-9 px-3 bg-[#07D9D9] hover:bg-[#0596A6] text-[#010440]"
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
