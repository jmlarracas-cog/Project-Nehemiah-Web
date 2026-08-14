import React, { useState } from 'react';
import { adminNavigationConfig } from '../../config/adminNavigation';
import { officialBrandConfig } from '../../config/brand';
import { useAuth } from '../../context/AuthContext';
import { useAuthorization } from '../../context/AuthorizationContext';
import { CANONICAL_ADMIN_ROLES, ROLE_DESCRIPTORS, AdminRole } from '../../types/rbac';
import {
  LayoutDashboard,
  FileText,
  HeartHandshake,
  BookOpen,
  Calendar,
  MapPin,
  UserCheck,
  Heart,
  Inbox,
  Image as ImageIcon,
  ShieldCheck,
  Sliders,
  Palette,
  Users,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  User,
  LogOut,
  Bell,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';

interface AdminShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

// Icon Mapping Resolver
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  FileText,
  HeartHandshake,
  BookOpen,
  Calendar,
  MapPin,
  UserCheck,
  Heart,
  Inbox,
  Image: ImageIcon,
  ShieldCheck,
  Sliders,
  Palette,
  Users,
};

export const AdminShell: React.FC<AdminShellProps> = ({
  currentPath,
  onNavigate,
  children,
}) => {
  const { user, isMockAdmin, signOut } = useAuth();
  const { role, hasPermission, setMockRole, mockRole } = useAuthorization();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
    onNavigate('/admin/login');
  };

  // Filter navigation items by permission
  const authorizedNavGroups = adminNavigationConfig
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(item.requiredPermission)),
    }))
    .filter((group) => group.items.length > 0);

  // Generate Breadcrumbs
  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length <= 1) return [{ label: 'Admin', path: '/admin' }, { label: 'Dashboard Overview', path: '/admin' }];

    const sub = parts[1];
    let pageLabel = sub.charAt(0).toUpperCase() + sub.slice(1);
    if (sub === 'prayer') pageLabel = 'Prayer Requests';
    if (sub === 'contact') pageLabel = 'Contact Inquiries';
    if (sub === 'churches') pageLabel = 'Church Locations';
    if (sub === 'media') pageLabel = 'Media Library';
    if (sub === 'settings') pageLabel = 'Site Settings';
    if (sub === 'branding') pageLabel = 'Brand & Identity';
    if (sub === 'users') pageLabel = 'Users & Roles';

    return [
      { label: 'Admin', path: '/admin' },
      { label: pageLabel, path: currentPath },
    ];
  };

  const breadcrumbs = getBreadcrumbs();
  const roleDescriptor = role ? ROLE_DESCRIPTORS[role] : null;

  return (
    <div className="min-h-screen bg-slate-100/80 font-sans text-slate-800 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-navy text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <img
            src={officialBrandConfig.primaryLogo}
            alt="Church of God Subic"
            className="w-8 h-8 object-contain"
          />
          <div>
            <span className="font-bold text-xs uppercase tracking-wider block text-white">
              Church of God – Subic
            </span>
            <span className="text-[10px] text-gold font-semibold uppercase tracking-widest block">
              CMS Admin Dashboard
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-navy text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-3">
          <img
            src={officialBrandConfig.primaryLogo}
            alt="Church of God Subic Logo"
            className="w-10 h-10 object-contain shrink-0"
          />
          <div>
            <span className="font-black text-sm uppercase tracking-wider text-white block leading-tight">
              Church of God
            </span>
            <span className="text-[10px] text-gold font-extrabold uppercase tracking-widest block">
              Subic Admin Panel
            </span>
          </div>
        </div>

        {/* Development Mode Indicator */}
        {isMockAdmin && (
          <div className="mx-4 mt-4 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] leading-tight flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-amber-200 uppercase tracking-wider text-[10px]">
                DEV PREVIEW MODE
              </span>
              <span>Development RBAC Simulation Active</span>
            </div>
          </div>
        )}

        {/* Permission-Filtered Navigation Groups */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {authorizedNavGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                {group.groupLabel}
              </span>

              {group.items.map((item) => {
                const Icon = iconMap[item.iconName] || FileText;
                const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gold text-navy font-black shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-navy' : 'text-gold'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          isActive
                            ? 'bg-navy text-gold'
                            : item.badgeVariant === 'amber'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2 text-xs">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl font-semibold transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold" />
              View Public Website
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <p className="text-[10px] text-slate-500 text-center pt-1">
            Project Nehemiah CMS • Stage 6C RBAC
          </p>
        </div>
      </aside>

      {/* Main Admin Region */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs">
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={bc.path + idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                <button
                  type="button"
                  onClick={() => onNavigate(bc.path)}
                  className={`font-semibold hover:text-gold transition-colors cursor-pointer ${
                    idx === breadcrumbs.length - 1 ? 'text-navy font-bold' : 'text-slate-500'
                  }`}
                >
                  {bc.label}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* User Profile & Role Controls */}
          <div className="flex items-center gap-3">
            {/* Development Mock Mode Role Switcher */}
            {isMockAdmin && (
              <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 pl-2 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-amber-500" />
                  Simulate Role:
                </span>
                <select
                  value={mockRole}
                  onChange={(e) => setMockRole(e.target.value as AdminRole)}
                  className="text-xs font-bold text-navy bg-white border border-slate-300 rounded-lg px-2 py-1 focus:outline-hidden focus:ring-2 focus:ring-gold cursor-pointer"
                >
                  {CANONICAL_ADMIN_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate('/admin/governance')}
              className="p-2 text-slate-500 hover:text-navy hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
              title="Verification Queue"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-gold/40 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-navy text-gold font-bold flex items-center justify-center text-xs border border-gold/40 shrink-0">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'SA'}
                  </div>
                )}
                <div className="hidden sm:block text-left max-w-44">
                  <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                    {user?.displayName || (isMockAdmin ? 'System Super Admin [Demo]' : 'Authenticated User')}
                  </span>
                  <span className="text-[10px] font-extrabold text-navy block truncate">
                    {role || 'PENDING ROLE'}
                  </span>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 space-y-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.displayName || (isMockAdmin ? 'System Super Admin [Demo]' : 'Authenticated User')}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {user?.email || 'admin.demo@subiccog.org'}
                    </p>

                    <div className="pt-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Technical Role:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${roleDescriptor?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                        {role || 'NONE'}
                      </span>
                    </div>
                  </div>

                  {/* Mobile/Small Screen Role Switcher */}
                  {isMockAdmin && (
                    <div className="px-4 py-2 border-b border-slate-100 bg-amber-50/50 space-y-1">
                      <span className="text-[10px] font-bold text-amber-800 block">
                        Dev Role Simulator:
                      </span>
                      <select
                        value={mockRole}
                        onChange={(e) => setMockRole(e.target.value as AdminRole)}
                        className="w-full text-xs font-bold text-navy bg-white border border-amber-300 rounded-lg p-1 cursor-pointer"
                      >
                        {CANONICAL_ADMIN_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('/admin/users');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Users & Role Matrix
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out & Exit
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
