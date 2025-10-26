"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createMapPinElement } from "./mapPin";
import { useRef, useEffect, useState } from "react";

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
    null,
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
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

      // Customize the styling of the map.
      // styles: [
      //  {
      //    featureType: "all",
      //    elementType: "geometry",
      //    stylers: [{ color: "#1d2c4d" }],
      //  },
      //  {
      //    featureType: "water",
      //    elementType: "geometry",
      //    stylers: [{ color: "#17263c" }],
      //  },
      //  {
      //    featureType: "landscape",
      //    elementType: "geometry",
      //    stylers: [{ color: "#2c5aa0" }],
      //  },
      //  {
      //    featureType: "poi",
      //    elementType: "geometry",
      //    stylers: [{ color: "#2c5aa0" }],
      //  },
      //  {
      //    featureType: "road",
      //    elementType: "geometry",
      //    stylers: [{ color: "#2c5aa0" }],
      //  },
      //  {
      //    featureType: "all",
      //    elementType: "labels.text.fill",
      //    stylers: [{ color: "#ffffff" }],
      //  },
      //  {
      //    featureType: "all",
      //    elementType: "labels.text.stroke",
      //    stylers: [{ color: "#000000" }, { weight: 2 }],
      //  },
      //],
    });

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat, lng },
      map,
      title: userName,
      content: 
      
    });
  });
};

export default MapUser;
