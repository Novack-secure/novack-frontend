"use client";

import { useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  activeVisitors?: number;
  type: "supplier" | "office" | "visitor";
}

// Sample locations for Costa Rica
const sampleLocations: Location[] = [
  {
    id: "1",
    name: "TechCorp Solutions",
    lat: 9.9325,
    lng: -84.0795,
    address: "Av. Tecnología 123, San José",
    activeVisitors: 2,
    type: "supplier",
  },
  {
    id: "2",
    name: "Innovatech Ltd",
    lat: 9.9981,
    lng: -84.1136,
    address: "Calle Innovación 456, Heredia",
    activeVisitors: 1,
    type: "supplier",
  },
  {
    id: "3",
    name: "SecureNet Systems",
    lat: 9.8636,
    lng: -83.9198,
    address: "Boulevard Seguridad 789, Cartago",
    activeVisitors: 3,
    type: "supplier",
  },
  {
    id: "4",
    name: "CloudFirst Technologies",
    lat: 10.0162,
    lng: -84.2136,
    address: "Avenida Nube 321, Alajuela",
    activeVisitors: 0,
    type: "supplier",
  },
  {
    id: "5",
    name: "DataGuard Corp",
    lat: 9.9756,
    lng: -84.8333,
    address: "Paseo Datos 654, Puntarenas",
    activeVisitors: 1,
    type: "supplier",
  },
];

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 9.9325,
  lng: -84.0795,
};

const mapOptions = {
  disableDefaultUI: false,
  clickableIcons: false,
  scrollwheel: true,
  styles: [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#1a1a2e" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8b8b8b" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1a1a2e" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#2a2a3e" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#16213e" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#1f2937" }],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [{ color: "#2c3e50" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1a1a2e" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0f172a" }],
    },
  ],
};

export default function LocationsMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [locations] = useState<Location[]>(sampleLocations);
  const [isLoaded, setIsLoaded] = useState(false);

  const getMarkerIcon = useCallback(
    (type: string, activeVisitors: number = 0) => {
      if (!isLoaded || typeof window === "undefined" || !window.google) {
        return undefined;
      }

      const colors: Record<string, string> = {
        supplier: "#0386D9",
        office: "#4CAF50",
        visitor: "#FF9800",
      };

      const color = colors[type] || "#9E9E9E";
      const hasVisitors = activeVisitors > 0;

      // Create custom SVG marker
      const svg = `
      <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C11.163 0 4 7.163 4 16c0 12 16 34 16 34s16-22 16-34c0-8.837-7.163-16-16-16z"
              fill="${color}" stroke="white" stroke-width="2"/>
        ${
          hasVisitors
            ? `<circle cx="32" cy="8" r="8" fill="#FF4444" stroke="white" stroke-width="2"/>
               <text x="32" y="12" text-anchor="middle" font-size="10" font-weight="bold" fill="white">${activeVisitors}</text>`
            : ""
        }
      </svg>
    `;

      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new window.google.maps.Size(40, 50),
        anchor: new window.google.maps.Point(20, 50),
      };
    },
    [isLoaded],
  );

  const handleMarkerClick = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-white/10">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        onLoad={handleLoad}
        loadingElement={
          <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Cargando mapa...</p>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          options={mapOptions}
        >
          {isLoaded &&
            locations.map((location) => (
              <Marker
                key={location.id}
                position={{ lat: location.lat, lng: location.lng }}
                icon={getMarkerIcon(location.type, location.activeVisitors)}
                onClick={() => handleMarkerClick(location)}
              />
            ))}

          {selectedLocation && (
            <InfoWindow
              position={{
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
              }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-2 bg-[#1a1a2e] text-white rounded-lg">
                <h3 className="font-bold text-base mb-1 text-[#0386D9]">
                  {selectedLocation.name}
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  {selectedLocation.address}
                </p>
                {selectedLocation.activeVisitors !== undefined &&
                  selectedLocation.activeVisitors > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <p className="text-sm font-semibold text-green-400">
                        {selectedLocation.activeVisitors} visitante
                        {selectedLocation.activeVisitors > 1 ? "s" : ""} activo
                        {selectedLocation.activeVisitors > 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
