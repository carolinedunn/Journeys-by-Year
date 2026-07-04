import React from "react";
import { TravelCheckIn } from "../types";
import { Milestone, Globe, Award, Compass } from "lucide-react";

interface StatsDashboardProps {
  allTravels: TravelCheckIn[];
  filteredTravels: TravelCheckIn[];
  selectedYear: number;
  selectedContinent?: string;
  searchQuery?: string;
}

export default function StatsDashboard({
  allTravels,
  filteredTravels,
  selectedYear,
  selectedContinent = "All",
  searchQuery = ""
}: StatsDashboardProps) {
  const isSearchActive = searchQuery.trim().length > 0;
  const isContinentFiltered = !isSearchActive && selectedContinent !== "All";

  // 1. Calculate General Footprint
  const totalCheckinsAllTime = allTravels.length;
  const distinctCountriesAllTime = Array.from(new Set(allTravels.map(t => t.country))).filter(Boolean).length;
  const totalDistanceAllTime = allTravels.reduce((acc, current) => acc + current.distanceFromAtlanta, 0);

  // 2. Count current selected year specific stats
  const checkinsThisYear = filteredTravels.length;
  const countriesThisYear = Array.from(new Set(filteredTravels.map(t => t.country))).filter(Boolean);
  const totalDistanceThisYear = filteredTravels.reduce((acc, current) => acc + current.distanceFromAtlanta, 0);

  // 3. Find furthest destination from Atlanta this year/continent
  const furthestDestinationThisYear = filteredTravels.reduce((max, current) => {
    return current.distanceFromAtlanta > (max?.distanceFromAtlanta || 0) ? current : max;
  }, null as TravelCheckIn | null);

  // 4. Most active cities this year/continent
  const cityCounts: { [city: string]: number } = {};
  filteredTravels.forEach(t => {
    const key = `${t.city}${t.country ? `, ${t.country}` : ""}`;
    cityCounts[key] = (cityCounts[key] || 0) + 1;
  });
  const topCityThisYear = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None Recorded";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      
      {/* Total Mileage Counter Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-700/50 flex flex-col justify-between group overflow-hidden relative">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-slate-800/20 group-hover:scale-125 transition-transform duration-500 pointer-events-none z-0">
          <Milestone className="h-28 w-28" />
        </div>
        
        <div className="relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            {isSearchActive ? "Search Match Mileage" : (isContinentFiltered ? "Selected Continent Mileage" : "Selected Year Mileage")}
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight mt-1 font-mono text-blue-400">
            {totalDistanceThisYear.toLocaleString()} <span className="text-sm font-medium text-white/80">mi</span>
          </h3>
          <p className="text-xs text-slate-300 mt-2 line-clamp-2">
            {isSearchActive 
              ? `Home to destination flights cumulative distance for search: "${searchQuery}".`
              : `Home to destination flights cumulative distance outside Atlanta in ${isContinentFiltered ? selectedContinent : selectedYear}.`}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400 font-mono relative z-10">
          <span>All-Time Cumulative:</span>
          <span className="font-bold text-white">{totalDistanceAllTime.toLocaleString()} mi</span>
        </div>
      </div>

      {/* Global Countries Explorer Card */}
      <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex flex-col justify-between group overflow-hidden relative">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-emerald-50 group-hover:scale-125 transition-transform duration-500 pointer-events-none z-0">
          <Globe className="h-28 w-28" />
        </div>

        <div className="relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            {isSearchActive ? "Matched Countries" : (isContinentFiltered ? "Countries in Continent" : "Countries Visited")}
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight mt-1 font-sans text-emerald-600">
            {countriesThisYear.length || "0"}{" "}
            <span className="text-xs font-normal text-slate-400">countries</span>
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">
            {isSearchActive ? "Countries in search matches" : (isContinentFiltered ? "Countries in this continent" : "Visited countries this year")}: {countriesThisYear.slice(0, 3).join(", ") || "None"}
            {countriesThisYear.length > 3 ? " & more" : ""}.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-mono relative z-10">
          <span>Total Footprint:</span>
          <span className="font-bold text-slate-700">{distinctCountriesAllTime} Countries</span>
        </div>
      </div>

      {/* Extreme Point - Furthest Travel Card */}
      <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex flex-col justify-between group overflow-hidden relative">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-rose-50 group-hover:scale-125 transition-transform duration-500 pointer-events-none z-0">
          <Award className="h-28 w-28" />
        </div>

        <div className="relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Furthest Pivot Point</span>
          {furthestDestinationThisYear ? (
            <>
              <h3 className="text-2xl font-extrabold tracking-tight mt-1 text-rose-600 truncate">
                {furthestDestinationThisYear.city}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                <span className="font-bold">{furthestDestinationThisYear.venueName}</span> at{" "}
                <span className="font-mono text-[11px] font-medium text-slate-600 bg-rose-50 px-1 py-0.5 rounded focus:outline-none">{furthestDestinationThisYear.distanceFromAtlanta.toLocaleString()} mi</span> from base.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-slate-400 mt-2">No Travels</h3>
              <p className="text-xs text-slate-500 mt-1">Select a year or continent with trips to find stats.</p>
            </>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-mono relative z-10">
          <span>Active Venue:</span>
          <span className="font-bold text-slate-700 max-w-[120px] truncate">
            {furthestDestinationThisYear?.venueName || "None"}
          </span>
        </div>
      </div>

      {/* Trip Frequency Statistics Card */}
      <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex flex-col justify-between group overflow-hidden relative">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-blue-50 group-hover:scale-125 transition-transform duration-500 pointer-events-none z-0">
          <Compass className="h-28 w-28" />
        </div>

        <div className="relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Checkin Densities</span>
          <h3 className="text-3xl font-extrabold tracking-tight mt-1 text-blue-600">
            {checkinsThisYear}{" "}
            <span className="text-xs font-normal text-slate-400">visits</span>
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">
            Most frequented region: <span className="font-semibold text-slate-700">{topCityThisYear}</span>
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-mono relative z-10">
          <span>Life-time Logins:</span>
          <span className="font-bold text-slate-700">{totalCheckinsAllTime} check-ins</span>
        </div>
      </div>

    </div>
  );
}
