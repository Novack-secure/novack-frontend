"use client";

import React, { useRef, useEffect } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createMapPinElement } from "./mapPin";

interface MapUserProps {
  lat: number;
  lng: number;
  userName: string;
  className?: string;
}

const MapUser = ({
  lat,
  lng,
  userName,
  className,
}: {
  lat: number;
  lng: number;
  userName: string;
  className?: string;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
      mapId: "novack_map_id", // Required for Advanced Markers
      mapTypeId: "roadmap",
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      streetViewControl: false,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
      // Los estilos se configuran desde Google Maps Cloud Console cuando se usa mapId
    });

    const pinElement = createMapPinElement(userName, "#0386D9");

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map,
      title: userName,
      content: pinElement,
    });

    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
      }
    };
  }, [lat, lng, userName]);

  return (
    <div ref={mapRef} className={className || "w-full h-full rounded-lg"} />
  );
};

export default function MapUserWrapper(props: MapUserProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-red-500 text-xs">
          API Key de Google Maps no configurada
        </p>
      </div>
    );
  }

  const render = (status: Status): React.ReactElement => {
    switch (status) {
      case Status.LOADING:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-700 border-t-[#0386D9]"></div>
          </div>
        );
      case Status.FAILURE:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-red-500 text-xs">Error al cargar el mapa</p>
          </div>
        );
      case Status.SUCCESS:
        return <MapUser {...props} />;
      default:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-red-500 text-xs">Estado desconocido</p>
          </div>
        );
    }
  };

  return (
    <Wrapper apiKey={apiKey} render={render} libraries={["marker"]}>
      <MapUser {...props} />
    </Wrapper>
  );
}
