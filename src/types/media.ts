import type { ContentStatus, ContentMeta } from './about';

export type MediaSourceType = 'local' | 'public_url' | 'external_url' | 'firebase_storage';

export type MediaAssetType =
  | 'image'
  | 'logo'
  | 'sermon_thumbnail'
  | 'event_graphic'
  | 'ministry_image'
  | 'leadership_photo'
  | 'church_photo'
  | 'hero_image'
  | 'social_share_image'
  | 'document'
  | 'audio_reference'
  | 'video_reference'
  | 'other';

export interface MediaAssetRecord {
  id: string;
  name?: string;
  filename: string;
  title: string;
  description?: string;
  assetType: MediaAssetType;
  mimeType: string;
  extension: string;
  sourceType: MediaSourceType;
  url: string;
  publicPath?: string;
  storagePath?: string;
  thumbnailUrl?: string;
  altText: string;
  alt?: string;
  caption?: string;
  category: string;
  tags?: string[];
  width?: number;
  height?: number;
  dimensions?: string;
  fileSize?: string;
  fileSizeBytes?: number;
  uploadedAt: string;
  uploadedBy: string;
  updatedAt?: string;
  status: ContentStatus;
  usageCount?: number;
  usedBy?: string[];
  isOfficialBrandAsset?: boolean;
  displayOrder?: number;
  meta?: ContentMeta;
}

export interface IAssetStorageProvider {
  upload(file: File, path: string): Promise<{ storagePath: string; downloadUrl: string }>;
  delete(storagePath: string): Promise<void>;
  getDownloadUrl(storagePath: string): Promise<string>;
}
