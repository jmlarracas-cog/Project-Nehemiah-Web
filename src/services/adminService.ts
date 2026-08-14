import {
  AdminDashboardMetrics,
  ManagedPageRecord,
  PrayerSubmissionRecord,
  PrayerSubmissionStatus,
  ContactInquiryRecord,
  ContactInquiryStatus,
  MediaAssetRecord,
  GovernanceQueueItem,
  AdminUser,
  AdminRoleInfo,
  UserAccountRecord,
} from '../types/admin';
import { Sermon } from '../types/sermon';
import { EventItem } from '../types/event';
import { Ministry } from '../types/ministry';
import { ChurchLocation } from '../types/church';
import { LeadershipMember } from '../types/about';
import { SiteSettings, BrandIdentityConfig } from '../types';
import { ContentStatus } from '../types/about';

import { officialBrandConfig } from '../config/brand';
import { getPrayerSubmissionRepository, getContactInquiryRepository } from '../repositories/private';
import {
  getSermonRepository,
  getEventRepository,
  getMinistryRepository,
  getChurchRepository,
  getLeadershipRepository,
  getPageRepository,
  getSiteSettingsRepository,
  getNavigationRepository,
  getGovernanceRepository,
  getUserRepository,
  getMediaRepository,
} from '../repositories';

// Initial Mock Admin Users
export const initialAdminUsers: AdminUser[] = [
  {
    id: 'user-001',
    name: 'System Super Admin [Demo]',
    email: 'admin.demo@subiccog.org',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    isActive: true,
    lastLoginAt: '2026-08-11 14:15',
    createdAt: '2026-01-01',
  },
  {
    id: 'user-002',
    name: 'Media Admin [Demo]',
    email: 'media.demo@subiccog.org',
    role: 'MEDIA_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    isActive: true,
    lastLoginAt: '2026-08-10 18:30',
    createdAt: '2026-01-15',
  },
  {
    id: 'user-003',
    name: 'Prayer Admin [Demo]',
    email: 'prayer.demo@subiccog.org',
    role: 'PRAYER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    isActive: true,
    lastLoginAt: '2026-08-11 09:45',
    createdAt: '2026-02-01',
  },
  {
    id: 'user-004',
    name: 'Ministry Content Editor [Demo]',
    email: 'editor.demo@subiccog.org',
    role: 'MINISTRY_EDITOR',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    isActive: true,
    lastLoginAt: '2026-08-08 11:20',
    createdAt: '2026-03-10',
  },
];

// Role Definitions & Matrix
export const roleDefinitions: AdminRoleInfo[] = [
  {
    role: 'SUPER_ADMIN',
    title: 'Super Administrator',
    description: 'Unrestricted system access including governance overrides, security settings, and user role management.',
    permissions: [
      'manage_pages',
      'manage_ministries',
      'manage_sermons',
      'manage_events',
      'manage_churches',
      'manage_leadership',
      'view_prayer_requests',
      'manage_prayer_requests',
      'view_contact_inquiries',
      'manage_media',
      'manage_settings',
      'manage_branding',
      'manage_users',
      'publish_content',
    ],
  },
  {
    role: 'ADMIN',
    title: 'Executive Administrator',
    description: 'Full operational control over public content, media assets, submissions, and site settings.',
    permissions: [
      'manage_pages',
      'manage_ministries',
      'manage_sermons',
      'manage_events',
      'manage_churches',
      'manage_leadership',
      'view_prayer_requests',
      'manage_prayer_requests',
      'view_contact_inquiries',
      'manage_media',
      'manage_settings',
      'manage_branding',
      'publish_content',
    ],
  },
  {
    role: 'EDITOR',
    title: 'Content Editor',
    description: 'Can edit and create drafts for pages, sermons, and events; requires governance verification to publish.',
    permissions: [
      'manage_pages',
      'manage_sermons',
      'manage_events',
      'manage_media',
    ],
  },
  {
    role: 'MEDIA_ADMIN',
    title: 'Media Specialist',
    description: 'Manages sermons, video streams, audio notes, and the global media library.',
    permissions: ['manage_sermons', 'manage_media'],
  },
  {
    role: 'PRAYER_ADMIN',
    title: 'Pastoral Care Admin',
    description: 'Access to confidential prayer request submissions and pastoral care tracking.',
    permissions: ['view_prayer_requests', 'manage_prayer_requests', 'view_contact_inquiries'],
  },
  {
    role: 'MINISTRY_EDITOR',
    title: 'Ministry Leader Editor',
    description: 'Manages ministry schedules, leadership details, and departmental event entries.',
    permissions: ['manage_ministries', 'manage_events'],
  },
  {
    role: 'READ_ONLY',
    title: 'Read Only Auditor',
    description: 'View-only access for content review and audit compliance.',
    permissions: [],
  },
];

// Initial Managed Pages
const initialManagedPages: ManagedPageRecord[] = [
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

// Initial Synthetic Prayer Submissions (Strictly Non-Sensitive / Synthetic UI Testing Examples)
const initialPrayerSubmissions: PrayerSubmissionRecord[] = [
  {
    id: 'pr-001',
    referenceId: 'PR-2026-8812',
    name: 'G. M. (Demo Member)',
    email: 'member.demo@example.com',
    phone: '0917-000-0000',
    request: 'Praying for spiritual wisdom, peace of heart, and guidance in daily living.',
    category: 'Guidance & Wisdom',
    isAnonymous: false,
    contactPreference: 'email',
    createdAt: '2026-08-11 08:30',
    status: 'new',
    assignedTo: 'Prayer Admin [Demo]',
  },
  {
    id: 'pr-002',
    referenceId: 'PR-2026-8811',
    name: 'Anonymous Supporter [Demo]',
    request: 'Requesting prayer for health, strength, and encouragement for our local community.',
    category: 'Healing & Health',
    isAnonymous: true,
    contactPreference: 'none',
    createdAt: '2026-08-10 19:15',
    status: 'praying',
    assignedTo: 'Prayer Admin [Demo]',
    internalNotes: 'Logged for weekly prayer gathering list [Demo].',
  },
  {
    id: 'pr-003',
    referenceId: 'PR-2026-8810',
    name: 'Sample Family [Demo]',
    email: 'family.demo@example.com',
    request: 'Praising God for new opportunities and praying for smooth transition.',
    category: 'Thanksgiving',
    isAnonymous: false,
    contactPreference: 'phone',
    createdAt: '2026-08-09 14:00',
    status: 'followed_up',
    assignedTo: 'Prayer Admin [Demo]',
    internalNotes: 'Sent encouraging confirmation email [Demo].',
  },
];

// Initial Synthetic Contact Inquiries (UI Testing Examples)
const initialContactInquiries: ContactInquiryRecord[] = [
  {
    id: 'ci-001',
    referenceId: 'INQ-2026-1042',
    name: 'Sample Visitor [Demo]',
    email: 'visitor.demo@example.com',
    phone: '0918-000-0000',
    topic: 'First Time Visit Inquiry',
    message: 'Hello, inquiring about Sunday worship service schedules and visitor guidelines.',
    createdAt: '2026-08-11 09:10',
    status: 'new',
    assignedTo: 'Secretariat Editor [Demo]',
  },
  {
    id: 'ci-002',
    referenceId: 'INQ-2026-1041',
    name: 'Sample Attendee [Demo]',
    email: 'attendee.demo@example.com',
    topic: 'Youth Ministry & Fellowship',
    message: 'Interested in learning more about youth fellowship gatherings and schedule.',
    createdAt: '2026-08-10 15:40',
    status: 'in_progress',
    assignedTo: 'Youth Lead [Demo]',
    internalNotes: 'Responded via email with campus information [Demo].',
  },
  {
    id: 'ci-003',
    referenceId: 'INQ-2026-1040',
    name: 'Sample Participant [Demo]',
    email: 'participant.demo@example.com',
    topic: 'Water Baptism Service',
    message: 'Inquiring about upcoming water baptism orientation and requirements.',
    createdAt: '2026-08-08 11:20',
    status: 'responded',
    assignedTo: 'Ministry Lead [Demo]',
  },
];

// Initial Synthetic Media Assets
const initialMediaAssets: MediaAssetRecord[] = [
  {
    id: 'media-001',
    filename: 'subic_main_sanctuary_hero.jpg',
    title: 'Church of God Subic Main Sanctuary Interior',
    description: 'High resolution sanctuary interior shot during Sunday worship.',
    assetType: 'church_photo',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200',
    publicPath: '/images/churches/subic_main_sanctuary.jpg',
    altText: 'Church of God Subic Main Sanctuary Interior during Worship',
    alt: 'Church of God Subic Main Sanctuary Interior during Worship',
    category: 'churches',
    fileSize: '1.4 MB',
    dimensions: '1920x1080',
    uploadedAt: '2026-08-01',
    uploadedBy: 'Media Specialist',
    status: 'published',
    isOfficialBrandAsset: false,
    usageCount: 2,
  },
  {
    id: 'media-002',
    filename: 'kingdom_first_sermon_series.jpg',
    title: 'Kingdom First Sermon Series Banner',
    description: 'Official graphics banner for the Kingdom First teaching series.',
    assetType: 'sermon_thumbnail',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=800',
    publicPath: '/images/sermons/kingdom_first.jpg',
    altText: 'Kingdom First Sermon Series Banner Artwork',
    alt: 'Kingdom First Sermon Series Banner Artwork',
    category: 'sermons',
    fileSize: '850 KB',
    dimensions: '1200x630',
    uploadedAt: '2026-08-03',
    uploadedBy: 'Media Specialist',
    status: 'published',
    isOfficialBrandAsset: false,
    usageCount: 1,
  },
  {
    id: 'media-003',
    filename: 'ignite_youth_summit_2026.jpg',
    title: 'Ignite Youth Gathering Praise Stage',
    description: 'Praise and worship gathering photo for youth ministry poster.',
    assetType: 'event_graphic',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    sourceType: 'public_url',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    publicPath: '/images/events/ignite_youth_summit.jpg',
    altText: 'Ignite Youth Gathering Praise & Worship Stage',
    alt: 'Ignite Youth Gathering Praise & Worship Stage',
    category: 'events',
    fileSize: '1.1 MB',
    dimensions: '1200x800',
    uploadedAt: '2026-08-05',
    uploadedBy: 'Youth Pastor',
    status: 'published',
    isOfficialBrandAsset: false,
    usageCount: 1,
  },
  {
    id: 'media-004',
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
    fileSize: '931 KB',
    dimensions: '1024x1024',
    uploadedAt: '2026-08-14',
    uploadedBy: 'Super Administrator',
    status: 'published',
    isOfficialBrandAsset: true,
    usageCount: 12,
  },
];

// Initial Site Settings
const initialSiteSettings: SiteSettings = {
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
    mapCoordinates: { lat: 14.8876, lng: 120.2319 },
  },
  socialLinks: {
    facebook: 'https://www.facebook.com/COGSUBIC',
    youtube: 'https://www.youtube.com/@COGWMPSubic',
    instagram: 'https://www.instagram.com/__cogsubic',
  },
};

// Admin Service Implementation
export const adminService = {
  // Metrics & Dashboard Overview
  async getDashboardMetrics(): Promise<AdminDashboardMetrics> {
    const pages = await getPageRepository().list();
    const sermons = await getSermonRepository().list();
    const events = await getEventRepository().list();
    const ministries = await getMinistryRepository().list();
    const churches = await getChurchRepository().list();
    const pendingGov = await getGovernanceRepository().listPendingItems();
    const prayers = await getPrayerSubmissionRepository().list();
    const contacts = await getContactInquiryRepository().list();

    return {
      totalPublished: pages.filter((p) => p.status === 'published').length + sermons.filter((s) => s.status === 'published').length,
      totalDrafts: pages.filter((p) => p.status === 'draft').length + sermons.filter((s) => s.status === 'draft').length,
      totalPendingVerification: pendingGov.length,
      totalSermons: sermons.length,
      totalEvents: events.length,
      totalMinistries: ministries.length,
      totalChurches: churches.length,
      newPrayerRequests: prayers.filter((p) => p.status === 'new').length,
      newContactInquiries: contacts.filter((c) => c.status === 'new').length,
      totalMediaAssets: initialMediaAssets.length,
    };
  },

  // Governance Queue
  async getGovernanceQueue(): Promise<GovernanceQueueItem[]> {
    return getGovernanceRepository().listPendingItems();
  },

  async updateGovernanceStatus(
    id: string,
    status: ContentStatus,
    notes?: string,
    verifiedBy?: string
  ): Promise<GovernanceQueueItem> {
    return getGovernanceRepository().updateStatus(id, status, notes, verifiedBy);
  },

  async verifyQueueItem(
    id: string,
    status: ContentStatus,
    notes?: string,
    verifiedBy?: string
  ): Promise<GovernanceQueueItem> {
    return getGovernanceRepository().updateStatus(id, status, notes, verifiedBy);
  },

  // Pages Management
  async getManagedPages(): Promise<ManagedPageRecord[]> {
    return getPageRepository().list();
  },

  async savePage(slugOrRecord: string | ManagedPageRecord, data?: Partial<ManagedPageRecord>): Promise<ManagedPageRecord> {
    if (typeof slugOrRecord === 'object') {
      const targetSlug = slugOrRecord.slug || slugOrRecord.id;
      return getPageRepository().update(targetSlug, slugOrRecord);
    }
    return getPageRepository().update(slugOrRecord, data || {});
  },

  // Sermons
  async getSermons(): Promise<Sermon[]> {
    return getSermonRepository().list();
  },

  async saveSermon(sermon: Sermon): Promise<Sermon> {
    const repo = getSermonRepository();
    const existing = await repo.getById(sermon.id);
    if (existing) {
      return repo.update(sermon.id, sermon);
    } else {
      const { id, ...data } = sermon;
      return repo.create(data);
    }
  },

  async archiveSermon(id: string): Promise<void> {
    return getSermonRepository().archive(id);
  },

  // Events
  async getEvents(): Promise<EventItem[]> {
    return getEventRepository().list();
  },

  async saveEvent(event: EventItem): Promise<EventItem> {
    const repo = getEventRepository();
    const existing = await repo.getById(event.id);
    if (existing) {
      return repo.update(event.id, event);
    } else {
      const { id, ...data } = event;
      return repo.create(data);
    }
  },

  async archiveEvent(id: string): Promise<void> {
    return getEventRepository().archive(id);
  },

  // Ministries
  async getMinistries(): Promise<Ministry[]> {
    return getMinistryRepository().list();
  },

  async saveMinistry(ministry: Ministry): Promise<Ministry> {
    const repo = getMinistryRepository();
    const existing = await repo.getById(ministry.id);
    if (existing) {
      return repo.update(ministry.id, ministry);
    } else {
      const { id, ...data } = ministry;
      return repo.create(data);
    }
  },

  async archiveMinistry(id: string): Promise<void> {
    return getMinistryRepository().archive(id);
  },

  // Churches
  async getChurches(): Promise<ChurchLocation[]> {
    return getChurchRepository().list();
  },

  async saveChurch(church: ChurchLocation): Promise<ChurchLocation> {
    const repo = getChurchRepository();
    const existing = await repo.getById(church.id);
    if (existing) {
      return repo.update(church.id, church);
    } else {
      const { id, ...data } = church;
      return repo.create(data);
    }
  },

  async archiveChurch(id: string): Promise<void> {
    return getChurchRepository().archive(id);
  },

  // Leadership
  async getLeadership(): Promise<LeadershipMember[]> {
    return getLeadershipRepository().list();
  },

  async saveLeadership(leader: LeadershipMember): Promise<LeadershipMember> {
    const repo = getLeadershipRepository();
    const existing = await repo.getById(leader.id);
    if (existing) {
      return repo.update(leader.id, leader);
    } else {
      const { id, ...data } = leader;
      return repo.create(data);
    }
  },

  // Submissions: Prayer
  async getPrayerSubmissions(options?: { status?: PrayerSubmissionStatus; limit?: number }): Promise<PrayerSubmissionRecord[]> {
    const repo = getPrayerSubmissionRepository();
    return repo.list(options);
  },

  // Submissions: Contact
  async getContactInquiries(options?: { status?: ContactInquiryStatus; limit?: number }): Promise<ContactInquiryRecord[]> {
    const repo = getContactInquiryRepository();
    return repo.list(options);
  },

  // Media Assets
  async getMediaAssets(options?: {
    category?: string;
    assetType?: any;
    status?: ContentStatus;
    sourceType?: any;
    limit?: number;
  }): Promise<MediaAssetRecord[]> {
    return getMediaRepository().list(options);
  },

  async saveMediaAsset(asset: MediaAssetRecord): Promise<MediaAssetRecord> {
    const repo = getMediaRepository();
    const existing = await repo.getById(asset.id);
    if (existing) {
      return repo.updateMetadata(asset.id, asset);
    } else {
      const { id, ...data } = asset;
      return repo.createMetadata(data);
    }
  },

  async archiveMediaAsset(id: string): Promise<void> {
    return getMediaRepository().archive(id);
  },

  async searchMediaAssets(query: string): Promise<MediaAssetRecord[]> {
    return getMediaRepository().search(query);
  },

  async getOfficialBrandAssets(): Promise<MediaAssetRecord[]> {
    return getMediaRepository().getOfficialBrandAssets();
  },

  // Settings
  async getSiteSettings(): Promise<SiteSettings> {
    const res = await getSiteSettingsRepository().getGlobalSettings();
    return res || { ...initialSiteSettings };
  },

  async getSettings(): Promise<SiteSettings> {
    const res = await getSiteSettingsRepository().getGlobalSettings();
    return res || { ...initialSiteSettings };
  },

  async saveSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    return getSiteSettingsRepository().updateGlobalSettings(settings);
  },

  async saveSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    return getSiteSettingsRepository().updateGlobalSettings(settings);
  },

  // Branding
  async getBrandConfig(): Promise<BrandIdentityConfig> {
    return { ...officialBrandConfig };
  },

  // Users
  async getAdminUsers(): Promise<AdminUser[]> {
    return [...initialAdminUsers];
  },

  async getUserAccounts(): Promise<UserAccountRecord[]> {
    return getUserRepository().list();
  },

  // Role Definitions
  getRoleDefinitions(): AdminRoleInfo[] {
    return roleDefinitions;
  },
};
