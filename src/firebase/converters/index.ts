/**
 * Project Nehemiah — Firestore Data Converters & Adapters
 * Type-safe converters for domain models with timestamp normalization and nested structure preservation.
 */

import {
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type DocumentData,
  serverTimestamp,
} from 'firebase/firestore';
import { normalizeTimestamp } from './timestamp';
import type { Sermon } from '../../types/sermon';
import type { EventItem } from '../../types/event';
import type { Ministry } from '../../types/ministry';
import type { ChurchLocation } from '../../types/church';
import type { LeadershipMember, ContentStatus } from '../../types/about';
import type { SiteSettings } from '../../types';
import type { ManagedPageRecord, UserAccountRecord, GovernanceQueueItem } from '../../types/admin';
import type { MediaAssetRecord, MediaSourceType, MediaAssetType } from '../../types/media';

// =============================
// SERMON CONVERTER
// =============================
export const sermonConverter: FirestoreDataConverter<Sermon> = {
  toFirestore(sermon: Sermon): DocumentData {
    const { id, ...data } = sermon;
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Sermon {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      slug: data.slug || snapshot.id,
      title: data.title || 'Untitled Sermon',
      subtitle: data.subtitle,
      description: data.description || '',
      speaker: data.speaker || 'Church Pastor',
      speakerId: data.speakerId,
      speakerRole: data.speakerRole,
      series: data.series || 'Sunday Teaching',
      seriesId: data.seriesId,
      scripture: data.scripture || { reference: data.scriptureReference || 'Holy Bible' },
      scriptureReference: data.scriptureReference,
      date: normalizeTimestamp(data.date),
      duration: data.duration || '0 min',
      thumbnailUrl: data.thumbnailUrl || '',
      thumbnailAlt: data.thumbnailAlt,
      videoUrl: data.videoUrl,
      videoProvider: data.videoProvider || 'youtube',
      audioUrl: data.audioUrl,
      notesUrl: data.notesUrl,
      notesContent: data.notesContent,
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: data.category || 'Sunday Service',
      featured: Boolean(data.featured),
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
      status: (data.status as ContentStatus) || 'published',
      meta: data.meta ? {
        status: data.meta.status || data.status || 'published',
        verifiedAt: normalizeTimestamp(data.meta.verifiedAt),
        verifiedBy: data.meta.verifiedBy,
        notes: data.meta.notes,
      } : undefined,
    };
  },
};

// =============================
// EVENT CONVERTER
// =============================
export const eventConverter: FirestoreDataConverter<EventItem> = {
  toFirestore(event: EventItem): DocumentData {
    const { id, ...data } = event;
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): EventItem {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      slug: data.slug || snapshot.id,
      title: data.title || 'Church Gathering',
      shortDescription: data.shortDescription,
      description: data.description || '',
      category: data.category || 'Special Event',
      imageUrl: data.imageUrl || '',
      imageAlt: data.imageAlt,
      startDate: normalizeTimestamp(data.startDate || data.date),
      date: data.date || normalizeTimestamp(data.startDate),
      endDate: data.endDate ? normalizeTimestamp(data.endDate) : undefined,
      startTime: data.startTime || data.time || '9:00 AM',
      time: data.time || data.startTime || '9:00 AM',
      endTime: data.endTime,
      allDay: Boolean(data.allDay),
      location: data.location || { name: 'Church Sanctuary', isOnline: false },
      organizer: data.organizer,
      contact: data.contact,
      registration: data.registration,
      registrationOpen: Boolean(data.registrationOpen),
      featured: Boolean(data.featured),
      recurring: Boolean(data.recurring),
      recurrenceRule: data.recurrenceRule,
      scripture: data.scripture,
      tags: Array.isArray(data.tags) ? data.tags : [],
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
      status: (data.status as ContentStatus) || 'published',
      meta: data.meta,
    };
  },
};

// =============================
// MINISTRY CONVERTER
// =============================
export const ministryConverter: FirestoreDataConverter<Ministry> = {
  toFirestore(ministry: Ministry): DocumentData {
    const { id, ...data } = ministry;
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Ministry {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      slug: data.slug || snapshot.id,
      name: data.name || 'Ministry Department',
      shortName: data.shortName,
      tagline: data.tagline,
      category: data.category || 'General',
      description: data.description || '',
      shortDescription: data.shortDescription,
      imageUrl: data.imageUrl,
      imageAlt: data.imageAlt,
      iconName: data.iconName || 'Users',
      scripture: data.scripture,
      leader: data.leader,
      leaderRole: data.leaderRole,
      meetingSchedule: data.meetingSchedule,
      meetingTime: data.meetingTime,
      ageGroup: data.ageGroup,
      contact: data.contact,
      socialLinks: data.socialLinks,
      featured: Boolean(data.featured),
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
      status: (data.status as ContentStatus) || 'published',
      meta: data.meta,
    };
  },
};

// =============================
// CHURCH LOCATION CONVERTER
// =============================
export const churchConverter: FirestoreDataConverter<ChurchLocation> = {
  toFirestore(church: ChurchLocation): DocumentData {
    const { id, ...data } = church;
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): ChurchLocation {
    const data = snapshot.data(options);
    const status: ContentStatus = (data.status as ContentStatus) || 'pending_verification';

    return {
      id: snapshot.id,
      slug: data.slug || snapshot.id,
      name: data.name || 'Church Location',
      shortName: data.shortName || data.name || 'COG Campus',
      city: data.city || 'Subic',
      municipality: data.municipality || 'Subic',
      province: data.province || 'Zambales',
      churchType: data.churchType || 'Local Campus',
      shortDescription: data.shortDescription || '',
      description: Array.isArray(data.description) ? data.description : [data.description || ''],
      address: data.address || {
        city: data.city || 'Subic',
        province: data.province || 'Zambales',
        formattedAddress: 'Address pending verification',
        status: 'pending_verification',
      },
      contact: data.contact || {
        phone: 'Pending verification',
        email: 'Pending verification',
        officeHours: 'Pending verification',
        status: 'pending_verification',
      },
      leadership: data.leadership || {
        name: 'Pastoral Staff',
        role: 'Resident Pastor',
        title: 'Pastoral Office',
        bio: 'Pastoral leadership profile pending.',
        imageUrl: '',
        status: 'pending_verification',
      },
      services: Array.isArray(data.services) ? data.services : [],
      ministries: Array.isArray(data.ministries) ? data.ministries : [],
      socialLinks: data.socialLinks || {},
      location: data.location || null,
      images: data.images || {
        heroImage: { url: '', alt: 'Church sanctuary', status },
        thumbnailImage: { url: '', alt: 'Church campus', status },
      },
      featured: Boolean(data.featured),
      isMainBranch: Boolean(data.isMainBranch || data.isSubicMain),
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
      status,
      meta: data.meta,
    };
  },
};

// =============================
// LEADERSHIP CONVERTER
// =============================
export const leadershipConverter: FirestoreDataConverter<LeadershipMember> = {
  toFirestore(leader: LeadershipMember): DocumentData {
    const { id, ...data } = leader;
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): LeadershipMember {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name || 'Ministry Leader',
      title: data.title || 'Pastoral Office',
      role: data.role || 'Leader',
      bio: data.bio || '',
      imageUrl: data.imageUrl || '',
      email: data.email,
      socialLinks: data.socialLinks,
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
      status: (data.status as ContentStatus) || 'published',
      meta: data.meta,
    };
  },
};

// =============================
// PAGE CONTENT CONVERTER
// =============================
export const pageConverter: FirestoreDataConverter<ManagedPageRecord> = {
  toFirestore(page: ManagedPageRecord): DocumentData {
    const { id, ...data } = page;
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): ManagedPageRecord {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      slug: data.slug || snapshot.id,
      title: data.title || 'Page',
      seoTitle: data.seoTitle || data.title || 'Page Title',
      metaDescription: data.metaDescription || '',
      lastModifiedAt: normalizeTimestamp(data.lastModifiedAt || data.updatedAt),
      lastModifiedBy: data.lastModifiedBy || 'System Admin',
      status: (data.status as ContentStatus) || 'published',
      verifiedAt: data.verifiedAt ? normalizeTimestamp(data.verifiedAt) : undefined,
      verifiedBy: data.verifiedBy,
      notes: data.notes,
    };
  },
};

// =============================
// SITE SETTINGS CONVERTER
// =============================
export const siteSettingsConverter: FirestoreDataConverter<SiteSettings> = {
  toFirestore(settings: SiteSettings): DocumentData {
    return {
      ...settings,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): SiteSettings {
    const data = snapshot.data(options);
    return {
      churchName: data.churchName || 'Church of God – Subic',
      tagline: data.tagline || 'Exalting Christ, Equipping Believers, Empowering Communities',
      logoUrl: data.logoUrl,
      brand: data.brand || {
        primaryLogo: '/assets/brand/subic-cog-brand-logo.png',
        logoAltText: 'Church of God – Subic official logo',
      },
      mission: data.mission || '',
      vision: data.vision || '',
      values: Array.isArray(data.values) ? data.values : [],
      contact: data.contact || {
        address: 'Subic, Zambales, Philippines',
        city: 'Subic',
        phone: '',
        email: '',
        serviceTimes: [],
      },
      socialLinks: data.socialLinks || {},
    };
  },
};

// =============================
// USER ACCOUNT CONVERTER
// =============================
export const userConverter: FirestoreDataConverter<UserAccountRecord> = {
  toFirestore(user: UserAccountRecord): DocumentData {
    const { id, ...data } = user;
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): UserAccountRecord {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      displayName: data.displayName || data.name || 'Church Staff',
      email: data.email || '',
      role: data.role || 'READ_ONLY',
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
      assignedCampus: data.assignedCampus || 'Subic Main Campus',
      isActive: data.isActive !== false,
      lastLoginAt: normalizeTimestamp(data.lastLoginAt),
    };
  },
};

// =============================
// GOVERNANCE QUEUE CONVERTER
// =============================
export const governanceConverter: FirestoreDataConverter<GovernanceQueueItem> = {
  toFirestore(item: GovernanceQueueItem): DocumentData {
    const { id, ...data } = item;
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): GovernanceQueueItem {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      contentType: data.contentType || 'page',
      title: data.title || 'Untitled Submission',
      slug: data.slug || snapshot.id,
      currentStatus: (data.currentStatus as ContentStatus) || 'pending_verification',
      submittedBy: data.submittedBy || 'Unknown User',
      submittedAt: normalizeTimestamp(data.submittedAt || data.createdAt),
      verificationNotes: data.verificationNotes,
      verifiedBy: data.verifiedBy,
      verifiedAt: data.verifiedAt ? normalizeTimestamp(data.verifiedAt) : undefined,
    };
  },
};

// =============================
// MEDIA ASSET CONVERTER
// =============================
export const mediaConverter: FirestoreDataConverter<MediaAssetRecord> = {
  toFirestore(media: MediaAssetRecord): DocumentData {
    const { id, ...data } = media;
    return {
      ...data,
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): MediaAssetRecord {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      filename: data.filename || snapshot.id,
      title: data.title || data.filename || 'Media Asset',
      description: data.description || '',
      assetType: (data.assetType as MediaAssetType) || 'image',
      mimeType: data.mimeType || 'image/jpeg',
      extension: data.extension || 'jpg',
      sourceType: (data.sourceType as MediaSourceType) || 'public_url',
      url: data.url || data.publicPath || '',
      publicPath: data.publicPath,
      storagePath: data.storagePath,
      thumbnailUrl: data.thumbnailUrl,
      altText: data.altText || data.alt || '',
      alt: data.alt || data.altText || '',
      caption: data.caption,
      category: data.category || 'general',
      tags: Array.isArray(data.tags) ? data.tags : [],
      width: data.width,
      height: data.height,
      dimensions: data.dimensions,
      fileSize: data.fileSize,
      fileSizeBytes: data.fileSizeBytes,
      uploadedAt: normalizeTimestamp(data.uploadedAt || data.createdAt),
      uploadedBy: data.uploadedBy || 'Church Secretariat',
      updatedAt: data.updatedAt ? normalizeTimestamp(data.updatedAt) : undefined,
      status: (data.status as ContentStatus) || 'published',
      usageCount: typeof data.usageCount === 'number' ? data.usageCount : 0,
      usedBy: Array.isArray(data.usedBy) ? data.usedBy : [],
      isOfficialBrandAsset: Boolean(data.isOfficialBrandAsset),
      displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
      meta: data.meta,
    };
  },
};
