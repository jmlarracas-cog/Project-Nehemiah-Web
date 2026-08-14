/**
 * Project Nehemiah — Initial SUPER_ADMIN Bootstrap Module
 * Controlled script for initial administrative account provisioning.
 *
 * BOOTSTRAP SAFETY RULES:
 * - NO AUTOMATIC PRIVILEGE ASSIGNMENT based on first user creation or email matching.
 * - MUST be explicitly invoked via trusted backend execution with an exact UID.
 * - NO hardcoded user emails or credentials in source code.
 */

import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '../admin.js';
import { AuditService } from '../audit/logger.js';
import type { ProvisioningResult } from '../types/index.js';

export async function bootstrapFirstSuperAdmin(
  targetUid: string,
  operatorTag: string = 'CLI_MANUAL_BOOTSTRAP'
): Promise<ProvisioningResult> {
  if (!targetUid || typeof targetUid !== 'string' || targetUid.trim() === '') {
    throw new Error('Bootstrap error: Target UID is required and cannot be empty.');
  }

  const cleanUid = targetUid.trim();

  try {
    const auth = getAdminAuth();
    const db = getAdminDb();
    const auditService = new AuditService();

    // Verify user exists in Firebase Auth before assigning claims
    const userRecord = await auth.getUser(cleanUid);

    // Set custom claim directly
    await auth.setCustomUserClaims(cleanUid, { role: 'SUPER_ADMIN' });

    // Sync profile metadata in Firestore
    const userRef = db.collection('users').doc(cleanUid);
    await userRef.set(
      {
        uid: cleanUid,
        email: userRecord.email || '',
        displayName: userRecord.displayName || 'Super Admin',
        role: 'SUPER_ADMIN',
        isSuperAdminBootstrapped: true,
        claimsUpdatedAt: FieldValue.serverTimestamp(),
        bootstrappedBy: operatorTag,
      },
      { merge: true }
    );

    // Write authoritative audit log
    await auditService.logEvent({
      eventType: 'SUPER_ADMIN_BOOTSTRAPPED',
      actorUid: operatorTag,
      actorRole: 'SUPER_ADMIN',
      targetType: 'user_account',
      targetId: cleanUid,
      metadata: {
        email: userRecord.email ? '[REDACTED_OR_LOGGED]' : undefined,
        note: 'First SUPER_ADMIN manually bootstrapped via CLI process.',
      },
    });

    return {
      success: true,
      uid: cleanUid,
      assignedRole: 'SUPER_ADMIN',
      message: `Initial SUPER_ADMIN successfully bootstrapped for user UID '${cleanUid}'.`,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    throw new Error(`Bootstrap failed for UID '${cleanUid}': ${err?.message || 'Internal provisioning error.'}`);
  }
}
