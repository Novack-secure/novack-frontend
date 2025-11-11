import { api } from '../api';
import type { ChatRoom, ChatMessage } from '../types/api.types';

/**
 * Servicio para gestionar chat y mensajería
 */
export const chatService = {
  /**
   * Obtener todas las salas de chat del usuario
   */
  async getRooms(): Promise<ChatRoom[]> {
    const { data } = await api.get<ChatRoom[]>('/chat/rooms');
    return data;
  },

  /**
   * Obtener mensajes de una sala específica
   */
  async getMessages(roomId: string): Promise<ChatMessage[]> {
    const { data } = await api.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`);
    return data;
  },

  /**
   * Enviar un mensaje a una sala
   */
  async sendMessage(roomId: string, content: string): Promise<ChatMessage> {
    const { data } = await api.post<ChatMessage>('/chat/messages', {
      room_id: roomId,
      content,
    });
    return data;
  },

  /**
   * Crear una sala de chat privada con otro usuario
   */
  async createPrivateRoom(participantId: string): Promise<ChatRoom> {
    const { data } = await api.post<ChatRoom>('/chat/rooms/private', {
      participant_id: participantId,
    });
    return data;
  },

  /**
   * Crear una sala de chat grupal para un proveedor
   */
  async createSupplierRoom(supplierId: string): Promise<ChatRoom> {
    const { data } = await api.post<ChatRoom>(`/chat/rooms/supplier/${supplierId}`);
    return data;
  },

  /**
   * Crear una nueva sala de chat
   */
  async createRoom(name: string, type: 'private' | 'group', participantIds: string[]): Promise<ChatRoom> {
    const { data } = await api.post<ChatRoom>('/chat/rooms', {
      name,
      type,
      participant_ids: participantIds,
    });
    return data;
  },
};






