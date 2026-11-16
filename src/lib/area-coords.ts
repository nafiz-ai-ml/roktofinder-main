import { type BloodGroup } from "@/lib/supabase";

export interface Coords {
  lat: number;
  lng: number;
}

export interface MapDonorPin {
  id: string;
  name: string;
  blood_group: BloodGroup;
  area: string;
  phone: string;
  coordinates: Coords;
  is_available: boolean;
}

export const SAMPLE_MAP_DONORS: MapDonorPin[] = [
  {
    id: "d1",
    name: "মুরাদ হাসান",
    blood_group: "O+",
    area: "চরপাড়া",
    phone: "01712-345671",
    coordinates: { lat: 24.7375, lng: 90.418 },
    is_available: true,
  },
  {
    id: "d2",
    name: "তানভীর আহমেদ",
    blood_group: "A+",
    area: "মাসকান্দা",
    phone: "01715-987652",
    coordinates: { lat: 24.7435, lng: 90.3985 },
    is_available: true,
  },
  {
    id: "d3",
    name: "রাকিবুল ইসলাম",
    blood_group: "B+",
    area: "গাঙ্গিনারপাড়",
    phone: "01819-234563",
    coordinates: { lat: 24.7545, lng: 90.4065 },
    is_available: true,
  },
  {
    id: "d4",
    name: "সাদিয়া আফরিন",
    blood_group: "O-",
    area: "কেওয়াটখালি",
    phone: "01540-380801",
    coordinates: { lat: 24.7315, lng: 90.4355 },
    is_available: true,
  },
  {
    id: "d5",
    name: "মাহমুদুল হাসান",
    blood_group: "AB+",
    area: "নতুন বাজার",
    phone: "01911-876544",
    coordinates: { lat: 24.7575, lng: 90.4035 },
    is_available: true,
  },
  {
    id: "d6",
    name: "শাকিল মাহমুদ",
    blood_group: "A-",
    area: "সানকিপাড়া",
    phone: "01723-456785",
    coordinates: { lat: 24.7485, lng: 90.3955 },
    is_available: true,
  },
  {
    id: "d7",
    name: "ফারহান কবির",
    blood_group: "B-",
    area: "বাঘমারা",
    phone: "01611-234566",
    coordinates: { lat: 24.7465, lng: 90.4045 },
    is_available: true,
  },
  {
    id: "d8",
    name: "নাজমুল হক",
    blood_group: "O+",
    area: "চুরখাই",
    phone: "01713-388271",
    coordinates: { lat: 24.6742, lng: 90.4415 },
    is_available: true,
  },
  {
    id: "d9",
    name: "আরিফুল ইসলাম",
    blood_group: "AB-",
    area: "আকুয়া",
    phone: "01822-334455",
    coordinates: { lat: 24.7555, lng: 90.3885 },
    is_available: true,
  },
  {
    id: "d10",
    name: "ইমরান হোসেন",
    blood_group: "B+",
    area: "নওমহল",
    phone: "01734-567890",
    coordinates: { lat: 24.7455, lng: 90.4125 },
    is_available: true,
  },
  {
    id: "d11",
    name: "হাসান জাহিদ",
    blood_group: "O+",
    area: "বলাশপুর",
    phone: "01920-112233",
    coordinates: { lat: 24.7325, lng: 90.4225 },
    is_available: true,
  },
  {
    id: "d12",
    name: "মেহেদী হাসান",
    blood_group: "A+",
    area: "কলেজ রোড",
    phone: "01745-667788",
    coordinates: { lat: 24.7425, lng: 90.4155 },
    is_available: true,
  },
];

export const MYMENSINGH_CENTER: Coords = {
  lat: 24.7471,
  lng: 90.4203,
};

export const MYMENSINGH_AREA_COORDS: Record<string, Coords> = {
  চরপাড়া: { lat: 24.7371, lng: 90.4184 },
  কেওয়াটখালি: { lat: 24.731, lng: 90.435 },
  মাসকান্দা: { lat: 24.743, lng: 90.398 },
  গাঙ্গিনারপাড়: { lat: 24.754, lng: 90.406 },
  "নতুন বাজার": { lat: 24.757, lng: 90.403 },
  ব্রাহ্মপল্লী: { lat: 24.749, lng: 90.401 },
  সানকিপাড়া: { lat: 24.748, lng: 90.395 },
  কাচিঝুলি: { lat: 24.752, lng: 90.398 },
  বাঘমারা: { lat: 24.746, lng: 90.404 },
  আকুয়া: { lat: 24.755, lng: 90.388 },
  কাঠগোলা: { lat: 24.759, lng: 90.409 },
  নওমহল: { lat: 24.745, lng: 90.412 },
  বলাশপুর: { lat: 24.732, lng: 90.422 },
  "কলেজ রোড": { lat: 24.742, lng: 90.415 },
  "জুবিলি ঘাট": { lat: 24.762, lng: 90.405 },
  "টাউন হল": { lat: 24.7555, lng: 90.4055 },
  ভাটিকাশর: { lat: 24.739, lng: 90.428 },
  কৃষ্টপুর: { lat: 24.75, lng: 90.411 },
  "ছোট বাজার": { lat: 24.7565, lng: 90.4045 },
  "বড় বাজার": { lat: 24.758, lng: 90.405 },
  গোহাইলকান্দি: { lat: 24.747, lng: 90.389 },
  শম্ভুগঞ্জ: { lat: 24.741, lng: 90.455 },
  "BAU (বাংলাদেশ কৃষি বিশ্ববিদ্যালয়)": { lat: 24.717, lng: 90.432 },
  চুরখাই: { lat: 24.6738, lng: 90.4411 },
  ত্রিশাল: { lat: 24.582, lng: 90.398 },
  ভালুকা: { lat: 24.378, lng: 90.378 },
  মুক্তাগাছা: { lat: 24.758, lng: 90.26 },
  ফুলবাড়িয়া: { lat: 24.634, lng: 90.265 },
  গফরগাঁও: { lat: 24.433, lng: 90.55 },
  গৌরীপুর: { lat: 24.756, lng: 90.573 },
  ঈশ্বরগঞ্জ: { lat: 24.686, lng: 90.596 },
  নান্দাইল: { lat: 24.571, lng: 90.686 },
  ফুলপুর: { lat: 24.952, lng: 90.354 },
  হালুয়াঘাট: { lat: 25.127, lng: 90.35 },
  ধোবাউড়া: { lat: 25.092, lng: 90.584 },
  তারাকান্দা: { lat: 24.878, lng: 90.417 },
  "ময়মনসিংহ সদর": { lat: 24.7471, lng: 90.4203 },
};

/**
 * Calculate distance in kilometers between two lat/lng coordinates (Haversine formula)
 */
export function calculateDistanceKm(c1: Coords, c2: Coords): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLon = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
