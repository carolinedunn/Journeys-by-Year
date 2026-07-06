import React, { useState, useMemo } from "react";
import { getParsedTravels, ATLANTA_COORDS, getContinentForCountry, getTravelsWithRouteDistances } from "./travelData";
import { TravelCheckIn, MapStyleOption } from "./types";
import TravelMap from "./components/TravelMap";
import StatsDashboard from "./components/StatsDashboard";
import SharePreviewModal from "./components/SharePreviewModal";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Search, 
  Globe, 
  SlidersHorizontal, 
  Info, 
  ListOrdered,
  Layers,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Palmtree,
  ArrowUpRight,
  Linkedin,
  Youtube,
  BookOpen,
  Briefcase,
  Share2
} from "lucide-react";

const MAP_STYLES: MapStyleOption[] = [
  {
    id: "voyager",
    name: "Voyager Blue",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: "esri-ocean",
    name: "Deep Ocean Bathymetry",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",
  },
  {
    id: "positron",
    name: "Bright Minimalist",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: "midnight",
    name: "Midnight Luminous",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
];

export default function App() {
  const allTravels = useMemo(() => getParsedTravels(), []);

  // Set default active year to the most recent year (e.g. 2026)
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const parsed = getParsedTravels();
    if (parsed.length === 0) return 2026;
    return Math.max(...parsed.map((t) => t.year));
  });
  const [selectedContinent, setSelectedContinent] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeMapStyle, setActiveMapStyle] = useState<MapStyleOption>(MAP_STYLES[0]);
  const [highlightedCheckin, setHighlightedCheckin] = useState<TravelCheckIn | null>(null);
  const [hoveredCheckin, setHoveredCheckin] = useState<TravelCheckIn | null>(null);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Derive distinct years from data & sort descending
  const yearsList = useMemo(() => {
    const years = Array.from(new Set<number>(allTravels.map((t) => t.year)));
    return years.sort((a: number, b: number) => b - a);
  }, [allTravels]);

  // Compute travel count per year for year selection layout
  const yearCounts = useMemo(() => {
    const counts: { [year: number]: number } = {};
    allTravels.forEach((t) => {
      counts[t.year] = (counts[t.year] || 0) + 1;
    });
    return counts;
  }, [allTravels]);

  // Filter current travels based on selected Year & search queries
  const yearTravels = useMemo(() => {
    return allTravels.filter((t) => t.year === selectedYear);
  }, [allTravels, selectedYear]);

  // Filter travels based on selected continent (all-time) or selected year (all continents)
  const filteredTravels = useMemo(() => {
    let list = allTravels;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.venueName.toLowerCase().includes(lowerQuery) ||
          t.city.toLowerCase().includes(lowerQuery) ||
          t.country.toLowerCase().includes(lowerQuery) ||
          (t.state && t.state.toLowerCase().includes(lowerQuery))
      );
    } else {
      if (selectedContinent !== "All") {
        list = allTravels.filter((t) => getContinentForCountry(t.country) === selectedContinent);
      } else {
        list = allTravels.filter((t) => t.year === selectedYear);
      }
    }

    // Sort by date ascending (oldest to newest)
    const sortedList = [...list].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    return getTravelsWithRouteDistances(sortedList);
  }, [allTravels, selectedContinent, selectedYear, searchQuery]);

  // Handle active travel node selection
  const handleSelectCheckin = (checkin: TravelCheckIn | null) => {
    setHighlightedCheckin(checkin);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 p-2 sm:p-5">
      
      {/* Outer balanced layout wrapper */}
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden min-h-[85vh] lg:h-[85vh] lg:min-h-[750px]">
        
        {/* Header Navigation */}
        <header className="h-16 flex items-center justify-between px-6 sm:px-8 bg-white border-b border-slate-200 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white font-extrabold tracking-tight">D</div>
            <h1 className="text-sm font-semibold tracking-tight uppercase text-slate-700">
              Travels of Caroline & Paul Dunn
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors rounded-lg text-xs font-bold border border-slate-200/80 cursor-pointer shadow-sm"
              title="View Social Sharing Preview"
              id="open-share-modal-btn"
            >
              <Share2 className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden sm:inline">Share Preview</span>
            </button>
          </div>
        </header>

        {/* Dynamic Multi-panel Inner Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-[640px] lg:min-h-0">
          
          {/* Sidebar Left: Year Selector */}
          <aside className="w-full lg:w-20 bg-slate-900 flex lg:flex-col items-center py-4 lg:py-8 gap-4 lg:gap-10 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-x-auto lg:overflow-x-hidden overflow-y-hidden lg:overflow-y-auto px-4 lg:px-0 aside-years-scrollbar">
            
            {/* Year selectors */}
            <div className="flex lg:flex-col gap-4 lg:gap-8 w-full items-center justify-around lg:justify-start">
              {yearsList.map((y) => {
                const isActive = selectedYear === y;
                const count = yearCounts[y] || 0;
                return (
                  <button
                    key={y}
                    onClick={() => {
                      setSelectedYear(y);
                      setSelectedContinent("All");
                      setSearchQuery("");
                      setHighlightedCheckin(null);
                    }}
                    className={`group flex flex-col items-center gap-1 transition-all shrink-0 ${
                      isActive ? "opacity-100 scale-110" : "opacity-40 hover:opacity-90"
                    }`}
                  >
                    <span className={`text-[11px] font-extrabold tracking-tight ${isActive ? "text-blue-400" : "text-white"}`}>
                      {y}
                    </span>
                    <div className={isActive ? "w-10 h-1 bg-blue-500 rounded-full" : "w-8 h-[1px] bg-slate-600"}></div>
                    <span className="text-[8px] font-mono text-slate-400">{count} stops</span>
                  </button>
                );
              })}
            </div>

          </aside>

          {/* Center Column: Map Area and controls */}
          <main className="flex-1 flex flex-col p-4 sm:p-6 gap-4 overflow-y-auto">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Globe className="h-3 w-3 text-blue-500" />
                  Travel Destinations Map
                </span>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                  {searchQuery.trim() 
                    ? `Search Results: "${searchQuery}" (All-Time)` 
                    : (selectedContinent === "All" ? `Journeys in ${selectedYear}` : `Journeys in ${selectedContinent}`)}
                </h2>
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs pl-9 pr-4 py-2.0 h-9 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Continent Selector (Replaces Ocean Theme) */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100/85 border border-slate-200 rounded-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mr-1">
                  <Globe className="h-3.5 w-3.5 text-slate-500" />
                  Select Continent:
                </span>
                {["All", "North America", "South America", "Europe", "Asia", "Africa", "Oceania"].map((continent) => (
                  <button
                    key={continent}
                    onClick={() => {
                      setSelectedContinent(continent);
                      setHighlightedCheckin(null);
                    }}
                    className={`py-1 px-2.5 text-[11px] rounded transition-all font-medium ${
                      selectedContinent === continent
                        ? "bg-blue-600 text-white font-bold shadow-sm"
                        : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {continent === "All" ? "by Year" : continent}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 italic hidden md:inline">
                {selectedContinent === "All" 
                  ? "Showing all destinations for selected year." 
                  : `Showing all destinations in ${selectedContinent} (all-time).`}
              </span>
            </div>

            {/* TravelMap Component */}
            <TravelMap 
              travels={filteredTravels} 
              selectedYear={selectedYear}
              highlightedCheckin={highlightedCheckin}
              hoveredCheckin={hoveredCheckin}
              onSelectCheckin={handleSelectCheckin}
              mapStyle={activeMapStyle}
              hideHUDs={isShareOpen}
              selectedContinent={selectedContinent}
            />

            {/* Quick Micro-Banner for Context */}
            <div className="p-3.5 bg-yellow-50/50 border border-yellow-100 rounded-lg text-xs text-slate-600 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Geometric Balance Pathing:</strong> Paths are represented chronologically. Use the timeline on the right or click directly on map nodes to inspect venues visited outside your Atlanta starting base.
              </span>
            </div>

          </main>

          {/* Right Panel: Detailed Trip Timeline & Curated Summary */}
          <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shrink-0 overflow-hidden">
            
            {/* Summary Block */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                SUMMARY {searchQuery.trim() ? "SEARCH RESULTS" : (selectedContinent === "All" ? selectedYear : selectedContinent)}
              </h2>
              <p className="text-2xl font-serif italic text-slate-800">
                {filteredTravels.length} Destinations
              </p>
              
              <div className="mt-4 flex gap-3">
                <div className="flex-1 bg-slate-100/70 p-3 rounded border border-slate-200/50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Distance</p>
                  <p className="text-base font-mono font-bold text-blue-600">
                    {filteredTravels.reduce((acc, curr) => acc + (curr.distanceContribution ?? curr.distanceFromAtlanta), 0).toLocaleString()}
                  </p>
                  <p className="text-[8px] text-slate-500 font-medium">TOTAL ROUTE MILES</p>
                </div>
                
                <div className="flex-1 bg-slate-100/70 p-3 rounded border border-slate-200/50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Peak Stop</p>
                  <p className="text-base font-mono font-bold text-emerald-600">
                    {filteredTravels.length > 0 
                      ? Math.max(...filteredTravels.map(t => t.distanceFromAtlanta)).toLocaleString() 
                      : "0"}
                  </p>
                  <p className="text-[8px] text-slate-500 font-medium">MAX RANGE MILES</p>
                </div>
              </div>
            </div>

            {/* List Chronology */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[460px] lg:max-h-none">
              
              {filteredTravels.length > 0 ? (
                filteredTravels.map((chk, index) => {
                  const isHighlighted = highlightedCheckin?.checkinId === chk.checkinId;
                  const distVal = chk.isLocalConnection ? chk.distanceContribution : chk.distanceFromAtlanta;
                  return (
                    <div
                      key={chk.checkinId}
                      onClick={() => handleSelectCheckin(chk)}
                      onMouseEnter={() => setHoveredCheckin(chk)}
                      onMouseLeave={() => setHoveredCheckin(null)}
                      className={`p-4 cursor-pointer flex items-start gap-4 transition-all duration-150 ${
                        isHighlighted
                          ? "bg-blue-600/10 border-l-4 border-l-blue-600 pl-3"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Circle Number Badge */}
                      <div className={`mt-0.5 font-mono text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                        isHighlighted 
                          ? "bg-blue-600 text-white border-blue-600 animate-pulse" 
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}>
                        {index + 1}
                      </div>

                      {/* Content block */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-1">
                          <span className="text-[9px] font-bold uppercase text-slate-400 font-mono" title={`Converted to local timezone (Offset: ${chk.timezoneOffset! >= 0 ? '+' : ''}${chk.timezoneOffset}h from original GMT)`}>
                            {chk.date}
                          </span>
                          <span className="text-[9px] font-bold font-mono text-blue-600 shrink-0">
                            {distVal?.toLocaleString()} mi
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-slate-900 mt-0.5 truncate" title={chk.venueName}>
                          {chk.venueName}
                        </h3>

                        <p className="text-[11px] text-slate-500 mt-0.5 truncate flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          {chk.city}{chk.state ? `, ${chk.state}` : ""}
                        </p>

                        {chk.isLocalConnection && (
                          <p className="text-[9px] text-amber-600 font-mono mt-0.5 flex items-center gap-1">
                            <span>↪</span> Local leg: {chk.distanceContribution} mi from {chk.prevLocationName}
                          </p>
                        )}
                      </div>

                      <ChevronRight className={`h-3.5 w-3.5 self-center transition-transform shrink-0 ${
                        isHighlighted ? "translate-x-1 text-blue-600" : "text-slate-300"
                      }`} />
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                  <span className="bg-slate-100 p-2.5 rounded-full text-slate-400">
                    <Search className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-medium text-slate-500">No match records found this year.</p>
                </div>
              )}

            </div>

            {/* Bottom button view summary */}
            <div className="p-4 bg-slate-50 mt-auto border-t border-slate-100">
              <div 
                onClick={() => {
                  if (allTravels.length > 0) {
                    const randomSpot = allTravels[Math.floor(Math.random() * allTravels.length)];
                    setSelectedYear(randomSpot.year);
                    setHighlightedCheckin(randomSpot);
                  }
                }}
                className="w-full py-2.5 bg-slate-900 text-white rounded font-bold text-xs uppercase tracking-widest text-center cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Inspect Random Stop
              </div>
            </div>

          </aside>

        </div>

        {/* Footer Status Bar */}
        <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-6 sm:px-8 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-semibold text-slate-600 tracking-wider">
                Created by{" "}
                <a 
                  href="https://app.globethrivers.com/s/sjEMw6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-blue-600 hover:underline inline-flex items-center gap-0.5"
                >
                  Caroline Dunn
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
              </span>
            </div>
            <div className="text-[10px] font-medium text-slate-500 hidden sm:flex items-center gap-3">
              <span className="text-slate-300">|</span>
              <a 
                href="https://app.globethrivers.com/s/sjEMw6" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-emerald-700 transition-colors flex items-center gap-1.5 font-bold"
              >
                <Briefcase className="h-3 w-3 text-emerald-600" />
                Itineraries
              </a>
              <span className="text-slate-300">•</span>
              <a 
                href="https://www.linkedin.com/in/carolinedunn/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-700 transition-colors flex items-center gap-1.5 font-bold"
              >
                <Linkedin className="h-3 w-3 text-blue-600" />
                LinkedIn
              </a>
              <span className="text-slate-300">•</span>
              <a 
                href="https://www.youtube.com/caroline" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-red-600 transition-colors flex items-center gap-1.5 font-bold"
              >
                <Youtube className="h-3 w-3.5 text-red-600" />
                YouTube
              </a>
            </div>
          </div>
          <div className="text-[10px] font-semibold text-slate-500 tracking-wide">
            <a 
              href="https://winningintech.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 hover:underline flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              Winning In Tech
            </a>
          </div>
        </footer>

      </div>

      {/* Row 4: Stats Dashboard Component Layer */}
      <div className="w-full max-w-7xl mx-auto mt-4 px-2 sm:px-0">
        <StatsDashboard 
          allTravels={allTravels} 
          filteredTravels={filteredTravels} 
          selectedYear={selectedYear} 
          selectedContinent={selectedContinent}
          searchQuery={searchQuery}
        />
      </div>

      <SharePreviewModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} sharedUrl="https://travel.cdunn.org/" />

    </div>
  );
}
