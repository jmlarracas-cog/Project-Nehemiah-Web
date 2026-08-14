import { ContentStatus, ContentMeta } from './about';
import type { PrayerSubmissionStatus } from './prayer';

export type { PrayerSubmissionStatus };

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'EDITOR'
  | 'MEDIA_ADMIN'
  | 'PRAYER_ADMIN'
  | 'MINISTRY_EDITOR'
  | 'READ_ONLY';

export type AdminPermission =
  | 'manage_pages'
  | 'manage_ministries'
  | 'manage_sermons'
  | 'manage_events'
  | 'manage_churches'
  | 'manage_leadership'
  | 'view_prayer_requests'
  | 'manage_prayer_requests'
  | 'view_contact_inquiries'
  | 'manage_media'
  | 'manage_settings'
  | 'manage_branding'
  | 'manage_users'
  | 'publish_content';

export type PermissionKey = AdminPermission | string;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface UserAccountRecord {
  id: string;
  displayName: string;
  email: string;
  role: AdminRole;
  permissions: PermissionKey[];
  assignedCampus: string;
  isActive: boolean;
  lastLoginAt: string;
}

export interface AdminRoleInfo {
  role: AdminRole;
  title: string;
  description: string;
  permissions: AdminPermission[];
}

export interface PrayerSubmissionRecord {
  id: string;
  referenceId: string;
  name: string;
  email?: string;
  phone?: string;
  request: string;
  category: string;
  isAnonymous: boolean;
  contactPreference: 'email' | 'phone' | 'none';
  createdAt: string;
  status: PrayerSubmissionStatus;
  assignedTo?: string;
  internalNotes?: string;
}

export type ContactInquiryStatus = 'new' | 'in_progress' | 'responded' | 'archived';

export interface ContactInquiryRecord {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  createdAt: string;
  status: ContactInquiryStatus;
  assignedTo?: string;
  internalNotes?: string;
}

import type { MediaAssetRecord, MediaSourceType, MediaAssetType } from './media';
export type { MediaAssetRecord, MediaSourceType, MediaAssetType };

export interface ManagedPageRecord {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
  status: ContentStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface GovernanceQueueItem {
  id: string;
  contentType: 'page' | 'ministry' | 'sermon' | 'event' | 'church' | 'leadership';
  title: string;
  slug: string;
  currentStatus: ContentStatus;
  submittedBy: string;
  submittedAt: string;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface AdminDashboardMetrics {
  totalPublished: number;
  totalDrafts: number;
  totalPendingVerification: number;
  totalSermons: number;
  totalEvents: number;
  totalMinistries: number;
  totalChurches: number;
  newPrayerRequests: number;
  newContactInquiries: number;
  totalMediaAssets: number;
}
