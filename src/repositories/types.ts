/**
 * Project Nehemiah — Repository Domain Contracts
 * Abstract repository interfaces defining data access signatures for local and Firestore implementations.
 */

import type { Sermon, SermonFilterOptions } from '../types/sermon';
import type { EventItem } from '../types/event';
import type { Ministry } from '../types/ministry';
import type { ChurchLocation } from '../types/church';
import type { LeadershipMember, ContentStatus } from '../types/about';
import type { SiteSettings } from '../types';
import type { ManagedPageRecord, UserAccountRecord, GovernanceQueueItem } from '../types/admin';
import type { MediaAssetRecord, MediaSourceType, MediaAssetType } from '../types/media';

export interface IMediaRepository {
  list(options?: { category?: string; assetType?: MediaAssetType; status?: ContentStatus; sourceType?: MediaSourceType; limit?: number }): Promise<MediaAssetRecord[]>;
  getById(id: string): Promise<MediaAssetRecord | null>;
  search(query: string): Promise<MediaAssetRecord[]>;
  createMetadata(data: Omit<MediaAssetRecord, 'id'>): Promise<MediaAssetRecord>;
  updateMetadata(id: string, data: Partial<MediaAssetRecord>): Promise<MediaAssetRecord>;
  archive(id: string): Promise<void>;
  getByCategory(category: string): Promise<MediaAssetRecord[]>;
  getOfficialBrandAssets(): Promise<MediaAssetRecord[]>;
}

export interface ISermonRepository {
  getById(id: string): Promise<Sermon | null>;
  getBySlug(slug: string): Promise<Sermon | null>;
  list(options?: SermonFilterOptions & { status?: ContentStatus; limit?: number }): Promise<Sermon[]>;
  listPublished(options?: SermonFilterOptions & { limit?: number }): Promise<Sermon[]>;
  getFeatured(): Promise<Sermon | null>;
  create(data: Omit<Sermon, 'id'>): Promise<Sermon>;
  update(id: string, data: Partial<Sermon>): Promise<Sermon>;
  archive(id: string): Promise<void>;
}

export interface IEventRepository {
  getById(id: string): Promise<EventItem | null>;
  getBySlug(slug: string): Promise<EventItem | null>;
  list(options?: { status?: ContentStatus; category?: string; limit?: number }): Promise<EventItem[]>;
  listPublished(options?: { category?: string; upcomingOnly?: boolean; limit?: number }): Promise<EventItem[]>;
  getFeatured(): Promise<EventItem | null>;
  create(data: Omit<EventItem, 'id'>): Promise<EventItem>;
  update(id: string, data: Partial<EventItem>): Promise<EventItem>;
  archive(id: string): Promise<void>;
}

export interface IMinistryRepository {
  getById(id: string): Promise<Ministry | null>;
  getBySlug(slug: string): Promise<Ministry | null>;
  list(options?: { status?: ContentStatus; category?: string; limit?: number }): Promise<Ministry[]>;
  listPublished(options?: { category?: string; limit?: number }): Promise<Ministry[]>;
  getFeatured(): Promise<Ministry | null>;
  create(data: Omit<Ministry, 'id'>): Promise<Ministry>;
  update(id: string, data: Partial<Ministry>): Promise<Ministry>;
  archive(id: string): Promise<void>;
}

export interface IChurchRepository {
  getById(id: string): Promise<ChurchLocation | null>;
  getBySlug(slug: string): Promise<ChurchLocation | null>;
  list(options?: { status?: ContentStatus; isSubicMain?: boolean; province?: string; limit?: number }): Promise<ChurchLocation[]>;
  listPublished(options?: { province?: string; limit?: number }): Promise<ChurchLocation[]>;
  create(data: Omit<ChurchLocation, 'id'>): Promise<ChurchLocation>;
  update(id: string, data: Partial<ChurchLocation>): Promise<ChurchLocation>;
  archive(id: string): Promise<void>;
}

export interface ILeadershipRepository {
  getById(id: string): Promise<LeadershipMember | null>;
  list(options?: { status?: ContentStatus; limit?: number }): Promise<LeadershipMember[]>;
  listPublished(): Promise<LeadershipMember[]>;
  create(data: Omit<LeadershipMember, 'id'>): Promise<LeadershipMember>;
  update(id: string, data: Partial<LeadershipMember>): Promise<LeadershipMember>;
}

export interface IPageRepository {
  getBySlug(slug: string): Promise<ManagedPageRecord | null>;
  list(): Promise<ManagedPageRecord[]>;
  update(slug: string, data: Partial<ManagedPageRecord>): Promise<ManagedPageRecord>;
}

export interface ISiteSettingsRepository {
  getGlobalSettings(): Promise<SiteSettings | null>;
  updateGlobalSettings(settings: Partial<SiteSettings>): Promise<SiteSettings>;
}

export interface NavigationRecord {
  id: string;
  label: string;
  path: string;
  displayOrder: number;
  visibility: string;
  status: ContentStatus;
}

export interface INavigationRepository {
  listNavItems(options?: { status?: ContentStatus }): Promise<NavigationRecord[]>;
  updateNavItem(id: string, item: Partial<NavigationRecord>): Promise<NavigationRecord>;
}

export interface IUserRepository {
  getByUid(uid: string): Promise<UserAccountRecord | null>;
  list(): Promise<UserAccountRecord[]>;
  create(user: UserAccountRecord): Promise<UserAccountRecord>;
  update(uid: string, user: Partial<UserAccountRecord>): Promise<UserAccountRecord>;
}

export interface IGovernanceRepository {
  listPendingItems(): Promise<GovernanceQueueItem[]>;
  getById(id: string): Promise<GovernanceQueueItem | null>;
  create(item: Omit<GovernanceQueueItem, 'id'>): Promise<GovernanceQueueItem>;
  updateStatus(id: string, status: ContentStatus, verificationNotes?: string, verifiedBy?: string): Promise<GovernanceQueueItem>;
}
