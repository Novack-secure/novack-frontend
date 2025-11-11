"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { cardService, type Card, type UpdateCardDto } from "@/lib/services";
import { handleApiError, showSuccess } from "@/lib/utils/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card as CardUI, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, CreditCard, ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function EditCardPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;

  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    card_uuid: "",
    battery_percentage: 100,
    status: "active" as "active" | "inactive" | "lost" | "damaged",
  });

  useEffect(() => {
    const loadCard = async () => {
      try {
        setIsLoading(true);
        const cardData = await cardService.getById(cardId);
        setCard(cardData);
        setFormData({
          card_uuid: cardData.card_uuid,
          battery_percentage: cardData.battery_percentage || 100,
          status: (cardData.status || "active") as "active" | "inactive" | "lost" | "damaged",
        });
      } catch (error) {
        handleApiError(error, "Error al cargar la tarjeta");
        router.push("/card");
      } finally {
        setIsLoading(false);
      }
    };

    if (cardId) {
      loadCard();
    }
  }, [cardId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const updateData: UpdateCardDto = {
        card_uuid: formData.card_uuid,
        battery_percentage: formData.battery_percentage,
        status: formData.status,
      };

      await cardService.update(cardId, updateData);

      showSuccess(
        "Tarjeta actualizada",
        "Los cambios han sido guardados exitosamente"
      );

      router.push("/card");
    } catch (error) {
      handleApiError(error, "Error al actualizar la tarjeta");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0386D9] border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg">Cargando tarjeta...</p>
        </div>
      </div>
    );
  }

  if (!card) {
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
                <BreadcrumbLink href="/card">Tarjetas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar Tarjeta</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <CardUI className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#0386D9]/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-[#0386D9]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Editar Tarjeta
                  </h2>
                  <p className="text-sm text-slate-400">
                    Tarjeta #{card.id.substring(0, 8)}
                  </p>
                </div>
              </div>

              {/* Card Info */}
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Número de Tarjeta</p>
                    <p className="text-white font-medium">
                      {card.card_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Fecha de Creación</p>
                    <p className="text-white font-medium">
                      {new Date(card.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {card.assigned_to && (
                    <div className="col-span-2">
                      <p className="text-slate-400">Asignado a</p>
                      <p className="text-white font-medium">
                        {card.assigned_to.first_name} {card.assigned_to.last_name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* UUID */}
                <div className="space-y-2">
                  <Label htmlFor="card_uuid" className="text-white">
                    UUID de la Tarjeta *
                  </Label>
                  <Input
                    id="card_uuid"
                    type="text"
                    required
                    placeholder="Ej: 04:5A:3B:F2:C1:80:80"
                    value={formData.card_uuid}
                    onChange={(e) =>
                      setFormData({ ...formData, card_uuid: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                  <p className="text-xs text-slate-400">
                    El identificador único de la tarjeta NFC/RFID
                  </p>
                </div>

                {/* Battery */}
                <div className="space-y-2">
                  <Label htmlFor="battery" className="text-white">
                    Nivel de Batería (%)
                  </Label>
                  <Input
                    id="battery"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.battery_percentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        battery_percentage: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-white">
                    Estado
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive" | "lost" | "damaged") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 border-white/10">
                      <SelectItem value="active" className="text-white">
                        Activa
                      </SelectItem>
                      <SelectItem value="inactive" className="text-white">
                        Inactiva
                      </SelectItem>
                      <SelectItem value="lost" className="text-white">
                        Perdida
                      </SelectItem>
                      <SelectItem value="damaged" className="text-white">
                        Dañada
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/card")}
                    disabled={isSaving}
                    className="flex-1 border-white/10 hover:bg-white/5 text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-[#0386D9] hover:bg-[#0270BE] text-black"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </CardUI>
        </motion.div>
      </div>
    </div>
  );
}
