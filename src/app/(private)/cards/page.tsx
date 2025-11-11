"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  Home,
  CreditCard,
  Activity,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cardService, Card as CardType } from "@/lib/services/card.service";
import { toast } from "sonner";
import MapUserWrapper from "@/components/private/map/mapUser";

export default function CardsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [cards, setCards] = useState<CardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form state
  const [newCardUuid, setNewCardUuid] = useState("");
  const [batteryPercentage, setBatteryPercentage] = useState(100);
  const [editBatteryPercentage, setEditBatteryPercentage] = useState(100);
  const [editStatus, setEditStatus] = useState<
    "active" | "inactive" | "lost" | "damaged"
  >("active");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const loadCards = useCallback(async () => {
    if (!user) {
      console.log("⚠️ No hay usuario, no se pueden cargar tarjetas");
      setLoading(false);
      setCards([]);
      setFilteredCards([]);
      return;
    }

    try {
      console.log("📥 Iniciando carga de tarjetas...");
      setLoading(true);
      // Si el usuario tiene supplier_id, obtener solo sus tarjetas
      const allCards = user?.supplier?.id
        ? await cardService.getBySupplier(user.supplier.id)
        : await cardService.getAll();
      console.log("✅ Tarjetas cargadas:", allCards?.length || 0);
      setCards(allCards || []);
      setFilteredCards(allCards || []);
    } catch (error) {
      console.error("❌ Error al cargar tarjetas:", error);
      toast.error("Error al cargar las tarjetas");
      // Asegurar que siempre tengamos un array vacío en caso de error
      setCards([]);
      setFilteredCards([]);
    } finally {
      console.log("🏁 Finalizando carga de tarjetas");
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log("🔄 useEffect carga de tarjetas:", {
      isAuthenticated,
      hasUser: !!user,
      isLoading,
      hasSupplier: !!user?.supplier?.id,
    });

    if (isAuthenticated && user && !isLoading) {
      console.log("✅ Condiciones cumplidas, cargando tarjetas...");
      loadCards();
    } else {
      console.log("⏸️ Condiciones no cumplidas, esperando...");
    }
  }, [isAuthenticated, user, isLoading, loadCards]);

  useEffect(() => {
    // Filtrar tarjetas por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = cards.filter(
        (card) =>
          card.card_uuid?.toLowerCase().includes(query) ||
          (card.status?.toLowerCase().includes(query) ?? false) ||
          card.employee?.first_name?.toLowerCase().includes(query) ||
          card.employee?.last_name?.toLowerCase().includes(query) ||
          card.visitor?.first_name?.toLowerCase().includes(query) ||
          card.visitor?.last_name?.toLowerCase().includes(query)
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards(cards);
    }
  }, [searchQuery, cards]);

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
    } catch (error) {
      type ErrorWithResponse = {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const e = error as ErrorWithResponse;
      console.error("Error al agregar tarjeta:", error);
      toast.error(
        e.response?.data?.message || e.message || "Error al agregar la tarjeta"
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

  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
    setEditBatteryPercentage(card.battery_percentage || 100);
    setEditStatus(
      (card.status as "active" | "inactive" | "lost" | "damaged") || "active"
    );
    setIsEditDialogOpen(true);
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    try {
      await cardService.update(editingCard.id, {
        battery_percentage: editBatteryPercentage,
        status: editStatus,
      });
      toast.success("Tarjeta actualizada exitosamente");
      setIsEditDialogOpen(false);
      setEditingCard(null);
      await loadCards();
    } catch (error) {
      console.error("Error al actualizar tarjeta:", error);
      toast.error("Error al actualizar la tarjeta");
    }
  };

  // Limpiar editingCard cuando se cierra el diálogo
  useEffect(() => {
    if (!isEditDialogOpen) {
      setEditingCard(null);
    }
  }, [isEditDialogOpen]);

  // Calcular estadísticas
  const stats = {
    total: cards.length,
    active: cards.filter((c) => c.status === "active").length,
    inactive: cards.filter((c) => c.status === "inactive").length,
    lost: cards.filter((c) => c.status === "lost").length,
    damaged: cards.filter((c) => c.status === "damaged").length,
    averageBattery:
      cards.length > 0
        ? Math.round(
            cards.reduce((sum, c) => sum + (c.battery_percentage || 0), 0) /
              cards.length
          )
        : 0,
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

  console.log("🎨 Renderizando CardsPage:", {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    loading,
    cardsCount: cards.length,
  });

  // Mostrar loading mientras se verifica autenticación
  if (isLoading) {
    console.log("⏳ Mostrando loading de autenticación");
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#0386D9]"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log("🚫 Usuario no autenticado");
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-center">
          <p className="text-white text-lg">No autenticado</p>
          <p className="text-gray-400 text-sm mt-2">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[#0386D9]/10 border border-[#0386D9]/20">
                    <CreditCard className="h-6 w-6 text-[#0386D9]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Gestión de Tarjetas
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Administra todas las tarjetas RFID del sistema
                    </p>
                  </div>
                </div>
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-[#0386D9] hover:bg-[#0270BE] text-black">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Tarjeta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/5 border-white/10">
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
                          <label
                            htmlFor="card-uuid"
                            className="text-sm font-medium text-white mb-2 block"
                          >
                            UUID de la Tarjeta *
                          </label>
                          <Input
                            id="card-uuid"
                            placeholder="Ej: 04:3E:F2:8A:9C:40:81"
                            value={newCardUuid}
                            onChange={(e) => setNewCardUuid(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="battery-percentage"
                            className="text-sm font-medium text-white mb-2 block"
                          >
                            Batería Inicial (%)
                          </label>
                          <Input
                            id="battery-percentage"
                            type="number"
                            min="0"
                            max="100"
                            value={batteryPercentage}
                            onChange={(e) =>
                              setBatteryPercentage(Number(e.target.value))
                            }
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                          className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
                        >
                          Agregar
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-6 border-b border-white/10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <Card className="bg-white/5 border-white/10 hover:border-[#0386D9]/40 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stats.total}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Tarjetas</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 hover:border-[#0386D9]/40 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <Activity className="w-4 h-4" />
                      Activas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stats.active}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">En uso</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 hover:border-[#0386D9]/40 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <Battery className="w-4 h-4" />
                      Batería Prom.
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stats.averageBattery}%
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Promedio</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 hover:border-[#0386D9]/40 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <AlertTriangle className="w-4 h-4" />
                      Problemas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stats.lost + stats.damaged}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Perdidas/Dañadas
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-4"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por UUID, estado o asignado..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                </motion.div>

                {/* Cards Grid */}
                {filteredCards.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center py-12 border-2 border-dashed border-white/10 rounded-lg"
                  >
                    <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {searchQuery
                        ? "No se encontraron tarjetas"
                        : "No hay tarjetas registradas"}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {searchQuery
                        ? "Intenta con otros términos de búsqueda"
                        : "Comienza agregando tu primera tarjeta al sistema"}
                    </p>
                    {!searchQuery && (
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar primera tarjeta
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  >
                    <AnimatePresence>
                      {filteredCards.map((card, index) => (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -2 }}
                        >
                          <Card className="bg-white/5 border-white/10 hover:border-[#0386D9]/40 hover:bg-white/[0.07] transition-all duration-300 group">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-sm font-mono text-[#0386D9] group-hover:text-[#0270BE] transition-colors">
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
                                <div 
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.stopPropagation();
                                    }
                                  }}
                                  role="button"
                                  tabIndex={0}
                                >
                                  {getStatusBadge(card.status || "inactive")}
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                              {/* Map Preview */}
                              {card.latitude != null &&
                                card.longitude != null &&
                                !isNaN(Number(card.latitude)) &&
                                !isNaN(Number(card.longitude)) && (
                                  <div className="h-32 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                                    <MapUserWrapper
                                      lat={Number(card.latitude)}
                                      lng={Number(card.longitude)}
                                      userName={
                                        card.employee
                                          ? `${
                                              card.employee.first_name || ""
                                            } ${
                                              card.employee.last_name || ""
                                            }`.trim()
                                          : card.visitor
                                          ? `${card.visitor.first_name || ""} ${
                                              card.visitor.last_name || ""
                                            }`.trim()
                                          : card.card_uuid || "Tarjeta"
                                      }
                                      className="w-full h-full"
                                    />
                                  </div>
                                )}

                              {/* Battery */}
                              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2">
                                  <Battery
                                    className={`w-4 h-4 ${getBatteryColor(
                                      card.battery_percentage
                                    )}`}
                                  />
                                  <span className="text-sm text-gray-300">
                                    Batería
                                  </span>
                                </div>
                                <span
                                  className={`font-semibold ${getBatteryColor(
                                    card.battery_percentage
                                  )}`}
                                >
                                  {card.battery_percentage || 0}%
                                </span>
                              </div>

                              {/* Location Info */}
                              {card.latitude != null &&
                                card.longitude != null && (
                                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                                    <MapPin className="w-4 h-4 text-[#0386D9]" />
                                    <span className="text-xs text-gray-400">
                                      {(() => {
                                        const lat =
                                          typeof card.latitude === "number"
                                            ? card.latitude
                                            : parseFloat(String(card.latitude));
                                        const lng =
                                          typeof card.longitude === "number"
                                            ? card.longitude
                                            : parseFloat(
                                                String(card.longitude)
                                              );
                                        return !isNaN(lat) && !isNaN(lng)
                                          ? `${lat.toFixed(4)}, ${lng.toFixed(
                                              4
                                            )}`
                                          : "Ubicación disponible";
                                      })()}
                                    </span>
                                  </div>
                                )}

                              {/* Actions */}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleEditCard(card);
                                  }}
                                  className="flex-1 border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCard(card.id, card.card_uuid);
                                  }}
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
          </motion.div>
        </div>

        {/* Edit Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditingCard(null);
            }
          }}
        >
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md">
            {editingCard ? (
              <form onSubmit={handleUpdateCard}>
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Editar Tarjeta
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Actualiza la información de la tarjeta
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="edit-uuid" className="text-sm font-medium text-white mb-2 block">
                      UUID
                    </Label>
                    <Input
                      id="edit-uuid"
                      value={editingCard?.card_uuid || ""}
                      disabled
                      className="bg-white/5 border-white/10 text-gray-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-battery"
                      className="text-sm font-medium text-white mb-2 block"
                    >
                      Batería (%)
                    </label>
                    <Input
                      id="edit-battery"
                      type="number"
                      min="0"
                      max="100"
                      value={editBatteryPercentage}
                      onChange={(e) =>
                        setEditBatteryPercentage(Number(e.target.value))
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-status"
                      className="text-sm font-medium text-white mb-2 block"
                    >
                      Estado
                    </label>
                    <select
                      id="edit-status"
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(
                          e.target.value as
                            | "active"
                            | "inactive"
                            | "lost"
                            | "damaged"
                        )
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#0386D9]"
                    >
                      <option value="active">Activa</option>
                      <option value="inactive">Inactiva</option>
                      <option value="lost">Perdida</option>
                      <option value="damaged">Dañada</option>
                    </select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingCard(null);
                    }}
                    className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
                  >
                    Guardar
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="p-4 text-center text-gray-400">
                Cargando información de la tarjeta...
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
