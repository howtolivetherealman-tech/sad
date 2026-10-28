export type Language = 'te' | 'en';

export interface BilingualText {
  te: string;
  en: string;
}

export interface YouTubeVideoItem {
  id: string;
  videoId: string;
  url: string;
  title: BilingualText;
  description: BilingualText;
  addedAt: number; // timestamp in ms — higher appears 1st
}

export type ServiceCategory =
  | 'all'
  | 'relationship'
  | 'tantra'
  | 'vitality'
  | 'prosperity';

export interface ServiceItem {
  id: string;
  number: string;
  category: Exclude<ServiceCategory, 'all'>;
  title: BilingualText;
  description: BilingualText;
  remedyNote: BilingualText;
  imageUrl?: string;
}

export interface SacredProductItem {
  id: string;
  category: 'yantra' | 'puja' | 'herbal_kit';
  name: BilingualText;
  subtitle: BilingualText;
  description: BilingualText;
  benefits: BilingualText;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

export interface AyurvedicHerbItem {
  id: string;
  sanskritName: string;
  name: BilingualText;
  partUsed: BilingualText;
  properties: BilingualText;
  benefits: BilingualText;
  usageMethod: BilingualText;
  imageUrl: string;
}

export interface PreparationMethodItem {
  id: string;
  stepNumber: string;
  title: BilingualText;
  subtitle: BilingualText;
  ingredients: BilingualText;
  processSteps: {
    te: string[];
    en: string[];
  };
  dosageAndPrecautions: BilingualText;
  imageUrl?: string;
}

export interface PrivateAdItem {
  id: string;
  title: string;
  advertiserName: string;
  contactPhone: string;
  description: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  imageUrl: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: number;
}

export interface GoogleAdsConfig {
  enabled: boolean;
  adLinkUrl: string;
  adsenseClientId?: string;
  adsenseMetaTag?: string;
  adScriptOrCode: string;
  headline: BilingualText;
  subtext: BilingualText;
  ctaLabel: BilingualText;
  bannerImageUrl?: string;
}

export interface ConsultationBooking {
  id: string;
  name: string;
  phone: string;
  problemCategory: string;
  message: string;
  createdAt: number;
}

export interface AppStoreData {
  logoUrl: string;
  channelUrl: string;
  contactPhone: string;
  practitionerName: BilingualText;
  centerName: BilingualText;
  videos: YouTubeVideoItem[];
  services: ServiceItem[];
  products: SacredProductItem[];
  herbs: AyurvedicHerbItem[];
  preparations: PreparationMethodItem[];
  privateAds: PrivateAdItem[];
  googleAds: GoogleAdsConfig;
  bookings: ConsultationBooking[];
}
