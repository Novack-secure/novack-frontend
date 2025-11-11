"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cardService, type Card } from "@/lib/services";
import { handleApiError, showSuccess } from "@/lib/utils/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card as CardUI, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  CreditCard,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  User,
  UserX,
  AlertTriangle,
  Home,
  Trash2,
  MapPin,
  Edit,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CardManagementPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<{
    id: string;
    number: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    lost: 0,
    damaged: 0,
    averageBattery: 0,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const loadCards = useCallback(async () => {
    try {
      setIsLoading(true);
      if (user?.supplier?.id) {
        const [cardsData, statsData] = await Promise.all([
          cardService.getBySupplier(user.supplier.id),
          cardService.getStats(user.supplier.id),
        ]);
        setCards(cardsData);
        setFilteredCards(cardsData);
        setStats(statsData);
      }
    } catch (error) {
      handleApiError(error, "Error al cargar tarjetas");
    } finally {
      setIsLoading(false);
    }
  }, [user?.supplier?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.supplier?.id) {
      loadCards();
    }
  }, [isAuthenticated, user, loadCards]);

  useEffect(() => {
    let filtered = cards;

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (card) =>
          card.card_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.card_uuid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.assigned_to?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.assigned_to?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.employee?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.employee?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((card) => {
        const status = card.status || (card.is_active ? "active" : "inactive");
        return status === statusFilter;
      });
    }

    setFilteredCards(filtered);
  }, [searchTerm, statusFilter, cards]);

  const openDeleteDialog = (id: string, cardNumber: string) => {
    setCardToDelete({ id, number: cardNumber });
    setDeleteDialogOpen(true);
  };

  const handleDeleteCard = async () => {
    if (!cardToDelete) return;

    try {
      setIsDeleting(true);
      await cardService.delete(cardToDelete.id);
      showSuccess(
        "Tarjeta eliminada",
        "La tarjeta ha sido eliminada exitosamente"
      );
      setDeleteDialogOpen(false);
      setCardToDelete(null);
      loadCards();
    } catch (error) {
      handleApiError(error, "Error al eliminar tarjeta");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (card: Card) => {
    // Usar is_active si no hay status
    const status = card.status || (card.is_active ? "active" : "inactive");

    switch (status) {
      case "active":
      case "assigned":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Activa
          </Badge>
        );
      case "available":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Disponible
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
            Inactiva
          </Badge>
        );
      case "lost":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Perdida
          </Badge>
        );
      case "damaged":
        return (
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            Dañada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
            Desconocido
          </Badge>
        );
    }
  };

  const getBatteryIcon = (percentage?: number) => {
    if (!percentage && percentage !== 0) return <Battery className="w-4 h-4 text-slate-400" />;
    if (percentage <= 20)
      return <BatteryLow className="w-4 h-4 text-red-400" />;
    if (percentage <= 50)
      return <BatteryMedium className="w-4 h-4 text-yellow-400" />;
    return <BatteryFull className="w-4 h-4 text-green-400" />;
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0386D9] border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg">Cargando tarjetas...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex flex-col h-full p-3 pl-2 overflow-hidden">
      <div className="flex-1 overflow-auto space-y-3">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/home">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tarjetas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          <CardUI className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <CreditCard className="h-8 w-8 text-[#0386D9]" />
              </div>
            </CardContent>
          </CardUI>

          <CardUI className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Activas</p>
                  <p className="text-2xl font-bold text-green-400">{stats.active}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </CardUI>

          <CardUI className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Inactivas</p>
                  <p className="text-2xl font-bold text-slate-400">{stats.inactive}</p>
                </div>
                <CreditCard className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </CardUI>

          <CardUI className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Perdidas</p>
                  <p className="text-2xl font-bold text-red-400">{stats.lost}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </CardUI>

          <CardUI className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Dañadas</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.damaged}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </CardUI>

          <CardUI className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Batería Prom.</p>
                  <p className="text-2xl font-bold text-white">
                    {typeof stats.averageBattery === 'number' 
                      ? stats.averageBattery.toFixed(0) 
                      : 0}%
                  </p>
                </div>
                <Battery className="h-8 w-8 text-[#0386D9]" />
              </div>
            </CardContent>
          </CardUI>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-[#0386D9]" />
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Gestión de Tarjetas
                  </h2>
                  <p className="text-sm text-slate-400">
                    Total de tarjetas: {filteredCards.length}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/card/new")}
                className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarjeta
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por número, UUID o asignado a..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-white/10">
                  <SelectItem value="all" className="text-white">
                    Todos los estados
                  </SelectItem>
                  <SelectItem value="active" className="text-white">
                    Activas
                  </SelectItem>
                  <SelectItem value="available" className="text-white">
                    Disponibles
                  </SelectItem>
                  <SelectItem value="inactive" className="text-white">
                    Inactivas
                  </SelectItem>
                  <SelectItem value="lost" className="text-white">
                    Perdidas
                  </SelectItem>
                  <SelectItem value="damaged" className="text-white">
                    Dañadas
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cards List */}
          <div className="flex-1 overflow-auto p-4">
            {filteredCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <CreditCard className="h-16 w-16 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {searchTerm || statusFilter !== "all"
                    ? "No se encontraron tarjetas"
                    : "No hay tarjetas registradas"}
                </h3>
                {!searchTerm && statusFilter === "all" && (
                  <>
                    <p className="text-slate-400 mb-6">
                      Crea tu primera tarjeta para comenzar
                    </p>
                    <Button
                      onClick={() => router.push("/card/new")}
                      className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Tarjeta
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CardUI className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-[#0386D9]/20 transition-all duration-300">
                      <CardContent className="p-4">
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#0386D9]/10 rounded-lg">
                              <CreditCard className="h-5 w-5 text-[#0386D9]" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                Tarjeta #{card.id.substring(0, 8)}
                              </p>
                              <p className="text-xs text-slate-400">
                                {card.card_number?.substring(0, 8)}...
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(card)}
                        </div>

                        {/* Battery */}
                        {card.battery_percentage !== undefined && (
                          <div className="flex items-center gap-2 mb-3 p-2 bg-white/5 rounded-lg">
                            {getBatteryIcon(card.battery_percentage)}
                            <span className="text-sm text-slate-300">
                              {card.battery_percentage}%
                            </span>
                          </div>
                        )}

                        {/* Assigned To */}
                        <div className="mb-3 p-2 bg-white/5 rounded-lg">
                          {card.assigned_to || card.employee ? (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-[#0386D9]" />
                              <span className="text-sm text-slate-300 truncate">
                                {card.assigned_to?.first_name ||
                                  card.employee?.first_name}{" "}
                                {card.assigned_to?.last_name ||
                                  card.employee?.last_name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <UserX className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-400">
                                Sin asignar
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Location */}
                        {card.latitude != null && card.longitude != null && (
                          <div className="flex items-center gap-2 mb-3 p-2 bg-white/5 rounded-lg">
                            <MapPin className="w-4 h-4 text-[#0386D9]" />
                            <span className="text-xs text-slate-400">
                              {(() => {
                                const lat = typeof card.latitude === 'number' 
                                  ? card.latitude 
                                  : parseFloat(String(card.latitude));
                                const lng = typeof card.longitude === 'number'
                                  ? card.longitude
                                  : parseFloat(String(card.longitude));
                                return !isNaN(lat) && !isNaN(lng)
                                  ? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
                                  : 'Ubicación no disponible';
                              })()}
                            </span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-[#0386D9] text-[#0386D9] hover:bg-[#0386D9] hover:text-black"
                            onClick={() => router.push(`/card/${card.id}`)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                            onClick={() =>
                              openDeleteDialog(card.id, card.card_number || card.card_uuid)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </CardUI>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-black/95 backdrop-blur-xl border border-red-500/30 text-white max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <DialogTitle className="text-xl text-white">
                Eliminar Tarjeta
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-300 text-base pt-2">
              ¿Estás seguro de que deseas eliminar la tarjeta{" "}
              <span className="font-semibold text-white">
                {cardToDelete?.number}
              </span>
              ?
              <br />
              <br />
              Esta acción no se puede deshacer y se perderá todo el historial
              de ubicaciones asociado a la tarjeta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setCardToDelete(null);
              }}
              disabled={isDeleting}
              className="border-white/10 hover:bg-white/5 text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteCard}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
