export interface CardData {
  name: string;
  bloodGroup: string;
  area: string;
  donorId: string;
  donationCount: number;
  qrDataUrl: string;
  theme: "light" | "dark";
  showName?: boolean;
  showArea?: boolean;
  variant?: "feed" | "story";
}
