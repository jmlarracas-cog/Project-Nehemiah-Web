/**
 * Project Nehemiah — Central Authorization Context
 * Manages Role-Based Access Control (RBAC) authorization state, permission checking,
 * ID token claim resolution, and development mock role testing.
 * 
 * SECURITY PRINCIPLES:
 * 1. Authentication proves identity (AuthContext). Authorization determines permissions (AuthorizationContext).
 * 2. Role resolution fails closed: unknown or missing roles result in 'unauthorized' status.
 * 3. Custom claims MUST be assigned from a trusted backend environment using Firebase Admin SDK.
 * 4. Development Mock Mode is DEVELOPMENT ONLY and clearly flagged.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { AdminRole, Permission, isCanonicalRole } from '../types/rbac';
import { ROLE_PERMISSIONS, getPermissionsForRole } from '../config/rbac';
import { getUserTokenClaims, getCurrentAuthUser } from '../firebase/auth';

export type AuthorizationStatus = 'loading' | 'authorized' | 'unauthorized' | 'disabled' | 'error';

export interface AuthorizationContextType {
  role: AdminRole | null;
  permissions: Permission[];
  authorizationStatus: AuthorizationStatus;
  isAuthorized: boolean;
  isMockAdmin: boolean;
  mockRole: AdminRole;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  refreshAuthorization: () => Promise<void>;
  setMockRole: (role: AdminRole) => void;
}

const AuthorizationContext = createContext<AuthorizationContextType | undefined>(undefined);

export const AuthorizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading, isMockAdmin } = useAuth();

  const [role, setRole] = useState<AdminRole | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [authorizationStatus, setAuthorizationStatus] = useState<AuthorizationStatus>('loading');
  const [mockRole, setMockRoleState] = useState<AdminRole>('SUPER_ADMIN');

  /**
   * Resolves user authorization from Firebase ID Token custom claims or Development Mock Mode.
   */
  const resolveAuthorization = useCallback(async (forceTokenRefresh = false) => {
    // 1. Wait for AuthContext loading to complete
    if (authLoading) {
      setAuthorizationStatus('loading');
      return;
    }

    // 2. Development Mock Mode Resolution
    if (isMockAdmin) {
      const activeRole = mockRole;
      setRole(activeRole);
      setPermissions(ROLE_PERMISSIONS[activeRole] || []);
      setAuthorizationStatus('authorized');
      return;
    }

    // 3. Unauthenticated State Resolution
    if (!user) {
      setRole(null);
      setPermissions([]);
      setAuthorizationStatus('unauthorized');
      return;
    }

    // 4. Authenticated Firebase User Claim Inspection
    const fbUser = getCurrentAuthUser();
    if (!fbUser) {
      setRole(null);
      setPermissions([]);
      setAuthorizationStatus('unauthorized');
      return;
    }

    try {
      setAuthorizationStatus('loading');
      const { role: claimRole, permissions: claimPermissions } = await getUserTokenClaims(
        fbUser,
        forceTokenRefresh
      );

      // Validate claimRole against canonical roles (FAIL CLOSED)
      if (claimRole && isCanonicalRole(claimRole)) {
        const validatedRole: AdminRole = claimRole;
        const resolvedPermissions =
          claimPermissions && Array.isArray(claimPermissions)
            ? (claimPermissions as Permission[])
            : getPermissionsForRole(validatedRole);

        setRole(validatedRole);
        setPermissions(resolvedPermissions);
        setAuthorizationStatus('authorized');
      } else {
        // Authenticated Google account has no valid custom claim role assigned
        setRole(null);
        setPermissions([]);
        setAuthorizationStatus('unauthorized');
      }
    } catch (error) {
      setRole(null);
      setPermissions([]);
      setAuthorizationStatus('error');
    }
  }, [authLoading, isMockAdmin, mockRole, user]);

  useEffect(() => {
    resolveAuthorization();
  }, [resolveAuthorization]);

  /**
   * Forces a refresh of Firebase ID Token custom claims.
   */
  const refreshAuthorization = async (): Promise<void> => {
    await resolveAuthorization(true);
  };

  /**
   * Switches active mock role in development preview mode to test UI filtering across canonical roles.
   */
  const setMockRole = (newRole: AdminRole): void => {
    if (!isMockAdmin) {
      console.warn('Mock role switching is only permitted in Development Mock Mode.');
      return;
    }
    setMockRoleState(newRole);
  };

  /**
   * Checks if user possesses a specific permission key.
   */
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (authorizationStatus !== 'authorized' || !role) return false;
      if (role === 'SUPER_ADMIN') return true;
      return permissions.includes(permission);
    },
    [authorizationStatus, role, permissions]
  );

  /**
   * Checks if user possesses ANY of the specified permission keys.
   */
  const hasAnyPermission = useCallback(
    (perms: Permission[]): boolean => {
      if (authorizationStatus !== 'authorized' || !role) return false;
      if (role === 'SUPER_ADMIN') return true;
      if (perms.length === 0) return true;
      return perms.some((p) => permissions.includes(p));
    },
    [authorizationStatus, role, permissions]
  );

  /**
   * Checks if user possesses ALL of the specified permission keys.
   */
  const hasAllPermissions = useCallback(
    (perms: Permission[]): boolean => {
      if (authorizationStatus !== 'authorized' || !role) return false;
      if (role === 'SUPER_ADMIN') return true;
      if (perms.length === 0) return true;
      return perms.every((p) => permissions.includes(p));
    },
    [authorizationStatus, role, permissions]
  );

  const isAuthorized = authorizationStatus === 'authorized' && role !== null;

  return (
    <AuthorizationContext.Provider
      value={{
        role,
        permissions,
        authorizationStatus,
        isAuthorized,
        isMockAdmin,
        mockRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        refreshAuthorization,
        setMockRole,
      }}
    >
      {children}
    </AuthorizationContext.Provider>
  );
};

export const useAuthorization = (): AuthorizationContextType => {
  const context = useContext(AuthorizationContext);
  if (!context) {
    throw new Error('useAuthorization must be used within an AuthorizationProvider');
  }
  return context;
};
