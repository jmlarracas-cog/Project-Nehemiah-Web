/**
 * Project Nehemiah — Trusted Backend Type Definitions
 * Defines canonical roles, custom claim structures, audit log event payloads,
 * and provisioning interfaces for the isolated backend service.
 */

export type CanonicalRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'EDITOR'
  | 'MEDIA_ADMIN'
  | 'PRAYER_ADMIN'
  | 'MINISTRY_EDITOR'
  | 'READ_ONLY';

export const CANONICAL_ROLES: CanonicalRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'EDITOR',
  'MEDIA_ADMIN',
  'PRAYER_ADMIN',
  'MINISTRY_EDITOR',
  'READ_ONLY',
];

export interface CustomClaimsPayload {
  role: CanonicalRole;
  [key: string]: any;
}

export type AuditEventType =
  | 'ROLE_ASSIGNED'
  | 'ROLE_REMOVED'
  | 'USER_DISABLED'
  | 'USER_ENABLED'
  | 'SUPER_ADMIN_BOOTSTRAPPED'
  | 'CONTENT_PUBLISHED'
  | 'CONTENT_ARCHIVED'
  | 'PRAYER_STATUS_CHANGED'
  | 'CONTACT_STATUS_CHANGED';

export interface AuditEventPayload {
  eventType: AuditEventType;
  actorUid: string;
  actorRole: CanonicalRole;
  targetType: string;
  targetId: string;
  metadata?: Record<string, any>;
}

export interface UserProfileSync {
  uid: string;
  role: CanonicalRole;
  claimsUpdatedAt?: any;
  updatedBy?: string;
  disabled?: boolean;
}

export interface ProvisioningResult {
  success: boolean;
  uid: string;
  assignedRole?: CanonicalRole;
  message: string;
  timestamp: string;
}
