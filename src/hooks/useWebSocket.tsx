"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import {
  websocketService,
  Message,
  ChatRoom,
} from "@/lib/services/websocket.service";
import { Socket } from "socket.io-client";

export const useWebSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const connectingRef = useRef(false);

  // Cargar salas del usuario
  const loadUserRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      const userRooms = await websocketService.getUserRooms();

      if (Array.isArray(userRooms)) {
        setRooms(userRooms);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error("Error al cargar salas:", error);
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Conectar WebSocket
  const connect = useCallback(async () => {
    if (connectingRef.current || !isAuthenticated || !user) {
      return;
    }

    try {
      connectingRef.current = true;
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No se encontró token de acceso");
        return;
      }

      const socket = await websocketService.connect(token);
      socketRef.current = socket;
      setIsConnected(true);

      // Cargar salas inmediatamente después de la conexión
      await loadUserRooms();
    } catch (error) {
      console.error("Error al conectar WebSocket:", error);
      setIsConnected(false);
    } finally {
      connectingRef.current = false;
    }
  }, [isAuthenticated, user, loadUserRooms]);

  // Desconectar WebSocket
  const disconnect = useCallback(() => {
    if (!isConnected) return;
    websocketService.disconnect();
    setIsConnected(false);
    setCurrentRoom(null);
    setRooms([]);
    socketRef.current = null;
  }, [isConnected]);

  // Unirse a una sala
  const joinRoom = useCallback(
    async (room: ChatRoom) => {
      try {
        if (!isConnected) {
          console.error("WebSocket no está conectado");
          return;
        }

        setIsLoadingMessages(true);
        await websocketService.joinRoom(room.id);
        setCurrentRoom(room);

        // Cargar mensajes de la sala con paginación (primeros 50)
        const result = await websocketService.getRoomMessages(room.id, 50);
        setMessages(result.messages);
        setHasMoreMessages(result.hasMore);
        setNextCursor(result.nextCursor);
      } catch (error) {
        console.error("Error al unirse a la sala:", error);
        // Don't show error to user, just log it and show empty messages
        setMessages([]);
        setHasMoreMessages(false);
        setNextCursor(null);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [isConnected]
  );

  // Cargar más mensajes (scroll infinito)
  const loadMoreMessages = useCallback(async () => {
    if (!currentRoom || !hasMoreMessages || !nextCursor || isLoadingMore) {
      return;
    }

    try {
      setIsLoadingMore(true);
      const result = await websocketService.getRoomMessages(
        currentRoom.id,
        50,
        nextCursor
      );

      // Prepend older messages to the beginning
      setMessages((prevMessages) => [...result.messages, ...prevMessages]);
      setHasMoreMessages(result.hasMore);
      setNextCursor(result.nextCursor);
    } catch (error) {
      console.error("Error al cargar más mensajes:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentRoom, hasMoreMessages, nextCursor, isLoadingMore]);

  // Salir de una sala
  const leaveRoom = useCallback(async () => {
    if (!currentRoom) return;

    try {
      await websocketService.leaveRoom(currentRoom.id);
      setCurrentRoom(null);
      setMessages([]);
    } catch (error) {
      console.error("Error al salir de la sala:", error);
    }
  }, [currentRoom]);

  // Enviar mensaje
  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentRoom || !content.trim()) return;

      // Crear mensaje optimista
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        content,
        roomId: currentRoom.id,
        senderType: "employee",
        senderId: user?.id || "",
        createdAt: new Date().toISOString(),
        sender: {
          id: user?.id || "",
          first_name: user?.first_name,
          last_name: user?.last_name,
          email: user?.email,
        },
      };

      // Agregar mensaje optimista inmediatamente
      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        await websocketService.sendMessage(currentRoom.id, content, "employee");
        // El mensaje real reemplazará al optimista cuando llegue el evento 'newMessage'
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
        // Remover mensaje optimista en caso de error
        setMessages((prev) =>
          prev.filter((m) => m.id !== optimisticMessage.id)
        );
        throw error;
      }
    },
    [currentRoom, user]
  );

  // Enviar mensaje al bot
  const sendMessageToBot = useCallback(
    async (content: string, supplierId: string) => {
      if (!currentRoom || !content.trim()) return;

      try {
        await websocketService.sendMessageToBot(
          currentRoom.id,
          content,
          supplierId
        );
        // La respuesta del bot se agregará automáticamente cuando llegue el evento 'newMessage'
      } catch (error) {
        console.error("Error al enviar mensaje al bot:", error);
        throw error;
      }
    },
    [currentRoom]
  );

  // Crear sala privada
  const createPrivateRoom = useCallback(
    async (targetUserId: string, targetUserType: "employee" | "visitor") => {
      try {
        if (!isConnected) {
          throw new Error("WebSocket no está conectado");
        }

        const newRoom = await websocketService.createPrivateRoom(
          targetUserId,
          targetUserType
        );

        // Actualizar la lista de salas inmediatamente
        setRooms((prev) => {
          // Evitar duplicados
          if (prev.some((r) => r.id === newRoom.id)) {
            return prev;
          }
          return [...prev, newRoom as ChatRoom];
        });

        // Recargar todas las salas para asegurar sincronización
        setTimeout(() => {
          loadUserRooms();
        }, 500);

        return newRoom;
      } catch (error) {
        console.error("Error al crear sala privada:", error);
        throw error;
      }
    },
    [isConnected, loadUserRooms]
  );

  // Escuchar nuevos mensajes
  useEffect(() => {
    if (!isConnected || !currentRoom) return;

    const handleNewMessage = (message: Message) => {
      // Solo agregar si el mensaje es de la sala actual
      if (message.roomId === currentRoom.id) {
        setMessages((prev) => {
          // Evitar duplicados
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          // Reemplazar mensaje optimista con el real si existe
          const existingIndex = prev.findIndex(
            (m) =>
              m.content === message.content &&
              m.senderId === message.senderId &&
              m.id.startsWith("temp-")
          );
          if (existingIndex !== -1) {
            const newMessages = [...prev];
            newMessages[existingIndex] = message;
            return newMessages;
          }
          return [...prev, message];
        });
      }

      // Actualizar última mensaje en la lista de salas
      setRooms((prev) =>
        prev.map((room) =>
          room.id === message.roomId ? { ...room, lastMessage: message } : room
        )
      );
    };

    websocketService.onNewMessage(handleNewMessage);

    return () => {
      websocketService.off("newMessage", handleNewMessage);
    };
  }, [isConnected, currentRoom]);

  // Escuchar nuevas salas creadas
  useEffect(() => {
    if (!isConnected) return;

    const handleRoomCreated = (room: ChatRoom) => {
      setRooms((prev) => {
        // Evitar duplicados
        if (prev.some((r) => r.id === room.id)) {
          return prev;
        }
        return [...prev, room];
      });
    };

    websocketService.onRoomCreated(handleRoomCreated);

    return () => {
      websocketService.off("roomCreated", handleRoomCreated);
    };
  }, [isConnected]);

  // Auto-conectar cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user && !isConnected) {
      connect();
    }

    // Cleanup al desmontar
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [isAuthenticated, user]); // Removí isConnected, connect y disconnect de las dependencias

  return {
    // Estado
    isConnected,
    isLoading,
    isLoadingMessages,
    rooms,
    currentRoom,
    messages,
    hasMoreMessages,
    isLoadingMore,

    // Métodos
    connect,
    disconnect,
    loadUserRooms,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendMessageToBot,
    createPrivateRoom,
    loadMoreMessages,
  };
};
