import { Permission } from '../types/rbac';

export interface AdminNavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  requiredPermission: Permission;
  badge?: string;
  badgeVariant?: 'amber' | 'gold' | 'navy' | 'green';
  description?: string;
}

export interface AdminNavGroup {
  id: string;
  groupLabel: string;
  items: AdminNavItem[];
}

export const adminNavigationConfig: AdminNavGroup[] = [
  {
    id: 'overview',
    groupLabel: 'OVERVIEW',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard Overview',
        path: '/admin',
        iconName: 'LayoutDashboard',
        requiredPermission: 'dashboard.read',
        description: 'System-wide content performance & governance summary',
      },
    ],
  },
  {
    id: 'content',
    groupLabel: 'CONTENT MANAGEMENT',
    items: [
      {
        id: 'pages',
        label: 'Site Pages',
        path: '/admin/pages',
        iconName: 'FileText',
        requiredPermission: 'pages.read',
        description: 'Manage core page metadata & structural copy',
      },
      {
        id: 'ministries',
        label: 'Ministries',
        path: '/admin/ministries',
        iconName: 'HeartHandshake',
        requiredPermission: 'ministries.read',
        description: 'Church programs, meeting schedules, leaders',
      },
      {
        id: 'sermons',
        label: 'Sermons & Media',
        path: '/admin/sermons',
        iconName: 'BookOpen',
        requiredPermission: 'sermons.read',
        description: 'Messages, video streams, audio, notes',
      },
      {
        id: 'events',
        label: 'Events & Calendar',
        path: '/admin/events',
        iconName: 'Calendar',
        requiredPermission: 'events.read',
        description: 'Gatherings, services, registrations, venues',
      },
      {
        id: 'churches',
        label: 'Church Locations',
        path: '/admin/churches',
        iconName: 'MapPin',
        requiredPermission: 'churches.read',
        description: 'Subic main sanctuary & provincial branch campuses',
      },
      {
        id: 'leadership',
        label: 'Pastoral Leadership',
        path: '/admin/leadership',
        iconName: 'UserCheck',
        requiredPermission: 'leadership.read',
        description: 'Pastors, elders, department directors',
      },
    ],
  },
  {
    id: 'submissions',
    groupLabel: 'SUBMISSIONS & INQUIRIES',
    items: [
      {
        id: 'prayer',
        label: 'Prayer Requests',
        path: '/admin/prayer',
        iconName: 'Heart',
        requiredPermission: 'prayer.read',
        badge: 'Private',
        badgeVariant: 'amber',
        description: 'Confidential prayer submissions & team follow-up',
      },
      {
        id: 'contact',
        label: 'Contact Inquiries',
        path: '/admin/contact',
        iconName: 'Inbox',
        requiredPermission: 'contact.read',
        description: 'Visitor messages & department questions',
      },
    ],
  },
  {
    id: 'media',
    groupLabel: 'ASSET MANAGEMENT',
    items: [
      {
        id: 'media-library',
        label: 'Media Library',
        path: '/admin/media',
        iconName: 'Image',
        requiredPermission: 'media.read',
        description: 'Banners, photography, documents, logos',
      },
    ],
  },
  {
    id: 'system',
    groupLabel: 'SYSTEM & GOVERNANCE',
    items: [
      {
        id: 'governance',
        label: 'Governance Queue',
        path: '/admin/governance',
        iconName: 'ShieldCheck',
        requiredPermission: 'governance.read',
        badge: 'Verification',
        badgeVariant: 'gold',
        description: 'Review pending content before publishing',
      },
      {
        id: 'settings',
        label: 'Site Settings',
        path: '/admin/settings',
        iconName: 'Sliders',
        requiredPermission: 'settings.read',
        description: 'Church profile, contact details, office hours',
      },
      {
        id: 'branding',
        label: 'Brand & Identity',
        path: '/admin/branding',
        iconName: 'Palette',
        requiredPermission: 'branding.read',
        description: 'Official logos, typography, asset previews',
      },
      {
        id: 'users',
        label: 'Users & Roles',
        path: '/admin/users',
        iconName: 'Users',
        requiredPermission: 'users.read',
        description: 'Access permissions & admin role matrices',
      },
    ],
  },
];
