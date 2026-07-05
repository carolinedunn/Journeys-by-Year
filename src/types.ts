export interface TravelCheckIn {
  date: string;
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
  utcDate?: string;
  timezoneOffset?: number;
}

export interface MapStyleOption {
  id: string;
  name: string;
  url: string;
  attribution: string;
}
