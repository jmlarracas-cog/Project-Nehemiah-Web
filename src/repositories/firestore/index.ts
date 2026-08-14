/**
 * Project Nehemiah — Firestore Repository Adapters
 * Production repositories executing Firestore queries with type-safe converters and status filtering.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit as limitQuery,
  serverTimestamp,
  type QueryConstraint,
} from 'firebase/firestore';

import { db, isFirebaseConfigured } from '../../firebase/firebase';
import { FIRESTORE_COLLECTIONS } from '../../firebase/types';
import { normalizeFirebaseError, OperationType } from '../../firebase/errors';
import {
  sermonConverter,
  eventConverter,
  ministryConverter,
  churchConverter,
  leadershipConverter,
  pageConverter,
  siteSettingsConverter,
  userConverter,
  governanceConverter,
  mediaConverter,
} from '../../firebase/converters';

import type {
  ISermonRepository,
  IEventRepository,
  IMinistryRepository,
  IChurchRepository,
  ILeadershipRepository,
  IPageRepository,
  ISiteSettingsRepository,
  INavigationRepository,
  IUserRepository,
  IGovernanceRepository,
  IMediaRepository,
  NavigationRecord,
} from '../types';
import type { MediaAssetRecord, MediaSourceType, MediaAssetType } from '../../types/media';

import type { Sermon, SermonFilterOptions } from '../../types/sermon';
import type { EventItem } from '../../types/event';
import type { Ministry } from '../../types/ministry';
import type { ChurchLocation } from '../../types/church';
import type { LeadershipMember, ContentStatus } from '../../types/about';
import type { SiteSettings } from '../../types';
import type { ManagedPageRecord, UserAccountRecord, GovernanceQueueItem } from '../../types/admin';

function assertDbAvailable() {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firestore is not configured. Please check VITE_FIREBASE_PROJECT_ID environment variable.');
  }
}

// =============================
// FIRESTORE SERMON REPOSITORY
// =============================
export class FirestoreSermonRepository implements ISermonRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, FIRESTORE_COLLECTIONS.SERMONS).withConverter(sermonConverter);
  }

  async getById(id: string): Promise<Sermon | null> {
    try {
      const docRef = doc(this.colRef, id);
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.SERMONS}/${id}`);
    }
  }

  async getBySlug(slug: string): Promise<Sermon | null> {
    try {
      const q = query(this.colRef, where('slug', '==', slug), limitQuery(1));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].data();
      return this.getById(slug);
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.SERMONS}/slug/${slug}`);
    }
  }

  async list(options?: SermonFilterOptions & { status?: ContentStatus; limit?: number }): Promise<Sermon[]> {
    try {
      const constraints: QueryConstraint[] = [];
      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }
      if (options?.category && options.category !== 'All Categories') {
        constraints.push(where('category', '==', options.category));
      }
      if (options?.featuredOnly) {
        constraints.push(where('featured', '==', true));
      }
      if (options?.limit && options.limit > 0) {
        constraints.push(limitQuery(options.limit));
      }

      const q = query(this.colRef, ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.SERMONS);
    }
  }

  async listPublished(options?: SermonFilterOptions & { limit?: number }): Promise<Sermon[]> {
    return this.list({ ...options, status: 'published' });
  }

  async getFeatured(): Promise<Sermon | null> {
    const list = await this.list({ status: 'published', featuredOnly: true, limit: 1 });
    return list[0] || null;
  }

  async create(data: Omit<Sermon, 'id'>): Promise<Sermon> {
    try {
      const docRef = await addDoc(this.colRef, {
        ...data,
        status: data.status || 'draft',
      } as Sermon);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.CREATE, FIRESTORE_COLLECTIONS.SERMONS);
    }
  }

  async update(id: string, data: Partial<Sermon>): Promise<Sermon> {
    try {
      const docRef = doc(this.colRef, id);
      const existing = await getDoc(docRef);
      if (!existing.exists()) throw new Error(`Sermon '${id}' not found`);
      const updated = { ...existing.data(), ...data };
      await setDoc(docRef, updated as Sermon);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.SERMONS}/${id}`);
    }
  }

  async archive(id: string): Promise<void> {
    await this.update(id, { status: 'archived' });
  }
}

// =============================
// FIRESTORE EVENT REPOSITORY
// =============================
export class FirestoreEventRepository implements IEventRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, FIRESTORE_COLLECTIONS.EVENTS).withConverter(eventConverter);
  }

  async getById(id: string): Promise<EventItem | null> {
    try {
      const docRef = doc(this.colRef, id);
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.EVENTS}/${id}`);
    }
  }

  async getBySlug(slug: string): Promise<EventItem | null> {
    try {
      const q = query(this.colRef, where('slug', '==', slug), limitQuery(1));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].data();
      return this.getById(slug);
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.EVENTS}/slug/${slug}`);
    }
  }

  async list(options?: { status?: ContentStatus; category?: string; limit?: number }): Promise<EventItem[]> {
    try {
      const constraints: QueryConstraint[] = [];
      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }
      if (options?.category) {
        constraints.push(where('category', '==', options.category));
      }
      if (options?.limit && options.limit > 0) {
        constraints.push(limitQuery(options.limit));
      }

      const q = query(this.colRef, ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.EVENTS);
    }
  }

  async listPublished(options?: { category?: string; upcomingOnly?: boolean; limit?: number }): Promise<EventItem[]> {
    let events = await this.list({ category: options?.category, status: 'published', limit: options?.limit });
    if (options?.upcomingOnly) {
      const today = new Date().toISOString().split('T')[0];
      events = events.filter((e) => (e.startDate || e.date || '9999-12-31') >= today);
    }
    return events;
  }

  async getFeatured(): Promise<EventItem | null> {
    try {
      const q = query(this.colRef, where('status', '==', 'published'), where('featured', '==', true), limitQuery(1));
      const snap = await getDocs(q);
      return !snap.empty ? snap.docs[0].data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.EVENTS}/featured`);
    }
  }

  async create(data: Omit<EventItem, 'id'>): Promise<EventItem> {
    try {
      const docRef = await addDoc(this.colRef, {
        ...data,
        status: data.status || 'draft',
      } as EventItem);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.CREATE, FIRESTORE_COLLECTIONS.EVENTS);
    }
  }

  async update(id: string, data: Partial<EventItem>): Promise<EventItem> {
    try {
      const docRef = doc(this.colRef, id);
      const existing = await getDoc(docRef);
      if (!existing.exists()) throw new Error(`Event '${id}' not found`);
      const updated = { ...existing.data(), ...data };
      await setDoc(docRef, updated as EventItem);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.EVENTS}/${id}`);
    }
  }

  async archive(id: string): Promise<void> {
    await this.update(id, { status: 'archived' });
  }
}

// =============================
// FIRESTORE MINISTRY REPOSITORY
// =============================
export class FirestoreMinistryRepository implements IMinistryRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, FIRESTORE_COLLECTIONS.MINISTRIES).withConverter(ministryConverter);
  }

  async getById(id: string): Promise<Ministry | null> {
    try {
      const docRef = doc(this.colRef, id);
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.MINISTRIES}/${id}`);
    }
  }

  async getBySlug(slug: string): Promise<Ministry | null> {
    try {
      const q = query(this.colRef, where('slug', '==', slug), limitQuery(1));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].data();
      return this.getById(slug);
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.MINISTRIES}/slug/${slug}`);
    }
  }

  async list(options?: { status?: ContentStatus; category?: string; limit?: number }): Promise<Ministry[]> {
    try {
      const constraints: QueryConstraint[] = [];
      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }
      if (options?.category) {
        constraints.push(where('category', '==', options.category));
      }
      if (options?.limit && options.limit > 0) {
        constraints.push(limitQuery(options.limit));
      }

      const q = query(this.colRef, ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.MINISTRIES);
    }
  }

  async listPublished(options?: { category?: string; limit?: number }): Promise<Ministry[]> {
    return this.list({ ...options, status: 'published' });
  }

  async getFeatured(): Promise<Ministry | null> {
    try {
      const q = query(this.colRef, where('status', '==', 'published'), where('featured', '==', true), limitQuery(1));
      const snap = await getDocs(q);
      return !snap.empty ? snap.docs[0].data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.MINISTRIES}/featured`);
    }
  }

  async create(data: Omit<Ministry, 'id'>): Promise<Ministry> {
    try {
      const docRef = await addDoc(this.colRef, {
        ...data,
        status: data.status || 'draft',
      } as Ministry);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.CREATE, FIRESTORE_COLLECTIONS.MINISTRIES);
    }
  }

  async update(id: string, data: Partial<Ministry>): Promise<Ministry> {
    try {
      const docRef = doc(this.colRef, id);
      const existing = await getDoc(docRef);
      if (!existing.exists()) throw new Error(`Ministry '${id}' not found`);
      const updated = { ...existing.data(), ...data };
      await setDoc(docRef, updated as Ministry);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.MINISTRIES}/${id}`);
    }
  }

  async archive(id: string): Promise<void> {
    await this.update(id, { status: 'archived' });
  }
}

// =============================
// FIRESTORE CHURCH REPOSITORY
// =============================
export class FirestoreChurchRepository implements IChurchRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, FIRESTORE_COLLECTIONS.CHURCHES).withConverter(churchConverter);
  }

  async getById(id: string): Promise<ChurchLocation | null> {
    try {
      const docRef = doc(this.colRef, id);
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.CHURCHES}/${id}`);
    }
  }

  async getBySlug(slug: string): Promise<ChurchLocation | null> {
    try {
      const q = query(this.colRef, where('slug', '==', slug), limitQuery(1));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].data();
      return this.getById(slug);
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.CHURCHES}/slug/${slug}`);
    }
  }

  async list(options?: { status?: ContentStatus; isSubicMain?: boolean; province?: string; limit?: number }): Promise<ChurchLocation[]> {
    try {
      const constraints: QueryConstraint[] = [];
      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }
      if (options?.isSubicMain !== undefined) {
        constraints.push(where('isMainBranch', '==', options.isSubicMain));
      }
      if (options?.province) {
        constraints.push(where('province', '==', options.province));
      }
      if (options?.limit && options.limit > 0) {
        constraints.push(limitQuery(options.limit));
      }

      const q = query(this.colRef, ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.CHURCHES);
    }
  }

  async listPublished(options?: { province?: string; limit?: number }): Promise<ChurchLocation[]> {
    return this.list({ ...options, status: 'published' });
  }

  async create(data: Omit<ChurchLocation, 'id'>): Promise<ChurchLocation> {
    try {
      const docRef = await addDoc(this.colRef, {
        ...data,
        status: data.status || 'pending_verification',
      } as ChurchLocation);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.CREATE, FIRESTORE_COLLECTIONS.CHURCHES);
    }
  }

  async update(id: string, data: Partial<ChurchLocation>): Promise<ChurchLocation> {
    try {
      const docRef = doc(this.colRef, id);
      const existing = await getDoc(docRef);
      if (!existing.exists()) throw new Error(`Church '${id}' not found`);
      const updated = { ...existing.data(), ...data };
      await setDoc(docRef, updated as ChurchLocation);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.CHURCHES}/${id}`);
    }
  }

  async archive(id: string): Promise<void> {
    await this.update(id, { status: 'archived' });
  }
}

// =============================
// FIRESTORE LEADERSHIP REPOSITORY
// =============================
export class FirestoreLeadershipRepository implements ILeadershipRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, FIRESTORE_COLLECTIONS.LEADERS).withConverter(leadershipConverter);
  }

  async getById(id: string): Promise<LeadershipMember | null> {
    try {
      const docRef = doc(this.colRef, id);
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.LEADERS}/${id}`);
    }
  }

  async list(options?: { status?: ContentStatus; limit?: number }): Promise<LeadershipMember[]> {
    try {
      const constraints: QueryConstraint[] = [orderBy('displayOrder', 'asc')];
      if (options?.status) {
        constraints.unshift(where('status', '==', options.status));
      }
      if (options?.limit && options.limit > 0) {
        constraints.push(limitQuery(options.limit));
      }

      const q = query(this.colRef, ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.LEADERS);
    }
  }

  async listPublished(): Promise<LeadershipMember[]> {
    return this.list({ status: 'published' });
  }

  async create(data: Omit<LeadershipMember, 'id'>): Promise<LeadershipMember> {
    try {
      const docRef = await addDoc(this.colRef, {
        ...data,
        status: data.status || 'draft',
      } as LeadershipMember);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.CREATE, FIRESTORE_COLLECTIONS.LEADERS);
    }
  }

  async update(id: string, data: Partial<LeadershipMember>): Promise<LeadershipMember> {
    try {
      const docRef = doc(this.colRef, id);
      const existing = await getDoc(docRef);
      if (!existing.exists()) throw new Error(`Leader '${id}' not found`);
      const updated = { ...existing.data(), ...data };
      await setDoc(docRef, updated as LeadershipMember);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.LEADERS}/${id}`);
    }
  }
}

// =============================
// FIRESTORE PAGE REPOSITORY
// =============================
export class FirestorePageRepository implements IPageRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, FIRESTORE_COLLECTIONS.PAGES).withConverter(pageConverter);
  }

  async getBySlug(slug: string): Promise<ManagedPageRecord | null> {
    try {
      const docRef = doc(this.colRef, slug);
      const snap = await getDoc(docRef);
      if (snap.exists()) return snap.data();

      const q = query(this.colRef, where('slug', '==', slug), limitQuery(1));
      const querySnap = await getDocs(q);
      return !querySnap.empty ? querySnap.docs[0].data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.PAGES}/${slug}`);
    }
  }

  async list(): Promise<ManagedPageRecord[]> {
    try {
      const snap = await getDocs(this.colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.PAGES);
    }
  }

  async update(slug: string, data: Partial<ManagedPageRecord>): Promise<ManagedPageRecord> {
    try {
      const docRef = doc(this.colRef, slug);
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        const updated = { ...existing.data(), ...data, lastModifiedAt: new Date().toISOString() };
        await setDoc(docRef, updated as ManagedPageRecord);
      } else {
        await setDoc(docRef, {
          id: slug,
          slug,
          title: data.title || 'Managed Page',
          seoTitle: data.seoTitle || data.title || 'Managed Page',
          metaDescription: data.metaDescription || '',
          lastModifiedAt: new Date().toISOString(),
          lastModifiedBy: data.lastModifiedBy || 'Admin',
          status: data.status || 'published',
          ...data,
        } as ManagedPageRecord);
      }
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.PAGES}/${slug}`);
    }
  }
}

// =============================
// FIRESTORE SITE SETTINGS REPOSITORY
// =============================
export class FirestoreSiteSettingsRepository implements ISiteSettingsRepository {
  private get globalDocRef() {
    assertDbAvailable();
    return doc(db!, FIRESTORE_COLLECTIONS.SITE_SETTINGS, 'global').withConverter(siteSettingsConverter);
  }

  async getGlobalSettings(): Promise<SiteSettings | null> {
    try {
      const snap = await getDoc(this.globalDocRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.SITE_SETTINGS}/global`);
    }
  }

  async updateGlobalSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    try {
      const snapBefore = await getDoc(this.globalDocRef);
      const existing = snapBefore.exists() ? snapBefore.data() : {
        churchName: 'Church of God – Subic',
        tagline: 'Exalting Christ, Equipping Believers, Empowering Communities',
        brand: { primaryLogo: '/assets/brand/subic-cog-brand-logo.png', logoAltText: 'Church of God – Subic official logo' },
        mission: '',
        vision: '',
        values: [],
        contact: { address: '', city: 'Subic', phone: '', email: '', serviceTimes: [] },
        socialLinks: {},
      };
      const merged = { ...existing, ...settings };
      await setDoc(this.globalDocRef, merged as SiteSettings);
      const snap = await getDoc(this.globalDocRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.SITE_SETTINGS}/global`);
    }
  }
}

// =============================
// FIRESTORE NAVIGATION REPOSITORY
// =============================
export class FirestoreNavigationRepository implements INavigationRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, FIRESTORE_COLLECTIONS.NAVIGATION);
  }

  async listNavItems(options?: { status?: ContentStatus }): Promise<NavigationRecord[]> {
    try {
      const constraints: QueryConstraint[] = [orderBy('displayOrder', 'asc')];
      if (options?.status) {
        constraints.unshift(where('status', '==', options.status));
      }
      const q = query(this.colRef, ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as NavigationRecord);
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.NAVIGATION);
    }
  }

  async updateNavItem(id: string, item: Partial<NavigationRecord>): Promise<NavigationRecord> {
    try {
      const docRef = doc(this.colRef, id);
      await setDoc(docRef, { ...item, updatedAt: serverTimestamp() }, { merge: true });
      const snap = await getDoc(docRef);
      return { id: snap.id, ...snap.data() } as NavigationRecord;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.NAVIGATION}/${id}`);
    }
  }
}

// =============================
// FIRESTORE USER REPOSITORY
// =============================
export class FirestoreUserRepository implements IUserRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, FIRESTORE_COLLECTIONS.USERS).withConverter(userConverter);
  }

  async getByUid(uid: string): Promise<UserAccountRecord | null> {
    try {
      const docRef = doc(this.colRef, uid);
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.USERS}/${uid}`);
    }
  }

  async list(): Promise<UserAccountRecord[]> {
    try {
      const snap = await getDocs(this.colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.USERS);
    }
  }

  async create(user: UserAccountRecord): Promise<UserAccountRecord> {
    try {
      const docRef = doc(this.colRef, user.id);
      await setDoc(docRef, user);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.CREATE, FIRESTORE_COLLECTIONS.USERS);
    }
  }

  async update(uid: string, user: Partial<UserAccountRecord>): Promise<UserAccountRecord> {
    try {
      const docRef = doc(this.colRef, uid);
      const existing = await getDoc(docRef);
      if (!existing.exists()) throw new Error(`User '${uid}' not found`);
      const updated = { ...existing.data(), ...user };
      await setDoc(docRef, updated as UserAccountRecord);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.USERS}/${uid}`);
    }
  }
}

// =============================
// FIRESTORE GOVERNANCE REPOSITORY
// =============================
export class FirestoreGovernanceRepository implements IGovernanceRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, FIRESTORE_COLLECTIONS.GOVERNANCE_QUEUE).withConverter(governanceConverter);
  }

  async listPendingItems(): Promise<GovernanceQueueItem[]> {
    try {
      const q = query(this.colRef, where('currentStatus', '==', 'pending_verification'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.GOVERNANCE_QUEUE);
    }
  }

  async getById(id: string): Promise<GovernanceQueueItem | null> {
    try {
      const docRef = doc(this.colRef, id);
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.GOVERNANCE_QUEUE}/${id}`);
    }
  }

  async create(item: Omit<GovernanceQueueItem, 'id'>): Promise<GovernanceQueueItem> {
    try {
      const docRef = await addDoc(this.colRef, {
        ...item,
        currentStatus: item.currentStatus || 'pending_verification',
      } as GovernanceQueueItem);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.CREATE, FIRESTORE_COLLECTIONS.GOVERNANCE_QUEUE);
    }
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    verificationNotes?: string,
    verifiedBy?: string
  ): Promise<GovernanceQueueItem> {
    try {
      const docRef = doc(this.colRef, id);
      const existing = await getDoc(docRef);
      if (!existing.exists()) throw new Error(`Governance item '${id}' not found`);
      const updated = {
        ...existing.data(),
        currentStatus: status,
        verificationNotes,
        verifiedBy,
        verifiedAt: new Date().toISOString(),
      };
      await setDoc(docRef, updated as GovernanceQueueItem);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.GOVERNANCE_QUEUE}/${id}`);
    }
  }
}

// =============================
// FIRESTORE MEDIA REPOSITORY
// =============================
export class FirestoreMediaRepository implements IMediaRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, FIRESTORE_COLLECTIONS.MEDIA).withConverter(mediaConverter);
  }

  async list(options?: {
    category?: string;
    assetType?: MediaAssetType;
    status?: ContentStatus;
    sourceType?: MediaSourceType;
    limit?: number;
  }): Promise<MediaAssetRecord[]> {
    try {
      const constraints: QueryConstraint[] = [];
      if (options?.category && options.category !== 'all') {
        constraints.push(where('category', '==', options.category));
      }
      if (options?.assetType) {
        constraints.push(where('assetType', '==', options.assetType));
      }
      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }
      if (options?.sourceType) {
        constraints.push(where('sourceType', '==', options.sourceType));
      }
      if (options?.limit && options.limit > 0) {
        constraints.push(limitQuery(options.limit));
      }

      const q = query(this.colRef, ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.MEDIA);
    }
  }

  async getById(id: string): Promise<MediaAssetRecord | null> {
    try {
      const docRef = doc(this.colRef, id);
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.MEDIA}/${id}`);
    }
  }

  async search(queryStr: string): Promise<MediaAssetRecord[]> {
    const all = await this.list();
    if (!queryStr || queryStr.trim() === '') return all;
    const q = queryStr.toLowerCase().trim();
    return all.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.filename.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.altText.toLowerCase().includes(q) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  async createMetadata(data: Omit<MediaAssetRecord, 'id'>): Promise<MediaAssetRecord> {
    try {
      const docRef = await addDoc(this.colRef, {
        ...data,
        uploadedAt: data.uploadedAt || new Date().toISOString().slice(0, 10),
        status: data.status || 'published',
      } as MediaAssetRecord);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.CREATE, FIRESTORE_COLLECTIONS.MEDIA);
    }
  }

  async updateMetadata(id: string, data: Partial<MediaAssetRecord>): Promise<MediaAssetRecord> {
    try {
      const docRef = doc(this.colRef, id);
      const existing = await getDoc(docRef);
      if (!existing.exists()) throw new Error(`Media asset '${id}' not found`);
      const updated = { ...existing.data(), ...data, updatedAt: new Date().toISOString().slice(0, 10) };
      await setDoc(docRef, updated as MediaAssetRecord);
      const snap = await getDoc(docRef);
      return snap.data()!;
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.MEDIA}/${id}`);
    }
  }

  async archive(id: string): Promise<void> {
    const existing = await this.getById(id);
    if (existing?.isOfficialBrandAsset) {
      throw new Error('Official brand assets cannot be archived.');
    }
    await this.updateMetadata(id, { status: 'archived' });
  }

  async getByCategory(category: string): Promise<MediaAssetRecord[]> {
    return this.list({ category });
  }

  async getOfficialBrandAssets(): Promise<MediaAssetRecord[]> {
    try {
      const q = query(this.colRef, where('isOfficialBrandAsset', '==', true));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, `${FIRESTORE_COLLECTIONS.MEDIA}/official`);
    }
  }
}
