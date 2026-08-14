/**
 * Project Nehemiah — Private Firestore Repository Adapters
 * Secure Firestore implementations for Prayer Submissions and Contact Inquiries.
 * Strictly adheres to firestore.rules schemas and field constraints.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit as limitQuery,
  type QueryConstraint,
} from 'firebase/firestore';

import { db, isFirebaseConfigured } from '../../firebase/firebase';
import { normalizeFirebaseError, OperationType } from '../../firebase/errors';
import type {
  IPrayerSubmissionRepository,
  IContactInquiryRepository,
  PrayerListOptions,
  ContactListOptions,
} from './types';
import type { PrayerRequestSubmission, PrayerSubmissionStatus } from '../../types/prayer';
import type { PrayerSubmissionRecord, ContactInquiryRecord, ContactInquiryStatus } from '../../types/admin';
import type { ContactSubmissionPayload } from '../../services/contactService';

function assertDbAvailable() {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firestore is not configured. Please check VITE_FIREBASE_PROJECT_ID environment variable.');
  }
}

function generateRefCode(prefix: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 8; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-2026-${randomPart}`;
}

// ===========================================
// FIRESTORE PRAYER SUBMISSION REPOSITORY
// ===========================================
export class FirestorePrayerSubmissionRepository implements IPrayerSubmissionRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, 'prayer_requests');
  }

  async submit(submission: PrayerRequestSubmission): Promise<{ success: boolean; referenceId: string; message: string }> {
    try {
      const referenceId = generateRefCode('PRY');
      const nowIso = new Date().toISOString();

      // Payload must strictly match firestore.rules allow create keys & types
      const payload: Record<string, any> = {
        request: submission.request.trim(),
        category: submission.category || 'Personal',
        isAnonymous: Boolean(submission.isAnonymous),
        visibility: submission.visibility || 'private',
        consent: true, // MUST be boolean true for firestore.rules validation
        status: 'new',
        submittedAt: nowIso,
        createdAt: nowIso,
        referenceId,
      };

      if (submission.name?.trim() && !submission.isAnonymous) {
        payload.name = submission.name.trim().slice(0, 100);
      }
      if (submission.email?.trim()) {
        payload.email = submission.email.trim().slice(0, 150);
      }
      if (submission.phone?.trim()) {
        payload.phone = submission.phone.trim().slice(0, 50);
      }
      if (submission.contactPreference) {
        payload.contactPreference = submission.contactPreference;
      }

      await addDoc(this.colRef, payload);

      return {
        success: true,
        referenceId,
        message: `Prayer request received. Reference: ${referenceId}`,
      };
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.CREATE, 'prayer_requests');
    }
  }

  async list(options?: PrayerListOptions): Promise<PrayerSubmissionRecord[]> {
    try {
      const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

      if (options?.status) {
        constraints.unshift(where('status', '==', options.status));
      }
      if (options?.limit && options.limit > 0) {
        constraints.push(limitQuery(options.limit));
      }

      const q = query(this.colRef, ...constraints);
      const snap = await getDocs(q);

      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          referenceId: data.referenceId || `PRY-2026-${d.id.slice(0, 6)}`,
          name: data.name || (data.isAnonymous ? 'Anonymous' : 'Member'),
          email: data.email,
          phone: data.phone,
          request: data.request || '',
          category: data.category || 'Personal',
          isAnonymous: Boolean(data.isAnonymous),
          contactPreference: data.contactPreference || 'none',
          createdAt: data.createdAt || data.submittedAt || '',
          status: (data.status as PrayerSubmissionStatus) || 'new',
          assignedTo: data.assignedTo,
          internalNotes: data.internalNotes,
        };
      });
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, 'prayer_requests');
    }
  }

  async getById(id: string): Promise<PrayerSubmissionRecord | null> {
    try {
      const docRef = doc(this.colRef, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;

      const data = snap.data();
      return {
        id: snap.id,
        referenceId: data.referenceId || `PRY-2026-${snap.id.slice(0, 6)}`,
        name: data.name || (data.isAnonymous ? 'Anonymous' : 'Member'),
        email: data.email,
        phone: data.phone,
        request: data.request || '',
        category: data.category || 'Personal',
        isAnonymous: Boolean(data.isAnonymous),
        contactPreference: data.contactPreference || 'none',
        createdAt: data.createdAt || data.submittedAt || '',
        status: (data.status as PrayerSubmissionStatus) || 'new',
        assignedTo: data.assignedTo,
        internalNotes: data.internalNotes,
      };
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `prayer_requests/${id}`);
    }
  }

  async updateStatus(
    id: string,
    status: PrayerSubmissionStatus,
    internalNotes?: string,
    assignedTo?: string
  ): Promise<PrayerSubmissionRecord> {
    try {
      const docRef = doc(this.colRef, id);
      const updateData: Record<string, any> = { status };
      if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
      if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

      await updateDoc(docRef, updateData);
      const updatedSnap = await getDoc(docRef);
      const data = updatedSnap.data()!;

      return {
        id: updatedSnap.id,
        referenceId: data.referenceId || `PRY-2026-${updatedSnap.id.slice(0, 6)}`,
        name: data.name || (data.isAnonymous ? 'Anonymous' : 'Member'),
        email: data.email,
        phone: data.phone,
        request: data.request || '',
        category: data.category || 'Personal',
        isAnonymous: Boolean(data.isAnonymous),
        contactPreference: data.contactPreference || 'none',
        createdAt: data.createdAt || data.submittedAt || '',
        status: (data.status as PrayerSubmissionStatus) || 'new',
        assignedTo: data.assignedTo,
        internalNotes: data.internalNotes,
      };
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `prayer_requests/${id}`);
    }
  }
}

// ===========================================
// FIRESTORE CONTACT INQUIRY REPOSITORY
// ===========================================
export class FirestoreContactInquiryRepository implements IContactInquiryRepository {
  private get colRef() {
    assertDbAvailable();
    return collection(db!, 'contact_inquiries');
  }

  async submit(payload: ContactSubmissionPayload): Promise<{ success: boolean; referenceId: string; error?: string }> {
    try {
      const referenceId = generateRefCode('CNT');
      const nowIso = new Date().toISOString();

      // Payload must strictly match firestore.rules allow create keys & types
      const docData: Record<string, any> = {
        name: payload.name.trim().slice(0, 100),
        email: payload.email.trim().slice(0, 150),
        topic: payload.topic ? payload.topic.slice(0, 100) : 'General Inquiry',
        message: payload.message.trim().slice(0, 2000),
        consent: true, // MUST be boolean true for firestore.rules validation
        createdAt: nowIso,
        status: 'new',
        referenceId,
      };

      if (payload.phone?.trim()) {
        docData.phone = payload.phone.trim().slice(0, 50);
      }

      await addDoc(this.colRef, docData);

      return {
        success: true,
        referenceId,
      };
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.CREATE, 'contact_inquiries');
    }
  }

  async list(options?: ContactListOptions): Promise<ContactInquiryRecord[]> {
    try {
      const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

      if (options?.status) {
        constraints.unshift(where('status', '==', options.status));
      }
      if (options?.limit && options.limit > 0) {
        constraints.push(limitQuery(options.limit));
      }

      const q = query(this.colRef, ...constraints);
      const snap = await getDocs(q);

      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          referenceId: data.referenceId || `CNT-2026-${d.id.slice(0, 6)}`,
          name: data.name || 'Visitor',
          email: data.email || '',
          phone: data.phone,
          topic: data.topic || 'General Inquiry',
          message: data.message || '',
          createdAt: data.createdAt || '',
          status: (data.status as ContactInquiryStatus) || 'new',
          assignedTo: data.assignedTo,
          internalNotes: data.internalNotes,
        };
      });
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.LIST, 'contact_inquiries');
    }
  }

  async getById(id: string): Promise<ContactInquiryRecord | null> {
    try {
      const docRef = doc(this.colRef, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;

      const data = snap.data();
      return {
        id: snap.id,
        referenceId: data.referenceId || `CNT-2026-${snap.id.slice(0, 6)}`,
        name: data.name || 'Visitor',
        email: data.email || '',
        phone: data.phone,
        topic: data.topic || 'General Inquiry',
        message: data.message || '',
        createdAt: data.createdAt || '',
        status: (data.status as ContactInquiryStatus) || 'new',
        assignedTo: data.assignedTo,
        internalNotes: data.internalNotes,
      };
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.GET, `contact_inquiries/${id}`);
    }
  }

  async updateStatus(
    id: string,
    status: ContactInquiryStatus,
    internalNotes?: string,
    assignedTo?: string
  ): Promise<ContactInquiryRecord> {
    try {
      const docRef = doc(this.colRef, id);
      const updateData: Record<string, any> = { status };
      if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
      if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

      await updateDoc(docRef, updateData);
      const updatedSnap = await getDoc(docRef);
      const data = updatedSnap.data()!;

      return {
        id: updatedSnap.id,
        referenceId: data.referenceId || `CNT-2026-${updatedSnap.id.slice(0, 6)}`,
        name: data.name || 'Visitor',
        email: data.email || '',
        phone: data.phone,
        topic: data.topic || 'General Inquiry',
        message: data.message || '',
        createdAt: data.createdAt || '',
        status: (data.status as ContactInquiryStatus) || 'new',
        assignedTo: data.assignedTo,
        internalNotes: data.internalNotes,
      };
    } catch (err) {
      throw normalizeFirebaseError(err, OperationType.WRITE, `contact_inquiries/${id}`);
    }
  }
}
