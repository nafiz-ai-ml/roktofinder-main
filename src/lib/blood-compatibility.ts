import { type BloodGroup } from "@/lib/supabase";

export type CompatibilityMode = "donate" | "receive";

export interface GroupDetails {
  group: BloodGroup;
  nameBn: string;
  canDonateTo: BloodGroup[];
  canReceiveFrom: BloodGroup[];
  isUniversalDonor?: boolean;
  isUniversalRecipient?: boolean;
  rarityBn: string;
  summaryBn: string;
  detailsBn: string;
}

export const COMPATIBILITY_DATA: Record<BloodGroup, GroupDetails> = {
  "O-": {
    group: "O-",
    nameBn: "ও নেগেটিভ",
    canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    canReceiveFrom: ["O-"],
    isUniversalDonor: true,
    rarityBn: "বিরল (প্রায় ১.৫%)",
    summaryBn: "সার্বজনীন রক্তদাতা (Universal Red Cell Donor)",
    detailsBn:
      "O- গ্রুপের রক্তে কোনো A, B বা Rh অ্যান্টিজেন থাকে না। তাই জরুরি পরিস্থিতিতে কোনো রক্তের গ্রুপ নিশ্চিত না হওয়া পর্যন্ত যেকোনো রোগীকে এই রক্ত নিরাপদে দেওয়া সম্ভব। তবে O- গ্রুপের রোগী শুধুমাত্র O- রক্তই গ্রহণ করতে পারেন।",
  },
  "O+": {
    group: "O+",
    nameBn: "ও পজিটিভ",
    canDonateTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O+", "O-"],
    rarityBn: "সর্বাধিক প্রচলিত (প্রায় ৩১%)",
    summaryBn: "সকল পজিটিভ গ্রুপের জন্য নিরাপদ দাতা",
    detailsBn:
      "বাংলাদেশে সবচেয়ে বেশি মানুষের রক্তের গ্রুপ O+। হাসপাতালে ও দুর্ঘটনাজনিত অপারেশনে এই রক্তের চাহিদা সবচেয়ে বেশি থাকে। O+ রক্ত যেকোনো পজিটিভ রোগীকে দেওয়া যায় এবং এরা O+ ও O- থেকে রক্ত নিতে পারেন।",
  },
  "A+": {
    group: "A+",
    nameBn: "এ পজিটিভ",
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    rarityBn: "খুবই প্রচলিত (প্রায় ২৭%)",
    summaryBn: "A+ এবং AB+ রোগীদের জীবন রক্ষাকারী",
    detailsBn:
      "A+ রক্তের লোহিত কণিকায় A ও Rh অ্যান্টিজেন থাকে। এরা A+ ও AB+ রোগীকে রক্ত দিতে পারেন। রক্ত গ্রহণের ক্ষেত্রে A+, A-, O+, ও O- এই চারটি গ্রুপ থেকে রক্ত নিতে পারেন।",
  },
  "A-": {
    group: "A-",
    nameBn: "এ নেগেটিভ",
    canDonateTo: ["A+", "A-", "AB+", "AB-"],
    canReceiveFrom: ["A-", "O-"],
    rarityBn: "বিরল (প্রায় ১.২%)",
    summaryBn: "সকল A ও AB রোগীর জন্য রক্তদান উপযোগী",
    detailsBn:
      "A- একটি বিরল নেগেটিভ রক্তের গ্রুপ। এরা A ও AB-এর পজিটিভ ও নেগেটিভ উভয় ধরনের রোগীকে রক্ত দিতে পারেন। কিন্তু রক্ত গ্রহণের জন্য শুধুমাত্র A- এবং O- এর ওপর নির্ভর করতে হয়।",
  },
  "B+": {
    group: "B+",
    nameBn: "বি পজিটিভ",
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    rarityBn: "খুবই প্রচলিত (প্রায় ৩৩%)",
    summaryBn: "B+ এবং AB+ রোগীদের পরম বন্ধু",
    detailsBn:
      "বাংলাদেশে B+ রক্তের মানুষ প্রচুর। B+ রক্তের ব্যক্তি B+ এবং AB+ রোগীকে রক্ত দিতে পারেন। প্রয়োজনে এরা B+, B-, O+, O- রক্ত গ্রহণ করতে পারেন।",
  },
  "B-": {
    group: "B-",
    nameBn: "বি নেগেটিভ",
    canDonateTo: ["B+", "B-", "AB+", "AB-"],
    canReceiveFrom: ["B-", "O-"],
    rarityBn: "বিরল (প্রায় ১.৪%)",
    summaryBn: "সকল B ও AB রোগীর জন্য জীবনদায়ী",
    detailsBn:
      "B- রক্তদাতার সংখ্যা ময়মনসিংহে তুলনামূলক কম। এরা B+, B-, AB+, AB- চার ধরনের রোগীকে রক্ত দিতে পারেন। তবে রক্ত নেওয়ার জন্য শুধুমাত্র B- ও O- ডোনার প্রয়োজন হয়।",
  },
  "AB+": {
    group: "AB+",
    nameBn: "এবি পজিটিভ",
    canDonateTo: ["AB+"],
    canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    isUniversalRecipient: true,
    rarityBn: "মাঝারি প্রচলিত (প্রায় ৮%)",
    summaryBn: "সার্বজনীন রক্তগ্রহীতা (Universal Recipient)",
    detailsBn:
      "AB+ রক্তের মানুষের শরীরে A, B ও Rh সব অ্যান্টিজেন উপস্থিত থাকে। ফলে অন্য কোনো রক্তের গ্রুপের অ্যান্টিবডি এদের শরীরে আক্রমণ করে না। তাই AB+ গ্রুপের মানুষ যেকোনো রক্তের গ্রুপ থেকে রক্ত গ্রহণ করতে পারেন। তবে রক্ত দেওয়ার সময় শুধুমাত্র AB+ রোগীকে রক্ত দিতে পারেন।",
  },
  "AB-": {
    group: "AB-",
    nameBn: "এবি নেগেটিভ",
    canDonateTo: ["AB+", "AB-"],
    canReceiveFrom: ["AB-", "A-", "B-", "O-"],
    rarityBn: "সবচেয়ে বিরলতম (১% এরও কম)",
    summaryBn: "বিরল গ্রুপের অসাধারণ দাতা",
    detailsBn:
      "AB- বাংলাদেশের জনসংখ্যার ১% এরও কম মানুষের থাকে। এরা AB+ এবং AB- উভয় গ্রুপকে রক্ত দিতে পারেন। রক্ত গ্রহণের ক্ষেত্রে সকল নেগেটিভ গ্রুপ (AB-, A-, B-, O-) থেকে রক্ত নিতে পারেন।",
  },
};

