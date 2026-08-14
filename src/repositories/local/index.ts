/**
 * Project Nehemiah — Local Demo Repository Adapters
 * Fallback repositories using static local datasets and mock memory state for offline/development mode.
 */

import { sermonData } from '../../data/sermonData';
import { eventData } from '../../data/eventData';
import { ministriesPageData } from '../../data/ministryData';
import { churchLocationsData } from '../../data/churchData';
import { aboutPageData } from '../../data/aboutData';
import { officialBrandConfig } from '../../config/brand';
import { adminService } from '../../services/adminService';

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

// Memory caches for mutated demo data
let localSermons: Sermon[] = [...sermonData.sermons];
let localEvents: EventItem[] = [...eventData.events];
let localMinistries: Ministry[] = [...ministriesPageData.ministries];
let localChurches: ChurchLocation[] = [...churchLocationsData];
let localLeaders: LeadershipMember[] = [...aboutPageData.leadership];

let localNavItems: NavigationRecord[] = [
  { id: 'nav-home', label: 'Home', path: '/', displayOrder: 1, visibility: 'public', status: 'published' },
  { id: 'nav-about', label: 'About', path: '/about', displayOrder: 2, visibility: 'public', status: 'published' },
  { id: 'nav-ministries', label: 'Ministries', path: '/ministries', displayOrder: 3, visibility: 'public', status: 'published' },
  { id: 'nav-sermons', label: 'Sermons', path: '/sermons', displayOrder: 4, visibility: 'public', status: 'published' },
  { id: 'nav-events', label: 'Events', path: '/events', displayOrder: 5, visibility: 'public', status: 'published' },
  { id: 'nav-churches', label: 'Churches', path: '/churches', displayOrder: 6, visibility: 'public', status: 'published' },
  { id: 'nav-contact', label: 'Contact', path: '/contact', displayOrder: 7, visibility: 'public', status: 'published' },
];

// =============================
// LOCAL SERMON REPOSITORY
// =============================
export class LocalSermonRepository implements ISermonRepository {
  async getById(id: string): Promise<Sermon | null> {
    return localSermons.find((s) => s.id === id) || null;
  }

  async getBySlug(slug: string): Promise<Sermon | null> {
    return localSermons.find((s) => s.slug === slug || s.id === slug) || null;
  }

  async list(options?: SermonFilterOptions & { status?: ContentStatus; limit?: number }): Promise<Sermon[]> {
    let result = [...localSermons];
    if (options?.status) {
      result = result.filter((s) => (s.status || 'published') === options.status);
    }
    if (options?.category && options.category !== 'All Categories') {
      result = result.filter((s) => s.category === options.category);
    }
    if (options?.featuredOnly) {
      result = result.filter((s) => s.featured);
    }
    if (options?.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  async listPublished(options?: SermonFilterOptions & { limit?: number }): Promise<Sermon[]> {
    return this.list({ ...options, status: 'published' });
  }

  async getFeatured(): Promise<Sermon | null> {
    return localSermons.find((s) => s.featured) || localSermons[0] || null;
  }

  async create(data: Omit<Sermon, 'id'>): Promise<Sermon> {
    const newSermon: Sermon = {
      ...data,
      id: `sermon-local-${Date.now()}`,
      status: data.status || 'draft',
    };
    localSermons.unshift(newSermon);
    return newSermon;
  }

  async update(id: string, data: Partial<Sermon>): Promise<Sermon> {
    const idx = localSermons.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Sermon '${id}' not found`);
    localSermons[idx] = { ...localSermons[idx], ...data };
    return localSermons[idx];
  }

  async archive(id: string): Promise<void> {
    await this.update(id, { status: 'archived' });
  }
}

// =============================
// LOCAL EVENT REPOSITORY
// =============================
export class LocalEventRepository implements IEventRepository {
  async getById(id: string): Promise<EventItem | null> {
    return localEvents.find((e) => e.id === id) || null;
  }

  async getBySlug(slug: string): Promise<EventItem | null> {
    return localEvents.find((e) => e.slug === slug || e.id === slug) || null;
  }

  async list(options?: { status?: ContentStatus; category?: string; limit?: number }): Promise<EventItem[]> {
    let result = [...localEvents];
    if (options?.status) {
      result = result.filter((e) => (e.status || 'published') === options.status);
    }
    if (options?.category) {
      result = result.filter((e) => e.category === options.category);
    }
    if (options?.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  async listPublished(options?: { category?: string; upcomingOnly?: boolean; limit?: number }): Promise<EventItem[]> {
    let result = await this.list({ category: options?.category, status: 'published', limit: options?.limit });
    if (options?.upcomingOnly) {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter((e) => (e.startDate || e.date || '9999-12-31') >= today);
    }
    return result;
  }

  async getFeatured(): Promise<EventItem | null> {
    return localEvents.find((e) => e.featured) || localEvents[0] || null;
  }

  async create(data: Omit<EventItem, 'id'>): Promise<EventItem> {
    const newEvent: EventItem = {
      ...data,
      id: `event-local-${Date.now()}`,
      status: data.status || 'draft',
    };
    localEvents.unshift(newEvent);
    return newEvent;
  }

  async update(id: string, data: Partial<EventItem>): Promise<EventItem> {
    const idx = localEvents.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error(`Event '${id}' not found`);
    localEvents[idx] = { ...localEvents[idx], ...data };
    return localEvents[idx];
  }

  async archive(id: string): Promise<void> {
    await this.update(id, { status: 'archived' });
  }
}

// =============================
// LOCAL MINISTRY REPOSITORY
// =============================
export class LocalMinistryRepository implements IMinistryRepository {
  async getById(id: string): Promise<Ministry | null> {
    return localMinistries.find((m) => m.id === id) || null;
  }

  async getBySlug(slug: string): Promise<Ministry | null> {
    return localMinistries.find((m) => m.slug === slug || m.id === slug) || null;
  }

  async list(options?: { status?: ContentStatus; category?: string; limit?: number }): Promise<Ministry[]> {
    let result = [...localMinistries];
    if (options?.status) {
      result = result.filter((m) => (m.status || 'published') === options.status);
    }
    if (options?.category) {
      result = result.filter((m) => m.category === options.category);
    }
    if (options?.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  async listPublished(options?: { category?: string; limit?: number }): Promise<Ministry[]> {
    return this.list({ ...options, status: 'published' });
  }

  async getFeatured(): Promise<Ministry | null> {
    return localMinistries.find((m) => m.featured) || localMinistries[0] || null;
  }

  async create(data: Omit<Ministry, 'id'>): Promise<Ministry> {
    const newMinistry: Ministry = {
      ...data,
      id: `ministry-local-${Date.now()}`,
      status: data.status || 'draft',
    };
    localMinistries.push(newMinistry);
    return newMinistry;
  }

  async update(id: string, data: Partial<Ministry>): Promise<Ministry> {
    const idx = localMinistries.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Ministry '${id}' not found`);
    localMinistries[idx] = { ...localMinistries[idx], ...data };
    return localMinistries[idx];
  }

  async archive(id: string): Promise<void> {
    await this.update(id, { status: 'archived' });
  }
}

// =============================
// LOCAL CHURCH REPOSITORY
// =============================
export class LocalChurchRepository implements IChurchRepository {
  async getById(id: string): Promise<ChurchLocation | null> {
    return localChurches.find((c) => c.id === id) || null;
  }

  async getBySlug(slug: string): Promise<ChurchLocation | null> {
    return localChurches.find((c) => c.slug === slug || c.id === slug) || null;
  }

  async list(options?: { status?: ContentStatus; isSubicMain?: boolean; province?: string; limit?: number }): Promise<ChurchLocation[]> {
    let result = [...localChurches];
    if (options?.status) {
      result = result.filter((c) => (c.status || 'pending_verification') === options.status);
    }
    if (options?.isSubicMain !== undefined) {
      result = result.filter((c) => Boolean(c.isMainBranch) === options.isSubicMain);
    }
    if (options?.province) {
      result = result.filter((c) => c.province === options.province);
    }
    if (options?.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  async listPublished(options?: { province?: string; limit?: number }): Promise<ChurchLocation[]> {
    return this.list({ ...options, status: 'published' });
  }

  async create(data: Omit<ChurchLocation, 'id'>): Promise<ChurchLocation> {
    const newChurch: ChurchLocation = {
      ...data,
      id: `church-local-${Date.now()}`,
      status: data.status || 'pending_verification',
    };
    localChurches.push(newChurch);
    return newChurch;
  }

  async update(id: string, data: Partial<ChurchLocation>): Promise<ChurchLocation> {
    const idx = localChurches.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Church Location '${id}' not found`);
    localChurches[idx] = { ...localChurches[idx], ...data };
    return localChurches[idx];
  }

  async archive(id: string): Promise<void> {
    await this.update(id, { status: 'archived' });
  }
}

// =============================
// LOCAL LEADERSHIP REPOSITORY
// =============================
export class LocalLeadershipRepository implements ILeadershipRepository {
  async getById(id: string): Promise<LeadershipMember | null> {
    return localLeaders.find((l) => l.id === id) || null;
  }

  async list(options?: { status?: ContentStatus; limit?: number }): Promise<LeadershipMember[]> {
    let result = [...localLeaders];
    if (options?.status) {
      result = result.filter((l) => (l.status || 'published') === options.status);
    }
    if (options?.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  async listPublished(): Promise<LeadershipMember[]> {
    return this.list({ status: 'published' });
  }

  async create(data: Omit<LeadershipMember, 'id'>): Promise<LeadershipMember> {
    const newLeader: LeadershipMember = {
      ...data,
      id: `leader-local-${Date.now()}`,
      status: data.status || 'draft',
    };
    localLeaders.push(newLeader);
    return newLeader;
  }

  async update(id: string, data: Partial<LeadershipMember>): Promise<LeadershipMember> {
    const idx = localLeaders.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error(`Leader '${id}' not found`);
    localLeaders[idx] = { ...localLeaders[idx], ...data };
    return localLeaders[idx];
  }
}

// =============================
// Seed initial local data structures
let localPages: ManagedPageRecord[] = [
  {
    id: 'page-home',
    slug: '/',
    title: 'Home Page',
    seoTitle: 'Church of God Subic — Official Church Sanctuary & Community',
    metaDescription: 'Welcome to Church of God Subic. Experience passionate worship, biblical preaching, and warm community in Subic, Zambales.',
    lastModifiedAt: '2026-08-11 10:00',
    lastModifiedBy: 'Secretariat Admin [Demo]',
    status: 'published',
    verifiedAt: '2026-08-11 10:00',
    verifiedBy: 'Church Secretariat [Demo]',
  },
  {
    id: 'page-about',
    slug: '/about',
    title: 'About Our Church',
    seoTitle: 'About Us — History, Mission, Vision & Faith | COG Subic',
    metaDescription: 'Learn about our 40+ year history, core beliefs, leadership team, and divine vision for Zambales.',
    lastModifiedAt: '2026-08-10 16:20',
    lastModifiedBy: 'Content Editor [Demo]',
    status: 'published',
    verifiedAt: '2026-08-10 16:20',
    verifiedBy: 'Secretariat Admin [Demo]',
  },
  {
    id: 'page-ministries',
    slug: '/ministries',
    title: 'Ministries Overview',
    seoTitle: 'Church Ministries — Worship, Youth, Kids, Outreach | COG Subic',
    metaDescription: 'Discover vibrant ministry departments serving children, youth, families, worship, and community outreach.',
    lastModifiedAt: '2026-08-09 14:10',
    lastModifiedBy: 'Ministry Content Editor',
    status: 'published',
    verifiedAt: '2026-08-09 14:10',
    verifiedBy: 'Church Secretariat',
  },
  {
    id: 'page-sermons',
    slug: '/sermons',
    title: 'Sermons & Messages',
    seoTitle: 'Sermons Library — Video, Audio & Study Notes | COG Subic',
    metaDescription: 'Watch and listen to uplifting Sunday messages, sermon series, and scripture teachings.',
    lastModifiedAt: '2026-08-11 11:30',
    lastModifiedBy: 'Media & Communications Lead',
    status: 'published',
    verifiedAt: '2026-08-11 11:30',
    verifiedBy: 'Pastor Executive Admin',
  },
  {
    id: 'page-events',
    slug: '/events',
    title: 'Events & Calendar',
    seoTitle: 'Upcoming Events — Gatherings, Services & Retreats | COG Subic',
    metaDescription: 'Stay connected with upcoming church events, special worship nights, youth summits, and medical missions.',
    lastModifiedAt: '2026-08-08 09:00',
    lastModifiedBy: 'Content Editor',
    status: 'published',
    verifiedAt: '2026-08-08 09:00',
    verifiedBy: 'Church Secretariat',
  },
  {
    id: 'page-prayer',
    slug: '/prayer',
    title: 'Prayer & Intercession',
    seoTitle: 'Prayer Ministry & Confidential Requests | COG Subic',
    metaDescription: 'Submit confidential prayer requests to our intercessory prayer team or join our weekly prayer gatherings.',
    lastModifiedAt: '2026-08-07 15:45',
    lastModifiedBy: 'Pastoral Care Team Lead',
    status: 'published',
    verifiedAt: '2026-08-07 15:45',
    verifiedBy: 'Pastor Executive Admin',
  },
  {
    id: 'page-churches',
    slug: '/churches',
    title: 'Church Locations',
    seoTitle: 'Subic & Zambales Candidate Church Locations | COG Subic',
    metaDescription: 'Find service times, addresses, and candidate locations across Zambales.',
    lastModifiedAt: '2026-08-06 12:00',
    lastModifiedBy: 'Content Editor [Demo]',
    status: 'pending_verification',
    notes: 'Verify updated service time for Candidate Church Location — Castillejos.',
  },
  {
    id: 'page-visit',
    slug: '/visit',
    title: 'Plan Your Visit',
    seoTitle: 'Plan Your Visit — Service Times & Visitor Guide | COG Subic',
    metaDescription: 'Everything you need to know for your first Sunday visit: directions, parking, kids programs, and what to wear.',
    lastModifiedAt: '2026-08-05 17:15',
    lastModifiedBy: 'Content Editor',
    status: 'published',
    verifiedAt: '2026-08-05 17:15',
    verifiedBy: 'Church Secretariat',
  },
  {
    id: 'page-contact',
    slug: '/contact',
    title: 'Contact Us',
    seoTitle: 'Contact Church Office — Phone, Email & Map | COG Subic',
    metaDescription: 'Get in touch with our pastoral staff, office secretariat, or ministry team.',
    lastModifiedAt: '2026-08-04 11:00',
    lastModifiedBy: 'Content Editor',
    status: 'published',
    verifiedAt: '2026-08-04 11:00',
    verifiedBy: 'Church Secretariat',
  },
];

let localSiteSettings: SiteSettings = {
  churchName: 'Church of God – Subic',
  tagline: 'Exalting Christ, Equipping Believers, Empowering Communities',
  mission: 'To bring the un-churched to Christ, build them up in faith, and deploy them into life-changing ministry across Subic, Zambales and the surrounding region.',
  vision: 'A vibrant, multi-generational, spirit-empowered church network discipling families and transforming society through the Gospel.',
  values: ['Christ-Centered Worship', 'Biblical Integrity', 'Authentic Fellowship', 'Passionate Evangelism', 'Generous Outreach'],
  brand: officialBrandConfig,
  contact: {
    address: 'V723+GFH, AYC Compound Rd',
    city: 'Subic, Zambales',
    phone: '0966 266 7012',
    email: 'cogsubic@gmail.com',
    serviceTimes: [
      { day: 'Sunday', time: '9:30 AM • 4:00 PM • 6:00 PM', name: 'Sunday Worship' },
      { day: 'Wednesday', time: '6:30 PM', name: 'Wednesday Midweek Service' },
    ],
  },
  socialLinks: {
    facebook: 'https://www.facebook.com/COGSUBIC',
    youtube: 'https://www.youtube.com/@COGWMPSubic',
    instagram: 'https://www.instagram.com/__cogsubic',
  },
};

let localGovernanceQueue: GovernanceQueueItem[] = [
  {
    id: 'gov-001',
    contentType: 'church',
    title: 'Candidate Church Location — Castillejos Service Schedule Update',
    slug: 'castillejos-branch',
    currentStatus: 'pending_verification',
    submittedBy: 'Content Editor',
    submittedAt: '2026-08-10 14:30',
    verificationNotes: 'Pending verification of newly assigned assistant pastor name and morning service start time.',
  },
  {
    id: 'gov-002',
    contentType: 'event',
    title: 'Kingdom Couples Retreat 2026 Registration Details',
    slug: 'kingdom-couples-retreat',
    currentStatus: 'pending_verification',
    submittedBy: 'Family Ministry Director',
    submittedAt: '2026-08-09 11:15',
    verificationNotes: 'Awaiting venue reservation confirmation from Anvaya Cove Subic.',
  },
  {
    id: 'gov-003',
    contentType: 'sermon',
    title: 'Atmosphere of Faith — Video Stream Notes',
    slug: 'atmosphere-of-faith',
    currentStatus: 'pending_verification',
    submittedBy: 'Media & Communications Lead',
    submittedAt: '2026-08-08 16:45',
    verificationNotes: 'Scripture references verified. Ready for final pastoral sign-off.',
  },
];

let localUsers: UserAccountRecord[] = [
  {
    id: 'usr-001',
    displayName: 'System Super Admin [Demo Account]',
    email: 'admin.demo@subiccog.org',
    role: 'SUPER_ADMIN',
    permissions: ['manage_pages', 'manage_ministries', 'manage_sermons', 'manage_events', 'manage_churches', 'manage_users'],
    assignedCampus: '[Pending location assignment]',
    isActive: true,
    lastLoginAt: '2026-08-11 08:30',
  },
  {
    id: 'usr-002',
    displayName: 'Content Secretariat Editor [Demo Account]',
    email: 'editor.demo@subiccog.org',
    role: 'EDITOR',
    permissions: ['manage_pages', 'manage_events', 'manage_sermons'],
    assignedCampus: '[Pending location assignment]',
    isActive: true,
    lastLoginAt: '2026-08-10 16:45',
  },
  {
    id: 'usr-003',
    displayName: 'Prayer Ministry Admin [Demo Account]',
    email: 'prayer.demo@subiccog.org',
    role: 'PRAYER_ADMIN',
    permissions: ['view_prayer_requests', 'manage_prayer_requests'],
    assignedCampus: '[Pending location assignment]',
    isActive: true,
    lastLoginAt: '2026-08-09 11:20',
  },
];

// =============================
// LOCAL PAGE REPOSITORY
// =============================
export class LocalPageRepository implements IPageRepository {
  async getBySlug(slug: string): Promise<ManagedPageRecord | null> {
    return localPages.find((p) => p.slug === slug || p.id === slug) || null;
  }

  async list(): Promise<ManagedPageRecord[]> {
    return [...localPages];
  }

  async update(slug: string, data: Partial<ManagedPageRecord>): Promise<ManagedPageRecord> {
    const idx = localPages.findIndex((p) => p.slug === slug || p.id === slug);
    if (idx === -1) {
      const newPage: ManagedPageRecord = {
        id: `page-${Date.now()}`,
        slug,
        title: data.title || 'Managed Page',
        seoTitle: data.seoTitle || data.title || 'Managed Page',
        metaDescription: data.metaDescription || '',
        lastModifiedAt: new Date().toISOString(),
        lastModifiedBy: data.lastModifiedBy || 'Admin',
        status: data.status || 'published',
        ...data,
      };
      localPages.push(newPage);
      return newPage;
    }
    localPages[idx] = { ...localPages[idx], ...data, lastModifiedAt: new Date().toISOString() };
    return localPages[idx];
  }
}

// =============================
// LOCAL SITE SETTINGS REPOSITORY
// =============================
export class LocalSiteSettingsRepository implements ISiteSettingsRepository {
  async getGlobalSettings(): Promise<SiteSettings | null> {
    return { ...localSiteSettings };
  }

  async updateGlobalSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    localSiteSettings = { ...localSiteSettings, ...settings };
    return { ...localSiteSettings };
  }
}

// =============================
// LOCAL NAVIGATION REPOSITORY
// =============================
export class LocalNavigationRepository implements INavigationRepository {
  async listNavItems(options?: { status?: ContentStatus }): Promise<NavigationRecord[]> {
    let result = [...localNavItems];
    if (options?.status) {
      result = result.filter((item) => (item.status || 'published') === options.status);
    }
    return result;
  }

  async updateNavItem(id: string, item: Partial<NavigationRecord>): Promise<NavigationRecord> {
    const idx = localNavItems.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error(`Nav item '${id}' not found`);
    localNavItems[idx] = { ...localNavItems[idx], ...item };
    return localNavItems[idx];
  }
}

// =============================
// LOCAL USER REPOSITORY
// =============================
export class LocalUserRepository implements IUserRepository {
  async getByUid(uid: string): Promise<UserAccountRecord | null> {
    return localUsers.find((u) => u.id === uid || u.email === uid) || null;
  }

  async list(): Promise<UserAccountRecord[]> {
    return [...localUsers];
  }

  async create(user: UserAccountRecord): Promise<UserAccountRecord> {
    localUsers.push(user);
    return user;
  }

  async update(uid: string, user: Partial<UserAccountRecord>): Promise<UserAccountRecord> {
    const idx = localUsers.findIndex((u) => u.id === uid || u.email === uid);
    if (idx === -1) throw new Error(`User '${uid}' not found`);
    localUsers[idx] = { ...localUsers[idx], ...user };
    return localUsers[idx];
  }
}

// =============================
// LOCAL GOVERNANCE REPOSITORY
// =============================
export class LocalGovernanceRepository implements IGovernanceRepository {
  async listPendingItems(): Promise<GovernanceQueueItem[]> {
    return localGovernanceQueue.filter((i) => i.currentStatus === 'pending_verification');
  }

  async getById(id: string): Promise<GovernanceQueueItem | null> {
    return localGovernanceQueue.find((i) => i.id === id) || null;
  }

  async create(item: Omit<GovernanceQueueItem, 'id'>): Promise<GovernanceQueueItem> {
    const newItem: GovernanceQueueItem = {
      ...item,
      id: `gov-local-${Date.now()}`,
      currentStatus: item.currentStatus || 'pending_verification',
    };
    localGovernanceQueue.unshift(newItem);
    return newItem;
  }

  async updateStatus(
    id: string,
    status: ContentStatus,
    verificationNotes?: string,
    verifiedBy?: string
  ): Promise<GovernanceQueueItem> {
    const idx = localGovernanceQueue.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error(`Governance item '${id}' not found`);
    localGovernanceQueue[idx] = {
      ...localGovernanceQueue[idx],
      currentStatus: status,
      verificationNotes: verificationNotes || localGovernanceQueue[idx].verificationNotes,
      verifiedBy: verifiedBy || localGovernanceQueue[idx].verifiedBy,
      verifiedAt: new Date().toISOString(),
    };
    return localGovernanceQueue[idx];
  }
}

// =============================
// LOCAL MEDIA REPOSITORY
// =============================
let localMediaAssets: MediaAssetRecord[] = [
  {
    id: 'media-official-logo-primary',
    filename: 'subic-cog-brand-logo.png',
    title: 'Church of God – Subic Official Brand Logo',
    description: 'Official Church of God – Subic brand logo (Subic COG Brand Logo) for use throughout the Project Nehemiah digital ministry platform.',
    assetType: 'logo',
    mimeType: 'image/png',
    extension: 'png',
    sourceType: 'local',
    url: officialBrandConfig.primaryLogo,
    publicPath: officialBrandConfig.primaryLogo,
    altText: officialBrandConfig.logoAltText,
    alt: officialBrandConfig.logoAltText,
    category: 'branding',
    tags: ['official', 'logo', 'brand', 'seal', 'branding', 'church of god', 'subic'],
    dimensions: '1024x1024',
    width: 1024,
    height: 1024,
    fileSize: '931 KB',
    fileSizeBytes: 953061,
    uploadedAt: '2026-08-14 12:00',
    uploadedBy: 'Church Leadership',
    status: 'published',
    usageCount: 12,
    isOfficialBrandAsset: true,
    displayOrder: 1,
  },
  {
    id: 'media-sermon-atmosphere-of-faith',
    filename: 'atmosphere_of_faith_banner.jpg',
    title: '[Demo] Atmosphere of Faith Preaching Series Graphic',
    description: 'Demo stage background and video thumbnail graphic for testing sermon series displays.',
    assetType: 'sermon_thumbnail',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=800',
    altText: 'Atmosphere of Faith Preaching Stage Graphic [Demo]',
    alt: 'Atmosphere of Faith Preaching Stage Graphic [Demo]',
    category: 'sermons',
    tags: ['demo', 'sermon', 'faith', 'preaching', 'banner'],
    dimensions: '1280x720',
    width: 1280,
    height: 720,
    fileSize: '1.2 MB',
    fileSizeBytes: 1258291,
    uploadedAt: '2026-08-01 14:00',
    uploadedBy: 'Media Lead [Demo]',
    status: 'pending_verification',
    usageCount: 3,
  },
  {
    id: 'media-sermon-unshakable-kingdom',
    filename: 'unshakable_kingdom_series.jpg',
    title: '[Demo] Unshakable Kingdom Sermon Series Title Graphic',
    description: 'Demo sermon thumbnail for testing expository series displays.',
    assetType: 'sermon_thumbnail',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800',
    altText: 'Unshakable Kingdom Sermon Series Title Graphic [Demo]',
    alt: 'Unshakable Kingdom Sermon Series Title Graphic [Demo]',
    category: 'sermons',
    tags: ['demo', 'sermon', 'kingdom', 'series'],
    dimensions: '1280x720',
    width: 1280,
    height: 720,
    fileSize: '980 KB',
    fileSizeBytes: 1003520,
    uploadedAt: '2026-08-03 09:15',
    uploadedBy: 'Media Lead [Demo]',
    status: 'pending_verification',
    usageCount: 2,
  },
  {
    id: 'media-event-ignite-youth-summit',
    filename: 'ignite_youth_summit_2026.jpg',
    title: '[Demo] Ignite Youth Summit Poster',
    description: 'Demo event registration poster for development testing.',
    assetType: 'event_graphic',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    altText: 'Ignite Youth Gathering Praise Stage [Demo]',
    alt: 'Ignite Youth Gathering Praise Stage [Demo]',
    category: 'events',
    tags: ['demo', 'youth', 'event', 'poster'],
    dimensions: '1200x800',
    width: 1200,
    height: 800,
    fileSize: '1.1 MB',
    fileSizeBytes: 1153433,
    uploadedAt: '2026-08-05 11:45',
    uploadedBy: 'Youth Ministry Lead [Demo]',
    status: 'pending_verification',
    usageCount: 5,
  },
  {
    id: 'media-event-kingdom-couples',
    filename: 'kingdom_couples_retreat.jpg',
    title: '[Demo] Kingdom Couples Marriage Retreat Flyer',
    description: 'Demo banner for development event testing.',
    assetType: 'event_graphic',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    altText: 'Kingdom Couples Marriage Retreat Flyer [Demo]',
    alt: 'Kingdom Couples Marriage Retreat Flyer [Demo]',
    category: 'events',
    tags: ['demo', 'family', 'couples', 'retreat'],
    dimensions: '1200x800',
    width: 1200,
    height: 800,
    fileSize: '1.4 MB',
    fileSizeBytes: 1468006,
    uploadedAt: '2026-08-06 16:20',
    uploadedBy: 'Family Life Ministry [Demo]',
    status: 'pending_verification',
    usageCount: 2,
  },
  {
    id: 'media-ministry-worship-banner',
    filename: 'worship_ministry_choir.jpg',
    title: '[Demo] Worship & Music Ministry Header Photo',
    description: 'Demo header image for worship ministry testing.',
    assetType: 'ministry_image',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=800',
    altText: 'Worship Ministry Gathering [Demo]',
    alt: 'Worship Ministry Gathering [Demo]',
    category: 'ministries',
    tags: ['demo', 'worship', 'music', 'ministry'],
    dimensions: '1600x900',
    width: 1600,
    height: 900,
    fileSize: '1.8 MB',
    fileSizeBytes: 1887436,
    uploadedAt: '2026-08-02 10:00',
    uploadedBy: 'Music Director [Demo]',
    status: 'pending_verification',
    usageCount: 4,
  },
  {
    id: 'media-ministry-kids-kingdom',
    filename: 'kingdom_kids_classroom.jpg',
    title: '[Demo] Kingdom Kids Children Ministry Banner',
    description: 'Demo header image for children ministry testing.',
    assetType: 'ministry_image',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&q=80&w=800',
    altText: 'Kingdom Kids Sunday School Classroom [Demo]',
    alt: 'Kingdom Kids Sunday School Classroom [Demo]',
    category: 'ministries',
    tags: ['demo', 'kids', 'children'],
    dimensions: '1600x900',
    width: 1600,
    height: 900,
    fileSize: '1.5 MB',
    fileSizeBytes: 1572864,
    uploadedAt: '2026-08-04 15:30',
    uploadedBy: 'Children Ministry Lead [Demo]',
    status: 'pending_verification',
    usageCount: 3,
  },
  {
    id: 'media-church-subic-sanctuary',
    filename: 'subic_sanctuary_interior.jpg',
    title: '[Demo] Subic Candidate Church Location Photo',
    description: 'Demo photo of Candidate Church Location sanctuary interior for testing.',
    assetType: 'church_photo',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800',
    altText: 'Candidate Church Location Sanctuary Stage [Demo]',
    alt: 'Candidate Church Location Sanctuary Stage [Demo]',
    category: 'churches',
    tags: ['demo', 'subic', 'sanctuary', 'candidate-location'],
    dimensions: '1920x1080',
    width: 1920,
    height: 1080,
    fileSize: '2.1 MB',
    fileSizeBytes: 2202009,
    uploadedAt: '2026-08-01 08:30',
    uploadedBy: 'Church Secretariat [Demo]',
    status: 'pending_verification',
    usageCount: 6,
  },
  {
    id: 'media-leadership-portrait-pending',
    filename: 'leadership_portrait_placeholder.jpg',
    title: '[Demo] Leadership Profile Portrait Placeholder',
    description: 'Standard demo placeholder portrait for upcoming pastoral roster testing.',
    assetType: 'leadership_photo',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800',
    altText: 'Church leadership profile — pending verified portrait [Demo]',
    alt: 'Church leadership profile — pending verified portrait [Demo]',
    category: 'leadership',
    tags: ['demo', 'leadership', 'portrait', 'placeholder', 'pending'],
    dimensions: '800x800',
    width: 800,
    height: 800,
    fileSize: '450 KB',
    fileSizeBytes: 460800,
    uploadedAt: '2026-08-07 13:10',
    uploadedBy: 'Content Secretariat [Demo]',
    status: 'pending_verification',
    usageCount: 1,
  },
  {
    id: 'media-document-bylaws-pdf',
    filename: 'cog_subic_constitution_bylaws.pdf',
    title: '[Demo] Church Constitution and Governance Bylaws PDF',
    description: 'Demo downloadable PDF copy of church governance bylaws for testing.',
    assetType: 'document',
    mimeType: 'application/pdf',
    extension: 'pdf',
    sourceType: 'local',
    url: '/documents/cog_subic_constitution_bylaws.pdf',
    publicPath: '/documents/cog_subic_constitution_bylaws.pdf',
    altText: 'Church Constitution and Governance Bylaws PDF [Demo]',
    alt: 'Church Constitution and Governance Bylaws PDF [Demo]',
    category: 'documents',
    tags: ['demo', 'constitution', 'bylaws', 'governance', 'pdf'],
    fileSize: '1.4 MB',
    fileSizeBytes: 1468006,
    uploadedAt: '2026-08-08 09:00',
    uploadedBy: 'Secretariat Admin [Demo]',
    status: 'pending_verification',
    usageCount: 2,
  },
];

export class LocalMediaRepository implements IMediaRepository {
  async list(options?: {
    category?: string;
    assetType?: MediaAssetType;
    status?: ContentStatus;
    sourceType?: MediaSourceType;
    limit?: number;
  }): Promise<MediaAssetRecord[]> {
    let result = [...localMediaAssets];

    if (options?.category && options.category !== 'all') {
      result = result.filter((m) => m.category.toLowerCase() === options.category!.toLowerCase());
    }
    if (options?.assetType) {
      result = result.filter((m) => m.assetType === options.assetType);
    }
    if (options?.status) {
      result = result.filter((m) => m.status === options.status);
    }
    if (options?.sourceType) {
      result = result.filter((m) => m.sourceType === options.sourceType);
    }
    if (options?.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  async getById(id: string): Promise<MediaAssetRecord | null> {
    return localMediaAssets.find((m) => m.id === id) || null;
  }

  async search(query: string): Promise<MediaAssetRecord[]> {
    if (!query || query.trim() === '') return this.list();
    const q = query.toLowerCase().trim();
    return localMediaAssets.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.filename.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.altText.toLowerCase().includes(q) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q))) ||
        (m.description && m.description.toLowerCase().includes(q))
    );
  }

  async createMetadata(data: Omit<MediaAssetRecord, 'id'>): Promise<MediaAssetRecord> {
    const newRecord: MediaAssetRecord = {
      ...data,
      id: `media-${Date.now()}`,
      uploadedAt: data.uploadedAt || new Date().toISOString().slice(0, 10),
      status: data.status || 'published',
    };
    localMediaAssets.unshift(newRecord);
    return newRecord;
  }

  async updateMetadata(id: string, data: Partial<MediaAssetRecord>): Promise<MediaAssetRecord> {
    const idx = localMediaAssets.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Media asset '${id}' not found`);
    localMediaAssets[idx] = {
      ...localMediaAssets[idx],
      ...data,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    return localMediaAssets[idx];
  }

  async archive(id: string): Promise<void> {
    const idx = localMediaAssets.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Media asset '${id}' not found`);
    if (localMediaAssets[idx].isOfficialBrandAsset) {
      throw new Error('Official brand assets cannot be archived or deleted.');
    }
    localMediaAssets[idx].status = 'archived';
  }

  async getByCategory(category: string): Promise<MediaAssetRecord[]> {
    return this.list({ category });
  }

  async getOfficialBrandAssets(): Promise<MediaAssetRecord[]> {
    return localMediaAssets.filter((m) => m.isOfficialBrandAsset === true);
  }
}
