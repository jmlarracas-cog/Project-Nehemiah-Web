import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthorizationProvider, useAuthorization } from './context/AuthorizationContext';
import { SiteProvider } from './context/SiteContext';
import { AppShell } from './components/layout/AppShell';
import { AdminShell } from './components/admin/AdminShell';
import { Permission } from './types/rbac';
import { isLeadershipPreview, isProductionEnvironment } from './config/environment';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MinistriesPage } from './pages/MinistriesPage';
import { MinistryDetailPage } from './pages/MinistryDetailPage';
import { SermonsPage } from './pages/SermonsPage';
import { SermonDetailPage } from './pages/SermonDetailPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { PrayerPage } from './pages/PrayerPage';
import { ChurchesPage } from './pages/ChurchesPage';
import { ChurchDetailPage } from './pages/ChurchDetailPage';
import { ContactPage } from './pages/ContactPage';
import { VisitPage } from './pages/VisitPage';
import { SearchPage } from './pages/SearchPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages & Guards
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPagesPage } from './pages/admin/AdminPagesPage';
import { AdminMinistriesPage } from './pages/admin/AdminMinistriesPage';
import { AdminSermonsPage } from './pages/admin/AdminSermonsPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminChurchesPage } from './pages/admin/AdminChurchesPage';
import { AdminLeadershipPage } from './pages/admin/AdminLeadershipPage';
import { AdminPrayerPage } from './pages/admin/AdminPrayerPage';
import { AdminContactPage } from './pages/admin/AdminContactPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminBrandingPage } from './pages/admin/AdminBrandingPage';
import { AdminGovernancePage } from './pages/admin/AdminGovernancePage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminUnauthorizedPage } from './pages/admin/AdminUnauthorizedPage';
import { AdminAuthLoadingScreen } from './components/admin/AdminAuthLoadingScreen';

interface AdminRouteGuardProps {
  cleanPath: string;
  navigateTo: (path: string) => void;
}

function getRequiredPermissionForRoute(path: string): Permission {
  if (path === '/admin/pages') return 'pages.read';
  if (path === '/admin/ministries') return 'ministries.read';
  if (path === '/admin/sermons') return 'sermons.read';
  if (path === '/admin/events') return 'events.read';
  if (path === '/admin/churches') return 'churches.read';
  if (path === '/admin/leadership') return 'leadership.read';
  if (path === '/admin/prayer') return 'prayer.read';
  if (path === '/admin/contact') return 'contact.read';
  if (path === '/admin/media') return 'media.read';
  if (path === '/admin/settings') return 'settings.read';
  if (path === '/admin/branding') return 'branding.read';
  if (path === '/admin/governance') return 'governance.read';
  if (path === '/admin/users') return 'users.read';
  return 'dashboard.read';
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ cleanPath, navigateTo }) => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { authorizationStatus, isAuthorized, hasPermission } = useAuthorization();

  // 1. Show loading screen while Firebase verifies identity and token claims
  if (authLoading || authorizationStatus === 'loading') {
    return <AdminAuthLoadingScreen />;
  }

  // 2. Explicit Login Route
  if (cleanPath === '/admin/login') {
    if (isAuthenticated) {
      if (isAuthorized) {
        return (
          <AdminShell currentPath="/admin/dashboard" onNavigate={navigateTo}>
            <AdminDashboardPage onNavigate={navigateTo} />
          </AdminShell>
        );
      }
      return <AdminUnauthorizedPage onNavigate={navigateTo} />;
    }
    return <AdminLoginPage onNavigate={navigateTo} />;
  }

  // 3. Explicit Unauthorized Account Route
  if (cleanPath === '/admin/unauthorized') {
    return <AdminUnauthorizedPage onNavigate={navigateTo} />;
  }

  // 4. Protected Admin Sub-routes (/admin/*)
  if (!isAuthenticated) {
    return <AdminLoginPage onNavigate={navigateTo} />;
  }

  if (!isAuthorized) {
    return <AdminUnauthorizedPage onNavigate={navigateTo} />;
  }

  // 5. Granular Module-Level Permission Checking
  const requiredPermission = getRequiredPermissionForRoute(cleanPath);

  if (!hasPermission(requiredPermission)) {
    return (
      <AdminShell currentPath={cleanPath} onNavigate={navigateTo}>
        <AdminUnauthorizedPage
          reasonMessage={`Your assigned administrative role lacks permission to view the requested management module (${cleanPath}).`}
          requiredPermission={requiredPermission}
          onNavigate={navigateTo}
        />
      </AdminShell>
    );
  }

  // Render authorized admin module content
  const renderAdminContent = () => {
    switch (cleanPath) {
      case '/admin':
      case '/admin/dashboard':
        return <AdminDashboardPage onNavigate={navigateTo} />;
      case '/admin/pages':
        return <AdminPagesPage />;
      case '/admin/ministries':
        return <AdminMinistriesPage />;
      case '/admin/sermons':
        return <AdminSermonsPage />;
      case '/admin/events':
        return <AdminEventsPage />;
      case '/admin/churches':
        return <AdminChurchesPage />;
      case '/admin/leadership':
        return <AdminLeadershipPage />;
      case '/admin/prayer':
        return <AdminPrayerPage />;
      case '/admin/contact':
        return <AdminContactPage />;
      case '/admin/media':
        return <AdminMediaPage />;
      case '/admin/settings':
        return <AdminSettingsPage />;
      case '/admin/branding':
        return <AdminBrandingPage />;
      case '/admin/governance':
        return <AdminGovernancePage />;
      case '/admin/users':
        return <AdminUsersPage />;
      default:
        return <AdminDashboardPage onNavigate={navigateTo} />;
    }
  };

  return (
    <AdminShell currentPath={cleanPath} onNavigate={navigateTo}>
      {renderAdminContent()}
    </AdminShell>
  );
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo(0, 0);
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('/')) {
        const href = anchor.getAttribute('href')!;
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
          e.preventDefault();
          navigateTo(href);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Configure preview indexing safeguard (noindex, nofollow for preview environment or admin routes)
  useEffect(() => {
    let robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }

    const cleanPath = currentPath.split('?')[0].split('#')[0];
    const isPrivateOrAdminRoute = cleanPath.startsWith('/admin') || cleanPath === '/prayer' || cleanPath === '/contact';

    if (isLeadershipPreview() || isPrivateOrAdminRoute || !isProductionEnvironment()) {
      robotsMeta.content = 'noindex, nofollow';
    } else {
      robotsMeta.content = 'index, follow';
    }
  }, [currentPath]);

  const cleanPath = currentPath.split('?')[0].split('#')[0];

  // Dedicated Admin Route Branch
  if (cleanPath.startsWith('/admin')) {
    return (
      <AuthProvider>
        <AuthorizationProvider>
          <AdminRouteGuard cleanPath={cleanPath} navigateTo={navigateTo} />
        </AuthorizationProvider>
      </AuthProvider>
    );
  }

  const renderPage = () => {
    if (cleanPath.startsWith('/ministries/') && cleanPath.length > 12) {
      const slug = cleanPath.replace('/ministries/', '');
      return <MinistryDetailPage slug={slug} />;
    }

    if (cleanPath.startsWith('/sermons/') && cleanPath.length > 9) {
      const slug = cleanPath.replace('/sermons/', '');
      return <SermonDetailPage slug={slug} />;
    }

    if (cleanPath.startsWith('/events/') && cleanPath.length > 8) {
      const slug = cleanPath.replace('/events/', '');
      return <EventDetailPage slug={slug} />;
    }

    if (cleanPath.startsWith('/churches/') && cleanPath.length > 10) {
      const slug = cleanPath.replace('/churches/', '');
      return <ChurchDetailPage slug={slug} />;
    }

    if (cleanPath.startsWith('/contact/') && cleanPath.length > 9) {
      const topicSlug = cleanPath.replace('/contact/', '');
      return <ContactPage topicSlug={topicSlug} />;
    }

    switch (cleanPath) {
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/ministries':
        return <MinistriesPage />;
      case '/sermons':
        return <SermonsPage />;
      case '/events':
        return <EventsPage />;
      case '/prayer':
      case '/prayer-request':
        return <PrayerPage />;
      case '/churches':
        return <ChurchesPage />;
      case '/contact':
        return <ContactPage />;
      case '/visit':
        return <VisitPage />;
      case '/search':
        return <SearchPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <AuthProvider>
      <SiteProvider>
        <AppShell currentPath={currentPath}>
          {renderPage()}
        </AppShell>
      </SiteProvider>
    </AuthProvider>
  );
}
