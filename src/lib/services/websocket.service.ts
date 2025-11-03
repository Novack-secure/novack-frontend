import { io, Socket } from "socket.io-client";

export interface Message {
  id: string;
  content: string;
  roomId: string;
  senderType: "employee" | "visitor" | "bot";
  senderId: string;
  createdAt: string;
  sender?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  roomType: "private" | "group" | "supplier";
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
  unreadCount?: number;
  participants?: any[];
}

// Mapear mensaje del backend al formato frontend
function mapServerMessage(m: any): Message {
  const senderType =
    m.senderType ||
    (m.sender_employee_id ? "employee" : m.sender_visitor_id ? "visitor" : "bot");

  return {
    id: m.id,
    content: m.content,
    roomId: m.roomId || m.chat_room_id || m.room_id,
    senderType,
    senderId: m.senderId || m.sender_employee_id || m.sender_visitor_id || "",
    createdAt: m.createdAt || m.created_at || new Date().toISOString(),
    sender: m.sender || m.sender_employee || m.sender_visitor,
  };
}

// Mapear sala del backend al formato frontend
function mapServerRoom(r: any): ChatRoom {
  const mapType = (t: any) => {
    if (typeof t === "string") {
      const typeLower = t.toLowerCase();
      if (typeLower.includes("supplier") || typeLower.includes("group")) return "supplier";
      if (typeLower.includes("employee_to_employee")) return "private";
      if (typeLower.includes("employee_to_visitor")) return "private";
      return "private";
    }
    return "private";
  };

  return {
    id: r.id,
    name: r.name || "Chat",
    roomType: r.roomType || mapType(r.type),
    createdAt: r.createdAt || r.created_at || "",
    updatedAt: r.updatedAt || r.updated_at || "",
    lastMessage: r.lastMessage ? mapServerMessage(r.lastMessage) : undefined,
    unreadCount: r.unreadCount || 0,
    participants: r.participants || [...(r.employees || []), ...(r.visitors || [])],
  };
}

class WebSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private readonly baseUrl: string;

  constructor() {
    // Usar la URL del backend
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  }

  /**
   * Conecta al servidor WebSocket
   */
  connect(accessToken: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      // Si ya está conectado, desconectar primero
      if (this.socket) {
        this.disconnect();
      }

      this.token = accessToken;

      console.log("🔌 Conectando a WebSocket...");

      // Crear nueva conexión al namespace /chat
      this.socket = io(`${this.baseUrl}/chat`, {
        auth: {
          token: accessToken,
        },
        query: {
          token: accessToken,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      // Manejar evento de conexión exitosa
      this.socket.on("connect", () => {
        console.log("✅ WebSocket conectado exitosamente al namespace /chat");
        console.log("🔍 Socket ID:", this.socket!.id);
      });

      // Escuchar evento de confirmación de autenticación
      this.socket.on("connected", (data: any) => {
        console.log("✅ Autenticación exitosa:", data);
        resolve(this.socket!);
      });

      // Manejar errores de conexión
      this.socket.on("connect_error", (error) => {
        console.error("❌ Error de conexión WebSocket:", error);

        // Si el error es de autenticación, limpiar y redirigir
        if (error.message.includes("authentication") ||
            error.message.includes("unauthorized") ||
            error.message.includes("jwt")) {
          console.log("🔐 Error de autenticación, cerrando sesión...");
          this.disconnect();
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }

        reject(error);
      });

      // Manejar desconexión
      this.socket.on("disconnect", (reason) => {
        console.log("🔌 WebSocket desconectado:", reason);
      });

      // Timeout de 10 segundos para la conexión
      setTimeout(() => {
        if (!this.socket?.connected) {
          reject(new Error("Timeout al conectar con WebSocket"));
        }
      }, 10000);
    });
  }


  /**
   * Desconecta del servidor WebSocket
   */
  disconnect() {
    if (this.socket) {
      console.log("🔌 Desconectando WebSocket...");
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  /**
   * Verifica si está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Obtiene la instancia del socket
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Obtiene las salas del usuario
   */
  getUserRooms(): Promise<ChatRoom[]> {
    if (!this.socket || !this.socket.connected) {
      return Promise.reject(new Error("WebSocket no está conectado"));
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout al obtener salas del usuario"));
      }, 5000);

      this.socket!.emit("getRooms", (response: any) => {
        clearTimeout(timeout);
        console.log("🔍 getRooms response:", response);

        if (!response) {
          reject(new Error("No se recibió respuesta del servidor"));
          return;
        }

        if (response.success === false || response.error) {
          reject(new Error(response.message || response.error));
        } else {
          // Mapear salas del backend al formato frontend
          const rooms = (response.data || []).map(mapServerRoom);
          console.log("🔍 getRooms rooms mapeadas:", rooms);
          resolve(rooms);
        }
      });
    });
  }

  /**
   * Envía un mensaje a una sala
   */
  sendMessage(roomId: string, content: string, senderType: "employee" | "visitor" = "employee"): Promise<any> {
    if (!this.socket || !this.socket.connected) {
      return Promise.reject(new Error("WebSocket no está conectado"));
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout al enviar mensaje"));
      }, 5000);

      this.socket!.emit(
        "sendMessage",
        { roomId, content },
        (response: any) => {
          clearTimeout(timeout);

          if (!response) {
            reject(new Error("No se recibió respuesta del servidor"));
            return;
          }

          if (response.success === false || response.error) {
            reject(new Error(response.error || response.message));
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  /**
   * Envía un mensaje al bot
   */
  sendMessageToBot(roomId: string, content: string, supplierId: string): Promise<any> {
    if (!this.socket || !this.socket.connected) {
      return Promise.reject(new Error("WebSocket no está conectado"));
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout al enviar mensaje al bot"));
      }, 5000);

      this.socket!.emit("sendMessageToBot", { roomId, content, supplierId }, (response: any) => {
        clearTimeout(timeout);

        if (!response) {
          reject(new Error("No se recibió respuesta del servidor"));
          return;
        }

        if (response.error || response.status === "error") {
          reject(new Error(response.error || response.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Se une a una sala específica
   */
  joinRoom(roomId: string): Promise<any> {
    if (!this.socket || !this.socket.connected) {
      return Promise.reject(new Error("WebSocket no está conectado"));
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout al unirse a la sala"));
      }, 5000);

      this.socket!.emit("joinRoom", { roomId }, (response: any) => {
        clearTimeout(timeout);

        if (!response) {
          reject(new Error("No se recibió respuesta del servidor"));
          return;
        }

        if (response.success === false || response.error) {
          reject(new Error(response.error || response.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Sale de una sala específica
   */
  leaveRoom(roomId: string): Promise<any> {
    if (!this.socket || !this.socket.connected) {
      return Promise.reject(new Error("WebSocket no está conectado"));
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout al salir de la sala"));
      }, 5000);

      this.socket!.emit("leaveRoom", { roomId }, (response: any) => {
        clearTimeout(timeout);

        if (!response) {
          reject(new Error("No se recibió respuesta del servidor"));
          return;
        }

        if (response.success === false || response.error) {
          reject(new Error(response.error || response.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Obtiene los mensajes de una sala con paginación
   */
  getRoomMessages(
    roomId: string,
    limit: number = 50,
    cursor?: string
  ): Promise<{ messages: Message[]; hasMore: boolean; nextCursor: string | null }> {
    if (!this.socket || !this.socket.connected) {
      return Promise.reject(new Error("WebSocket no está conectado"));
    }

    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout;
      let hasResponded = false;

      const timeout = setTimeout(() => {
        if (!hasResponded) {
          hasResponded = true;
          console.warn("⏱️ Timeout al obtener mensajes después de 15s - retornando mensajes vacíos");
          // Resolve with empty messages instead of rejecting
          resolve({
            messages: [],
            hasMore: false,
            nextCursor: null,
          });
        }
      }, 15000); // Increased timeout to 15 seconds

      this.socket!.emit("getRoomMessages", { roomId, limit, cursor }, (response: any) => {
        if (hasResponded) {
          console.warn("⚠️ Respuesta recibida después del timeout, ignorando");
          return;
        }

        hasResponded = true;
        clearTimeout(timeout);
        console.log("🔍 getRoomMessages response:", response);

        if (!response) {
          // If no response, return empty messages instead of failing
          console.warn("⚠️ No se recibió respuesta, retornando mensajes vacíos");
          resolve({
            messages: [],
            hasMore: false,
            nextCursor: null,
          });
          return;
        }

        if (response.status === "error" || response.error) {
          console.warn("⚠️ Error al obtener mensajes:", response.message || response.error);
          // Return empty messages instead of rejecting
          resolve({
            messages: [],
            hasMore: false,
            nextCursor: null,
          });
        } else {
          // Mapear mensajes del backend al formato frontend
          const messages = (response.messages || []).map(mapServerMessage);
          console.log("🔍 getRoomMessages mensajes mapeados:", messages.length, "hasMore:", response.hasMore);
          resolve({
            messages,
            hasMore: response.hasMore || false,
            nextCursor: response.nextCursor || null,
          });
        }
      });
    });
  }

  /**
   * Crea una sala privada
   */
  createPrivateRoom(targetUserId: string, targetUserType: "employee" | "visitor"): Promise<ChatRoom> {
    if (!this.socket || !this.socket.connected) {
      return Promise.reject(new Error("WebSocket no está conectado"));
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout al crear sala privada"));
      }, 5000);

      this.socket!.emit("createPrivateRoom", { targetUserId, targetUserType }, (response: any) => {
        clearTimeout(timeout);
        console.log("🔍 createPrivateRoom response:", response);

        if (!response) {
          reject(new Error("No se recibió respuesta del servidor"));
          return;
        }

        if (response.success === false || response.error) {
          reject(new Error(response.message || response.error));
        } else {
          // Mapear sala del backend al formato frontend
          const room = mapServerRoom(response.data || response);
          console.log("🔍 createPrivateRoom sala mapeada:", room);
          resolve(room);
        }
      });
    });
  }

  /**
   * Marca mensajes como leídos
   */
  markMessagesAsRead(roomId: string): Promise<any> {
    if (!this.socket || !this.socket.connected) {
      return Promise.reject(new Error("WebSocket no está conectado"));
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout al marcar mensajes como leídos"));
      }, 5000);

      this.socket!.emit("markAsRead", { roomId }, (response: any) => {
        clearTimeout(timeout);

        if (!response) {
          reject(new Error("No se recibió respuesta del servidor"));
          return;
        }

        if (response.success === false || response.error) {
          reject(new Error(response.error || response.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Escucha nuevos mensajes
   */
  onNewMessage(callback: (message: Message) => void) {
    if (!this.socket) {
      throw new Error("WebSocket no está conectado");
    }

    this.socket.on("newMessage", (raw: any) => {
      console.log("🔍 newMessage evento recibido:", raw);
      try {
        const mappedMessage = mapServerMessage(raw);
        console.log("🔍 newMessage mapeado:", mappedMessage);
        callback(mappedMessage);
      } catch (error) {
        console.error("❌ Error al mapear newMessage:", error);
        callback(raw as Message);
      }
    });
  }

  /**
   * Escucha cuando se crea una nueva sala
   */
  onRoomCreated(callback: (room: ChatRoom) => void) {
    if (!this.socket) {
      throw new Error("WebSocket no está conectado");
    }

    this.socket.on("roomCreated", (raw: any) => {
      console.log("🔍 roomCreated evento recibido:", raw);
      try {
        const mappedRoom = mapServerRoom(raw);
        console.log("🔍 roomCreated mapeado:", mappedRoom);
        callback(mappedRoom);
      } catch (error) {
        console.error("❌ Error al mapear roomCreated:", error);
        callback(raw as ChatRoom);
      }
    });
  }

  /**
   * Escucha actualizaciones de salas
   */
  onRoomUpdate(callback: (room: ChatRoom) => void) {
    if (!this.socket) {
      throw new Error("WebSocket no está conectado");
    }

    this.socket.on("roomUpdate", (raw: any) => {
      try {
        callback(mapServerRoom(raw));
      } catch (error) {
        console.error("❌ Error al mapear roomUpdate:", error);
        callback(raw as ChatRoom);
      }
    });
  }

  /**
   * Escucha cuando un usuario está escribiendo
   */
  onUserTyping(callback: (data: { roomId: string; userId: string; isTyping: boolean }) => void) {
    if (!this.socket) {
      throw new Error("WebSocket no está conectado");
    }

    this.socket.on("userTyping", callback);
  }

  /**
   * Envía evento de usuario escribiendo
   */
  emitTyping(roomId: string, isTyping: boolean) {
    if (!this.socket || !this.socket.connected) {
      return;
    }

    this.socket.emit("typing", { roomId, isTyping });
  }

  /**
   * Elimina un listener específico
   */
  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }
}

// Exportar una instancia única (singleton)
export const websocketService = new WebSocketService();
