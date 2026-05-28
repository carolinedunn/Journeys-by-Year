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

// Highly representative travel locations span across all countries and years from the user's log
const SAMPLE_TRAVELS_RAW = [
  // 2010
  { date: "5/30/10", time: "15:17:55", venue: "NASA Johnson Space Center", city: "Nassau Bay", state: "Texas", country: "United States", lat: 29.5493715, lng: -95.095325, id: "4c0281a3a4de2f5ebac98dbe" },
  { date: "6/17/10", time: "1:51:07", venue: "Crystal Cove State Park", city: "San Joaquin Hills", state: "California", country: "United States", lat: 33.5744873, lng: -117.84052, id: "4c197f8b98f4a593bf4500f6" },
  { date: "10/16/10", time: "14:09:20", venue: "Niagara Falls (Canadian Side)", city: "Niagara Falls", state: "", country: "Canada", lat: 43.0790792, lng: -79.07814, id: "4cb9b210c7228cfa248611ce" },
  { date: "10/18/10", time: "21:42:44", venue: "Toronto Bed & Breakfast", city: "Toronto", state: "", country: "Canada", lat: 43.6651281, lng: -79.375223, id: "4cba1c54c7228cfa43f414ce" },
  // 2011
  { date: "1/20/11", time: "6:58:58", venue: "Hilton Financial District", city: "San Francisco", state: "California", country: "United States", lat: 37.7955882, lng: -122.40428, id: "4d37dd320f81b60c37dd3a3a" },
  { date: "1/29/11", time: "7:07:04", venue: "Takashimaya S.C.", city: "Singapore", state: "", country: "Singapore", lat: 1.30276166, lng: 103.835871, id: "4d43bc984e5d37043252e393" },
  { date: "1/31/11", time: "7:51:19", venue: "Restoran E&Y", city: "Johor Bahru", state: "", country: "Malaysia", lat: 1.48098365, lng: 103.762976, id: "4d4669f7bbb1a1434d965c72" },
  { date: "2/8/11", time: "12:02:44", venue: "Phnom Bakheng", city: "Siem Reap", state: "", country: "Cambodia", lat: 13.3519914, lng: 103.858897, id: "4d5130e4c5ff6ea84a89a107" },
  { date: "2/11/11", time: "6:39:34", venue: "The Royal Palace", city: "Phnom Penh", state: "", country: "Cambodia", lat: 11.5664581, lng: 104.931776, id: "4d54d9a658856dcb47be426d" },
  { date: "9/4/11", time: "3:52:05", venue: "Coco Bongo", city: "Playa del Carmen", state: "", country: "Mexico", lat: 20.6278119, lng: -87.072082, id: "4e62f5e5a80951b318bf3661" },
  { date: "9/5/11", time: "17:24:54", venue: "Paradise Beach", city: "Cozumel", state: "", country: "Mexico", lat: 20.4009307, lng: -87.017559, id: "4e6505e61838ad3d0fea625b" },
  { date: "11/4/11", time: "14:12:03", venue: "Savannah Trade Center", city: "Savannah", state: "Georgia", country: "United States", lat: 32.0864663, lng: -81.086269, id: "4eb3f2b30aaf1abedea2264a" },
  { date: "11/4/11", time: "23:04:32,The Crab Shack", venue: "Tybee Island", city: "Tybee Island", state: "Georgia", country: "United States", lat: 32.0116433, lng: -80.865332, id: "4eb46f80b8030fb58270fa73" },
  // 2012
  { date: "3/16/12", time: "19:14:16", venue: "Maui Tropical Plantation", city: "Waikapu", state: "Hawaii", country: "United States", lat: 20.8488499, lng: -156.50634, id: "4f639108e4b02cbb7e31e925" },
  { date: "3/18/12", time: "23:05:48", venue: "Ululani's Hawaiian Shave Ice", city: "Lahaina", state: "Hawaii", country: "United States", lat: 20.8752409, lng: -156.77941, id: "4f666a4ce4b075c71503eddf" },
  { date: "3/22/12", time: "19:37:01", venue: "Hawai'i Volcanoes National Park", city: "Volcano", state: "Hawaii", country: "United States", lat: 19.4296073, lng: -155.25727, id: "4f6b7f5de4b0743010fcbe05" },
  // 2013
  { date: "3/21/13", time: "15:10:25", venue: "Carmen Bed and Breakfast", city: "Rio de Janeiro", state: "", country: "Brazil", lat: -22.917161, lng: -43.178952, id: "514b22e1e4b0f1239d7f2593" },
  { date: "3/26/13", time: "20:57:43", venue: "Iguazú National Park", city: "Foz do Iguacu", state: "", country: "Brazil", lat: -25.550372, lng: -54.574474, id: "51520bc7e4b01a3cdd3101a2" },
  { date: "7/11/13", time: "20:00:11", venue: "Christ the Redeemer", city: "Rio de Janeiro", state: "", country: "Brazil", lat: -22.951475, lng: -43.210842, id: "51df0ecb498ea08f1f5fabb3" },
  { date: "7/16/13", time: "21:36:52", venue: "Iguazú Falls", city: "Puerto Iguazu", state: "", country: "Argentina", lat: -25.642617, lng: -54.436862, id: "51e5bcf4498e32915150fa6f" },
  // 2014
  { date: "2/1/14", time: "15:57:39", venue: "ABQ BioPark Aquarium", city: "Albuquerque", state: "New Mexico", country: "United States", lat: 35.0938619, lng: -106.67907, id: "52ed1973498e30f0f7dad1a7" },
  { date: "2/3/14", time: "16:57:50", venue: "Georgia O'Keeffe Museum", city: "Santa Fe", state: "New Mexico", country: "United States", lat: 35.6888976, lng: -105.94157, id: "52efca8e498e30f0f81a8cf3" },
  { date: "2/5/14", time: "15:53:38", venue: "Taos Ski Valley", city: "Arroyo Seco", state: "New Mexico", country: "United States", lat: 36.5946604, lng: -105.44968, id: "52f25e82498eb81f966d2d19" },
  { date: "7/28/14", time: "1:07:15", venue: "Baseball Hall of Fame", city: "Cooperstown", state: "New York", country: "United States", lat: 42.6971573, lng: -74.925202, id: "53d5a24311d219d740256df6" },
  { date: "7/29/14", time: "17:35:12", venue: "Brooklyn Bridge", city: "New York City", state: "New York", country: "United States", lat: 40.7002633, lng: -73.991523, id: "53d7db5011d23c726b41d276" },
  { date: "7/30/14", time: "12:27:43", venue: "Times Square", city: "New York City", state: "New York", country: "United States", lat: 40.758899, lng: -73.985131, id: "53d8e4bf11d2f376db735dfd" },
  // 2015
  { date: "1/27/15", time: "0:31:59", venue: "Mysore Palace", city: "Mysore", state: "", country: "India", lat: 12.3318137, lng: 76.6248308, id: "54c6dc7f498eee0929a33dd5" },
  { date: "1/30/15", time: "16:26:13", venue: "The Ritz-Carlton", city: "Bangalore", state: "", country: "India", lat: 12.9676471, lng: 77.6018079, id: "54cbb0a5498e850bcf92316e" },
  { date: "8/6/15", time: "14:25:33", venue: "Piazza del Duomo", city: "Milano", state: "", country: "Italy", lat: 45.467321, lng: 9.18343081, id: "55c36e5d498e6ec9a6b6580a" },
  { date: "8/9/15", time: "11:54:37", venue: "Monterosso Coastline", city: "Monterosso al Mare", state: "", country: "Italy", lat: 44.1457592, lng: 9.64887418, id: "55c73f7d498e2bea0acd1ed3" },
  { date: "8/14/15", time: "17:52:03", venue: "Leaning Tower of Pisa", city: "Pisa", state: "", country: "Italy", lat: 43.7220272, lng: 10.3966396, id: "55ce2ac3498e5221e038250f" },
  { date: "9/3/15", time: "16:35:01", venue: "Pike Place Market", city: "Seattle", state: "Washington", country: "United States", lat: 47.6097787, lng: -122.34186, id: "55e876b5498e03b435bbf60c" },
  { date: "9/5/15", time: "15:40:24", venue: "Space Needle", city: "Seattle", state: "Washington", country: "United States", lat: 47.6200774, lng: -122.34606, id: "55eb0ce8498e4658ff5a3196" },
  { date: "9/19/15", time: "17:53:43", venue: "Notre Dame Stadium Tailgate", city: "Notre Dame", state: "Indiana", country: "United States", lat: 41.6943331, lng: -86.225668, id: "55fda127498e6660b0432f15" },
  // 2016
  { date: "2/6/16", time: "19:42:27", venue: "The Crater Geothermal Dome", city: "Midway", state: "Utah", country: "United States", lat: 40.5242922, lng: -111.4847, id: "56b64ca338faf4d33cc6976d" },
  { date: "2/8/16", time: "15:52:22", venue: "Park City Mountain Resort", city: "Park City", state: "Utah", country: "United States", lat: 40.6514389, lng: -111.50803, id: "56b8b9b6498e50ae13c36b22" },
  { date: "2/28/16", time: "18:12:47", venue: "Wynwood Walls Art District", city: "Miami", state: "Florida", country: "United States", lat: 25.8022874, lng: -80.201288, id: "56d3389f498e4fef60fd594f" },
  { date: "9/2/16", time: "10:41:47", venue: "Guinness Storehouse", city: "Dublin", state: "", country: "Ireland", lat: 53.3418473, lng: -6.2868871, id: "57c9576b498ee4c1fe2db01e" },
  { date: "9/5/16", time: "14:20:04", venue: "Slea Head Drive Coast", city: "Dingle", state: "", country: "Ireland", lat: 51.8947291, lng: -10.35314, id: "57cd7f14498e770e67a5f7e9" },
  { date: "9/7/16", time: "13:18:13", venue: "Blarney Castle & Gardens", city: "Blarney", state: "", country: "Ireland", lat: 51.9378982, lng: -8.5618571, id: "57d01395498e1d84dfa0c6c6" },
  // 2017
  { date: "4/28/17", time: "22:11:30", venue: "Playa Dominicus Beach", city: "La Romana", state: "", country: "Dominican Republic", lat: 18.3477655, lng: -68.825635, id: "5903be1212f0a94a0c428162" },
  { date: "5/26/17", time: "14:22:33", venue: "Skydeck Chicago (Willis Tower)", city: "Chicago", state: "Illinois", country: "United States", lat: 41.8862361, lng: -87.641346, id: "59283a29dab4b1214533cc14" },
  { date: "10/6/17", time: "18:22:35", venue: "Faneuil Hall Marketplace", city: "Boston", state: "Massachusetts", country: "United States", lat: 42.359963, lng: -71.056077, id: "59d7c9eb4420d84c1d82679e" },
  { date: "10/8/17", time: "21:38:11", venue: "Chauncey Creek Lobster Pier", city: "Kittery Point", state: "Maine", country: "United States", lat: 43.0845645, lng: -70.68983, id: "59da9ac3f8cbd476a4d09e8b" },
  // 2018
  { date: "1/31/18", time: "2:58:29", venue: "Crystal Lodge Resort", city: "Whistler", state: "", country: "Canada", lat: 50.1142929, lng: -122.95592, id: "5a7130d57269fe4c0075f3dc" },
  { date: "5/18/18", time: "16:38:28", venue: "Alcatraz Island Cell House", city: "San Francisco", state: "California", country: "United States", lat: 37.8268487, lng: -122.42293, id: "5af0184c8b2fb0039aad7e3" },
  { date: "5/21/18", time: "18:20:41", venue: "Kendall-Jackson Winery", city: "Santa Rosa", state: "California", country: "United States", lat: 38.5073027, lng: -122.77243, id: "5b030df9840fc2002c0b0fd0" },
  { date: "8/30/18", time: "19:04:47", venue: "Inca Ruins: Machu Picchu", city: "Cusco", state: "", country: "Peru", lat: -13.154095, lng: -72.523189, id: "5b883fcfda5ede002ca43e3d" },
  { date: "9/1/18", time: "13:35:34", venue: "Parque del Amor overlooking Pacific", city: "Lima", state: "", country: "Peru", lat: -12.130074, lng: -77.032352, id: "5b8a95a6e07550002c9bdb0b" },
  // 2019
  { date: "3/16/19", time: "15:37:47", venue: "Cape Henry Lighthouse", city: "Virginia Beach", state: "Virginia", country: "United States", lat: 36.9260536, lng: -76.007748, id: "5c8d184b5b971100256274b8" },
  { date: "7/14/19", time: "20:30:38", venue: "Dunn's Famous", city: "Montreal", state: "", country: "Canada", lat: 45.5004864, lng: -73.571757, id: "5d2b63014c60f30007b3469b" },
  { date: "7/18/19", time: "20:30:38", venue: "CN Tower revolving observation", city: "Toronto", state: "", country: "Canada", lat: 43.6450795, lng: -79.388903, id: "5d30d6eefe6ba700082ad05a" },
  { date: "8/30/19", time: "19:30:34", venue: "Powell's City of Books", city: "Portland", state: "Oregon", country: "United States", lat: 45.5234684, lng: -122.68142, id: "5d69795a4bed47000823fcb8" },
  { date: "10/14/19", time: "11:06:39", venue: "Estrella Dominicus", city: "La Romana", state: "", country: "Dominican Republic", lat: 18.351945, lng: -68.827818, id: "5dc69dbfb5a2f900089ce0e8" },
  { date: "11/9/19", time: "11:06:39", venue: "Cours Saleya Flower Market", city: "Nice", state: "", country: "France", lat: 43.6956772, lng: 7.27453485, id: "5dc69dbfb5a2f900089ce0e8" },
  // 2020
  { date: "1/4/20", time: "07:45:12", venue: "Big Dog Running Co.", city: "Columbus", state: "Georgia", country: "United States", lat: 32.4669426, lng: -84.993244, id: "5e108be3e6b69600089a1325" },
  { date: "2/3/20", time: "19:45:12", venue: "Tamarack Lodge Ski Resort", city: "Kingsbury", state: "Nevada", country: "United States", lat: 38.9363397, lng: -119.91006, id: "5e387848a4780400086c0505" },
  { date: "3/3/20", time: "16:14:28", venue: "Mercer Williams Historic House", city: "Savannah", state: "Georgia", country: "United States", lat: 32.0729944, lng: -81.094142, id: "5e5e8264205e86000879fbcb" },
  { date: "10/13/20", time: "15:27:51", venue: "Driftwood Beach Scenic Shoreline", city: "Jekyll Island", state: "Georgia", country: "United States", lat: 31.1048809, lng: -81.404268, id: "5f85c7770f8aa624937bfa62" },
  // 2021
  { date: "1/31/21", time: "16:38:56", venue: "Laurel Falls Scenic Trail", city: "Gatlinburg", state: "Tennessee", country: "United States", lat: 35.6717174, lng: -83.590047, id: "6016dd2055a5234ca0b1a6bc" },
  { date: "4/3/21", time: "21:18:20", venue: "Cafe Beignet Royal Street", city: "New Orleans", state: "Louisiana", country: "United States", lat: 29.9553219, lng: -90.067134, id: "6068db9c20be61482b993959" },
  { date: "5/30/21", time: "17:48:03", venue: "Casa Bacardi Distillery", city: "Catano", state: "", country: "Puerto Rico", lat: 18.4581895, lng: -66.139763, id: "60b3cfd389a4e463c6ac6372" },
  { date: "6/4/21", time: "15:09:02", venue: "Fort San Felipe del Morro", city: "San Juan", state: "", country: "Puerto Rico", lat: 18.4706779, lng: -66.123642, id: "60ba420e959d406c7125a695" },
  { date: "8/8/21", time: "15:42:13", venue: "Harbour Town Lighthouse", city: "Hilton Head Island", state: "South Carolina", country: "United States", lat: 32.1388846, lng: -80.81225, id: "610ffb55bfb9a00a15e62fae" },
  // 2022
  { date: "2/6/22", time: "21:18:52", venue: "Continental Divide Winery", city: "Breckenridge", state: "Colorado", country: "United States", lat: 39.4766251, lng: -106.04541, id: "62003b3c434375442a3b21b7" },
  { date: "3/18/22", time: "18:26:13", venue: "Roosevelt Island Tramway", city: "New York City", state: "New York", country: "United States", lat: 40.7578751, lng: -73.954428, id: "6234cec5900be83a87c9f882" },
  { date: "5/27/22", time: "15:20:05", venue: "Graceland Elvis Estate", city: "Memphis", state: "Tennessee", country: "United States", lat: 35.0457745, lng: -90.027173, id: "6290ec25d1fc0a40c3422d9a" },
  { date: "9/4/22", time: "16:46:56", venue: "Philadelphia Museum of Art", city: "Philadelphia", state: "Pennsylvania", country: "United States", lat: 39.9651806, lng: -75.181171, id: "6314d6809893df63d05294ca" },
  { date: "11/27/22", time: "12:17:53", venue: "Jardin Exotique cliffs", city: "Eze", state: "", country: "France", lat: 43.7299194, lng: 7.36203507, id: "638355710d9146286d53862b" },
  // 2023
  { date: "1/8/23", time: "15:31:35", venue: "Providence Canyon State Park", city: "Lumpkin", state: "Georgia", country: "United States", lat: 32.0686323, lng: -84.906531, id: "63bae1d783d1d16c31da2d18" },
  { date: "2/2/23", time: "18:33:30", venue: "Empire Canyon Lodge", city: "Park City", state: "Utah", country: "United States", lat: 40.6150813, lng: -111.51002, id: "63dc01faf5bad173d0a4082e" },
  { date: "5/26/23", time: "16:10:24", venue: "Panama Canal Expansion View", city: "Panama City", state: "", country: "Panama", lat: 9.26492899, lng: -79.909899, id: "6470d9f03e8c4e088a1f9df0" },
  { date: "11/23/23", time: "14:21:45", venue: "Sky Costanera Tower Observatory", city: "Santiago", state: "", country: "Chile", lat: -33.416961, lng: -70.606828, id: "655f5ff90013880780a87479" },
  { date: "12/27/23", time: "0:30:45", venue: "Beach Club St. Simons Island", city: "Saint Simons Island", state: "Georgia", country: "United States", lat: 31.1428239, lng: -81.376156, id: "658b7035f25d397c1826d592" },
  // 2024
  { date: "1/7/24", time: "15:26:23", venue: "Providence Canyon Explorer", city: "Lumpkin", state: "Georgia", country: "United States", lat: 32.0677442, lng: -84.905636, id: "659ac29ff4459409cd3447cd" },
  { date: "1/31/24", time: "16:10:16", venue: "Steamboat Ski Resort", city: "Steamboat Springs", state: "Colorado", country: "United States", lat: 40.4581523, lng: -106.80355, id: "65ba70e8bb5e175a442df56c" },
  { date: "3/23/24", time: "12:18:54", venue: "Cartecay Vineyards", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.6157221, lng: -84.392633, id: "65fec8ae138fa3597393c249" },
  { date: "4/7/24", time: "12:46:31", venue: "Congress Avenue Bat Bridge", city: "Austin", state: "Texas", country: "United States", lat: 30.2627917, lng: -97.74815, id: "661295a74b0f8114f1a1894c" },
  { date: "4/27/24", time: "19:39:43", venue: "Friends In Low Places Bar & Honkey Tonk", city: "Nashville", state: "Tennessee", country: "United States", lat: 36.1619245, lng: -86.77868, id: "662d547fe104fb0e1f02cd59" },
  { date: "5/24/24", time: "22:16:16", venue: "Hotel Riu Palace Aquarelle", city: "Falmouth", state: "", country: "Jamaica", lat: 18.4860829, lng: -77.613468, id: "665111b03076185b47dc936f" },
  { date: "5/27/24", time: "17:00:47", venue: "Dunn's River Falls rainforest", city: "Ocho Rios", state: "", country: "Jamaica", lat: 18.4155707, lng: -77.138441, id: "6654bc3f81636637e542305a" },
  { date: "6/28/24", time: "21:50:30", venue: "Hard Rock Hotel New York", city: "Manhattan", state: "New York", country: "United States", lat: 40.75959, lng: -73.983471, id: "667f3026f637ed329766545b" },
  { date: "8/24/24", time: "15:41:12", venue: "Aviva Stadium", city: "Ringsend", state: "", country: "Ireland", lat: 53.3351686, lng: -6.2284484, id: "66c9ff182df8e153d243a6c5" },
  { date: "8/25/24", time: "14:43:11", venue: "St George's Victorian Market", city: "Belfast", state: "", country: "United Kingdom", lat: 54.5947559, lng: -5.9344586, id: "66cb42ff52819c74d4757d36" },
  { date: "8/28/24", time: "12:50:09", venue: "Giant's Causeway volcanic columns", city: "Bushmills", state: "", country: "United Kingdom", lat: 55.2343422, lng: -6.5106251, id: "66cf1d01ee1b9611b4da983c" },
  { date: "8/29/24", time: "13:22:58", venue: "Nice", city: "Nice", state: "", country: "France", lat: 43.6987587, lng: 7.26768554, id: "66d07632fdc55256cf38c63e" },
  { date: "8/31/24", time: "8:03:03", venue: "Casino de Monte-Carlo", city: "Monte-Carlo", state: "", country: "Monaco", lat: 43.7393007, lng: 7.42773408, id: "66d2ce37ed7e5b3853e9f65c" },
  { date: "9/23/24", time: "21:22:38", venue: "Grand Canyon Visitor Center", city: "Grand Canyon", state: "Arizona", country: "United States", lat: 36.0582256, lng: -112.10858, id: "66f1dc1e6622b06269ab1e94" },
  { date: "11/2/24", time: "19:44:10", venue: "The Classic Center", city: "Athens", state: "Georgia", country: "United States", lat: 33.9616861, lng: -83.371909, id: "6726810a17cfba2332455ae5" },
  { date: "11/25/24", time: "11:20:15", venue: "Plaza Mayor historic square", city: "Madrid", state: "", country: "Spain", lat: 40.4156515, lng: -3.7071444, id: "67445d6f502f881797b6763e" },
  { date: "11/28/24", time: "11:18:04", venue: "Alcazar de Segovia fort", city: "Segovia", state: "", country: "Spain", lat: 40.9524599, lng: -4.1319185, id: "6748516c91df085cfb67841a" },
  // 2025
  { date: "2/2/25", time: "15:27:09", venue: "Lakeland Village Resort", city: "South Lake Tahoe", state: "California", country: "United States", lat: 38.9472731, lng: -119.9631, id: "679f8ecd7f44f801f99d4ed9" },
  { date: "2/5/25", time: "16:34:22", venue: "Northstar California Ski Resort", city: "Tahoe Vista", state: "California", country: "United States", lat: 39.2741873, lng: -120.12019, id: "67a3930e44d77b6eac1798ec" },
  { date: "5/28/25", time: "20:49:31", venue: "The Drexel Mediterranean Grill", city: "Miami Beach", state: "Florida", country: "United States", lat: 25.7869109, lng: -80.133064, id: "683776dbe07dcf7558ada0e7" },
  { date: "6/1/25", time: "22:16:00", venue: "Grand Prismatic Spring geyser", city: "West Yellowstone", state: "Montana", country: "United States", lat: 44.5285734, lng: -110.83634, id: "683cd120380ced507c46c0c8" },
  { date: "6/5/25", time: "22:02:23", venue: "Grand Teton National Park", city: "Jackson", state: "Wyoming", country: "United States", lat: 43.9820364, lng: -110.66275, id: "684213ef489d1c0d4e6b933d" },
  { date: "6/6/25", time: "19:54:56", venue: "Hidden Falls cascades", city: "Jackson Hole", state: "Wyoming", country: "United States", lat: 43.7650042, lng: -110.75089, id: "684347905d32696aed0786ce" },
  { date: "7/10/25", time: "16:24:56", venue: "Napa Valley Wine Train", city: "Napa", state: "California", country: "United States", lat: 38.3030504, lng: -122.28378, id: "686fe952bc355f69d82baa34" },
  { date: "10/3/25", time: "15:22:55", venue: "Pyrámide del Sol: Teotihuacan", city: "Teotihuacan", state: "", country: "Mexico", lat: 19.6885347, lng: -98.854101, id: "68dfea4f3a0e5176b3a6e00f" },
  { date: "11/22/25", time: "10:30:00", venue: "Senso-ji Temple & Shibuya Crossing", city: "Tokyo", state: "", country: "Japan", lat: 35.7147, lng: 139.7966, id: "68japan_tokyo_01" },
  { date: "11/26/25", time: "11:45:00", venue: "Fushimi Inari Taisha", city: "Kyoto", state: "", country: "Japan", lat: 34.9671, lng: 135.7727, id: "68japan_kyoto_02" },
  { date: "11/28/25", time: "14:15:00", venue: "Nara Park & Todai-ji Temple", city: "Nara", state: "", country: "Japan", lat: 34.6851, lng: 135.8282, id: "68japan_nara_03" },
  { date: "11/29/25", time: "18:00:00", venue: "Osaka Castle & Dotonbori District", city: "Osaka", state: "", country: "Japan", lat: 34.6873, lng: 135.5262, id: "68japan_osaka_04" },
  // 2026
  { date: "3/22/26", time: "16:24:33", venue: "Plaza Lazaro Cardenas", city: "Puerto Vallarta", state: "", country: "Mexico", lat: 20.6027865, lng: -105.2378, id: "69c017c1d006f7103913b495" },
  { date: "5/16/26", time: "11:35:31", venue: "Chateau Meichtry Family Winery", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.587383, lng: -84.43347, id: "6a0856837a03e6055ec1cc1d" },
  { date: "5/17/26", time: "18:04:19", venue: "Ott Vineyards and Winery", city: "Ellijay", state: "Georgia", country: "United States", lat: 34.6082699, lng: -84.420377, id: "6a0a03238f1ea61b3e53b957" }
];

export function getParsedTravels(): TravelCheckIn[] {
  return SAMPLE_TRAVELS_RAW.map((row) => {
    // Parse year from date string e.g. "5/30/10" -> 2010
    const parts = row.date.split("/");
    let yearPart = parseInt(parts[2], 10);
    const year = yearPart < 50 ? 2000 + yearPart : 1900 + yearPart;

    const [h, m, s] = row.time.split(":").map(Number);
    const dateObj = new Date(year, parseInt(parts[0], 10) - 1, parseInt(parts[1], 10), h || 0, m || 0, s || 0);

    const distanceFromAtlanta = calculateDistance(ATLANTA_COORDS.lat, ATLANTA_COORDS.lng, row.lat, row.lng);

    return {
      date: row.date,
      time: row.time,
      venueName: row.venue,
      city: row.city,
      state: row.state,
      country: row.country,
      latitude: row.lat,
      longitude: row.lng,
      checkinId: row.id,
      year,
      dateObj,
      distanceFromAtlanta
    };
  }).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
}
