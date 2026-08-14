/**
 * Project Nehemiah — Firebase Data & Collection Type Definitions
 * Unified type constants and collection path taxonomy for Firestore.
 */

// Firestore Collection Names Taxonomy
export const FIRESTORE_COLLECTIONS = {
  // Public / Published CMS Collections
  SITE_SETTINGS: 'site_settings',
  PAGES: 'pages',
  MINISTRIES: 'ministries',
  SERMONS: 'sermons',
  SERMON_SERIES: 'sermon_series',
  EVENTS: 'events',
  CHURCHES: 'churches',
  LEADERS: 'leaders',
  STATISTICS: 'statistics',
  SOCIAL_LINKS: 'social_links',
  NAVIGATION: 'navigation',
  MEDIA: 'media',
  USERS: 'users',

  // STRICTLY PRIVATE COLLECTIONS (Never exposed to public read rules)
  PRAYER_REQUESTS: 'prayer_requests',
  CONTACT_INQUIRIES: 'contact_inquiries',

  // Governance & System Collections
  AUDIT_LOGS: 'audit_logs',
  GOVERNANCE_QUEUE: 'governance_queue',
} as const;

export type FirestoreCollectionName = typeof FIRESTORE_COLLECTIONS[keyof typeof FIRESTORE_COLLECTIONS];

// Firebase Storage Asset Folders
export const STORAGE_FOLDERS = {
  LOGOS: 'logos',
  CHURCH_PHOTOS: 'church_photos',
  LEADERSHIP_PHOTOS: 'leadership_photos',
  SERMON_THUMBNAILS: 'sermon_thumbnails',
  EVENT_IMAGES: 'event_images',
  MINISTRY_IMAGES: 'ministry_images',
  DOCUMENTS: 'documents',
} as const;

export type StorageFolder = typeof STORAGE_FOLDERS[keyof typeof STORAGE_FOLDERS];

export interface FirebaseAdapterResult<T> {
  data: T | null;
  error: string | null;
  fromFallback: boolean;
}

// Standardized CMS Document Metadata for Firestore Serialization
export interface FirestoreCmsDocMeta {
  status: 'published' | 'draft' | 'pending_verification' | 'archived';
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  publishedAt?: string;
  publishedBy?: string;
  displayOrder?: number;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

