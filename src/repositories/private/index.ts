/**
 * Project Nehemiah — Private Repository Gateway
 * Resolves Local vs Firestore private repositories for Prayer Submissions and Contact Inquiries.
 */

import { useFirestore } from '../index';
import { LocalPrayerSubmissionRepository, LocalContactInquiryRepository } from './local';
import { FirestorePrayerSubmissionRepository, FirestoreContactInquiryRepository } from './firestore';
import type { IPrayerSubmissionRepository, IContactInquiryRepository } from './types';

export * from './types';

let prayerRepo: IPrayerSubmissionRepository | null = null;
let contactRepo: IContactInquiryRepository | null = null;

export function getPrayerSubmissionRepository(): IPrayerSubmissionRepository {
  if (!prayerRepo) {
    prayerRepo = useFirestore() ? new FirestorePrayerSubmissionRepository() : new LocalPrayerSubmissionRepository();
  }
  return prayerRepo;
}

export function getContactInquiryRepository(): IContactInquiryRepository {
  if (!contactRepo) {
    contactRepo = useFirestore() ? new FirestoreContactInquiryRepository() : new LocalContactInquiryRepository();
  }
  return contactRepo;
}
