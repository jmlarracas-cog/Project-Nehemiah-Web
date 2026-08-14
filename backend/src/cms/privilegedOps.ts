/**
 * Project Nehemiah — Privileged CMS & Governance Operations
 * Prepares trusted backend logic for content publication, verification, and archiving.
 * Decoupled from transport handlers for seamless Cloud Functions compatibility in future stages.
 *
 * PRIVACY RULES ENFORCED:
 * - Prayer request operations require PRAYER_ADMIN or SUPER_ADMIN. (ADMIN denied).
 * - Contact inquiry operations require ADMIN or SUPER_ADMIN. (PRAYER_ADMIN denied).
 * - CMS content operations enforce RBAC based on content domain.
 */

import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../admin.js';
import { AuditService } from '../audit/logger.js';
import type { CanonicalRole } from '../types/index.js';

export interface PrivilegedCaller {
  uid: string;
  role: CanonicalRole;
}

export class PrivilegedCmsService {
  private auditService = new AuditService();

  /**
   * Enforces Prayer Privacy Access Rule:
   * Only PRAYER_ADMIN and SUPER_ADMIN are permitted access.
   */
  public static verifyPrayerAccess(callerRole: CanonicalRole): void {
    if (callerRole !== 'SUPER_ADMIN' && callerRole !== 'PRAYER_ADMIN') {
      throw new Error("Unauthorized: Access to prayer submissions requires PRAYER_ADMIN or SUPER_ADMIN privileges.");
    }
  }

  /**
   * Enforces Contact Inquiry Access Rule:
   * Only ADMIN and SUPER_ADMIN are permitted access.
   */
  public static verifyContactAccess(callerRole: CanonicalRole): void {
    if (callerRole !== 'SUPER_ADMIN' && callerRole !== 'ADMIN') {
      throw new Error("Unauthorized: Access to contact inquiries requires ADMIN or SUPER_ADMIN privileges.");
    }
  }

  /**
   * Publishes a managed CMS document in Firestore with authoritative server timestamps.
   */
  public async publishContent(
    caller: PrivilegedCaller,
    collectionName: string,
    documentId: string
  ): Promise<{ success: boolean; documentId: string }> {
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MEDIA_ADMIN', 'MINISTRY_EDITOR'].includes(caller.role)) {
      throw new Error(`Unauthorized: Role '${caller.role}' cannot publish content.`);
    }

    try {
      const db = getAdminDb();
      const docRef = db.collection(collectionName).doc(documentId);

      await docRef.set(
        {
          status: 'published',
          publishedAt: FieldValue.serverTimestamp(),
          publishedBy: caller.uid,
        },
        { merge: true }
      );

      await this.auditService.logEvent({
        eventType: 'CONTENT_PUBLISHED',
        actorUid: caller.uid,
        actorRole: caller.role,
        targetType: collectionName,
        targetId: documentId,
      });

      return { success: true, documentId };
    } catch (err: any) {
      if (err.message?.startsWith('Unauthorized')) throw err;
      throw new Error(`Failed to publish document '${documentId}': ${err?.message || 'Internal error.'}`);
    }
  }

  /**
   * Archives a managed CMS document in Firestore.
   */
  public async archiveContent(
    caller: PrivilegedCaller,
    collectionName: string,
    documentId: string
  ): Promise<{ success: boolean; documentId: string }> {
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(caller.role)) {
      throw new Error(`Unauthorized: Role '${caller.role}' cannot archive content.`);
    }

    try {
      const db = getAdminDb();
      const docRef = db.collection(collectionName).doc(documentId);

      await docRef.set(
        {
          status: 'archived',
          archivedAt: FieldValue.serverTimestamp(),
          archivedBy: caller.uid,
        },
        { merge: true }
      );

      await this.auditService.logEvent({
        eventType: 'CONTENT_ARCHIVED',
        actorUid: caller.uid,
        actorRole: caller.role,
        targetType: collectionName,
        targetId: documentId,
      });

      return { success: true, documentId };
    } catch (err: any) {
      if (err.message?.startsWith('Unauthorized')) throw err;
      throw new Error(`Failed to archive document '${documentId}': ${err?.message || 'Internal error.'}`);
    }
  }
}
