/**
 * Project Nehemiah — Private Local Repositories
 * In-memory & SessionStorage fallback implementations for Prayer Submissions and Contact Inquiries.
 */

import type {
  IPrayerSubmissionRepository,
  IContactInquiryRepository,
  PrayerListOptions,
  ContactListOptions,
} from './types';
import type { PrayerRequestSubmission, PrayerSubmissionStatus } from '../../types/prayer';
import type { PrayerSubmissionRecord, ContactInquiryRecord, ContactInquiryStatus } from '../../types/admin';
import type { ContactSubmissionPayload } from '../../services/contactService';

// Initial Synthetic Prayer Submissions for Local/Demo Mode
const initialLocalPrayerSubmissions: PrayerSubmissionRecord[] = [
  {
    id: 'pr-001',
    referenceId: 'PRY-2026-8812',
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
    referenceId: 'PRY-2026-8811',
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
    referenceId: 'PRY-2026-8810',
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

// Initial Synthetic Contact Inquiries for Local/Demo Mode
const initialLocalContactInquiries: ContactInquiryRecord[] = [
  {
    id: 'ci-001',
    referenceId: 'CNT-2026-1042',
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
    referenceId: 'CNT-2026-1041',
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
    referenceId: 'CNT-2026-1040',
    name: 'Sample Participant [Demo]',
    email: 'participant.demo@example.com',
    topic: 'Water Baptism Service',
    message: 'Inquiring about upcoming water baptism orientation and requirements.',
    createdAt: '2026-08-08 11:20',
    status: 'responded',
    assignedTo: 'Ministry Lead [Demo]',
  },
];

function generateRandomRefCode(prefix: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 8; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-2026-${randomPart}`;
}

export class LocalPrayerSubmissionRepository implements IPrayerSubmissionRepository {
  private items: PrayerSubmissionRecord[] = [...initialLocalPrayerSubmissions];

  async submit(submission: PrayerRequestSubmission): Promise<{ success: boolean; referenceId: string; message: string }> {
    const referenceId = generateRandomRefCode('PRY');
    const record: PrayerSubmissionRecord = {
      id: `pr-${Date.now()}`,
      referenceId,
      name: submission.isAnonymous ? 'Anonymous' : (submission.name?.trim() || 'Anonymous'),
      email: submission.email?.trim(),
      phone: submission.phone?.trim(),
      request: submission.request.trim(),
      category: submission.category || 'Personal',
      isAnonymous: Boolean(submission.isAnonymous),
      contactPreference: submission.contactPreference || 'none',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'new',
    };

    this.items.unshift(record);

    return {
      success: true,
      referenceId,
      message: `Prayer request received. Reference: ${referenceId}`,
    };
  }

  async list(options?: PrayerListOptions): Promise<PrayerSubmissionRecord[]> {
    let result = [...this.items];
    if (options?.status) {
      result = result.filter((item) => item.status === options.status);
    }
    if (options?.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  async getById(id: string): Promise<PrayerSubmissionRecord | null> {
    return this.items.find((item) => item.id === id || item.referenceId === id) || null;
  }

  async updateStatus(
    id: string,
    status: PrayerSubmissionStatus,
    internalNotes?: string,
    assignedTo?: string
  ): Promise<PrayerSubmissionRecord> {
    const index = this.items.findIndex((item) => item.id === id || item.referenceId === id);
    if (index === -1) {
      throw new Error(`Prayer request record '${id}' not found.`);
    }

    const existing = this.items[index];
    const updated: PrayerSubmissionRecord = {
      ...existing,
      status,
      internalNotes: internalNotes !== undefined ? internalNotes : existing.internalNotes,
      assignedTo: assignedTo !== undefined ? assignedTo : existing.assignedTo,
    };

    this.items[index] = updated;
    return updated;
  }
}

export class LocalContactInquiryRepository implements IContactInquiryRepository {
  private items: ContactInquiryRecord[] = [...initialLocalContactInquiries];

  async submit(payload: ContactSubmissionPayload): Promise<{ success: boolean; referenceId: string; error?: string }> {
    const referenceId = generateRandomRefCode('CNT');
    const record: ContactInquiryRecord = {
      id: `ci-${Date.now()}`,
      referenceId,
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim(),
      topic: payload.topic || 'General Inquiry',
      message: payload.message.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'new',
    };

    this.items.unshift(record);

    return {
      success: true,
      referenceId,
    };
  }

  async list(options?: ContactListOptions): Promise<ContactInquiryRecord[]> {
    let result = [...this.items];
    if (options?.status) {
      result = result.filter((item) => item.status === options.status);
    }
    if (options?.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  async getById(id: string): Promise<ContactInquiryRecord | null> {
    return this.items.find((item) => item.id === id || item.referenceId === id) || null;
  }

  async updateStatus(
    id: string,
    status: ContactInquiryStatus,
    internalNotes?: string,
    assignedTo?: string
  ): Promise<ContactInquiryRecord> {
    const index = this.items.findIndex((item) => item.id === id || item.referenceId === id);
    if (index === -1) {
      throw new Error(`Contact inquiry record '${id}' not found.`);
    }

    const existing = this.items[index];
    const updated: ContactInquiryRecord = {
      ...existing,
      status,
      internalNotes: internalNotes !== undefined ? internalNotes : existing.internalNotes,
      assignedTo: assignedTo !== undefined ? assignedTo : existing.assignedTo,
    };

    this.items[index] = updated;
    return updated;
  }
}
