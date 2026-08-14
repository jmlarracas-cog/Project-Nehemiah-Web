/**
 * Project Nehemiah — Role-Based Access Control (RBAC) Architecture Types
 * Defines canonical administrative roles and granular permission keys.
 * 
 * IMPORTANT ARCHITECTURAL DIRECTIVE:
 * Technical roles determine system authorization permissions.
 * Church/organizational titles (e.g. Pastor, Bishop, Secretary, Ministry Head)
 * are organizational metadata and MUST NOT be used as system authorization roles.
 */

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'EDITOR'
  | 'MEDIA_ADMIN'
  | 'PRAYER_ADMIN'
  | 'MINISTRY_EDITOR'
  | 'READ_ONLY';

export const CANONICAL_ADMIN_ROLES: AdminRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'EDITOR',
  'MEDIA_ADMIN',
  'PRAYER_ADMIN',
  'MINISTRY_EDITOR',
  'READ_ONLY',
];

/**
 * Granular Permission Keys across all administrative CMS domains.
 */
export type Permission =
  // Overview / Dashboard
  | 'dashboard.read'
  // Content: Site Pages
  | 'pages.read'
  | 'pages.create'
  | 'pages.update'
  | 'pages.publish'
  // Content: Ministries
  | 'ministries.read'
  | 'ministries.create'
  | 'ministries.update'
  | 'ministries.publish'
  // Content: Sermons & Messages
  | 'sermons.read'
  | 'sermons.create'
  | 'sermons.update'
  | 'sermons.publish'
  // Content: Events & Calendar
  | 'events.read'
  | 'events.create'
  | 'events.update'
  | 'events.publish'
  // Content: Church Locations
  | 'churches.read'
  | 'churches.update'
  | 'churches.publish'
  // Content: Pastoral Leadership
  | 'leadership.read'
  | 'leadership.update'
  | 'leadership.publish'
  // Media Assets
  | 'media.read'
  | 'media.upload'
  | 'media.update'
  | 'media.delete'
  // Private Submissions: Prayer Requests
  | 'prayer.read'
  | 'prayer.update'
  // Private Submissions: Contact Inquiries
  | 'contact.read'
  | 'contact.update'
  // System: Governance
  | 'governance.read'
  | 'governance.review'
  | 'governance.publish'
  // System: Site Settings
  | 'settings.read'
  | 'settings.update'
  // System: Brand & Identity
  | 'branding.read'
  | 'branding.update'
  // System: Users & Roles
  | 'users.read'
  | 'users.manage'
  // System: Security Audit Logs
  | 'audit.read';

/**
 * Validates if a value is a canonical AdminRole. Unknown roles fail closed (returns false).
 */
export function isCanonicalRole(role: unknown): role is AdminRole {
  return typeof role === 'string' && CANONICAL_ADMIN_ROLES.includes(role as AdminRole);
}

/**
 * Human-readable display information for canonical technical roles.
 */
export interface RoleDescriptor {
  role: AdminRole;
  title: string;
  badgeColor: string;
  description: string;
}

export const ROLE_DESCRIPTORS: Record<AdminRole, RoleDescriptor> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    title: 'Super Administrator',
    badgeColor: 'bg-navy text-gold border border-gold/40',
    description: 'Unrestricted system access including security, user management, and system governance.',
  },
  ADMIN: {
    role: 'ADMIN',
    title: 'Administrator',
    badgeColor: 'bg-blue-100 text-blue-900 border border-blue-300',
    description: 'Broad CMS administrative access across content, media, and settings.',
  },
  EDITOR: {
    role: 'EDITOR',
    title: 'Content Editor',
    badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    description: 'Public web content editing and publishing for pages, sermons, and events.',
  },
  MEDIA_ADMIN: {
    role: 'MEDIA_ADMIN',
    title: 'Media Administrator',
    badgeColor: 'bg-purple-100 text-purple-900 border border-purple-300',
    description: 'Management of audio, video streams, graphic assets, and sermon archives.',
  },
  PRAYER_ADMIN: {
    role: 'PRAYER_ADMIN',
    title: 'Prayer Ministry Admin',
    badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
    description: 'Authorized access to confidential prayer request submissions and contact inquiries.',
  },
  MINISTRY_EDITOR: {
    role: 'MINISTRY_EDITOR',
    title: 'Ministry Editor',
    badgeColor: 'bg-teal-100 text-teal-900 border border-teal-300',
    description: 'Scoped content editing for assigned church ministries and events.',
  },
  READ_ONLY: {
    role: 'READ_ONLY',
    title: 'Read Only Inspector',
    badgeColor: 'bg-slate-100 text-slate-800 border border-slate-300',
    description: 'Explicit read-only administrative inspection without mutation privileges.',
  },
};
