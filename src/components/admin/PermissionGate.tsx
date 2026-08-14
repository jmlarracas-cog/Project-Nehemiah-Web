/**
 * Project Nehemiah — Action & View Permission Gate Component
 * Declarative component for guarding UI controls and content blocks based on granular permissions.
 */

import React from 'react';
import { useAuthorization } from '../../context/AuthorizationContext';
import { Permission } from '../../types/rbac';

interface PermissionGateProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuthorization();

  let isAllowed = false;

  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    isAllowed = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    // If no permission criteria provided, allow by default
    isAllowed = true;
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
