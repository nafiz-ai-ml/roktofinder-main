export type HospitalCategory = "all" | "government" | "private" | "blood_bank";

export interface Hospital {
  id: string;
  name: string;
  nameBn: string;
  category: "government" | "private" | "blood_bank";
  address: string;
  area: string;
  emergencyHotline: string;
  receptionPhone?: string;
  bloodBankAvailable: boolean;
  bloodBankPhone?: string;
  hasICU: boolean;
  is24x7: boolean;
  mapUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  descriptionBn: string;
  badgeBn?: string;
}

export const HOSPITALS_DATA: Hospital[] = [
  {
    id: "mmch",
    name: "Mymensingh Medical College Hospital (MMCH)",
    nameBn: "ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল",
    category: "government",
    address: "চরপাড়া, ময়মনসিংহ সদর, ময়মনসিংহ ২২০০",
    area: "চরপাড়া",
    emergencyHotline: "01716-166160",
    receptionPhone: "091-66063",
    bloodBankAvailable: true,
    bloodBankPhone: "01716-166160",
    hasICU: true,
    is24x7: true,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=24.7371,90.4184",
    coordinates: { lat: 24.7371, lng: 90.4184 },
    badgeBn: "সর্ববৃহৎ সরকারি টারশিয়ারি হাসপাতাল",
    descriptionBn:
      "ময়মনসিংহ বিভাগের প্রধান ও বৃহত্তম সরকারি হাসপাতাল। এখানে সার্বক্ষণিক জরুরি বিভাগ, আইসিইউ এবং কেন্দ্রীয় ব্লাড ট্রান্সফিউশন ইউনিট সচল থাকে।",
  },
  {
    id: "sandhani-mmch",
    name: "Sandhani MMCH Unit & Blood Bank",
    nameBn: "সন্ধানী (ময়মনসিংহ মেডিকেল কলেজ ইউনিট ও রক্ত সঞ্চালন কেন্দ্র)",
    category: "blood_bank",
    address: "ময়মনসিংহ মেডিকেল কলেজ প্রাঙ্গণ, চরপাড়া, ময়মনসিংহ",
    area: "চরপাড়া",
    emergencyHotline: "01712-258070",
    bloodBankAvailable: true,
    bloodBankPhone: "01712-258070",
    hasICU: false,
    is24x7: true,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=24.7380,90.4190",
    coordinates: { lat: 24.738, lng: 90.419 },
    badgeBn: "ঐতিহ্যবাহী স্বেচ্ছাসেবী ব্লাড ব্যাংক",
    descriptionBn:
      "মেডিকেল শিক্ষার্থীদের পরিচালিত ময়মনসিংহের অন্যতম বিশ্বস্ত স্বেচ্ছাসেবী রক্তদান সংস্থা ও ২৪ ঘণ্টার সংরক্ষিত রক্ত সঞ্চালন কেন্দ্র।",
  },
  {
    id: "red-crescent-mym",
    name: "Bangladesh Red Crescent Society (Mymensingh Unit)",
    nameBn: "বাংলাদেশ রেড ক্রিসেন্ট সোসাইটি (ময়মনসিংহ ইউনিট রক্ত কেন্দ্র)",
    category: "blood_bank",
    address: "রেড ক্রিসেন্ট ভবন, স্টেশন রোড, ময়মনসিংহ",
    area: "স্টেশন রোড",
    emergencyHotline: "01711-382944",
    bloodBankAvailable: true,
    bloodBankPhone: "01711-382944",
    hasICU: false,
    is24x7: true,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=24.7523,90.4072",
    coordinates: { lat: 24.7523, lng: 90.4072 },
    badgeBn: "সার্বক্ষণিক রক্ত কেন্দ্র",
    descriptionBn:
      "মানবিক সাহায্য ও দুর্যোগকালীন সহায়তার পাশাপাশি সার্বক্ষণিক নিরাপদ রক্তের ব্যবস্থা ও রক্তের স্ক্রিনিং টেস্ট সরবরাহ করে।",
  },
  {
    id: "cbmcb",
    name: "Community Based Medical College Hospital (CBMCB)",
    nameBn: "কমিউনিটি বেজড মেডিকেল কলেজ হাসপাতাল (সিবিএমসিবি)",
    category: "private",
    address: "উইনারপার, চুরখাই, ঢাকা-ময়মনসিংহ মহাসড়ক",
    area: "চুরখাই",
    emergencyHotline: "01713-388277",
    receptionPhone: "091-64501",
    bloodBankAvailable: true,
    bloodBankPhone: "01713-388277",
    hasICU: true,
    is24x7: true,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=24.6738,90.4411",
    coordinates: { lat: 24.6738, lng: 90.4411 },
    badgeBn: "শীর্ষ বেসরকারি মেডিকেল",
    descriptionBn:
      "দক্ষিণ ময়মনসিংহের চুরখাই অবস্থিত ৬৫০ শয্যাবিশিষ্ট পূর্ণাঙ্গ মাল্টি-ডিসিপ্লিনারি হাসপাতাল, আধুনিক আইসিইউ ও অনুমোদিত ব্লাড ব্যাংক।",
  },
  {
    id: "swadesh-hospital",
    name: "Swadesh Hospital & Diagnostic Centre",
    nameBn: "স্বদেশ হাসপাতাল ও ডায়াগনস্টিক",
    category: "private",
    address: "চরপাড়া মোড়, ময়মনসিংহ সদর",
    area: "চরপাড়া",
    emergencyHotline: "01711-236582",
    receptionPhone: "091-67890",
    bloodBankAvailable: true,
    hasICU: true,
    is24x7: true,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=24.7358,90.4168",
    coordinates: { lat: 24.7358, lng: 90.4168 },
    badgeBn: "২৪/৭ জরুরি ও ল্যাব",
    descriptionBn:
      "চরপাড়ার অন্যতম ব্যস্ত বেসরকারি হাসপাতাল। সার্বক্ষণিক জরুরি অপারেশন, রক্তের গ্রুপ টেস্ট ও নিবিড় পরিচর্যা (ICU) সুবিধা রয়েছে।",
  },
  {
    id: "nexus-hospital",
    name: "Nexus Cardiac & General Hospital",
    nameBn: "নেক্সাস কার্ডিয়াক ও জেনারেল হাসপাতাল",
    category: "private",
    address: "১৪/এ, মেডিকেল কলেজ গেট রোড, চরপাড়া",
    area: "চরপাড়া",
    emergencyHotline: "01799-335500",
    receptionPhone: "091-62400",
    bloodBankAvailable: false,
    hasICU: true,
    is24x7: true,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=24.7365,90.4175",
    coordinates: { lat: 24.7365, lng: 90.4175 },
    badgeBn: "হৃদরোগ ও সিসিইউ বিশেষায়িত",
    descriptionBn:
      "হৃদরোগী এবং ক্রিটিক্যাল কেয়ার চিকিৎসায় ময়মনসিংহের অন্যতম শীর্ষ বিশেষায়িত হাসপাতাল ও আধুনিক কার্ডিয়াক কেয়ার ইউনিট।",
  },
  {
    id: "popular-hospital",
    name: "Popular Diagnostic Centre & Hospital",
    nameBn: "পপুলার ডায়াগনস্টিক সেন্টার ও হাসপাতাল",
    category: "private",
    address: "১৭১/২, চরপাড়া মোড়, ময়মনসিংহ",
    area: "চরপাড়া",
    emergencyHotline: "09613-787814",
    receptionPhone: "091-67814",
    bloodBankAvailable: false,
    hasICU: false,
    is24x7: true,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=24.7377,90.4162",
    coordinates: { lat: 24.7377, lng: 90.4162 },
    badgeBn: "আধুনিক প্যাথলজি ও পরীক্ষা",
    descriptionBn:
      "উন্নত মানের রক্ত পরীক্ষা, ক্রস-ম্যাচিং, ডিজিটাল রেডিওলজি ও বিশেষজ্ঞ চিকিৎসকদের চেম্বার সুবিধা সমৃদ্ধ ডায়াগনস্টিক কমপ্লেক্স।",
  },
  {
    id: "sk-hospital",
    name: "Surjakanta (SK) Hospital",
    nameBn: "সূর্যকান্ত (এসকে) হাসপাতাল",
    category: "government",
    address: "বাঘমারা রোড, ময়মনসিংহ সদর",
    area: "বাঘমারা",
    emergencyHotline: "091-65521",
    bloodBankAvailable: false,
    hasICU: false,
    is24x7: true,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=24.7460,90.4040",
    coordinates: { lat: 24.746, lng: 90.404 },
    badgeBn: "ঐতিহাসিক সরকারি বিশেষায়িত হাসপাতাল",
    descriptionBn:
      "সরকারি বিশেষায়িত সংক্রামক ব্যাধি ও বক্ষব্যাধি চিকিৎসাকেন্দ্র। জরুরি প্রাথমিক চিকিৎসা ও বহির্বিভাগীয় সেবা চালু থাকে।",
  },
  {
    id: "sadar-health-complex",
    name: "Mymensingh Sadar Upazila Health Complex",
    nameBn: "ময়মনসিংহ সদর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    category: "government",
    address: "উপজেলা পরিষদ চত্বর, ময়মনসিংহ সদর",
    area: "ময়মনসিংহ সদর",
    emergencyHotline: "01730-324860",
    bloodBankAvailable: false,
    hasICU: false,
    is24x7: true,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=24.7580,90.3950",
    coordinates: { lat: 24.758, lng: 90.395 },
    badgeBn: "সরকারি উপজেলা স্বাস্থ্যকেন্দ্র",
    descriptionBn:
      "স্থানীয় বাসিন্দাদের প্রাথমিক স্বাস্থ্য ও জরুরি মাতৃত্বকালীন চিকিৎসাসেবা প্রদানে নিবেদিত সরকারি স্বাস্থ্য কেন্দ্র।",
  },
  {
    id: "labaid-mym",
    name: "Labaid Diagnostic Mymensingh",
    nameBn: "ল্যাবএইড ডায়াগনস্টিক ময়মনসিংহ",
    category: "private",
    address: "চরপাড়া নয়াপাড়া রোড, ময়মনসিংহ",
    area: "চরপাড়া",
    emergencyHotline: "01766-662606",
    bloodBankAvailable: false,
    hasICU: false,
    is24x7: true,
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=24.7385,90.4150",
    coordinates: { lat: 24.7385, lng: 90.415 },
    badgeBn: "সার্বক্ষণিক ডায়াগনস্টিক",
    descriptionBn:
      "জরুরি প্যাথলজি, দ্রুত ব্লাড স্ক্রিনিং রিপোর্ট ও উন্নত চিকিৎসা পরীক্ষার জন্য সার্বক্ষণিক সেবা প্রদান করে।",
  },
];

