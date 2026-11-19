export type AmbulanceType = "all" | "icu" | "ac" | "non_ac" | "freezer";

export interface AmbulanceService {
  id: string;
  providerName: string;
  driverOrContact: string;
  vehicleType: "icu" | "ac" | "non_ac" | "freezer";
  baseLocation: string;
  primaryPhone: string;
  secondaryPhone?: string;
  hasWhatsApp: boolean;
  is24x7: boolean;
  hasOxygen: boolean;
  hasVentilator?: boolean;
  pricingNote: string;
  verified: boolean;
  badgeBn?: string;
  descriptionBn: string;
}

export const AMBULANCE_DATA: AmbulanceService[] = [
  {
    id: "national-999",
    providerName: "জাতীয় জরুরি সেবা (৯৯৯ - অ্যাম্বুলেন্স ডিসপ্যাচ)",
    driverOrContact: "সরকারি সেন্ট্রাল কমান্ড ডেস্ক",
    vehicleType: "ac",
    baseLocation: "ময়মনসিংহ জেলা ও সারা বাংলাদেশ",
    primaryPhone: "999",
    hasWhatsApp: false,
    is24x7: true,
    hasOxygen: true,
    pricingNote: "সরকারি টোল-ফ্রি জরুরি সেবা",
    verified: true,
    badgeBn: "সরকারি টোল-ফ্রি ২৪/৭",
    descriptionBn:
      "জরুরি মুহূর্তে বাংলাদেশ সরকারের কেন্দ্রীয় জরুরি সেবা। কল করার পর রোগীর অবস্থান অনুযায়ী নিকটস্থ সরকারি বা অনুমোদিত অ্যাম্বুলেন্স সহায়তা নিশ্চিত করে।",
  },
  {
    id: "mmch-ambulance-stand",
    providerName: "ময়মনসিংহ মেডিকেল কেন্দ্রীয় অ্যাম্বুলেন্স স্ট্যান্ড",
    driverOrContact: "হাসপাতাল অ্যাম্বুলেন্স নিয়ন্ত্রণ কক্ষ",
    vehicleType: "ac",
    baseLocation: "চরপাড়া মেডিকেল গেট",
    primaryPhone: "01716-166160",
    secondaryPhone: "01711-236582",
    hasWhatsApp: true,
    is24x7: true,
    hasOxygen: true,
    pricingNote: "হাসপাতাল অনুমোদিত লোকাল ও দূরপাল্লায় ফিক্সড ফেয়ার",
    verified: true,
    badgeBn: "মেডিকেল গেট সার্বক্ষণিক",
    descriptionBn:
      "চরপাড়া ময়মনসিংহ মেডিকেল কলেজ গেটের প্রধান স্ট্যান্ড। ঢাকা, সিলেট, উত্তরবঙ্গসহ যেকোনো দূরপাল্লার রোগী স্থানান্তরে সার্বক্ষণিক আধুনিক এসি অ্যাম্বুলেন্স প্রস্তুত থাকে।",
  },
  {
    id: "lifeaid-icu-ambulance",
    providerName: "লাইফ এইড আইসিইউ অ্যাম্বুলেন্স সার্ভিস",
    driverOrContact: "মেডিকেল টিম ইন-চার্জ (হাসানুর)",
    vehicleType: "icu",
    baseLocation: "চরপাড়া মোড়, ময়মনসিংহ",
    primaryPhone: "01711-236582",
    secondaryPhone: "01819-234567",
    hasWhatsApp: true,
    is24x7: true,
    hasOxygen: true,
    hasVentilator: true,
    pricingNote: "দূরত্ব ও মেডিকেল সাপোর্ট অনুযায়ী নির্ধারিত সাশ্রয়ী রেট",
    verified: true,
    badgeBn: "ভেন্টিলেটর ও কার্ডিয়াক মনিটরযুক্ত",
    descriptionBn:
      "ক্রিটিক্যাল কেয়ার ও নিবিড় পরিচর্যা প্রয়োজন এমন রোগীদের জন্য পোর্টেবল ভেন্টিলেটর, সিরিঞ্জ পাম্প, সাকশন ও প্যারামেডিক সাপোর্ট সহ আধুনিক আইসিইউ অ্যাম্বুলেন্স।",
  },
  {
    id: "charpara-malik-samity",
    providerName: "চরপাড়া অ্যাম্বুলেন্স মালিক সমিতি",
    driverOrContact: "কন্ট্রোল রুম / ডিউটি অফিসার",
    vehicleType: "ac",
    baseLocation: "চরপাড়া মোড়, ময়মনসিংহ",
    primaryPhone: "01712-456789",
    secondaryPhone: "01911-345678",
    hasWhatsApp: true,
    is24x7: true,
    hasOxygen: true,
    pricingNote: "সমিতি নির্ধারিত ন্যায্য ভাড়া ও ২৪ ঘণ্টা দ্রুত রেসপন্স",
    verified: true,
    badgeBn: "সমিতি ভেরিফাইড স্ট্যান্ড",
    descriptionBn:
      "ময়মনসিংহ জেলা অ্যাম্বুলেন্স মালিক সমিতির নিবন্ধিত স্ট্যান্ড। অভিজ্ঞ ড্রাইভার ও নিয়মিত সার্ভিসিং করা নির্ভরযোগ্য অ্যাম্বুলেন্স নেটওয়ার্ক।",
  },
  {
    id: "sandhani-emergency-ambulance",
    providerName: "সন্ধানী স্বেচ্ছাসেবী অ্যাম্বুলেন্স",
    driverOrContact: "সন্ধানী এমএমসিএইচ দায়িত্বপ্রাপ্ত",
    vehicleType: "non_ac",
    baseLocation: "ময়মনসিংহ মেডিকেল প্রাঙ্গণ",
    primaryPhone: "01712-258070",
    hasWhatsApp: true,
    is24x7: true,
    hasOxygen: true,
    pricingNote: "অলাভজনক ও সাশ্রয়ী সেবামূলক ব্যবস্থা",
    verified: true,
    badgeBn: "সেবামূলক স্বেচ্ছাসেবী সার্ভিস",
    descriptionBn:
      "অসহায় ও দরিদ্র রোগীদের জরুরি স্থানান্তর সহায়তায় সন্ধানীর উদ্যোগে পরিচালিত সাশ্রয়ী স্বেচ্ছাসেবী অ্যাম্বুলেন্স।",
  },
  {
    id: "cbmcb-churkhai-stand",
    providerName: "সিবিএমসিবি চুরখাই অ্যাম্বুলেন্স সার্ভিস",
    driverOrContact: "চুরখাই স্ট্যান্ড ইন-চার্জ (রফিক)",
    vehicleType: "ac",
    baseLocation: "চুরখাই, ঢাকা-ময়মনসিংহ মহাসড়ক",
    primaryPhone: "01713-388277",
    secondaryPhone: "01725-678901",
    hasWhatsApp: true,
    is24x7: true,
    hasOxygen: true,
    pricingNote: "হাইওয়ে রুটে দ্রুত রেসপন্স ও রিজনেবল ফেয়ার",
    verified: true,
    badgeBn: "মহাসড়ক ও দক্ষিণ ময়মনসিংহ",
    descriptionBn:
      "ময়মনসিংহ-ঢাকা মহাসড়কের চুরখাই পয়েন্টে সার্বক্ষণিক স্ট্যান্ডবাই থাকে। ত্রিশাল, ভালুকা ও ঢাকা অভিমুখে দ্রুত রোগী পরিবহনে সবচেয়ে সুবিধাজনক।",
  },
  {
    id: "station-ganginarpar-ambulance",
    providerName: "গাঙ্গিনারপাড় ও রেলওয়ে স্টেশন স্ট্যান্ড",
    driverOrContact: "স্ট্যান্ড কো-অর্ডিনেটর (জালাল)",
    vehicleType: "non_ac",
    baseLocation: "গাঙ্গিনারপাড় / স্টেশন রোড",
    primaryPhone: "01718-901234",
    secondaryPhone: "01923-456789",
    hasWhatsApp: true,
    is24x7: true,
    hasOxygen: true,
    pricingNote: "শহরের ভেতরে সাশ্রয়ী ও দ্রুত যাতায়াত",
    verified: true,
    badgeBn: "শহরের কেন্দ্রস্থল স্ট্যান্ড",
    descriptionBn:
      "ময়মনসিংহ শহরের কেন্দ্রস্থলে অবস্থান করায় শহরের ভেতরের যেকোনো ক্লিনিক বা বাসা থেকে হাসপাতালে রোগী নেওয়ার জন্য দ্রুত পৌঁছাতে সক্ষম।",
  },
];
