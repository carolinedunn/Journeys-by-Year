import { TravelCheckIn } from "./types";

// Coordinates for Atlanta (Home Reference)
export const ATLANTA_COORDS = { lat: 33.7490, lng: -84.3880 };

// Geodesic distance calculation (Haversine formula) in miles
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// All travel log locations without hardcoded IDs, enabling easy additions
const SAMPLE_TRAVELS_RAW = [
  // 2002
  { date: "3/26/02", venue: "Merlion Park", city: "Singapore", state: "", country: "Singapore", lat: 1.2867503, lng: 103.8518069 },
  { date: "3/31/02", venue: "Sky Tower", city: "Auckland", state: "", country: "New Zealand", lat: -36.8484437, lng: 174.7596107 },
  { date: "4/2/02", venue: "Agrodome", city: "Rotorua", state: "", country: "New Zealand", lat: -38.0853594, lng: 176.1930398 },
  { date: "4/4/02", venue: "Lake Taupo Marina", city: "Taupo", state: "", country: "New Zealand", lat: -38.6770158, lng: 176.0710975 },
  { date: "4/5/02", venue: "Church Road Winery", city: "Napier", state: "", country: "New Zealand", lat: -39.5250914, lng: 176.8435485 },
  { date: "4/9/02", venue: "Aliʻiōlani Hale", city: "Honolulu", state: "Hawaii", country: "United States", lat: 21.3052046, lng: -157.8629717 },
  { date: "08/30/02", venue: "Torre Yokahú (El Yunque)", city: "Rio Grande", state: "", country: "Puerto Rico", lat: 18.324278, lng: -65.7966686 },
  { date: "08/31/02", venue: "Catedral Basilica Menor de San Juan Bautista", city: "San Juan", state: "", country: "Puerto Rico", lat: 18.4659178, lng: -66.1201931 },
  // 2003
  { date: "03/28/03", venue: "Universal Studios Orlando", city: "Orlando", state: "Florida", country: "United States", lat: 28.4723576, lng: -81.471578 },
  { date: "8/8/03", venue: "Dollywood", city: "Pigeon Forge", state: "Tennessee", country: "United States", lat: 35.7951069, lng: -83.5337665 },
  { date: "9/6/03", venue: "High School Reunion", city: "Houston", state: "Texas", country: "United States", lat: 29.7492318, lng: -95.393789 },
  { date: "9/27/03", venue: "Faith Chapel", city: "Jeckyll Island", state: "Georgia", country: "United States", lat: 31.0606159, lng: -81.4243395 },
  // 2004
  { date: "3/18/04", venue: "Colosseum", city: "Rome", state: "", country: "Italy", lat: 41.8914811, lng: 12.4888935 },
  { date: "3/18/04", venue: "Sistine Chapel", city: "Vatican City", state: "", country: "Vatican City", lat: 41.9038978, lng: 12.4529806 },
  { date: "3/19/04", venue: "Pantheon", city: "Rome", state: "", country: "Italy", lat: 41.898585, lng: 12.476837 },
  { date: "3/20/04", venue: "Cathedral of Santa Maria del Fiore", city: "Florence", state: "", country: "Italy", lat: 43.7731488, lng: 11.2533853 },
  { date: "3/22/04", venue: "Palazzo Pubblico", city: "Siena", state: "", country: "Italy", lat: 43.3181842, lng: 11.3312572 },
  { date: "3/22/04", venue: "Piazza della Cisterna", city: "San Gimignano", state: "", country: "Italy", lat: 43.4674407, lng: 11.0431511 },
  { date: "3/22/04", venue: "Tower of Pisa", city: "Pisa", state: "", country: "Italy", lat: 43.7229558, lng: 10.3940221 },
  { date: "3/23/04", venue: "Palazzo Ducale di Modena", city: "Modena", state: "", country: "Italy", lat: 44.648685, lng: 10.9267104 },
  { date: "3/23/04", venue: "Casa di Giulietta", city: "Verona", state: "", country: "Italy", lat: 45.4418927, lng: 10.9920798 },
  { date: "3/23/04", venue: "Piazza San Marco", city: "Venice", state: "", country: "Italy", lat: 45.4342198, lng: 12.3375749 },
  { date: "3/25/04", venue: "Archaeological Park of Pompeii", city: "Pompei", state: "", country: "Italy", lat: 40.7497615, lng: 14.4829697 },
  { date: "3/26/04", venue: "Castel Nuovo", city: "Naples", state: "", country: "Italy", lat: 40.8384931, lng: 14.2501445 },
  { date: "12/30/04", venue: "Diamond Peak", city: "Incline Village", state: "Nevada", country: "United States", lat: 39.2536837, lng: -119.9238493 },
  // 2005
  { date: "1/1/05", venue: "Mt. Rose", city: "Incline Village", state: "Nevada", country: "United States", lat: 39.2677635, lng: -120.160999 },
  { date: "5/2/05", venue: "AstroWorld", city: "Houston", state: "Texas", country: "United States", lat: 29.6767243, lng: -95.413319 },
  { date: "6/30/05", venue: "National Capital of Cuba", city: "Havana", state: "", country: "Cuba", lat: 23.1349853, lng: -82.3596036 },
  { date: "7/2/05", venue: "Viñales Valley", city: "Viñales", state: "", country: "Cuba", lat: 22.6082939, lng: -83.7287568 },
  { date: "7/6/05", venue: "Bubba Gump Shrimp Co", city: "Cancun", state: "", country: "Mexico", lat: 21.1183285, lng: -86.7577583 },
  { date: "7/16/05", venue: "The Alamo", city: "San Antonio", state: "Texas", country: "United States", lat: 29.4259717, lng: -98.4887222 },
  { date: "11/20/05", venue: "Sacré-Cœur", city: "Paris", state: "", country: "France", lat: 48.8867081, lng: 2.340524 },
  { date: "11/21/05", venue: "Kong Meng San Phor Kark See Monastery", city: "Singapore", state: "", country: "Singapore", lat: 1.3603335, lng: 103.835865 },
  { date: "11/23/05", venue: "Petronas Twin Towers", city: "Kuala Lumpur", state: "", country: "Malaysia", lat: 3.1579224, lng: 101.7092978 },
  { date: "11/28/05", venue: "Sentosa Island", city: "Singapore", state: "", country: "Singapore", lat: 1.2489856, lng: 103.8172344 },
  // 2006
  { date: "2/5/06", venue: "Heavenly Ski Resort", city: "South Lake Tahoe", state: "California", country: "United States", lat: 38.9287193, lng: -119.9076956 },
  { date: "4/23/06", venue: "Georgetown", city: "Washington, D.C.", state: "Washington, D.C.", country: "United States", lat: 38.9091974, lng: -77.0698984 },
  { date: "5/28/06", venue: "Wrigley Field", city: "Chicago", state: "Illnois", country: "United States", lat: 41.9484424, lng: -87.657913 },
  { date: "9/16/06", venue: "Arlington National Cemetery", city: "Arlington", state: "Virginia", country: "United States", lat: 38.8768725, lng: -77.073366 },
  { date: "9/18/06", venue: "Smithsonian National Zoological Park", city: "Washington, D.C.", state: "Washington, D.C.", country: "United States", lat: 38.9091974, lng: -77.0698984 },
  // 2007
  { date: "3/17/07", venue: "Neptune Statue", city: "Virginia Beach", state: "Virginia", country: "United States", lat: 36.8596453, lng: -75.9798547 },
  { date: "3/24/07", venue: "The Butchart Gardens", city: "Brentwood Bay", state: "British Columbia", country: "Canada", lat: 48.5637529, lng: -123.4711929 },
  { date: "3/25/07", venue: "Whistler-Blackcomb", city: "Whistler", state: "British Columbia", country: "Canada", lat: 50.1149673, lng: -122.9512223 },
  { date: "4/14/07", venue: "Arenal Volcano", city: "San Carlos", state: "", country: "Costa Rica", lat: 10.4626469, lng: -84.7134791 },
  { date: "4/15/07", venue: "Poás Volcano", city: "San Jose", state: "", country: "Costa Rica", lat: 10.2155688, lng: -84.3188288 },
  { date: "9/1/07", venue: "Madame Tussauds New York", city: "New York City", state: "New York", country: "United States", lat: 40.7564792, lng: -73.9909691 },
  { date: "9/24/07", venue: "Sam & Johanna's house", city: "Byfleet", state: "England", country: "United Kingdom", lat: 51.3390414, lng: -0.4864831 },
  { date: "9/25/07", venue: "Notre Dame", city: "Paris", state: "", country: "France", lat: 48.8529717, lng: 2.3473218 },
  { date: "9/27/07", venue: "Red Light District (De Wallen)", city: "Amsterdam", state: "", country: "Netherlands", lat: 52.373477, lng: 4.900167 },
  { date: "9/28/07", venue: "Römerberg", city: "Frankfurt", state: "", country: "Germany", lat: 50.1104379, lng: 8.6794055 },
  { date: "11/17/07", venue: "Singapore", city: "Singapore", state: "", country: "Singapore", lat: 1.2991551, lng: 103.8615805 },
  { date: "11/19/07", venue: "Reclining Buddha", city: "Bangkok", state: "", country: "Thailand", lat: 13.7465304, lng: 100.4890804 },
  { date: "11/21/07", venue: "Scuba Diving", city: "Phuket", state: "", country: "Thailand", lat: 7.8397254, lng: 98.2054676 },
  // 2008
  { date: "2/16/08", venue: "Ryman Auditorium", city: "Nashville", state: "Tennessee", country: "United States", lat: 36.1593505, lng: -86.7808041 },
  { date: "4/4/08", venue: "Venetian", city: "Las Vegas", state: "Nevada", country: "United States", lat: 36.1211783, lng: -115.1722329 },
  { date: "7/2/08", venue: "Old Spaghetti Factory", city: "Vancouver", state: "British Columbia", country: "Canada", lat: 49.283735, lng: -123.1100714 },
  { date: "7/4/08", venue: "Totem Heritage Center", city: "Ketchikan", state: "Alaska", country: "United States", lat: 55.3608523, lng: -131.7206451 },
  { date: "7/5/08", venue: "Mendenhall Glacier", city: "Juneau", state: "Alaska", country: "United States", lat: 58.4409563, lng: -134.5561844 },
  { date: "7/6/08", venue: "Tongass National Forest", city: "Skagway", state: "Alaska", country: "United States", lat: 59.4571156, lng: -135.334883 },
  { date: "7/7/08", venue: "St. Michael the Archangel Orthodox Cathedral", city: "Sitka", state: "Alaska", country: "United States", lat: 57.0508111, lng: -135.3389685 },
  { date: "7/9/08", venue: "Denali Winery U-Brew Ice Wine", city: "Anchorage", state: "Alaska", country: "United States", lat: 61.1075574, lng: -150.6293569 },
  { date: "7/10/08", venue: "Talkeetna", city: "Talkeetna", state: "Alaska", country: "United States", lat: 62.2937434, lng: -150.5819839 },
  { date: "8/30/08", venue: "Trunk Bay", city: "St. John", state: "U.S. Virgin Islands", country: "United States", lat: 17.7637701, lng: -64.745988 },
  { date: "8/31/08", venue: "Mangrove Lagoon", city: "St. Thomas", state: "U.S. Virgin Islands", country: "United States", lat: 18.3083408, lng: -64.8902402 },
  { date: "10/11/08", venue: "Baltimore Marathon", city: "Baltimore", state: "Maryland", country: "United States", lat: 39.2848101, lng: -76.7030576 },
  { date: "10/12/08", venue: "Gettysburg", city: "Gettysburg", state: "Pennsylvania", country: "United States", lat: 39.8298366, lng: -77.2421712 },
  // 2009
  { date: "2/16/09", venue: "Universal Studios Hollywood", city: "Los Angeles", state: "California", country: "United States", lat: 34.1370757, lng: -118.3558864 },
  { date: "12/6/09", venue: "Basílica de la Sagrada Família", city: "Barcelona", state: "", country: "Spain", lat: 41.4036339, lng: 2.1717809 },
  { date: "12/10/09", venue: "Etruscopolis", city: "Tarquina", state: "", country: "Italy", lat: 42.2477262, lng: 11.7497059 },
  { date: "12/12/09", venue: "Parthenon", city: "Athens", state: "", country: "Greece", lat: 37.9715327, lng: 23.7241417 },
  { date: "12/13/09", venue: "Ephesus Archaeological Site", city: "Ephesus", state: "", country: "Turkey", lat: 37.9322344, lng: 27.3371864 },
  { date: "12/15/09", venue: "The Great Pyramid of Giza", city: "Giza", state: "", country: "Egypt", lat: 29.9780965, lng: 31.1326966 },
  { date: "12/18/09", venue: "St. George’s Square", city: "Valetta", state: "", country: "Malta", lat: 35.8990444, lng: 14.513733 },
  // 2010
  { date: "1/16/10", venue: "Chichén-Itzá", city: "Yucatan", state: "", country: "Mexico", lat: 20.6787866, lng: -88.5710518 },
  { date: "4/5/10", venue: "Ardastra Gardens & Wildlife Conservation Centre", city: "", state: "", country: "Behamas", lat: 25.0757262, lng: -77.3643659 },
  { date: "5/30/10", venue: "NASA Johnson Space Center", city: "Nassau Bay", state: "Texas", country: "United States", lat: 29.5493715, lng: -95.095325 },
  { date: "6/17/10", venue: "Crystal Cove State Park", city: "San Joaquin Hills", state: "California", country: "United States", lat: 33.5744873, lng: -117.84052 },
  { date: "10/16/10", venue: "Niagara Falls (Canadian Side)", city: "Niagara Falls", state: "", country: "Canada", lat: 43.0790792, lng: -79.07814 },
  { date: "10/18/10", venue: "Toronto Bed & Breakfast", city: "Toronto", state: "", country: "Canada", lat: 43.6651281, lng: -79.375223 },
  // 2011
  { date: "1/20/11", venue: "Hilton Financial District", city: "San Francisco", state: "California", country: "United States", lat: 37.7955882, lng: -122.40428 },
  { date: "1/29/11", venue: "Takashimaya S.C.", city: "Singapore", state: "", country: "Singapore", lat: 1.30276166, lng: 103.835871 },
  { date: "1/31/11", venue: "Restoran E&Y", city: "Johor Bahru", state: "", country: "Malaysia", lat: 1.48098365, lng: 103.762976 },
  { date: "2/8/11", venue: "Phnom Bakheng", city: "Siem Reap", state: "", country: "Cambodia", lat: 13.3519914, lng: 103.858897 },
  { date: "2/11/11", venue: "The Royal Palace", city: "Phnom Penh", state: "", country: "Cambodia", lat: 11.5664581, lng: 104.931776 },
  { date: "9/4/11", venue: "Coco Bongo", city: "Playa del Carmen", state: "", country: "Mexico", lat: 20.6278119, lng: -87.072082 },
  { date: "9/5/11", venue: "Paradise Beach", city: "Cozumel", state: "", country: "Mexico", lat: 20.4009307, lng: -87.017559 },
  { date: "11/4/11", venue: "Savannah Trade Center", city: "Savannah", state: "Georgia", country: "United States", lat: 32.0864663, lng: -81.086269 },
  { date: "11/4/11", venue: "Tybee Island", city: "Tybee Island", state: "Georgia", country: "United States", lat: 32.0116433, lng: -80.865332 },
  // 2012
  { date: "3/16/12", venue: "Maui Tropical Plantation", city: "Waikapu", state: "Hawaii", country: "United States", lat: 20.8488499, lng: -156.50634 },
  { date: "3/18/12", venue: "Ululani's Hawaiian Shave Ice", city: "Lahaina", state: "Hawaii", country: "United States", lat: 20.8752409, lng: -156.77941 },
  { date: "3/22/12", venue: "Hawai'i Volcanoes National Park", city: "Volcano", state: "Hawaii", country: "United States", lat: 19.4296073, lng: -155.25727 },
  // 2013
  { date: "3/21/13", venue: "Carmen Bed and Breakfast", city: "Rio de Janeiro", state: "", country: "Brazil", lat: -22.917161, lng: -43.178952 },
  { date: "3/25/13", venue: "Christ the Redeemer", city: "Rio de Janeiro", state: "", country: "Brazil", lat: -22.951475, lng: -43.210842 },
  { date: "3/26/13", venue: "Iguazú National Park", city: "Foz do Iguacu", state: "", country: "Brazil", lat: -25.550372, lng: -54.574474 },
  // 2014
  { date: "2/1/14", venue: "ABQ BioPark Aquarium", city: "Albuquerque", state: "New Mexico", country: "United States", lat: 35.0938619, lng: -106.67907 },
  { date: "2/3/14", venue: "Georgia O'Keeffe Museum", city: "Santa Fe", state: "New Mexico", country: "United States", lat: 35.6888976, lng: -105.94157 },
  { date: "2/5/14", venue: "Taos Ski Valley", city: "Arroyo Seco", state: "New Mexico", country: "United States", lat: 36.5946604, lng: -105.44968 },
  { date: "7/28/14", venue: "Baseball Hall of Fame", city: "Cooperstown", state: "New York", country: "United States", lat: 42.6971573, lng: -74.925202 },
  { date: "7/29/14", venue: "Brooklyn Bridge", city: "New York City", state: "New York", country: "United States", lat: 40.7002633, lng: -73.991523 },
  { date: "8/3/14", venue: "Waldorf Astoria New York", city: "Manhattan", state: "New York", country: "United States", lat: 40.7568071, lng: -73.974913 },
  { date: "10/18/14", venue: "Cartecay Vineyards", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.6146484, lng: -84.392361 },
  { date: "11/7/14", venue: "17Hundred90 Inn and Restaurant", city: "Savannah", state: "Georgia", country: "United States", lat: 32.0769653, lng: -81.088646 },
  // 2015
  { date: "1/8/15", venue: "DoubleTree by Hilton New York Times Square South", city: "New York City", state: "New York", country: "United States", lat: 40.7426325, lng: -73.992045 },
  { date: "1/13/15", venue: "Little Dumpling", city: "Little Neck", state: "New York", country: "United States", lat: 40.7745685, lng: -73.7566501 },
  { date: "1/27/15", venue: "Mysore Palace", city: "Mysore", state: "", country: "India", lat: 12.3318137, lng: 76.6248308 },
  { date: "1/30/15", venue: "The Ritz-Carlton", city: "Bangalore", state: "", country: "India", lat: 12.9676471, lng: 77.6018079 },
  { date: "8/6/15", venue: "Piazza del Duomo", city: "Milano", state: "", country: "Italy", lat: 45.467321, lng: 9.18343081 },
  { date: "8/9/15", venue: "Monterosso Coastline", city: "Monterosso al Mare", state: "", country: "Italy", lat: 44.1457592, lng: 9.64887418 },
  { date: "8/14/15", venue: "Leaning Tower of Pisa", city: "Pisa", state: "", country: "Italy", lat: 43.7220272, lng: 10.3966396 },
  { date: "9/3/15", venue: "Pike Place Market", city: "Seattle", state: "Washington", country: "United States", lat: 47.6097787, lng: -122.34186 },
  { date: "9/5/15", venue: "Space Needle", city: "Seattle", state: "Washington", country: "United States", lat: 47.6200774, lng: -122.34606 },
  { date: "9/2/15", venue: "Grand Hyatt Denver", city: "Denver", state: "Colorado", country: "United States", lat: 39.7460359, lng: -104.98971 },
  { date: "9/18/15", venue: "The Westin Chicago River North", city: "Chicago", state: "Illinois", country: "United States", lat: 41.887952, lng: -87.629573 },
  { date: "9/19/15", venue: "Notre Dame Stadium Tailgate", city: "Notre Dame", state: "Indiana", country: "United States", lat: 41.6943331, lng: -86.225668 },
  { date: "10/10/15", venue: "Georgia Apple Festival", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.6746647, lng: -84.486232 },
  // 2016
  { date: "2/6/16", venue: "The Crater Geothermal Dome", city: "Midway", state: "Utah", country: "United States", lat: 40.5242922, lng: -111.4847 },
  { date: "2/8/16", venue: "Park City Mountain Resort", city: "Park City", state: "Utah", country: "United States", lat: 40.6514389, lng: -111.50803 },
  { date: "2/28/16", venue: "Wynwood Walls Art District", city: "Miami", state: "Florida", country: "United States", lat: 25.8022874, lng: -80.201288 },
  { date: "5/28/16", venue: "Cozumel Palace", city: "San Miguel de Cozumel\t", state: "", country: "Mexico", lat: 20.5033173, lng: -86.959439 },
  { date: "8/30/16", venue: "Nice", city: "Nice", state: "", country: "France", lat: 43.6985008, lng: 7.26039969 },
  { date: "9/2/16", venue: "Guinness Storehouse", city: "Dublin", state: "", country: "Ireland", lat: 53.3418473, lng: -6.2868871 },
  { date: "9/5/16", venue: "Slea Head Drive Coast", city: "Dingle", state: "", country: "Ireland", lat: 51.8947291, lng: -10.35314 },
  { date: "9/7/16", venue: "Blarney Castle & Gardens", city: "Blarney", state: "", country: "Ireland", lat: 51.9378982, lng: -8.5618571 },
  // 2017
  { date: "4/28/17", venue: "Playa Dominicus Beach", city: "La Romana", state: "", country: "Dominican Republic", lat: 18.3477655, lng: -68.825635 },
  { date: "5/26/17", venue: "Skydeck Chicago (Willis Tower)", city: "Chicago", state: "Illinois", country: "United States", lat: 41.8862361, lng: -87.641346 },
  { date: "10/6/17", venue: "Hotel AKA Boston Common", city: "Boston", state: "Massachusetts", country: "United States", lat: 42.359963, lng: -71.056077 },
  { date: "10/8/17", venue: "Chauncey Creek Lobster Pier", city: "Kittery Point", state: "Maine", country: "United States", lat: 43.0845645, lng: -70.68983 },
  // 2018
  { date: "1/31/18", venue: "Crystal Lodge Resort", city: "Whistler", state: "", country: "Canada", lat: 50.1142929, lng: -122.95592 },
  { date: "5/18/18", venue: "Alcatraz Island Cell House", city: "San Francisco", state: "California", country: "United States", lat: 37.8268487, lng: -122.42293 },
  { date: "5/21/18", venue: "Kendall-Jackson Winery", city: "Santa Rosa", state: "California", country: "United States", lat: 38.5073027, lng: -122.77243 },
  { date: "8/30/18", venue: "Machu Picchu", city: "Santa Teresa", state: "", country: "Peru", lat: -13.154095, lng: -72.523189 },
  { date: "9/1/18", venue: "Parque del Amor overlooking Pacific", city: "Lima", state: "", country: "Peru", lat: -12.130074, lng: -77.032352 },
  { date: "11/4/18", venue: "Central Park", city: "Manhattan", state: "New York", country: "United States", lat: 40.7789786, lng: -73.976205 },
  // 2019
  { date: "2/2/19", venue: "DoubleTree by Hilton Hotel Tallahassee", city: "Tallahassee", state: "Florida", country: "United States", lat: 30.4417785, lng: -84.281702 },
  { date: "3/16/19", venue: "Cape Henry Lighthouse", city: "Virginia Beach", state: "Virginia", country: "United States", lat: 36.9260536, lng: -76.007748 },
  { date: "7/14/19", venue: "Dunn's Famous", city: "Montreal", state: "", country: "Canada", lat: 45.5004864, lng: -73.571757 },
  { date: "7/18/19", venue: "CN Tower revolving observation", city: "Toronto", state: "", country: "Canada", lat: 43.6450795, lng: -79.388903 },
  { date: "8/30/19", venue: "Powell's City of Books", city: "Portland", state: "Oregon", country: "United States", lat: 45.5234684, lng: -122.68142 },
  { date: "10/14/19", venue: "Estrella Dominicus", city: "La Romana", state: "", country: "Dominican Republic", lat: 18.351945, lng: -68.827818 },
  { date: "11/9/19", venue: "Cours Saleya Flower Market", city: "Nice", state: "", country: "France", lat: 43.6956772, lng: 7.27453485 },
  // 2020
  { date: "1/4/20", venue: "Big Dog Running Co.", city: "Columbus", state: "Georgia", country: "United States", lat: 32.4669426, lng: -84.993244 },
  { date: "2/3/20", venue: "Tamarack Lodge Ski Resort", city: "Kingsbury", state: "Nevada", country: "United States", lat: 38.9363397, lng: -119.91006 },
  { date: "3/3/20", venue: "Mercer Williams Historic House", city: "Savannah", state: "Georgia", country: "United States", lat: 32.0729944, lng: -81.094142 },
  { date: "10/13/20", venue: "Driftwood Beach Scenic Shoreline", city: "Jekyll Island", state: "Georgia", country: "United States", lat: 31.1048809, lng: -81.404268 },
  // 2021
  { date: "1/31/21", venue: "Laurel Falls Scenic Trail", city: "Gatlinburg", state: "Tennessee", country: "United States", lat: 35.6717174, lng: -83.590047 },
  { date: "4/3/21", venue: "Cafe Beignet Royal Street", city: "New Orleans", state: "Louisiana", country: "United States", lat: 29.9553219, lng: -90.067134 },
  { date: "5/30/21", venue: "Casa Bacardi Distillery", city: "Catano", state: "", country: "Puerto Rico", lat: 18.4581895, lng: -66.139763 },
  { date: "6/4/21", venue: "Fort San Felipe del Morro", city: "San Juan", state: "", country: "Puerto Rico", lat: 18.4706779, lng: -66.123642 },
  { date: "8/8/21", venue: "The Salty Dog Cafe", city: "Hilton Head Island", state: "South Carolina", country: "United States", lat: 32.1388846, lng: -80.81225 },
  { date: "10/9/21", venue: "Hotel Monaco", city: "Chicago", state: "Illinois", country: "United States", lat: 41.8877483, lng: -87.624623 },
  { date: "12/20/21", venue: "Biltmore Estate Winery", city: "Asheville", state: "North Carolina", country: "United States", lat: 35.5550261, lng: -82.581274 },
  // 2022
  { date: "2/6/22", venue: "Continental Divide Winery", city: "Breckenridge", state: "Colorado", country: "United States", lat: 39.4766251, lng: -106.04541 },
  { date: "3/18/22", venue: "Roosevelt Island Tramway", city: "New York City", state: "New York", country: "United States", lat: 40.7578751, lng: -73.954428 },
  { date: "5/27/22", venue: "Graceland Elvis Estate", city: "Memphis", state: "Tennessee", country: "United States", lat: 35.0457745, lng: -90.027173 },
  { date: "9/4/22", venue: "Philadelphia Museum of Art", city: "Philadelphia", state: "Pennsylvania", country: "United States", lat: 39.9651806, lng: -75.181171 },
  { date: "10/21/22", venue: "Stock & Barrel", city: "Knoxville", state: "Tennessee", country: "United States", lat: 35.9658192, lng: -83.920008 },
  { date: "11/21/22", venue: "Nice", city: "Nice", state: "", country: "France", lat: 43.6997699, lng: 7.2692819 },
  { date: "11/23/22", venue: "Saint-Paul-de-Vence", city: "Saint-Paul-de-Vence", state: "", country: "France", lat: 43.6971721, lng: 7.12096685 },
  { date: "11/25/22", venue: "Bar Canada", city: "Ventimiglia", state: "", country: "Italy", lat: 43.7914321, lng: 7.51723385 },
  { date: "11/28/22", venue: "L'Atelier Artisan Crepier", city: "Cannes", state: "", country: "France", lat: 43.5518797, lng: 7.01352814 },
  // 2023
  { date: "1/8/23", venue: "Providence Canyon State Park", city: "Lumpkin", state: "Georgia", country: "United States", lat: 32.0686323, lng: -84.906531 },
  { date: "2/2/23", venue: "Empire Canyon Lodge", city: "Park City", state: "Utah", country: "United States", lat: 40.6150813, lng: -111.51002 },
  { date: "3/18/23", venue: "Statue of Liberty", city: "New York City", state: "New York", country: "United States", lat: 40.6885997, lng: -74.044055 },
  { date: "4/30/23", venue: "Central Park", city: "New York City", state: "New York", country: "United States", lat: 40.7647996, lng: -73.9724 },
  { date: "5/26/23", venue: "Panama Canal Expansion View", city: "Panama City", state: "", country: "Panama", lat: 9.26492899, lng: -79.909899 },
  { date: "8/24/23", venue: "Deschutes Brewery Portland Public House", city: "Portland", state: "Oregon", country: "United States", lat: 45.5245047, lng: -122.68197 },
  { date: "8/25/23", venue: "Timberline Lodge", city: "Mount Hood Village", state: "Oregon", country: "United States", lat: 45.3292188, lng: -121.70854 },
  { date: "8/27/23", venue: "Haystack Rock", city: "Cannon Beach", state: "Oregon", country: "United States", lat: 45.8834837, lng: -123.96331 },
  { date: "11/20/23", venue: "Reloj de Flores", city: "Vina del Mar", state: "", country: "Chile", lat: -33.023575, lng: -71.568283 },
  { date: "11/23/23", venue: "Sky Costanera Tower Observatory", city: "Santiago", state: "", country: "Chile", lat: -33.416961, lng: -70.606828 },
  { date: "12/27/23", venue: "Beach Club St. Simons Island", city: "Saint Simons Island", state: "Georgia", country: "United States", lat: 31.1428239, lng: -81.376156 },
  // 2024
  { date: "1/7/24", venue: "Providence Canyon Explorer", city: "Lumpkin", state: "Georgia", country: "United States", lat: 32.0677442, lng: -84.905636 },
  { date: "1/31/24", venue: "Steamboat Ski Resort", city: "Steamboat Springs", state: "Colorado", country: "United States", lat: 40.4581523, lng: -106.80355 },
  { date: "3/23/24", venue: "Cartecay Vineyards", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.6157221, lng: -84.392633 },
  { date: "4/7/24", venue: "Congress Avenue Bat Bridge", city: "Austin", state: "Texas", country: "United States", lat: 30.2627917, lng: -97.74815 },
  { date: "4/27/24", venue: "Friends In Low Places Bar & Honkey Tonk", city: "Nashville", state: "Tennessee", country: "United States", lat: 36.1619245, lng: -86.77868 },
  { date: "5/24/24", venue: "Hotel Riu Palace Aquarelle", city: "Falmouth", state: "", country: "Jamaica", lat: 18.4860829, lng: -77.613468 },
  { date: "5/27/24", venue: "Dunn's River Falls rainforest", city: "Ocho Rios", state: "", country: "Jamaica", lat: 18.4155707, lng: -77.138441 },
  { date: "6/28/24", venue: "Hard Rock Hotel New York", city: "Manhattan", state: "New York", country: "United States", lat: 40.75959, lng: -73.983471 },
  { date: "8/24/24", venue: "Aviva Stadium", city: "Ringsend", state: "", country: "Ireland", lat: 53.3351686, lng: -6.2284484 },
  { date: "8/25/24", venue: "St George's Victorian Market", city: "Belfast", state: "", country: "United Kingdom", lat: 54.5947559, lng: -5.9344586 },
  { date: "8/28/24", venue: "Giant's Causeway volcanic columns", city: "Bushmills", state: "", country: "United Kingdom", lat: 55.2343422, lng: -6.5106251 },
  { date: "8/29/24", venue: "Nice", city: "Nice", state: "", country: "France", lat: 43.6987587, lng: 7.26768554 },
  { date: "8/31/24", venue: "Casino de Monte-Carlo", city: "Monte-Carlo", state: "", country: "Monaco", lat: 43.7393007, lng: 7.42773408 },
  { date: "9/21/24", venue: "Phoenix Art Museum", city: "Phoenix", state: "Arizona", country: "United States", lat: 33.4665244, lng: -112.07341 },
  { date: "11/2/24", venue: "The Classic Center", city: "Athens", state: "Georgia", country: "United States", lat: 33.9616861, lng: -83.371909 },
  { date: "11/25/24", venue: "Plaza Mayor historic square", city: "Madrid", state: "", country: "Spain", lat: 40.4156515, lng: -3.7071444 },
  { date: "11/28/24", venue: "Alcazar de Segovia fort", city: "Segovia", state: "", country: "Spain", lat: 40.9524599, lng: -4.1319185 },
  // 2025
  { date: "2/2/25", venue: "Lakeland Village Resort", city: "South Lake Tahoe", state: "California", country: "United States", lat: 38.9472731, lng: -119.9631 },
  { date: "2/5/25", venue: "Northstar California Ski Resort", city: "Tahoe Vista", state: "California", country: "United States", lat: 39.2741873, lng: -120.12019 },
  { date: "5/28/25", venue: "Radisson Resort Miami Beach", city: "Miami Beach", state: "Florida", country: "United States", lat: 25.7869109, lng: -80.133064 },
  { date: "5/31/25", venue: "320 Guest Ranch", city: "Big Sky", state: "Montana", country: "United States", lat: 45.1034798, lng: -111.21309 },
  { date: "6/1/25", venue: "Grand Prismatic Spring Geyser", city: "West Yellowstone", state: "Montana", country: "United States", lat: 44.5285734, lng: -110.83634 },
  { date: "6/5/25", venue: "Grand Teton National Park", city: "Jackson", state: "Wyoming", country: "United States", lat: 43.9820364, lng: -110.66275 },
  { date: "6/6/25", venue: "Jenny Lake", city: "Moose Wilson Road", state: "Wyoming", country: "United States", lat: 43.753864, lng: -110.72613 },
  { date: "7/10/25", venue: "Napa Valley Wine Train", city: "Napa", state: "California", country: "United States", lat: 38.3030504, lng: -122.28378 },
  { date: "10/3/25", venue: "Pyrámide del Sol: Teotihuacan", city: "Teotihuacan", state: "", country: "Mexico", lat: 19.6885347, lng: -98.854101 },
  { date: "11/22/25", venue: "Senso-ji Temple & Shibuya Crossing", city: "Tokyo", state: "", country: "Japan", lat: 35.7147, lng: 139.7966 },
  { date: "11/26/25", venue: "Fushimi Inari Taisha", city: "Kyoto", state: "", country: "Japan", lat: 34.9671, lng: 135.7727 },
  { date: "11/28/25", venue: "Nara Park & Todai-ji Temple", city: "Nara", state: "", country: "Japan", lat: 34.6851, lng: 135.8282 },
  { date: "11/29/25", venue: "Osaka Castle & Dotonbori District", city: "Osaka", state: "", country: "Japan", lat: 34.6873, lng: 135.5262 },
  { date: "12/26/25", venue: "Universal Studios Orlando", city: "Orlando", state: "Florida", country: "United States", lat: 28.4723576, lng: -81.4715778 },
  // 2026
  { date: "2/28/26", venue: "Swamp Rabbit Trail", city: "Travelers Rest", state: "South Carolina", country: "United States", lat: 34.9528305, lng: -82.440272 },
  { date: "3/22/26", venue: "Plaza Lazaro Cardenas", city: "Puerto Vallarta", state: "", country: "Mexico", lat: 20.6027865, lng: -105.2378 },
  { date: "5/16/26", venue: "Chateau Meichtry Family Winery", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.587383, lng: -84.43347 },
  { date: "5/17/26", venue: "Ott Vineyards and Winery", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.6082699, lng: -84.420377 },
  { date: "5/30/26", venue: "The Chattanoogan Hotel", city: "Chattanooga", state: "Tennessee", country: "United States", lat: 35.0406625, lng: -85.3124794 }
];

export function getContinentForCountry(country: string): string {
  if (!country) return "North America";
  const c = country.trim().toLowerCase();
  if (
    c.includes("united states") || 
    c.includes("usa") || 
    c.includes("canada") || 
    c.includes("mexico") || 
    c.includes("dominican") || 
    c.includes("panama") || 
    c.includes("jamaica") || 
    c.includes("behamas") || 
    c.includes("bahamas") ||
    c.includes("puerto rico")
  ) {
    return "North America";
  }
  if (
    c.includes("new zealand") ||
    c.includes("australia")
  ) {
    return "Oceania";
  }
  if (
    c.includes("brazil") || 
    c.includes("argentina") || 
    c.includes("peru") || 
    c.includes("chile")
  ) {
    return "South America";
  }
  if (
    c.includes("italy") || 
    c.includes("france") || 
    c.includes("ireland") || 
    c.includes("united kingdom") || 
    c.includes("monaco") || 
    c.includes("spain") || 
    c.includes("malta") || 
    c.includes("greece") ||
    c.includes("germany") ||
    c.includes("netherlands") ||
    c.includes("amsterdam") ||
    c.includes("vatican city")
  ) {
    return "Europe";
  }
  if (
    c.includes("singapore") || 
    c.includes("malaysia") || 
    c.includes("cambodia") || 
    c.includes("india") || 
    c.includes("japan") || 
    c.includes("turkey") ||
    c.includes("thailand")
  ) {
    return "Asia";
  }
  if (c.includes("egypt")) {
    return "Africa";
  }
  return "North America"; // Default fallback
}

function isDSTNorthern(month: number, day: number): boolean {
  if (month > 3 && month < 11) return true;
  if (month === 3) return day >= 14;
  if (month === 11) return day < 7;
  return false;
}

function isDSTSouthern(month: number, day: number): boolean {
  if (month >= 11 || month <= 2) return true;
  if (month === 10) return day >= 15;
  if (month === 3) return day < 15;
  return false;
}

export function getLocalTimeOffset(
  lat: number,
  lng: number,
  country: string,
  state: string,
  city: string,
  month: number,
  day: number
): number {
  const c = country.trim().toLowerCase();
  const s = state.trim().toLowerCase();
  const ct = city.trim().toLowerCase();

  // 1. United States
  if (c.includes("united states") || c.includes("usa")) {
    if (s.includes("hawaii")) {
      return -10; // HST, no DST
    }
    if (s.includes("alaska")) {
      return isDSTNorthern(month, day) ? -8 : -9;
    }
    if (s.includes("california") || s.includes("oregon") || s.includes("washington")) {
      return isDSTNorthern(month, day) ? -7 : -8; // Pacific Time
    }
    if (s.includes("arizona")) {
      return -7; // MST, no DST
    }
    if (
      s.includes("colorado") ||
      s.includes("montana") ||
      s.includes("wyoming") ||
      s.includes("utah") ||
      s.includes("idaho") ||
      s.includes("new mexico")
    ) {
      return isDSTNorthern(month, day) ? -6 : -7; // Mountain Time
    }
    if (
      s.includes("texas") ||
      s.includes("illinois") ||
      s.includes("louisiana") ||
      s.includes("tennessee") && !ct.includes("chattanooga")
    ) {
      return isDSTNorthern(month, day) ? -5 : -6; // Central Time
    }
    // Georgia, New York, Florida, South Carolina, Chattanooga (TN), etc. -> Eastern Time
    return isDSTNorthern(month, day) ? -4 : -5;
  }

  // 2. Canada
  if (c.includes("canada")) {
    return isDSTNorthern(month, day) ? -4 : -5;
  }

  // 3. Western Europe (Spain, France, Italy, Malta, Monaco, Germany, Netherlands, Vatican City)
  if (
    c.includes("spain") ||
    c.includes("france") ||
    c.includes("italy") ||
    c.includes("malta") ||
    c.includes("monaco") ||
    c.includes("germany") ||
    c.includes("netherlands") ||
    c.includes("vatican city")
  ) {
    return isDSTNorthern(month, day) ? 2 : 1;
  }

  // 4. United Kingdom & Ireland
  if (c.includes("united kingdom") || c.includes("ireland")) {
    return isDSTNorthern(month, day) ? 1 : 0;
  }

  // 5. Greece & Egypt
  if (c.includes("greece") || c.includes("egypt")) {
    return isDSTNorthern(month, day) ? 3 : 2;
  }

  // 6. Turkey
  if (c.includes("turkey")) {
    return 3; // TRT (UTC+3) all year
  }

  // 7. Singapore & Malaysia
  if (c.includes("singapore") || c.includes("malaysia")) {
    return 8; // UTC+8
  }

  // 8. Cambodia & Thailand
  if (c.includes("cambodia") || c.includes("thailand")) {
    return 7; // UTC+7
  }

  // New Zealand
  if (c.includes("new zealand")) {
    return isDSTSouthern(month, day) ? 13 : 12;
  }

  // Costa Rica
  if (c.includes("costa rica")) {
    return -6;
  }

  // Puerto Rico
  if (c.includes("puerto rico")) {
    return -4;
  }

  // India
  if (c.includes("india")) {
    return 5.5;
  }

  // 9. Japan
  if (c.includes("japan")) {
    return 9; // UTC+9
  }

  // 10. Brazil
  if (c.includes("brazil")) {
    return isDSTSouthern(month, day) ? -2 : -3;
  }

  // 11. Chile
  if (c.includes("chile")) {
    return isDSTSouthern(month, day) ? -3 : -4;
  }

  // 12. Jamaica & Panama & Bahamas/Behamas
  if (c.includes("jamaica") || c.includes("panama")) {
    return -5; // UTC-5 all year
  }
  if (c.includes("bahamas") || c.includes("behamas")) {
    return isDSTNorthern(month, day) ? -4 : -5;
  }

  // 13. Mexico
  if (c.includes("mexico")) {
    if (ct.includes("cozumel") || ct.includes("playa del carmen")) {
      return -5;
    }
    return isDSTNorthern(month, day) ? -5 : -6;
  }

  // Fallback heuristic by longitude
  return Math.round(lng / 15);
}

export function getParsedTravels(): TravelCheckIn[] {
  const parsed = SAMPLE_TRAVELS_RAW.map((row, index) => {
    // Parse year from date string e.g. "5/30/10" -> 2010
    const parts = row.date.split("/");
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    let yearPart = parseInt(parts[2], 10);
    const year = yearPart < 50 ? 2000 + yearPart : 1900 + yearPart;

    const h = 12;
    const m = 0;
    const s = 0;
    
    // Create UTC date in milliseconds
    const utcTimeMs = Date.UTC(year, month - 1, day, h, m, s);

    // Get correct timezone offset for the location
    const offsetHours = getLocalTimeOffset(row.lat, row.lng, row.country, row.state, row.city, month, day);

    // Apply the offset to get local time milliseconds
    const localTimeMs = utcTimeMs + offsetHours * 60 * 60 * 1000;
    const localDateObj = new Date(localTimeMs);

    // Extract exact converted local parts
    const localYear = localDateObj.getUTCFullYear();
    const localMonth = localDateObj.getUTCMonth() + 1;
    const localDay = localDateObj.getUTCDate();
    const localHour = localDateObj.getUTCHours();
    const localMin = localDateObj.getUTCMinutes();
    const localSec = localDateObj.getUTCSeconds();

    // Format new local strings
    const shortYear = localYear % 100;
    const localDateStr = `${localMonth}/${localDay}/${shortYear.toString().padStart(2, '0')}`;

    // Create a timezone-adjusted JS Date object for sorting & compatibility
    const dateObj = new Date(localYear, localMonth - 1, localDay, localHour, localMin, localSec);

    const distanceFromAtlanta = calculateDistance(ATLANTA_COORDS.lat, ATLANTA_COORDS.lng, row.lat, row.lng);

    // Automatically generate a unique, clean, stable identifier based on details
    const checkinId = `chk_${localYear}_${localDateStr.replace(/\//g, '_')}_${row.city.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${index}`;

    return {
      date: localDateStr,
      venueName: row.venue,
      city: row.city,
      state: row.state,
      country: row.country,
      latitude: row.lat,
      longitude: row.lng,
      checkinId,
      year: localYear,
      dateObj,
      distanceFromAtlanta,
      utcDate: row.date,
      timezoneOffset: offsetHours
    };
  }).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  return getTravelsWithRouteDistances(parsed);
}

export function getTravelsWithRouteDistances(travels: TravelCheckIn[]): TravelCheckIn[] {
  // Sort by dateObj ascending to guarantee chronological order
  const sorted = [...travels].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  
  return sorted.map((current, i) => {
    if (i === 0) {
      return {
        ...current,
        isLocalConnection: false,
        distanceContribution: current.distanceFromAtlanta,
        prevLocationName: undefined
      };
    } else {
      const prev = sorted[i - 1];
      const daysDiff = Math.abs(current.dateObj.getTime() - prev.dateObj.getTime()) / (1000 * 60 * 60 * 24);
      const distBetween = calculateDistance(prev.latitude, prev.longitude, current.latitude, current.longitude);
      
      if (daysDiff <= 5 && distBetween <= 120) {
        return {
          ...current,
          isLocalConnection: true,
          distanceContribution: distBetween,
          prevLocationName: prev.city
        };
      } else {
        return {
          ...current,
          isLocalConnection: false,
          distanceContribution: current.distanceFromAtlanta,
          prevLocationName: undefined
        };
      }
    }
  });
}
