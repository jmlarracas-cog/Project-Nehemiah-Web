export interface BrandIdentityConfig {
  primaryLogo: string;
  lightLogo?: string;
  darkLogo?: string;
  compactLogo?: string;
  favicon?: string;
  logoAltText: string;
  displaySettings?: {
    headerLogoHeightDesktop?: string;
    headerLogoHeightMobile?: string;
    footerLogoHeight?: string;
    showBrandTextNextToLogo?: boolean;
    clearSpacePadding?: string;
  };
}

export interface SiteSettings {
  churchName: string;
  tagline: string;
  logoUrl?: string;
  brand: BrandIdentityConfig;
  mission: string;
  vision: string;
  values: string[];
  contact: {
    address: string;
    city: string;
    phone: string;
    email: string;
    serviceTimes: {
      day: string;
      time: string;
      name: string;
    }[];
    mapCoordinates?: { lat: number; lng: number };
  };
  socialLinks: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export interface NavigationItem {
  label: string;
  path: string;
  badge?: string;
}

export interface ImageAsset {
  id: string;
  url: string;
  alt: string;
  title?: string;
  category?: 'hero' | 'church' | 'worship' | 'leadership' | 'ministry' | 'sermon' | 'event' | 'community' | 'background' | 'logo';
}

export * from './church';
export * from './about';
export * from './event';
export * from './ministry';
export * from './sermon';
export * from './prayer';
export * from './contact';
export * from './search';
export * from './admin';


export interface ImpactStatistic {
  id: string;
  value: string;
  label: string;
  description: string;
  iconName: string;
}

export interface Leader {
  id: string;
  name: string;
  title: string;
  role: string;
  bio: string;
  imageUrl: string;
  email?: string;
}

export interface PrayerRequest {
  id: string;
  name: string;
  request: string;
  date: string;
  isAnonymous: boolean;
  prayerCount: number;
}
