"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cardService, type CreateCardDto } from "@/lib/services";
import { handleApiError, showSuccess } from "@/lib/utils/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import { Home, CreditCard, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NewCardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    card_uuid: "",
    battery_percentage: 100,
    status: "active" as "active" | "inactive" | "lost" | "damaged",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.supplier?.id) {
      handleApiError(
        new Error("No se encontró el proveedor"),
        "Error de autenticación"
      );
      return;
    }

    try {
      setIsLoading(true);

      const createData: CreateCardDto = {
        card_uuid: formData.card_uuid,
        supplier_id: user.supplier.id,
        battery_percentage: formData.battery_percentage,
        status: formData.status,
      };

      await cardService.create(createData);

      showSuccess(
        "Tarjeta creada",
        "La tarjeta ha sido creada exitosamente"
      );

      router.push("/card");
    } catch (error) {
      handleApiError(error, "Error al crear la tarjeta");
    } finally {
      setIsLoading(false);
    }
  };

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
                <BreadcrumbPage>Nueva Tarjeta</BreadcrumbPage>
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
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#0386D9]/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-[#0386D9]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Crear Nueva Tarjeta
                  </h2>
                  <p className="text-sm text-slate-400">
                    Registra una nueva tarjeta en el sistema
                  </p>
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
                    disabled={isLoading}
                    className="flex-1 border-white/10 hover:bg-white/5 text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#0386D9] hover:bg-[#0270BE] text-black"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Crear Tarjeta
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
