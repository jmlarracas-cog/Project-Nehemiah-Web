import { ContentStatus, ContentMeta } from './about';

export interface ChurchAddress {
  street?: string;
  city: string;
  municipality?: string;
  province: string;
  postalCode?: string;
  landmark?: string;
  locationNote?: string;
  formattedAddress: string;
  status: ContentStatus;
  meta?: ContentMeta;
}

export interface ChurchContact {
  phone?: string;
  email?: string;
  contactPerson?: string;
  officeHours?: string;
  status: ContentStatus;
  meta?: ContentMeta;
}

export interface ChurchLeader {
  name: string;
  role: string;
  title?: string;
  bio?: string;
  imageUrl?: string;
  status: ContentStatus;
  meta?: ContentMeta;
}

export interface ChurchService {
  id: string;
  day: string;
  time: string;
  name: string;
  language?: string;
  description?: string;
  status: ContentStatus;
  meta?: ContentMeta;
}

export interface ChurchMinistrySummary {
  id: string;
  name: string;
  summary: string;
  status: ContentStatus;
}

export interface ChurchSocialLinks {
  facebook?: string;
  youtube?: string;
  youtubeTitle?: string;
  instagram?: string;
  status?: ContentStatus;
}

export interface ChurchLocationImage {
  url: string;
  alt: string;
  caption?: string;
  status: ContentStatus;
}

export interface ChurchLocationCoordinates {
  lat: number | null;
  lng: number | null;
  addressText: string;
  googleMapsUrl?: string;
  directionsUrl?: string;
  status: ContentStatus;
  meta?: ContentMeta;
}

export interface ChurchLocation {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  city: string;
  municipality?: string;
  province: string;
  churchType:
    | 'Established Church Location'
    | 'Confirmed Location'
    | 'Church Location'
    | 'Vision Area'
    | 'Main Campus'
    | 'Branch Church'
    | 'Planting Site'
    | 'Mission Station'
    | 'Candidate Location';
  shortDescription: string;
  description: string[];
  address: ChurchAddress;
  contact: ChurchContact;
  leadership: ChurchLeader;
  services: ChurchService[];
  ministries: ChurchMinistrySummary[];
  socialLinks: ChurchSocialLinks;
  location: ChurchLocationCoordinates | null;
  canonicalMapUrl?: string;
  isVisionArea?: boolean;
  images: {
    heroImage: ChurchLocationImage;
    thumbnailImage: ChurchLocationImage;
    galleryImages?: ChurchLocationImage[];
  };
  featured?: boolean;
  isMainBranch?: boolean;
  displayOrder: number;
  status: ContentStatus;
  meta?: ContentMeta;
}

export interface ChurchPageData {
  hero: {
    title: string;
    goldSubtitle?: string;
    subtitle: string;
    bgImage: string;
    imageAlt: string;
    status: ContentStatus;
    meta?: ContentMeta;
  };
  churches: ChurchLocation[];
  seo: {
    title: string;
    description: string;
  };
}
