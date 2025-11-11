"use client";

import React, { useRef, useEffect, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createMapPinElement } from "./mapPin";

export interface MapCard {
  id: string;
  card_number: string;
  latitude: number;
  longitude: number;
  assigned_to?: {
    first_name: string;
    last_name: string;
  };
  is_active: boolean;
}

interface GlobalMapProps {
  cards: MapCard[];
  className?: string;
}

const Map = ({ cards }: { cards: MapCard[] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (!mapRef.current || cards.length === 0) return;

    // Validar que todas las coordenadas son números válidos
    const validCards = cards.filter(
      (card) =>
        typeof card.latitude === 'number' &&
        typeof card.longitude === 'number' &&
        !isNaN(card.latitude) &&
        !isNaN(card.longitude) &&
        card.latitude >= -90 &&
        card.latitude <= 90 &&
        card.longitude >= -180 &&
        card.longitude <= 180
    );

    if (validCards.length === 0) return;

    // Calcular el centro del mapa basado en todas las tarjetas válidas
    const center = validCards.length === 1
      ? { lat: validCards[0].latitude, lng: validCards[0].longitude }
      : {
          lat: validCards.reduce((sum, card) => sum + card.latitude, 0) / validCards.length,
          lng: validCards.reduce((sum, card) => sum + card.longitude, 0) / validCards.length,
        };

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: validCards.length === 1 ? 18 : 15,
      mapId: "novack_map_id", // Required for Advanced Markers
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // Los estilos se configuran desde Google Maps Cloud Console cuando se usa mapId
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Limpiar marcadores anteriores
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    // Crear marcadores para cada tarjeta válida
    validCards.forEach((card) => {
      const isActive = card.is_active;
      const assignedName = card.assigned_to
        ? `${card.assigned_to.first_name} ${card.assigned_to.last_name}`
        : "Sin asignar";

      // Usar el mismo pin de mapUser con el color según si está activa o no
      const pinColor = isActive ? "#0386D9" : "#64748b";
      const pinElement = createMapPinElement(card.card_number, pinColor);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: card.latitude, lng: card.longitude },
        map,
        title: card.card_number,
        content: pinElement,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="
            padding: 12px;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 8px;
            border: 1px solid rgba(7, 217, 217, 0.3);
            min-width: 180px;
          ">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <div style="
                width: 12px;
                height: 12px;
                background: ${isActive ? "#10B981" : "#64748b"};
                border-radius: 50%;
                margin-right: 8px;
                box-shadow: 0 0 8px ${isActive ? "rgba(16, 185, 129, 0.5)" : "rgba(100, 116, 139, 0.5)"};
              "></div>
              <strong style="color: #0386D9; font-size: 14px;">
                ${card.card_number}
              </strong>
            </div>

            <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; margin-bottom: 8px;">
              <div style="color: #e2e8f0; font-size: 12px; margin-bottom: 4px;">
                👤 <strong>${assignedName}</strong>
              </div>
              <div style="color: #94a3b8; font-size: 11px;">
                📍 ${card.latitude.toFixed(6)}, ${card.longitude.toFixed(6)}
              </div>
            </div>

            <div style="
              display: inline-block;
              background: ${isActive ? "rgba(16, 185, 129, 0.2)" : "rgba(100, 116, 139, 0.2)"};
              color: ${isActive ? "#10B981" : "#94a3b8"};
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
            ">
              ${isActive ? "🟢 ACTIVA" : "⚫ INACTIVA"}
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [cards]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Contador de tarjetas */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-[#0386D9]/30">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#0386D9] rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-white">
            {cards.filter((c) => c.is_active).length} / {cards.length} Tarjetas Activas
          </span>
        </div>
      </div>
    </div>
  );
};

const LoadingMap = () => (
  <div className="w-full h-full bg-slate-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="relative mb-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#0386D9] mx-auto"></div>
      </div>
      <p className="text-sm text-slate-300 font-medium">Cargando mapa...</p>
      <p className="text-xs text-slate-500 mt-1">Cargando ubicaciones de tarjetas</p>
    </div>
  </div>
);

const ErrorMap = () => (
  <div className="w-full h-full bg-slate-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <div className="text-red-500 text-xl">⚠️</div>
      </div>
      <p className="text-sm text-red-400 font-medium">Error al cargar el mapa</p>
      <p className="text-xs text-slate-500 mt-1">Verifica tu conexión a internet</p>
    </div>
  </div>
);

export default function GlobalMap({ cards, className = "" }: GlobalMapProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null);
  }, []);

  if (!apiKey) {
    return (
      <div className={`w-full h-full bg-slate-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="text-amber-500 text-xl">🗝️</div>
          </div>
          <p className="text-sm text-amber-400 font-medium mb-2">
            Google Maps API Key no configurada
          </p>
          <p className="text-xs text-slate-500 mb-3">
            Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en .env.local
          </p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className={`w-full h-full bg-slate-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="text-slate-400 text-xl">📍</div>
          </div>
          <p className="text-sm text-slate-300 font-medium mb-2">
            No hay tarjetas para mostrar
          </p>
          <p className="text-xs text-slate-500">
            Las tarjetas con ubicación aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  const render = (status: Status): React.ReactElement => {
    switch (status) {
      case Status.LOADING:
        return <LoadingMap />;
      case Status.FAILURE:
        return <ErrorMap />;
      case Status.SUCCESS:
        return <Map cards={cards} />;
      default:
        return <ErrorMap />;
    }
  };

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden ${className}`}>
      <Wrapper apiKey={apiKey} render={render} libraries={["marker"]} />
    </div>
  );
}
