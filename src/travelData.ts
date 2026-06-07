import { TravelCheckIn } from "./types";

// Coordinates for Atlanta (Home Reference)
export const ATLANTA_COORDS = { lat: 33.7490, lng: -84.3880 };

// Geodesic distance calculation (Haversine formula) in km
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
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
  // 2009
  { date: "12/6/09", time: "15:17:55", venue: "Basílica de la Sagrada Família", city: "Barcelona", state: "", country: "Spain", lat: 41.4036339, lng: 2.1717809 },
  { date: "12/10/09", time: "15:17:55", venue: "Etruscopolis", city: "Tarquina", state: "", country: "Italy", lat: 42.2477262, lng: 11.7497059 },
  { date: "12/12/09", time: "15:17:55", venue: "Parthenon", city: "Athens", state: "", country: "Greece", lat: 37.9715327, lng: 23.7241417 },
  { date: "12/13/09", time: "15:17:55", venue: "Ephesus Archaeological Site", city: "Ephesus", state: "", country: "Turkey", lat: 37.9322344, lng: 27.3371864 },
  { date: "12/15/09", time: "15:17:55", venue: "The Great Pyramid of Giza", city: "Giza", state: "", country: "Egypt", lat: 29.9780965, lng: 31.1326966 },
  { date: "12/18/09", time: "15:17:55", venue: "St. George’s Square", city: "Valetta", state: "", country: "Malta", lat: 35.8990444, lng: 14.513733 },
  // 2010
  { date: "1/16/10", time: "15:17:55", venue: "Chichén-Itzá", city: "Yucatan", state: "", country: "Mexico", lat: 20.6787866, lng: -88.5710518 },
  { date: "4/5/10", time: "15:17:55", venue: "Ardastra Gardens & Wildlife Conservation Centre", city: "", state: "", country: "Behamas", lat: 25.0757262, lng: -77.3643659 },
  { date: "5/30/10", time: "15:17:55", venue: "NASA Johnson Space Center", city: "Nassau Bay", state: "Texas", country: "United States", lat: 29.5493715, lng: -95.095325 },
  { date: "6/17/10", time: "1:51:07", venue: "Crystal Cove State Park", city: "San Joaquin Hills", state: "California", country: "United States", lat: 33.5744873, lng: -117.84052 },
  { date: "10/16/10", time: "14:09:20", venue: "Niagara Falls (Canadian Side)", city: "Niagara Falls", state: "", country: "Canada", lat: 43.0790792, lng: -79.07814 },
  { date: "10/18/10", time: "21:42:44", venue: "Toronto Bed & Breakfast", city: "Toronto", state: "", country: "Canada", lat: 43.6651281, lng: -79.375223 },
  // 2011
  { date: "1/20/11", time: "6:58:58", venue: "Hilton Financial District", city: "San Francisco", state: "California", country: "United States", lat: 37.7955882, lng: -122.40428 },
  { date: "1/29/11", time: "7:07:04", venue: "Takashimaya S.C.", city: "Singapore", state: "", country: "Singapore", lat: 1.30276166, lng: 103.835871 },
  { date: "1/31/11", time: "7:51:19", venue: "Restoran E&Y", city: "Johor Bahru", state: "", country: "Malaysia", lat: 1.48098365, lng: 103.762976 },
  { date: "2/8/11", time: "12:02:44", venue: "Phnom Bakheng", city: "Siem Reap", state: "", country: "Cambodia", lat: 13.3519914, lng: 103.858897 },
  { date: "2/11/11", time: "6:39:34", venue: "The Royal Palace", city: "Phnom Penh", state: "", country: "Cambodia", lat: 11.5664581, lng: 104.931776 },
  { date: "9/4/11", time: "3:52:05", venue: "Coco Bongo", city: "Playa del Carmen", state: "", country: "Mexico", lat: 20.6278119, lng: -87.072082 },
  { date: "9/5/11", time: "17:24:54", venue: "Paradise Beach", city: "Cozumel", state: "", country: "Mexico", lat: 20.4009307, lng: -87.017559 },
  { date: "11/4/11", time: "14:12:03", venue: "Savannah Trade Center", city: "Savannah", state: "Georgia", country: "United States", lat: 32.0864663, lng: -81.086269 },
  { date: "11/4/11", time: "23:04:32,The Crab Shack", venue: "Tybee Island", city: "Tybee Island", state: "Georgia", country: "United States", lat: 32.0116433, lng: -80.865332 },
  // 2012
  { date: "3/16/12", time: "19:14:16", venue: "Maui Tropical Plantation", city: "Waikapu", state: "Hawaii", country: "United States", lat: 20.8488499, lng: -156.50634 },
  { date: "3/18/12", time: "23:05:48", venue: "Ululani's Hawaiian Shave Ice", city: "Lahaina", state: "Hawaii", country: "United States", lat: 20.8752409, lng: -156.77941 },
  { date: "3/22/12", time: "19:37:01", venue: "Hawai'i Volcanoes National Park", city: "Volcano", state: "Hawaii", country: "United States", lat: 19.4296073, lng: -155.25727 },
  // 2013
  { date: "3/21/13", time: "15:10:25", venue: "Carmen Bed and Breakfast", city: "Rio de Janeiro", state: "", country: "Brazil", lat: -22.917161, lng: -43.178952 },
  { date: "3/26/13", time: "20:57:43", venue: "Iguazú National Park", city: "Foz do Iguacu", state: "", country: "Brazil", lat: -25.550372, lng: -54.574474 },
  { date: "7/11/13", time: "20:00:11", venue: "Christ the Redeemer", city: "Rio de Janeiro", state: "", country: "Brazil", lat: -22.951475, lng: -43.210842 },
  { date: "7/16/13", time: "21:36:52", venue: "Iguazú Falls", city: "Puerto Iguazu", state: "", country: "Argentina", lat: -25.642617, lng: -54.436862 },
  // 2014
  { date: "2/1/14", time: "15:57:39", venue: "ABQ BioPark Aquarium", city: "Albuquerque", state: "New Mexico", country: "United States", lat: 35.0938619, lng: -106.67907 },
  { date: "2/3/14", time: "16:57:50", venue: "Georgia O'Keeffe Museum", city: "Santa Fe", state: "New Mexico", country: "United States", lat: 35.6888976, lng: -105.94157 },
  { date: "2/5/14", time: "15:53:38", venue: "Taos Ski Valley", city: "Arroyo Seco", state: "New Mexico", country: "United States", lat: 36.5946604, lng: -105.44968 },
  { date: "7/28/14", time: "1:07:15", venue: "Baseball Hall of Fame", city: "Cooperstown", state: "New York", country: "United States", lat: 42.6971573, lng: -74.925202 },
  { date: "7/29/14", time: "17:35:12", venue: "Brooklyn Bridge", city: "New York City", state: "New York", country: "United States", lat: 40.7002633, lng: -73.991523 },
  { date: "7/30/14", time: "12:27:43", venue: "Times Square", city: "New York City", state: "New York", country: "United States", lat: 40.758899, lng: -73.985131 },
  // 2015
  { date: "1/27/15", time: "0:31:59", venue: "Mysore Palace", city: "Mysore", state: "", country: "India", lat: 12.3318137, lng: 76.6248308 },
  { date: "1/30/15", time: "16:26:13", venue: "The Ritz-Carlton", city: "Bangalore", state: "", country: "India", lat: 12.9676471, lng: 77.6018079 },
  { date: "8/6/15", time: "14:25:33", venue: "Piazza del Duomo", city: "Milano", state: "", country: "Italy", lat: 45.467321, lng: 9.18343081 },
  { date: "8/9/15", time: "11:54:37", venue: "Monterosso Coastline", city: "Monterosso al Mare", state: "", country: "Italy", lat: 44.1457592, lng: 9.64887418 },
  { date: "8/14/15", time: "17:52:03", venue: "Leaning Tower of Pisa", city: "Pisa", state: "", country: "Italy", lat: 43.7220272, lng: 10.3966396 },
  { date: "9/3/15", time: "16:35:01", venue: "Pike Place Market", city: "Seattle", state: "Washington", country: "United States", lat: 47.6097787, lng: -122.34186 },
  { date: "9/5/15", time: "15:40:24", venue: "Space Needle", city: "Seattle", state: "Washington", country: "United States", lat: 47.6200774, lng: -122.34606 },
  { date: "9/19/15", time: "17:53:43", venue: "Notre Dame Stadium Tailgate", city: "Notre Dame", state: "Indiana", country: "United States", lat: 41.6943331, lng: -86.225668 },
  // 2016
  { date: "2/6/16", time: "19:42:27", venue: "The Crater Geothermal Dome", city: "Midway", state: "Utah", country: "United States", lat: 40.5242922, lng: -111.4847 },
  { date: "2/8/16", time: "15:52:22", venue: "Park City Mountain Resort", city: "Park City", state: "Utah", country: "United States", lat: 40.6514389, lng: -111.50803 },
  { date: "2/28/16", time: "18:12:47", venue: "Wynwood Walls Art District", city: "Miami", state: "Florida", country: "United States", lat: 25.8022874, lng: -80.201288 },
  { date: "5/28/16", time: "18:12:47", venue: "Cozumel Palace", city: "San Miguel de Cozumel\t", state: "", country: "Mexico", lat: 20.5033173, lng: -86.959439 },
  { date: "8/30/16", time: "10:41:47", venue: "Nice", city: "Nice", state: "", country: "France", lat: 43.6985008, lng: 7.26039969 },
  { date: "9/2/16", time: "10:41:47", venue: "Guinness Storehouse", city: "Dublin", state: "", country: "Ireland", lat: 53.3418473, lng: -6.2868871 },
  { date: "9/5/16", time: "14:20:04", venue: "Slea Head Drive Coast", city: "Dingle", state: "", country: "Ireland", lat: 51.8947291, lng: -10.35314 },
  { date: "9/7/16", time: "13:18:13", venue: "Blarney Castle & Gardens", city: "Blarney", state: "", country: "Ireland", lat: 51.9378982, lng: -8.5618571 },
  // 2017
  { date: "4/28/17", time: "22:11:30", venue: "Playa Dominicus Beach", city: "La Romana", state: "", country: "Dominican Republic", lat: 18.3477655, lng: -68.825635 },
  { date: "5/26/17", time: "14:22:33", venue: "Skydeck Chicago (Willis Tower)", city: "Chicago", state: "Illinois", country: "United States", lat: 41.8862361, lng: -87.641346 },
  { date: "10/6/17", time: "18:22:35", venue: "Faneuil Hall Marketplace", city: "Boston", state: "Massachusetts", country: "United States", lat: 42.359963, lng: -71.056077 },
  { date: "10/8/17", time: "21:38:11", venue: "Chauncey Creek Lobster Pier", city: "Kittery Point", state: "Maine", country: "United States", lat: 43.0845645, lng: -70.68983 },
  // 2018
  { date: "1/31/18", time: "2:58:29", venue: "Crystal Lodge Resort", city: "Whistler", state: "", country: "Canada", lat: 50.1142929, lng: -122.95592 },
  { date: "5/18/18", time: "16:38:28", venue: "Alcatraz Island Cell House", city: "San Francisco", state: "California", country: "United States", lat: 37.8268487, lng: -122.42293 },
  { date: "5/21/18", time: "18:20:41", venue: "Kendall-Jackson Winery", city: "Santa Rosa", state: "California", country: "United States", lat: 38.5073027, lng: -122.77243 },
  { date: "8/30/18", time: "19:04:47", venue: "Inca Ruins: Machu Picchu", city: "Cusco", state: "", country: "Peru", lat: -13.154095, lng: -72.523189 },
  { date: "9/1/18", time: "13:35:34", venue: "Parque del Amor overlooking Pacific", city: "Lima", state: "", country: "Peru", lat: -12.130074, lng: -77.032352 },
  { date: "11/4/18", time: "18:20:41", venue: "Central Park", city: "Manhattan", state: "New York", country: "United States", lat: 40.7789786, lng: -73.976205 },
  // 2019
  { date: "3/16/19", time: "15:37:47", venue: "Cape Henry Lighthouse", city: "Virginia Beach", state: "Virginia", country: "United States", lat: 36.9260536, lng: -76.007748 },
  { date: "7/14/19", time: "20:30:38", venue: "Dunn's Famous", city: "Montreal", state: "", country: "Canada", lat: 45.5004864, lng: -73.571757 },
  { date: "7/18/19", time: "20:30:38", venue: "CN Tower revolving observation", city: "Toronto", state: "", country: "Canada", lat: 43.6450795, lng: -79.388903 },
  { date: "8/30/19", time: "19:30:34", venue: "Powell's City of Books", city: "Portland", state: "Oregon", country: "United States", lat: 45.5234684, lng: -122.68142 },
  { date: "10/14/19", time: "11:06:39", venue: "Estrella Dominicus", city: "La Romana", state: "", country: "Dominican Republic", lat: 18.351945, lng: -68.827818 },
  { date: "11/9/19", time: "11:06:39", venue: "Cours Saleya Flower Market", city: "Nice", state: "", country: "France", lat: 43.6956772, lng: 7.27453485 },
  // 2020
  { date: "1/4/20", time: "07:45:12", venue: "Big Dog Running Co.", city: "Columbus", state: "Georgia", country: "United States", lat: 32.4669426, lng: -84.993244 },
  { date: "2/3/20", time: "19:45:12", venue: "Tamarack Lodge Ski Resort", city: "Kingsbury", state: "Nevada", country: "United States", lat: 38.9363397, lng: -119.91006 },
  { date: "3/3/20", time: "16:14:28", venue: "Mercer Williams Historic House", city: "Savannah", state: "Georgia", country: "United States", lat: 32.0729944, lng: -81.094142 },
  { date: "10/13/20", time: "15:27:51", venue: "Driftwood Beach Scenic Shoreline", city: "Jekyll Island", state: "Georgia", country: "United States", lat: 31.1048809, lng: -81.404268 },
  // 2021
  { date: "1/31/21", time: "16:38:56", venue: "Laurel Falls Scenic Trail", city: "Gatlinburg", state: "Tennessee", country: "United States", lat: 35.6717174, lng: -83.590047 },
  { date: "4/3/21", time: "21:18:20", venue: "Cafe Beignet Royal Street", city: "New Orleans", state: "Louisiana", country: "United States", lat: 29.9553219, lng: -90.067134 },
  { date: "5/30/21", time: "17:48:03", venue: "Casa Bacardi Distillery", city: "Catano", state: "", country: "Puerto Rico", lat: 18.4581895, lng: -66.139763 },
  { date: "6/4/21", time: "15:09:02", venue: "Fort San Felipe del Morro", city: "San Juan", state: "", country: "Puerto Rico", lat: 18.4706779, lng: -66.123642 },
  { date: "8/8/21", time: "15:42:13", venue: "Harbour Town Lighthouse", city: "Hilton Head Island", state: "South Carolina", country: "United States", lat: 32.1388846, lng: -80.81225 },
  // 2022
  { date: "2/6/22", time: "21:18:52", venue: "Continental Divide Winery", city: "Breckenridge", state: "Colorado", country: "United States", lat: 39.4766251, lng: -106.04541 },
  { date: "3/18/22", time: "18:26:13", venue: "Roosevelt Island Tramway", city: "New York City", state: "New York", country: "United States", lat: 40.7578751, lng: -73.954428 },
  { date: "5/27/22", time: "15:20:05", venue: "Graceland Elvis Estate", city: "Memphis", state: "Tennessee", country: "United States", lat: 35.0457745, lng: -90.027173 },
  { date: "9/4/22", time: "16:46:56", venue: "Philadelphia Museum of Art", city: "Philadelphia", state: "Pennsylvania", country: "United States", lat: 39.9651806, lng: -75.181171 },
  { date: "11/27/22", time: "12:17:53", venue: "Jardin Exotique cliffs", city: "Eze", state: "", country: "France", lat: 43.7299194, lng: 7.36203507 },
  // 2023
  { date: "1/8/23", time: "15:31:35", venue: "Providence Canyon State Park", city: "Lumpkin", state: "Georgia", country: "United States", lat: 32.0686323, lng: -84.906531 },
  { date: "2/2/23", time: "18:33:30", venue: "Empire Canyon Lodge", city: "Park City", state: "Utah", country: "United States", lat: 40.6150813, lng: -111.51002 },
  { date: "5/26/23", time: "16:10:24", venue: "Panama Canal Expansion View", city: "Panama City", state: "", country: "Panama", lat: 9.26492899, lng: -79.909899 },
  { date: "8/24/23", time: "16:10:24", venue: "Deschutes Brewery Portland Public House", city: "Portland", state: "Oregon", country: "United States", lat: 45.5245047, lng: -122.68197 },
  { date: "8/25/23", time: "16:10:24", venue: "Timberline Lodge", city: "Mount Hood Village", state: "Oregon", country: "United States", lat: 45.3292188, lng: -121.70854 },
  { date: "8/27/23", time: "16:10:24", venue: "Haystack Rock", city: "Cannon Beach", state: "Oregon", country: "United States", lat: 45.8834837, lng: -123.96331 },
  { date: "11/23/23", time: "14:21:45", venue: "Sky Costanera Tower Observatory", city: "Santiago", state: "", country: "Chile", lat: -33.416961, lng: -70.606828 },
  { date: "12/27/23", time: "0:30:45", venue: "Beach Club St. Simons Island", city: "Saint Simons Island", state: "Georgia", country: "United States", lat: 31.1428239, lng: -81.376156 },
  // 2024
  { date: "1/7/24", time: "15:26:23", venue: "Providence Canyon Explorer", city: "Lumpkin", state: "Georgia", country: "United States", lat: 32.0677442, lng: -84.905636 },
  { date: "1/31/24", time: "16:10:16", venue: "Steamboat Ski Resort", city: "Steamboat Springs", state: "Colorado", country: "United States", lat: 40.4581523, lng: -106.80355 },
  { date: "3/23/24", time: "12:18:54", venue: "Cartecay Vineyards", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.6157221, lng: -84.392633 },
  { date: "4/7/24", time: "12:46:31", venue: "Congress Avenue Bat Bridge", city: "Austin", state: "Texas", country: "United States", lat: 30.2627917, lng: -97.74815 },
  { date: "4/27/24", time: "19:39:43", venue: "Friends In Low Places Bar & Honkey Tonk", city: "Nashville", state: "Tennessee", country: "United States", lat: 36.1619245, lng: -86.77868 },
  { date: "5/24/24", time: "22:16:16", venue: "Hotel Riu Palace Aquarelle", city: "Falmouth", state: "", country: "Jamaica", lat: 18.4860829, lng: -77.613468 },
  { date: "5/27/24", time: "17:00:47", venue: "Dunn's River Falls rainforest", city: "Ocho Rios", state: "", country: "Jamaica", lat: 18.4155707, lng: -77.138441 },
  { date: "6/28/24", time: "21:50:30", venue: "Hard Rock Hotel New York", city: "Manhattan", state: "New York", country: "United States", lat: 40.75959, lng: -73.983471 },
  { date: "8/24/24", time: "15:41:12", venue: "Aviva Stadium", city: "Ringsend", state: "", country: "Ireland", lat: 53.3351686, lng: -6.2284484 },
  { date: "8/25/24", time: "14:43:11", venue: "St George's Victorian Market", city: "Belfast", state: "", country: "United Kingdom", lat: 54.5947559, lng: -5.9344586 },
  { date: "8/28/24", time: "12:50:09", venue: "Giant's Causeway volcanic columns", city: "Bushmills", state: "", country: "United Kingdom", lat: 55.2343422, lng: -6.5106251 },
  { date: "8/29/24", time: "13:22:58", venue: "Nice", city: "Nice", state: "", country: "France", lat: 43.6987587, lng: 7.26768554 },
  { date: "8/31/24", time: "8:03:03", venue: "Casino de Monte-Carlo", city: "Monte-Carlo", state: "", country: "Monaco", lat: 43.7393007, lng: 7.42773408 },
  { date: "9/21/24", time: "13:22:38", venue: "Phoenix Art Museum", city: "Phoenix", state: "Arizona", country: "United States", lat: 33.4665244, lng: -112.07341 },
  { date: "11/2/24", time: "19:44:10", venue: "The Classic Center", city: "Athens", state: "Georgia", country: "United States", lat: 33.9616861, lng: -83.371909 },
  { date: "11/25/24", time: "11:20:15", venue: "Plaza Mayor historic square", city: "Madrid", state: "", country: "Spain", lat: 40.4156515, lng: -3.7071444 },
  { date: "11/28/24", time: "11:18:04", venue: "Alcazar de Segovia fort", city: "Segovia", state: "", country: "Spain", lat: 40.9524599, lng: -4.1319185 },
  // 2025
  { date: "2/2/25", time: "15:27:09", venue: "Lakeland Village Resort", city: "South Lake Tahoe", state: "California", country: "United States", lat: 38.9472731, lng: -119.9631 },
  { date: "2/5/25", time: "16:34:22", venue: "Northstar California Ski Resort", city: "Tahoe Vista", state: "California", country: "United States", lat: 39.2741873, lng: -120.12019 },
  { date: "5/28/25", time: "20:49:31", venue: "The Drexel Mediterranean Grill", city: "Miami Beach", state: "Florida", country: "United States", lat: 25.7869109, lng: -80.133064 },
  { date: "6/1/25", time: "22:16:00", venue: "Grand Prismatic Spring geyser", city: "West Yellowstone", state: "Montana", country: "United States", lat: 44.5285734, lng: -110.83634 },
  { date: "6/5/25", time: "22:02:23", venue: "Grand Teton National Park", city: "Jackson", state: "Wyoming", country: "United States", lat: 43.9820364, lng: -110.66275 },
  { date: "6/6/25", time: "19:54:56", venue: "Hidden Falls cascades", city: "Jackson Hole", state: "Wyoming", country: "United States", lat: 43.7650042, lng: -110.75089 },
  { date: "7/10/25", time: "16:24:56", venue: "Napa Valley Wine Train", city: "Napa", state: "California", country: "United States", lat: 38.3030504, lng: -122.28378 },
  { date: "10/3/25", time: "15:22:55", venue: "Pyrámide del Sol: Teotihuacan", city: "Teotihuacan", state: "", country: "Mexico", lat: 19.6885347, lng: -98.854101 },
  { date: "11/22/25", time: "10:30:00", venue: "Senso-ji Temple & Shibuya Crossing", city: "Tokyo", state: "", country: "Japan", lat: 35.7147, lng: 139.7966 },
  { date: "11/26/25", time: "11:45:00", venue: "Fushimi Inari Taisha", city: "Kyoto", state: "", country: "Japan", lat: 34.9671, lng: 135.7727 },
  { date: "11/28/25", time: "14:15:00", venue: "Nara Park & Todai-ji Temple", city: "Nara", state: "", country: "Japan", lat: 34.6851, lng: 135.8282 },
  { date: "11/29/25", time: "18:00:00", venue: "Osaka Castle & Dotonbori District", city: "Osaka", state: "", country: "Japan", lat: 34.6873, lng: 135.5262 },
  { date: "12/26/25", time: "10:00:00", venue: "Universal Studios Orlando", city: "Orlando", state: "Florida", country: "United States", lat: 28.4723576, lng: -81.4715778 },
  // 2026
  { date: "2/28/26", time: "08:24:33", venue: "Swamp Rabbit Trail", city: "Travelers Rest", state: "South Carolina", country: "United States", lat: 34.9528305, lng: -82.440272 },
  { date: "3/22/26", time: "16:24:33", venue: "Plaza Lazaro Cardenas", city: "Puerto Vallarta", state: "", country: "Mexico", lat: 20.6027865, lng: -105.2378 },
  { date: "5/16/26", time: "11:35:31", venue: "Chateau Meichtry Family Winery", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.587383, lng: -84.43347 },
  { date: "5/17/26", time: "18:04:19", venue: "Ott Vineyards and Winery", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.6082699, lng: -84.420377 },
  { date: "5/30/26", time: "08:04:19", venue: "The Chattanoogan Hotel", city: "Chattanooga", state: "Tennessee", country: "United States", lat: 35.0406625, lng: -85.3124794 }
];

export function getParsedTravels(): TravelCheckIn[] {
  return SAMPLE_TRAVELS_RAW.map((row, index) => {
    // Parse year from date string e.g. "5/30/10" -> 2010
    const parts = row.date.split("/");
    let yearPart = parseInt(parts[2], 10);
    const year = yearPart < 50 ? 2000 + yearPart : 1900 + yearPart;

    const [h, m, s] = row.time.split(":").map(Number);
    const dateObj = new Date(year, parseInt(parts[0], 10) - 1, parseInt(parts[1], 10), h || 0, m || 0, s || 0);

    const distanceFromAtlanta = calculateDistance(ATLANTA_COORDS.lat, ATLANTA_COORDS.lng, row.lat, row.lng);

    // Automatically generate a unique, clean, stable identifier based on details
    const checkinId = `chk_${year}_${row.date.replace(/\//g, '_')}_${row.city.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${index}`;

    return {
      date: row.date,
      time: row.time,
      venueName: row.venue,
      city: row.city,
      state: row.state,
      country: row.country,
      latitude: row.lat,
      longitude: row.lng,
      checkinId,
      year,
      dateObj,
      distanceFromAtlanta
    };
  }).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
}
