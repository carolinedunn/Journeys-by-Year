export interface TravelCheckIn {
  date: string;
  time: string;
  venueName: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  checkinId: string;
  year: number;
  dateObj: Date;
  distanceFromAtlanta: number; // in km or miles
}

export interface MapStyleOption {
  id: string;
  name: string;
  url: string;
  attribution: string;
}
