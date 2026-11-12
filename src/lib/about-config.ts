import {
  Heart,
  ShieldCheck,
  Users,
  Handshake,
  MapPin,
  Search,
  PhoneCall,
  CheckCircle2,
  Building2,
  Compass,
  Sparkles,
} from "lucide-react";

/**
 * Centralized content configuration for RoktoFinder About page and Founder Profile.
 * Ensures all details are easily maintained in one place.
 */

export interface FounderSocialLinks {
  facebook: string;
  linkedin: string;
  github: string;
  x: string;
  portfolio: string;
}

export const founderSocialLinks: FounderSocialLinks = {
  // Empty until actual profile URLs are provided. Non-empty URLs will automatically become active links.
  facebook: "",
  linkedin: "",
  github: "",
  x: "",
  portfolio: "https://muhammadnafiz.netlify.app/",
};

export const founderInfo = {
  name: "Muhammad Nafiz",
  nameBn: "মুহাম্মদ নাফিজ",
  title: "Founder | Web Application Developer | AI/ML Engineer in Training",
  titleBn: "প্রতিষ্ঠাতা ও ডেভেলপার",
  location: "Mymensingh, Bangladesh",
  locationBn: "ময়মনসিংহ, বাংলাদেশ",
  image: "/images/my.png",
  imageAlt: "Muhammad Nafiz — Founder of RoktoFinder",
  // English Biography: displayed exactly as confirmed, do not translate
  biography: [
    "Muhammad Nafiz is an independent founder and web application developer passionate about building digital products that solve real-world problems. He is the founder of RoktoFinder and is continuously exploring and developing new ideas through technology and entrepreneurship.",
    "Alongside building web applications, Nafiz is pursuing his journey toward becoming an AI/ML Engineer. He has completed his foundational learning in Python and Machine Learning and is currently exploring Deep Learning. His learning roadmap includes Natural Language Processing (NLP), Computer Vision, Generative AI, Transformers, and AI Agent Development.",
    "He believes in continuous learning, practical problem-solving, and using technology to create meaningful impact.",
  ],
  socialLinks: founderSocialLinks,
};

export const founderMessage = {
  heading: "কেন RoktoFinder তৈরি করেছি?",
  paragraphs: [
    "রক্তের প্রয়োজন কখনো বলে-কয়ে আসে না। জরুরি সময়ে সঠিক রক্তের গ্রুপের একজন রক্তদাতা খুঁজে পাওয়া অনেক সময় কঠিন হয়ে পড়ে। বিশেষ করে নিজের আশপাশে কারা রক্ত দিতে আগ্রহী, তাঁদের সঙ্গে কীভাবে যোগাযোগ করা যাবে—এসব তথ্য সহজে পাওয়া সবসময় সম্ভব হয় না।",
    "এই সমস্যাটি কিছুটা সহজ করার লক্ষ্য নিয়েই RoktoFinder তৈরি করেছি।",
    "আমার উদ্দেশ্য হলো, মানুষ যেন নিজের এলাকা ও প্রয়োজনীয় রক্তের গ্রুপ অনুযায়ী কাছাকাছি স্বেচ্ছাসেবী রক্তদাতাদের খুঁজে পেতে পারেন এবং তাঁদের সঙ্গে সহজে যোগাযোগ করতে পারেন।",
    "RoktoFinder-এর যাত্রা শুরু হয়েছে ময়মনসিংহ থেকে। ভবিষ্যতে এই উদ্যোগকে বাংলাদেশের আরও মানুষের কাছে পৌঁছে দিতে চাই।",
    "আমি বিশ্বাস করি, প্রযুক্তি শুধু ব্যবসা বা সুবিধা তৈরির মাধ্যম নয়; সঠিকভাবে ব্যবহার করতে পারলে এটি মানুষের পাশে দাঁড়ানোরও একটি কার্যকর মাধ্যম হতে পারে।",
  ],
  highlightQuote: "আমার স্বপ্ন—রক্তের প্রয়োজনে কাউকে যেন অসহায়ভাবে রক্তদাতা খুঁজতে না হয়।",
  signature: "মুহাম্মদ নাফিজ",
  signatureRole: "প্রতিষ্ঠাতা, RoktoFinder",
};

export const aboutPlatformPillars = [
  {
    icon: Building2,
    badge: "উদ্যোগের পটভূমি",
    title: "আল ফাতিহ ইসলামিক পাঠাগার-এর সামাজিক উদ্যোগ",
    description:
      "RoktoFinder ময়মনসিংহের আল ফাতিহ ইসলামিক পাঠাগার-এর একটি স্বেচ্ছাসেবী উদ্যোগ। মানবিক দায়বদ্ধতা ও সমাজের জরুরি প্রয়োজনের সময়ে মানুষের পাশে দাঁড়ানোর তাগিদ থেকেই এই প্ল্যাটফর্মের সূচনা।",
  },
  {
    icon: MapPin,
    badge: "স্থানীয় মনোযোগ",
    title: "ময়মনসিংহ থেকে সূচিত কমিউনিটি নেটওয়ার্ক",
    description:
      "প্রাথমিক পর্যায়ে ময়মনসিংহ শহর ও আশপাশের এলাকাগুলোকে প্রধান ফোকাসে রেখে স্বেচ্ছাসেবী রক্তদাতাদের একটি সক্রিয় ও নির্ভরযোগ্য ডেটাবেজ গড়ে তোলা হচ্ছে।",
  },
  {
    icon: Search,
    badge: "সহজ অনুসন্ধান",
    title: "রক্তের গ্রুপ ও এলাকাভিত্তিক সরাসরি সার্চ",
    description:
      "জরুরি মুহূর্তে সময় অপচয় না করে কাঙ্ক্ষিত রক্তের গ্রুপ এবং নির্দিষ্ট এলাকা নির্বাচন করে তাৎক্ষণিকভাবে কাছাকাছি রক্তদাতাদের তালিকা পাওয়া যায়।",
  },
  {
    icon: Compass,
    badge: "ভবিষ্যৎ রূপকল্প",
    title: "সারা বাংলাদেশে ছড়িয়ে দেওয়ার দীর্ঘমেয়াদি ভিশন",
    description:
      "ময়মনসিংহ দিয়ে আমাদের এই পথচলার সূচনা হলেও আমাদের দীর্ঘমেয়াদি স্বপ্ন—ধাপে ধাপে এই প্রযুক্তিগত সেবাকে পুরো বাংলাদেশের প্রতিটি জেলায় বিস্তৃত করা।",
  },
];

export const coreValues = [
  {
    icon: Heart,
    title: "মানবিকতা",
    text: "রক্তের প্রয়োজনে মানুষের পাশে দাঁড়ানোর মানসিকতা।",
    tag: "মূল চালিকাশক্তি",
  },
  {
    icon: ShieldCheck,
    title: "দায়িত্বশীলতা",
    text: "ডোনার ও রক্তগ্রহীতা উভয়ের নিরাপত্তা এবং দায়িত্বশীল যোগাযোগকে গুরুত্ব দেওয়া।",
    tag: "নিরাপত্তা ও শালীনতা",
  },
  {
    icon: CheckCircle2,
    title: "বিশ্বস্ততা",
    text: "সঠিক তথ্য এবং দায়িত্বশীল ব্যবহারের মাধ্যমে একটি নির্ভরযোগ্য প্ল্যাটফর্ম গড়ে তোলার চেষ্টা।",
    tag: "সততা ও স্বচ্ছতা",
  },
  {
    icon: Handshake,
    title: "সহযোগিতা",
    text: "স্থানীয় মানুষের মধ্যে সহযোগিতার সুযোগ তৈরি করা।",
    tag: "সামাজিক ঐক্য",
  },
];

export const howItWorksSteps = [
  {
    step: "০১",
    title: "ডোনার নিবন্ধন",
    desc: "স্বেচ্ছাসেবী রক্তদাতারা নিজেদের রক্তের গ্রুপ ও এলাকার তথ্য দিয়ে সহজে যুক্ত হন।",
    icon: Users,
  },
  {
    step: "০২",
    title: "রক্তের গ্রুপ ও এলাকা অনুযায়ী ডোনার খোঁজা",
    desc: "প্রয়োজনীয় রক্তের গ্রুপ ও নির্দিষ্ট এলাকা নির্বাচন করে তাৎক্ষণিকভাবে সার্চ করুন।",
    icon: Search,
  },
  {
    step: "০৩",
    title: "ডোনারের সঙ্গে যোগাযোগ",
    desc: "উপলব্ধ ডোনারের প্রোফাইল দেখে কল বা মেসেজের মাধ্যমে দ্রুত ও সরাসরি যোগাযোগ করুন।",
    icon: PhoneCall,
  },
  {
    step: "০৪",
    title: "প্রয়োজনীয় যাচাই করে রক্তদান",
    desc: "উভয় পক্ষের পরিচয় ও শারীরিক সক্ষমতা নিশ্চিত করে নির্ধারিত স্বাস্থ্যকেন্দ্রে নিরাপদ রক্তদান সম্পন্ন করুন।",
    icon: Sparkles,
  },
];

export const journeyMilestones = [
  {
    phase: "পরিকল্পনা ও ভিত্তি",
    title: "উদ্যোগের সূচনা",
    desc: "আল ফাতিহ ইসলামিক পাঠাগার-এর তরফ থেকে ময়মনসিংহে জরুরি রক্তের সংকট লাঘবে একটি আধুনিক স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্কের পরিকল্পনা গ্রহণ।",
    status: "সম্পন্ন",
    isCompleted: true,
  },
  {
    phase: "বাস্তবায়ন ও প্রকাশ",
    title: "RoktoFinder প্ল্যাটফর্ম সূচনা",
    desc: "ময়মনসিংহ অঞ্চলকে ভিত্তি করে সম্পূর্ণ ডিজিটাল ডোনার ডেটাবেজ, দ্রুত সার্চ ব্যবস্থা এবং মোবাইল-ফ্রেন্ডলি ওয়েব ইন্টারফেস সফলভাবে চালু।",
    status: "সক্রিয়",
    isCompleted: true,
  },
  {
    phase: "ভবিষ্যৎ রূপকল্প",
    title: "সারা বাংলাদেশে সম্প্রসারণ",
    desc: "ময়মনসিংহের সাফল্য ও অভিজ্ঞতার ওপর ভিত্তি করে পর্যায়ক্রমে দেশের প্রতিটি জেলা ও উপজেলায় স্বেচ্ছাসেবী রক্তদাতাদের এক সুতোয় বাঁধার লক্ষ্য।",
    status: "আসন্ন রূপকল্প",
    isCompleted: false,
  },
];
