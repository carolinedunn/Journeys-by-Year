import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TravelCheckIn, MapStyleOption } from "../types";
import { ATLANTA_COORDS } from "../travelData";
import { Map, Plane, Compass, Award, Calendar, Search, Play, Pause, Navigation, Layers, Milestone, Globe } from "lucide-react";

interface TravelMapProps {
  travels: TravelCheckIn[];
  selectedYear: number;
  highlightedCheckin: TravelCheckIn | null;
  onSelectCheckin: (checkin: TravelCheckIn | null) => void;
  mapStyle: MapStyleOption;
}

export default function TravelMap({
  travels,
  selectedYear,
  highlightedCheckin,
  onSelectCheckin,
  mapStyle,
}: TravelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const travelPathRef = useRef<L.Polyline | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1500); // ms per step
  const [currentPlayIndex, setCurrentPlayIndex] = useState(-1);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Start with broad global view centered on US/Atlanta
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
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

    // Add selected tile layer
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

    const homeMarker = L.marker([ATLANTA_COORDS.lat, ATLANTA_COORDS.lng], { icon: homeIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div class="p-2 font-sans font-medium text-gray-800 text-center">
          <h4 class="font-bold text-emerald-600">Home Ref Base</h4>
          <p class="text-xs text-gray-500 mt-1">Atlanta, Georgia</p>
        </div>
      `);

    travels.forEach((chk, idx) => {
      const latlng: L.LatLngExpression = [chk.latitude, chk.longitude];
      coordinates.push(latlng);

      // Create a beautiful Tailwind HTML Marker with pulse/glow and rank number
      const markerHtml = `
        <div class="group relative flex items-center justify-center cursor-pointer">
          <span class="absolute inline-flex h-7 w-7 animate-ping rounded-full bg-blue-400 opacity-30 group-hover:opacity-60 transition-opacity"></span>
          <div class="relative bg-blue-600 text-white font-mono text-[10px] font-bold w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-all group-hover:scale-125 group-hover:bg-amber-500">
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
          <div class="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-blue-600 font-bold mb-1">
            <span class="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">${chk.country}</span>
            <span>${chk.date}</span>
          </div>
          <h4 class="font-bold text-gray-900 text-sm leading-snug">${chk.venueName}</h4>
          <p class="text-xs text-gray-600 mt-0.5">${chk.city}${chk.state ? `, ${chk.state}` : ""}</p>
          
          <div class="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-500 font-mono">Distance from ATL:</span>
            <span class="font-bold text-gray-800 font-mono font-medium">${chk.distanceFromAtlanta.toLocaleString()} km</span>
          </div>
          <div class="mt-1 flex items-center justify-between text-[9px] text-gray-400 font-mono">
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
      const allPoints = [L.latLng(ATLANTA_COORDS.lat, ATLANTA_COORDS.lng), ...coordinates.map(p => L.latLng(p as [number, number]))];
      const bounds = L.latLngBounds(allPoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } catch (e) {
      // safe fallback
    }

  }, [travels]);

  // Center on Highlighted Check-in
  useEffect(() => {
    if (!mapInstanceRef.current || !highlightedCheckin) return;

    const { latitude, longitude, checkinId } = highlightedCheckin;
    mapInstanceRef.current.setView([latitude, longitude], 12, { animate: true });

    // Open associated popup
    const marker = markersRef.current[checkinId];
    if (marker) {
      marker.openPopup();
    }
  }, [highlightedCheckin]);

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
            const activeCoords = travels.slice(0, nextIndex + 1).map(c => [c.latitude, c.longitude] as [number, number]);
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
  }, [isPlaying, currentPlayIndex, travels, playSpeed]);

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-100 shadow-xl bg-slate-50">
      
      {/* Absolute Header HUD Layer */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-100 shadow-md flex items-center gap-3">
        <div className="p-1.5 bg-blue-500 rounded-lg text-white">
          <Globe className="h-4 w-4 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[10px] text-slate-400">Map Mode</h4>
          <span className="text-sm font-bold text-slate-800 capitalize">{mapStyle.name} Map</span>
        </div>
      </div>

      {/* Animation Control Deck HUD (Sticky Top Right) */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-100 shadow-lg flex flex-col gap-2 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Plane className="h-3.5 w-3.5 text-blue-500 animate-bounce" />
            Wanderlust Playback
          </span>
          {isPlaying && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={travels.length === 0}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all border ${
              isPlaying
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 fill-slate-700" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-white" />
                Play Timeline
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentPlayIndex(-1);
              onSelectCheckin(null);
              if (mapInstanceRef.current && travels.length > 0) {
                // Focus out overview
                const points = [L.latLng(ATLANTA_COORDS.lat, ATLANTA_COORDS.lng), ...travels.map(p => L.latLng(p.latitude, p.longitude))];
                mapInstanceRef.current.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
              }
            }}
            className="px-2 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Playback speed slider */}
        {isPlaying && (
          <div className="mt-1 flex flex-col gap-1 transition-all">
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Speed:</span>
              <span>{(playSpeed / 1000).toFixed(1)}s / stop</span>
            </div>
            <input
              type="range"
              min="800"
              max="3500"
              step="300"
              value={playSpeed}
              onChange={(e) => setPlaySpeed(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}
      </div>

      {/* Actual Map Container */}
      <div id="map" ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Ocean/Land indicator overlay at bottom right */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none bg-slate-950/80 backdrop-blur-sm text-[10px] text-slate-300 font-mono px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5 shadow-lg">
        <div className="w-2.5 h-2.5 rounded bg-blue-500 border border-blue-400"></div>
        <span>Blue for Oceans Mode Loaded</span>
      </div>

      {/* Floating coordinates viewer at center bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 border border-slate-100 shadow-md backdrop-blur-sm px-3.5 py-1.5 rounded-full flex items-center gap-4 text-xs font-mono text-slate-600">
        <div className="flex items-center gap-1.5">
          <Navigation className="h-3 w-3 text-emerald-600 animate-pulse" />
          <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Atlanta Base:</span>
          <span className="font-semibold text-slate-800">33.749°N, 84.388°W</span>
        </div>
      </div>

    </div>
  );
}
