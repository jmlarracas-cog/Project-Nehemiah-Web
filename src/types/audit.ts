/**
 * Project Nehemiah — Administrative Security Audit Architecture Types
 * Defines canonical audit event categories and log structures for tracking privileged operations.
 * 
 * IMPORTANT PRIVACY DIRECTIVE:
 * Audit log entries MUST NOT store confidential prayer request text or sensitive personal communications.
 */

export type AuditEventType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'ROLE_CHANGED'
  | 'CONTENT_PUBLISHED'
  | 'PRAYER_ACCESSED'
  | 'CONTACT_ACCESSED'
  | 'USER_DISABLED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'SETTINGS_UPDATED';

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  actorUid: string;
  actorEmail: string;
  actorRole: string;
  targetResource: string;
  actionSummary: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Creates a normalized audit event object for tracking administrative activity.
 */
export function createAuditEvent(
  eventType: AuditEventType,
  actorUid: string,
  actorEmail: string,
  actorRole: string,
  targetResource: string,
  actionSummary: string,
  metadata?: Record<string, string | number | boolean>
): AuditEvent {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    eventType,
    actorUid,
    actorEmail,
    actorRole,
    targetResource,
    actionSummary,
    timestamp: new Date().toISOString(),
    metadata,
  };
}
