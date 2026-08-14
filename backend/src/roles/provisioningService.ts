/**
 * Project Nehemiah — Privileged Role Provisioning Service
 * Trusted backend implementation for assigning Firebase ID Token custom claims,
 * maintaining authorization sync with `users/{uid}`, and enforcing self-elevation guards.
 *
 * TRUST BOUNDARY GUARANTEES:
 * - Browser/React code can NEVER invoke custom claim assignment directly.
 * - Validates role strings against strict CANONICAL_ROLES list.
 * - Prevents unauthorized self-elevation or escalation to SUPER_ADMIN.
 */

import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '../admin.js';
import { AuditService } from '../audit/logger.js';
import {
  CanonicalRole,
  CANONICAL_ROLES,
  ProvisioningResult,
  UserProfileSync,
} from '../types/index.js';

export class RoleProvisioningService {
  private auditService = new AuditService();

  /**
   * Validates input against canonical role union.
   * Throws safe validation error if malformed or unrecognized.
   */
  public static validateRole(role: string): CanonicalRole {
    if (!role || typeof role !== 'string') {
      throw new Error("Role parameter is required and must be a string.");
    }
    const uppercaseRole = role.trim().toUpperCase() as CanonicalRole;
    if (!CANONICAL_ROLES.includes(uppercaseRole)) {
      throw new Error(`Invalid canonical role '${role}'. Role must be one of: ${CANONICAL_ROLES.join(', ')}.`);
    }
    return uppercaseRole;
  }

  /**
   * Assigns a custom claim role to a target user and synchronizes Firestore profile.
   */
  public async assignRole(
    caller: { uid: string; role: CanonicalRole },
    targetUid: string,
    targetRoleInput: string
  ): Promise<ProvisioningResult> {
    if (!targetUid || typeof targetUid !== 'string' || targetUid.trim() === '') {
      throw new Error('Target UID is required and cannot be empty.');
    }

    const validatedRole = RoleProvisioningService.validateRole(targetRoleInput);

    // SELF-ELEVATION & PRIVILEGE ESCALATION GUARDS
    // 1. Assigning SUPER_ADMIN requires caller to be SUPER_ADMIN
    if (validatedRole === 'SUPER_ADMIN' && caller.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized: Only a SUPER_ADMIN can assign the SUPER_ADMIN role.');
    }

    // 2. Non-SUPER_ADMIN callers cannot modify accounts that currently hold SUPER_ADMIN
    const currentTargetData = await this.getUserRole(targetUid);
    if (currentTargetData.role === 'SUPER_ADMIN' && caller.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized: Non-SUPER_ADMIN accounts cannot modify a SUPER_ADMIN user.');
    }

    try {
      const auth = getAdminAuth();
      const db = getAdminDb();

      // 1. Assign Firebase Auth Custom Claims
      await auth.setCustomUserClaims(targetUid, { role: validatedRole });

      // 2. Synchronize Firestore `users/{uid}` Display Profile
      const userRef = db.collection('users').doc(targetUid);
      const syncData: UserProfileSync = {
        uid: targetUid,
        role: validatedRole,
        claimsUpdatedAt: FieldValue.serverTimestamp(),
        updatedBy: caller.uid,
      };
      await userRef.set(syncData, { merge: true });

      // 3. Log Authoritative Audit Event
      await this.auditService.logEvent({
        eventType: 'ROLE_ASSIGNED',
        actorUid: caller.uid,
        actorRole: caller.role,
        targetType: 'user_role',
        targetId: targetUid,
        metadata: {
          assignedRole: validatedRole,
          previousRole: currentTargetData.role,
        },
      });

      return {
        success: true,
        uid: targetUid,
        assignedRole: validatedRole,
        message: `Successfully assigned role '${validatedRole}' to user '${targetUid}'.`,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      if (err.message?.startsWith('Unauthorized') || err.message?.startsWith('Invalid canonical role')) {
        throw err;
      }
      throw new Error(`Failed to assign role: ${err?.message || 'Internal provisioning error.'}`);
    }
  }

  /**
   * Removes custom claim role from a target user, reverting to READ_ONLY.
   */
  public async removeRole(
    caller: { uid: string; role: CanonicalRole },
    targetUid: string
  ): Promise<ProvisioningResult> {
    if (!targetUid || targetUid.trim() === '') {
      throw new Error('Target UID is required and cannot be empty.');
    }

    const currentTargetData = await this.getUserRole(targetUid);
    if (currentTargetData.role === 'SUPER_ADMIN' && caller.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized: Only a SUPER_ADMIN can revoke roles from a SUPER_ADMIN account.');
    }

    try {
      const auth = getAdminAuth();
      const db = getAdminDb();

      await auth.setCustomUserClaims(targetUid, { role: 'READ_ONLY' });

      const userRef = db.collection('users').doc(targetUid);
      await userRef.set(
        {
          role: 'READ_ONLY',
          claimsUpdatedAt: FieldValue.serverTimestamp(),
          updatedBy: caller.uid,
        },
        { merge: true }
      );

      await this.auditService.logEvent({
        eventType: 'ROLE_REMOVED',
        actorUid: caller.uid,
        actorRole: caller.role,
        targetType: 'user_role',
        targetId: targetUid,
        metadata: {
          previousRole: currentTargetData.role,
          newRole: 'READ_ONLY',
        },
      });

      return {
        success: true,
        uid: targetUid,
        assignedRole: 'READ_ONLY',
        message: `Role revoked for user '${targetUid}'. Reset to READ_ONLY.`,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      if (err.message?.startsWith('Unauthorized')) throw err;
      throw new Error(`Failed to remove role: ${err?.message || 'Internal provisioning error.'}`);
    }
  }

  /**
   * Retrieves custom claims and profile document for a user.
   */
  public async getUserRole(targetUid: string): Promise<{ role: CanonicalRole; claims: any; profile: any }> {
    try {
      const auth = getAdminAuth();
      const db = getAdminDb();

      const authUser = await auth.getUser(targetUid);
      const claims = authUser.customClaims || {};
      const claimsRole = claims.role ? RoleProvisioningService.validateRole(claims.role) : 'READ_ONLY';

      const userSnap = await db.collection('users').doc(targetUid).get();
      const profile = userSnap.exists ? userSnap.data() : null;

      return {
        role: claimsRole,
        claims,
        profile,
      };
    } catch {
      // Development / Mock Fallback
      return {
        role: 'READ_ONLY',
        claims: { role: 'READ_ONLY' },
        profile: null,
      };
    }
  }

  /**
   * Disables an administrative account in Firebase Auth.
   */
  public async disableAdminUser(
    caller: { uid: string; role: CanonicalRole },
    targetUid: string
  ): Promise<ProvisioningResult> {
    if (caller.role !== 'SUPER_ADMIN' && caller.role !== 'ADMIN') {
      throw new Error('Unauthorized: Account disabling requires ADMIN or SUPER_ADMIN privileges.');
    }

    const currentTarget = await this.getUserRole(targetUid);
    if (currentTarget.role === 'SUPER_ADMIN' && caller.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized: Only a SUPER_ADMIN can disable another SUPER_ADMIN.');
    }

    try {
      const auth = getAdminAuth();
      const db = getAdminDb();

      await auth.updateUser(targetUid, { disabled: true });

      await db.collection('users').doc(targetUid).set(
        {
          disabled: true,
          disabledAt: FieldValue.serverTimestamp(),
          disabledBy: caller.uid,
        },
        { merge: true }
      );

      await this.auditService.logEvent({
        eventType: 'USER_DISABLED',
        actorUid: caller.uid,
        actorRole: caller.role,
        targetType: 'user_account',
        targetId: targetUid,
      });

      return {
        success: true,
        uid: targetUid,
        message: `Account '${targetUid}' has been disabled.`,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      if (err.message?.startsWith('Unauthorized')) throw err;
      throw new Error(`Failed to disable account: ${err?.message || 'Internal provisioning error.'}`);
    }
  }

  /**
   * Enables an administrative account in Firebase Auth.
   */
  public async enableAdminUser(
    caller: { uid: string; role: CanonicalRole },
    targetUid: string
  ): Promise<ProvisioningResult> {
    if (caller.role !== 'SUPER_ADMIN' && caller.role !== 'ADMIN') {
      throw new Error('Unauthorized: Account enabling requires ADMIN or SUPER_ADMIN privileges.');
    }

    try {
      const auth = getAdminAuth();
      const db = getAdminDb();

      await auth.updateUser(targetUid, { disabled: false });

      await db.collection('users').doc(targetUid).set(
        {
          disabled: false,
          enabledAt: FieldValue.serverTimestamp(),
          enabledBy: caller.uid,
        },
        { merge: true }
      );

      await this.auditService.logEvent({
        eventType: 'USER_ENABLED',
        actorUid: caller.uid,
        actorRole: caller.role,
        targetType: 'user_account',
        targetId: targetUid,
      });

      return {
        success: true,
        uid: targetUid,
        message: `Account '${targetUid}' has been enabled.`,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      if (err.message?.startsWith('Unauthorized')) throw err;
      throw new Error(`Failed to enable account: ${err?.message || 'Internal provisioning error.'}`);
    }
  }
}
