"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { employeeService } from "@/lib/services/employee.service";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks/useAuth";

interface Contact {
  id: string;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  position?: string;
  department?: string;
  profile_image_url?: string;
  supplier?: {
    id: string;
    supplier_name: string;
  };
}

interface ContactListProps {
  onRoomCreated?: () => void;
  onClose?: () => void;
}

export default function ContactList({ onRoomCreated, onClose }: ContactListProps) {
  const { user } = useAuth();
  const { createPrivateRoom, joinRoom, rooms } = useWebSocket();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creatingRoomFor, setCreatingRoomFor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedContacts = await employeeService.searchContacts("");
        const filtered = fetchedContacts.filter(
          (contact) => contact.id !== user.id
        );
        setContacts(filtered);
      } catch (error: any) {
        console.error("❌ Error fetching contacts:", error);
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [user?.id]);

  const handleCreateOrJoinRoom = async (contact: Contact) => {
    setCreatingRoomFor(contact.id);
    try {
      // Buscar sala existente
      const existingRoom = rooms.find((room) => {
        if (room.roomType === "private" && room.participants) {
          return room.participants.some((p) => p.id === contact.id);
        }
        return false;
      });

      if (existingRoom) {
        await joinRoom(existingRoom);
      } else {
        const newRoom = await createPrivateRoom(contact.id, "employee");
        await joinRoom(newRoom);
      }
      onRoomCreated?.();
      onClose?.();
    } catch (error) {
      console.error("❌ Error creating or joining room:", error);
    } finally {
      setCreatingRoomFor(null);
    }
  };

  // Filtrar contactos por búsqueda
  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
    const email = contact.email.toLowerCase();
    const position = contact.position?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || email.includes(query) || position.includes(query);
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Search Input */}
      <div className="relative px-3 pt-3">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 pl-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#07D9D9]"
        />
      </div>

      {/* Contacts List */}
      <ScrollArea className="flex-1 px-3 pb-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
              >
                <Skeleton className="size-9 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4 bg-white/10" />
                  <Skeleton className="h-2.5 w-1/2 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-10 h-10 text-gray-500 mx-auto mb-2" />
            <p className="text-xs text-white font-medium mb-1">
              {searchQuery ? "Sin resultados" : "No hay contactos"}
            </p>
            <p className="text-xs text-gray-400">
              {searchQuery ? "Intenta otra búsqueda" : "No hay empleados"}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredContacts.map((contact, index) => {
              const isCreating = creatingRoomFor === contact.id;

              return (
                <div
                  key={contact.id}
                  onClick={() =>
                    !isCreating && handleCreateOrJoinRoom(contact)
                  }
                  className={`group relative flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                    isCreating
                      ? "bg-[#07D9D9]/10 border border-[#07D9D9]/30"
                      : "hover:bg-white/5"
                  }`}
                >
                  {/* Avatar */}
                  <Avatar className="h-9 w-9 border border-[#07D9D9]/30">
                    {contact.profile_image_url ? (
                      <AvatarImage
                        src={contact.profile_image_url}
                        alt={`${contact.first_name} ${contact.last_name}`}
                      />
                    ) : (
                      <AvatarFallback className="bg-[#07D9D9] text-[#010440] font-bold text-xs">
                        {getInitials(contact.first_name, contact.last_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {contact.first_name} {contact.last_name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {contact.position || contact.email}
                    </p>
                  </div>

                  {/* Action Button */}
                  {isCreating && (
                    <Loader2 className="w-4 h-4 text-[#07D9D9] animate-spin" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
