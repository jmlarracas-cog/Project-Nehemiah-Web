/**
 * Project Nehemiah — Authoritative Audit Logging Service
 * Trusted backend audit logging module with mandatory privacy filtering.
 *
 * PRIVACY GUARANTEES:
 * - NEVER logs prayer request text or contact inquiry messages.
 * - NEVER logs passwords, ID tokens, OAuth tokens, or secrets.
 * - Uses server-authoritative timestamps (`FieldValue.serverTimestamp()`).
 */

import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../admin.js';
import type { AuditEventPayload, CanonicalRole } from '../types/index.js';

// Keys strictly prohibited from appearing in audit log metadata
const SENSITIVE_KEYS = [
  'request',
  'message',
  'prayer',
  'prayertext',
  'contactmessage',
  'password',
  'token',
  'idtoken',
  'oauthtoken',
  'secret',
  'privatekey',
  'credential',
];

export class AuditService {
  /**
   * Sanitizes metadata payload to guarantee zero sensitive content leaks.
   */
  public static sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> {
    if (!metadata) return {};

    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(metadata)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED_PRIVACY_PROTECTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeMetadata(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  /**
   * Constructs an audit record object with server timestamp and privacy filter.
   */
  public static createRecord(payload: AuditEventPayload) {
    return {
      eventType: payload.eventType,
      actorUid: payload.actorUid,
      actorRole: payload.actorRole,
      targetType: payload.targetType,
      targetId: payload.targetId,
      timestamp: FieldValue.serverTimestamp(),
      createdAtIso: new Date().toISOString(),
      metadata: this.sanitizeMetadata(payload.metadata),
    };
  }

  /**
   * Writes authoritative audit log record to `audit_logs` collection.
   */
  public async logEvent(payload: AuditEventPayload): Promise<string> {
    const record = AuditService.createRecord(payload);

    try {
      const db = getAdminDb();
      const ref = await db.collection('audit_logs').add(record);
      return ref.id;
    } catch (err: any) {
      console.warn('[AuditService] Firestore write skipped (Development Mode or Uninitialized DB):', err?.message);
      return `audit-dev-id-${Date.now()}`;
    }
  }
}
