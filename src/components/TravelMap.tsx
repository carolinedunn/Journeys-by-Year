import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TravelCheckIn, MapStyleOption } from "../types";
import { ATLANTA_COORDS } from "../travelData";
import { Map, Plane, Compass, Award, Calendar, Search, Play, Pause, Navigation, Layers, Milestone, Globe } from "lucide-react";

// Helper to shift Asia/Oceania longitudes to a continuous West-running scale relative to Atlanta.
// If isPacificView is true, we map positive longitudes (Asia, Europe) from 0 upwards,
// and we map negative longitudes (Americas) by adding 360, so Turkey is at the far left
// and North America is on the far right.
function getAdjustedLatLng(lat: number, lng: number, isPacificView: boolean): [number, number] {
  if (isPacificView) {
    let adjustedLng = lng;
    if (adjustedLng < 0) {
      adjustedLng += 360;
    }
    return [lat, adjustedLng];
  } else {
    let adjustedLng = lng;
    const diff = adjustedLng - ATLANTA_COORDS.lng;
    if (diff > 180) {
      adjustedLng -= 360;
    } else if (diff < -180) {
      adjustedLng += 360;
    }
    return [lat, adjustedLng];
  }
}

interface TravelMapProps {
  travels: TravelCheckIn[];
  selectedYear: number;
  highlightedCheckin: TravelCheckIn | null;
  hoveredCheckin?: TravelCheckIn | null;
  onSelectCheckin: (checkin: TravelCheckIn | null) => void;
  mapStyle: MapStyleOption;
  hideHUDs?: boolean;
  selectedContinent: string;
}

export default function TravelMap({
  travels,
  selectedYear,
  highlightedCheckin,
  hoveredCheckin = null,
  onSelectCheckin,
  mapStyle,
  hideHUDs = false,
  selectedContinent,
}: TravelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const travelPathRef = useRef<L.Polyline | null>(null);

  const isPacificView = selectedContinent === "Asia" || selectedContinent === "Oceania";

  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1500); // ms per step
  const [currentPlayIndex, setCurrentPlayIndex] = useState(-1);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Start with broad global view centered on US/Atlanta, and allow panning past -180/180
      // using custom Pacific-centered bounds ([-285, 105]) so that the Pacific crossing can be panned seamlessly
      // without duplicating any continents.
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        minZoom: 2,
        maxBounds: [
          [-85, -285],
          [85, 105]
        ],
        maxBoundsViscosity: 1.0,
      }).setView([ATLANTA_COORDS.lat, ATLANTA_COORDS.lng], 3);

      L.control.zoom({ position: "bottomright" }).addTo(mapInstanceRef.current);
      
      // Scale indicator
      L.control.scale({ position: "bottomleft" }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Map Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing tile layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    // Add selected tile layer. We do not restrict tiles using noWrap or bounds
    // so Leaflet can seamlessly render the Pacific-centered adjusted longitude range.
    L.tileLayer(mapStyle.url, {
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [mapStyle]);

  // Clean and rebuild Year Markers / Map Elements
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Stop playback if playing
    setIsPlaying(false);
    setCurrentPlayIndex(-1);

    // Clear previous markers
    Object.values(markersRef.current).forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = {};

    if (polylineRef.current) {
      mapInstanceRef.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (travelPathRef.current) {
      mapInstanceRef.current.removeLayer(travelPathRef.current);
      travelPathRef.current = null;
    }

    if (travels.length === 0) return;

    const coordinates: L.LatLngExpression[] = [];

    // Also draw Home Base (Atlanta) as reference
    const homeIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute bg-emerald-400 opacity-60 w-10 h-10 rounded-full animate-ping"></span>
          <div class="relative bg-emerald-600 text-white rounded-full p-1.5 shadow-xl border border-white flex items-center justify-center">
            <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          </div>
        </div>
      `,
      className: "home-marker-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const homeMarker = L.marker(getAdjustedLatLng(ATLANTA_COORDS.lat, ATLANTA_COORDS.lng, isPacificView), { icon: homeIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div class="p-2 font-sans font-medium text-gray-800 text-center">
          <h4 class="font-bold text-emerald-600">Home Ref Base</h4>
          <p class="text-xs text-gray-500 mt-1">Atlanta, Georgia</p>
        </div>
      `);

    travels.forEach((chk, idx) => {
      const latlng = getAdjustedLatLng(chk.latitude, chk.longitude, isPacificView);
      coordinates.push(latlng);

      const isHovered = hoveredCheckin?.checkinId === chk.checkinId;
      // Create a beautiful Tailwind HTML Marker with pulse/glow and rank number
      const markerHtml = `
        <div class="group relative flex items-center justify-center cursor-pointer">
          <span class="absolute inline-flex ${isHovered ? 'h-10 w-10 bg-amber-500 opacity-60 scale-150' : 'h-7 w-7 bg-blue-400 opacity-30'} animate-ping rounded-full group-hover:opacity-60 transition-opacity"></span>
          <div class="relative ${isHovered ? 'bg-amber-500 scale-135 border-amber-300 z-50 text-slate-950 font-extrabold shadow-lg shadow-amber-500/50' : 'bg-blue-600 border-white text-white'} font-mono text-[10px] font-bold w-6 h-6 rounded-full border-2 shadow-md flex items-center justify-center transition-all group-hover:scale-125 group-hover:bg-amber-500">
            ${idx + 1}
          </div>
        </div>
      `;

      const pIcon = L.divIcon({
        html: markerHtml,
        className: "custom-travel-pin",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const pMarker = L.marker(latlng, { icon: pIcon })
        .addTo(mapInstanceRef.current!)
        .on("click", () => {
          onSelectCheckin(chk);
        });

      // Bind detailed contextual popup
      pMarker.bindPopup(`
        <div class="p-3 font-sans max-w-[280px]">
          <div class="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-blue-600 font-bold mb-1 flex-wrap">
            <span class="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">${chk.country}</span>
            <span>${chk.date}</span>
          </div>
          <h4 class="font-bold text-gray-900 text-sm leading-snug">${chk.venueName}</h4>
          <p class="text-xs text-gray-600 mt-0.5">${chk.city}${chk.state ? `, ${chk.state}` : ""}</p>
          
          <div class="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-500 font-mono">Distance from ATL:</span>
            <span class="font-bold text-gray-800 font-mono font-medium">${chk.distanceFromAtlanta.toLocaleString()} mi</span>
          </div>
          ${chk.isLocalConnection ? `
          <div class="mt-1 pt-1 border-t border-dashed border-gray-100 flex items-center justify-between text-xs text-amber-700 font-medium">
            <span class="font-mono">Local Route Leg:</span>
            <span class="font-bold font-mono">${chk.distanceContribution?.toLocaleString()} mi (from ${chk.prevLocationName})</span>
          </div>
          ` : ""}
          <div class="mt-1 pt-1 border-t border-dashed border-gray-100 flex items-center justify-between text-[9px] text-gray-400 font-mono">
            <span>Lat: ${chk.latitude.toFixed(4)}</span>
            <span>Lng: ${chk.longitude.toFixed(4)}</span>
          </div>
        </div>
      `);

      markersRef.current[chk.checkinId] = pMarker;
    });

    // Draw active flight/travel lines in year sequence (Connecting path)
    if (coordinates.length > 1) {
      polylineRef.current = L.polyline(coordinates, {
        color: "#3b82f6",
        weight: 3,
        opacity: 0.7,
        dashArray: "6, 8",
        className: "pulsing-travel-line",
      }).addTo(mapInstanceRef.current);
    }

    // Adjust map frame bounds around travels
    try {
      // Temporarily clear maxBounds to allow smooth fitting of the new coordinate set
      mapInstanceRef.current.setMaxBounds(null);

      const atlAdjusted = getAdjustedLatLng(ATLANTA_COORDS.lat, ATLANTA_COORDS.lng, isPacificView);
      const allPoints = [L.latLng(atlAdjusted), ...coordinates.map(p => L.latLng(p as [number, number]))];
      const bounds = L.latLngBounds(allPoints);
      
      // Fit bounds and enforce a safe maximum zoom level so we don't zoom in too close for 1-marker views (e.g. Africa)
      mapInstanceRef.current.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 4,
        animate: false
      });

      // Apply the correct maxBounds constraints for the selected perspective
      if (isPacificView) {
        mapInstanceRef.current.setMaxBounds([
          [-85, -10],
          [85, 310]
        ]);
      } else {
        mapInstanceRef.current.setMaxBounds([
          [-85, -285],
          [85, 105]
        ]);
      }
    } catch (e) {
      // safe fallback
    }

  }, [travels, isPacificView, hoveredCheckin]);

  // Center on Highlighted or Hovered Check-in
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (hoveredCheckin) {
      const { latitude, longitude } = hoveredCheckin;
      const adjustedCoords = getAdjustedLatLng(latitude, longitude, isPacificView);
      const [adjLat, adjLng] = adjustedCoords;

      // 1 degree of latitude is ~69 miles
      const latDelta = 100 / 69; // ~1.45 degrees
      const cosLat = Math.cos(adjLat * Math.PI / 180);
      const lngDelta = latDelta / (cosLat > 0.01 ? cosLat : 0.01);

      const minLat = adjLat - latDelta;
      const maxLat = adjLat + latDelta;
      const minLng = adjLng - lngDelta;
      const maxLng = adjLng + lngDelta;

      try {
        mapInstanceRef.current.fitBounds([
          [minLat, minLng],
          [maxLat, maxLng]
        ], { animate: true });
      } catch (e) {
        mapInstanceRef.current.setView(adjustedCoords, 10, { animate: true });
      }
    } else if (highlightedCheckin) {
      const { latitude, longitude, checkinId } = highlightedCheckin;
      const adjustedCoords = getAdjustedLatLng(latitude, longitude, isPacificView);
      mapInstanceRef.current.setView(adjustedCoords, 12, { animate: true });

      // Open associated popup
      const marker = markersRef.current[checkinId];
      if (marker) {
        marker.openPopup();
      }
    } else {
      // Restore overview bounds when nothing is hovered or highlighted
      try {
        const atlAdjusted = getAdjustedLatLng(ATLANTA_COORDS.lat, ATLANTA_COORDS.lng, isPacificView);
        const coordinates = travels.map(chk => getAdjustedLatLng(chk.latitude, chk.longitude, isPacificView));
        const allPoints = [L.latLng(atlAdjusted), ...coordinates.map(p => L.latLng(p as [number, number]))];
        const bounds = L.latLngBounds(allPoints);
        
        mapInstanceRef.current.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 4,
          animate: true
        });
      } catch (e) {
        // safe fallback
      }
    }
  }, [hoveredCheckin, highlightedCheckin, isPacificView, travels]);

  // Animation Playback Engine
  useEffect(() => {
    if (isPlaying) {
      if (currentPlayIndex === -1) {
        setCurrentPlayIndex(0);
      }

      playTimerRef.current = setTimeout(() => {
        const nextIndex = currentPlayIndex + 1;
        if (nextIndex < travels.length) {
          setCurrentPlayIndex(nextIndex);
          const nextCheckin = travels[nextIndex];
          onSelectCheckin(nextCheckin);
          
          // Draw a real-time animated path trail
          if (mapInstanceRef.current) {
            if (travelPathRef.current) {
              mapInstanceRef.current.removeLayer(travelPathRef.current);
            }
            const activeCoords = travels.slice(0, nextIndex + 1).map(c => getAdjustedLatLng(c.latitude, c.longitude, isPacificView));
            travelPathRef.current = L.polyline(activeCoords, {
              color: "#f59e0b", // Amber line for animated sweep
              weight: 4,
              opacity: 0.95
            }).addTo(mapInstanceRef.current);
          }
        } else {
          // Playback finished
          setIsPlaying(false);
          setCurrentPlayIndex(-1);
        }
      }, playSpeed);
    } else {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }
    }

    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
      }
    };
  }, [isPlaying, currentPlayIndex, travels, playSpeed, isPacificView]);

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-100 shadow-xl bg-slate-50">
      


      {/* Actual Map Container */}
      <div id="map" ref={mapContainerRef} className="w-full h-full z-10" />



    </div>
  );
}
