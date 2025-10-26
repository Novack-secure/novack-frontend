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
  const socketRef = useRef<Socket | null>(null);
  const connectingRef = useRef(false);

  // Cargar salas del usuario
  const loadUserRooms = useCallback(async () => {
    try {
      console.log("✅ loadUserRooms iniciado");
      setIsLoading(true);

      const userRooms = await websocketService.getUserRooms();
      console.log("✅ Salas cargadas:", userRooms.length);

      if (Array.isArray(userRooms)) {
        setRooms(userRooms);
        console.log("✅ Salas establecidas en el estado:", userRooms.length);
      } else {
        console.warn("⚠️ Los datos recibidos no son un array:", userRooms);
        setRooms([]);
      }
    } catch (error) {
      console.error("❌ Error al cargar salas:", error);
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Conectar WebSocket
  const connect = useCallback(async () => {
    console.log("✅ connect() llamado");

    if (connectingRef.current) {
      console.log("🔄 Already connecting, skipping");
      return;
    }

    if (!isAuthenticated || !user) {
      console.log("⚠️ WebSocket - No autenticado o sin usuario");
      return;
    }

    try {
      connectingRef.current = true;
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("❌ No se encontró token de acceso");
        return;
      }

      console.log("✅ Conectando WebSocket...");
      const socket = await websocketService.connect(token);
      socketRef.current = socket;
      setIsConnected(true);
      console.log("✅ WebSocket conectado y usuario registrado");

      // Cargar salas inmediatamente después de la conexión
      await loadUserRooms();
    } catch (error) {
      console.error("❌ Error al conectar WebSocket:", error);
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
        console.log("🔍 joinRoom - Uniéndose a sala:", room);
        console.log("🔍 joinRoom - WebSocket conectado:", isConnected);

        if (!isConnected) {
          console.error("❌ WebSocket no está conectado");
          return;
        }

        await websocketService.joinRoom(room.id);
        console.log("🔍 joinRoom - Estableciendo currentRoom:", room);
        setCurrentRoom(room);
        console.log("🔍 joinRoom - currentRoom establecido");

        // Cargar mensajes de la sala
        const roomMessages = (await websocketService.getRoomMessages(
          room.id
        )) as Message[];
        console.log("🔍 joinRoom - Mensajes cargados:", roomMessages.length);
        setMessages(roomMessages);
        console.log(
          "🔍 joinRoom - Mensajes establecidos:",
          roomMessages.length
        );

        // Forzar re-render después de un pequeño delay
        setTimeout(() => {
          console.log("🔍 joinRoom - Forzando re-render después del delay");
          setCurrentRoom((prev) => {
            console.log("🔍 joinRoom - currentRoom previo:", prev);
            return room;
          });
        }, 100);
      } catch (error) {
        console.error("❌ Error al unirse a la sala:", error);
      }
    },
    [isConnected]
  );

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
        console.log("🔍 createPrivateRoom - WebSocket conectado:", isConnected);
        console.log("🔍 createPrivateRoom - targetUserId:", targetUserId);
        console.log("🔍 createPrivateRoom - targetUserType:", targetUserType);

        if (!isConnected) {
          console.error("❌ WebSocket no está conectado");
          throw new Error("WebSocket no está conectado");
        }

        const newRoom = await websocketService.createPrivateRoom(
          targetUserId,
          targetUserType
        );
        console.log("🔍 createPrivateRoom - Sala creada:", newRoom);

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
        console.error("❌ Error al crear sala privada:", error);
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

  // No necesitamos polling constante - Socket.IO maneja el estado de conexión

  // Debug: Monitorear cambios en currentRoom
  useEffect(() => {
    console.log("🔍 currentRoom cambió:", currentRoom);
  }, [currentRoom]);

  // Auto-conectar cuando el usuario está autenticado
  useEffect(() => {
    console.log("🔍 useEffect de conexión ejecutado");
    console.log("🔍 isAuthenticated:", isAuthenticated);
    console.log("🔍 user:", !!user);
    console.log("🔍 isConnected:", isConnected);

    if (isAuthenticated && user && !isConnected) {
      console.log("🔍 Condiciones cumplidas, conectando...");
      connect();
    } else {
      console.log("🔍 Condiciones no cumplidas para conectar");
    }

    // Cleanup al desmontar
    return () => {
      if (isConnected) {
        console.log("🔍 Cleanup: desconectando WebSocket");
        disconnect();
      }
    };
  }, [isAuthenticated, user]); // Removí isConnected, connect y disconnect de las dependencias

  return {
    // Estado
    isConnected,
    isLoading,
    rooms,
    currentRoom,
    messages,

    // Métodos
    connect,
    disconnect,
    loadUserRooms,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendMessageToBot,
    createPrivateRoom,
  };
};
