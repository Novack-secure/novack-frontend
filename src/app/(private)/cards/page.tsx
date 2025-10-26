"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Battery,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  QrCode,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cardService, Card as CardType } from "@/lib/services/card.service";
import { toast } from "sonner";

export default function CardsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [cards, setCards] = useState<CardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form state
  const [newCardUuid, setNewCardUuid] = useState("");
  const [batteryPercentage, setBatteryPercentage] = useState(100);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCards();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Filtrar tarjetas por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = cards.filter(
        (card) =>
          card.card_uuid.toLowerCase().includes(query) ||
          card.status.toLowerCase().includes(query) ||
          card.employee?.first_name.toLowerCase().includes(query) ||
          card.employee?.last_name.toLowerCase().includes(query)
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards(cards);
    }
  }, [searchQuery, cards]);

  const loadCards = async () => {
    try {
      setLoading(true);
      // Si el usuario tiene supplier_id, obtener solo sus tarjetas
      const allCards = user?.supplier?.id
        ? await cardService.getBySupplier(user.supplier.id)
        : await cardService.getAll();
      setCards(allCards);
      setFilteredCards(allCards);
    } catch (error) {
      console.error("Error al cargar tarjetas:", error);
      toast.error("Error al cargar las tarjetas");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCardUuid.trim()) {
      toast.error("Debes ingresar un UUID");
      return;
    }

    if (!user?.supplier?.id) {
      toast.error("No se pudo identificar el supplier");
      return;
    }

    try {
      await cardService.create({
        card_uuid: newCardUuid.trim(),
        supplier_id: user.supplier.id,
        battery_percentage: batteryPercentage,
        status: "active",
      });

      toast.success("Tarjeta agregada exitosamente");
      setIsAddDialogOpen(false);
      setNewCardUuid("");
      setBatteryPercentage(100);
      await loadCards();
    } catch (error: any) {
      console.error("Error al agregar tarjeta:", error);
      toast.error(
        error.response?.data?.message || "Error al agregar la tarjeta"
      );
    }
  };

  const handleDeleteCard = async (cardId: string, cardUuid: string) => {
    if (!confirm(`¿Estás seguro de eliminar la tarjeta ${cardUuid}?`)) {
      return;
    }

    try {
      await cardService.delete(cardId);
      toast.success("Tarjeta eliminada exitosamente");
      await loadCards();
    } catch (error) {
      console.error("Error al eliminar tarjeta:", error);
      toast.error("Error al eliminar la tarjeta");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Activa
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Inactiva
          </Badge>
        );
      case "lost":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Perdida
          </Badge>
        );
      case "damaged":
        return (
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Dañada
          </Badge>
        );
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getBatteryColor = (percentage: number | undefined) => {
    if (!percentage) return "text-gray-400";
    if (percentage >= 50) return "text-green-400";
    if (percentage >= 20) return "text-yellow-400";
    return "text-red-400";
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-black overflow-auto">
      <div className="flex-1 p-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#07D9D9] to-[#0596A6] bg-clip-text text-transparent">
                Gestión de Tarjetas
              </h1>
              <p className="text-gray-400 mt-1">
                Administra todas las tarjetas RFID del sistema
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#07D9D9] to-[#0596A6] hover:opacity-90 text-[#010440] font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Tarjeta
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#010440] border border-[#07D9D9]/30">
                <form onSubmit={handleAddCard}>
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Nueva Tarjeta RFID
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Ingresa el UUID de la tarjeta para registrarla en el
                      sistema
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        UUID de la Tarjeta *
                      </label>
                      <Input
                        placeholder="Ej: 04:3E:F2:8A:9C:40:81"
                        value={newCardUuid}
                        onChange={(e) => setNewCardUuid(e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Batería Inicial (%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={batteryPercentage}
                        onChange={(e) =>
                          setBatteryPercentage(Number(e.target.value))
                        }
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#07D9D9] hover:bg-[#0596A6] text-[#010440] font-semibold"
                    >
                      Agregar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por UUID, estado o asignado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-[#07D9D9]"
            />
          </div>
        </motion.div>

        {/* Cards Grid */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">
              {searchQuery
                ? "No se encontraron tarjetas"
                : "No hay tarjetas registradas"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="mt-4 bg-[#07D9D9] hover:bg-[#0596A6] text-[#010440]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar primera tarjeta
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-[#07D9D9]/30 transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm font-mono text-[#07D9D9]">
                            {card.card_uuid}
                          </CardTitle>
                          <CardDescription className="text-xs text-gray-400 mt-1">
                            {card.employee
                              ? `${card.employee.first_name} ${card.employee.last_name}`
                              : card.visitor
                              ? `${card.visitor.first_name} ${card.visitor.last_name}`
                              : "Sin asignar"}
                          </CardDescription>
                        </div>
                        {getStatusBadge(card.status)}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Battery */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2">
                          <Battery
                            className={`w-4 h-4 ${getBatteryColor(
                              card.battery_percentage
                            )}`}
                          />
                          <span className="text-sm text-gray-300">Batería</span>
                        </div>
                        <span
                          className={`font-semibold ${getBatteryColor(
                            card.battery_percentage
                          )}`}
                        >
                          {card.battery_percentage || 0}%
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDeleteCard(card.id, card.card_uuid)
                          }
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
