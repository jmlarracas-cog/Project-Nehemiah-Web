/**
 * Project Nehemiah — Private Repository Domain Contracts
 * Abstract repository interfaces defining private data access signatures for
 * Prayer Submissions and Contact Inquiries.
 */

import type { PrayerRequestSubmission, PrayerSubmissionStatus } from '../../types/prayer';
import type { PrayerSubmissionRecord, ContactInquiryRecord, ContactInquiryStatus } from '../../types/admin';
import type { ContactSubmissionPayload } from '../../services/contactService';

export interface PrayerListOptions {
  status?: PrayerSubmissionStatus;
  limit?: number;
}

export interface ContactListOptions {
  status?: ContactInquiryStatus;
  limit?: number;
}

export interface IPrayerSubmissionRepository {
  submit(submission: PrayerRequestSubmission): Promise<{ success: boolean; referenceId: string; message: string }>;
  list(options?: PrayerListOptions): Promise<PrayerSubmissionRecord[]>;
  getById(id: string): Promise<PrayerSubmissionRecord | null>;
  updateStatus(id: string, status: PrayerSubmissionStatus, internalNotes?: string, assignedTo?: string): Promise<PrayerSubmissionRecord>;
}

export interface IContactInquiryRepository {
  submit(payload: ContactSubmissionPayload): Promise<{ success: boolean; referenceId: string; error?: string }>;
  list(options?: ContactListOptions): Promise<ContactInquiryRecord[]>;
  getById(id: string): Promise<ContactInquiryRecord | null>;
  updateStatus(id: string, status: ContactInquiryStatus, internalNotes?: string, assignedTo?: string): Promise<ContactInquiryRecord>;
}
