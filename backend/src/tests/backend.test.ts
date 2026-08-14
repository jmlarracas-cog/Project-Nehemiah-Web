/**
 * Project Nehemiah — Backend Unit Test Suite
 * Local automated verification for backend security, role validation,
 * self-elevation guards, and privacy filtering.
 */

import { RoleProvisioningService } from '../roles/provisioningService.js';
import { AuditService } from '../audit/logger.js';
import { PrivilegedCmsService } from '../cms/privilegedOps.js';
import { CANONICAL_ROLES, CanonicalRole } from '../types/index.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[TEST FAILED] ${message}`);
  }
}

function assertThrows(fn: () => void, expectedMessageFragment: string, testName: string) {
  try {
    fn();
    throw new Error(`[TEST FAILED] ${testName}: Expected error was not thrown.`);
  } catch (err: any) {
    if (err.message?.includes(expectedMessageFragment)) {
      // Passed
      return;
    }
    throw new Error(`[TEST FAILED] ${testName}: Unexpected error message: "${err.message}". Expected fragment: "${expectedMessageFragment}".`);
  }
}

async function runBackendTests() {
  console.log('==================================================');
  console.log('Project Nehemiah — Stage 6G Local Backend Tests');
  console.log('==================================================\n');

  let passed = 0;

  // TEST 1: Canonical Role Validation (Valid Roles)
  console.log('Test 1: Valid Canonical Role Inputs');
  for (const role of CANONICAL_ROLES) {
    const validated = RoleProvisioningService.validateRole(role.toLowerCase());
    assert(validated === role, `Expected ${role}, got ${validated}`);
  }
  console.log('  ✔ Passed (All 7 canonical roles validated correctly)');
  passed++;

  // TEST 2: Canonical Role Validation (Invalid Roles - No Default Fallbacks)
  console.log('Test 2: Invalid Role Inputs Reject strictly without Fallback');
  assertThrows(
    () => RoleProvisioningService.validateRole('GOD_MODE'),
    "Invalid canonical role 'GOD_MODE'",
    'Invalid role GOD_MODE'
  );
  assertThrows(
    () => RoleProvisioningService.validateRole('ROOT_USER'),
    "Invalid canonical role 'ROOT_USER'",
    'Invalid role ROOT_USER'
  );
  assertThrows(
    () => RoleProvisioningService.validateRole(''),
    'Role parameter is required',
    'Empty role parameter'
  );
  console.log('  ✔ Passed (Invalid roles throw safe errors without fallback)');
  passed++;

  // TEST 3: Self-Elevation Guard (Non-SUPER_ADMIN assigning SUPER_ADMIN)
  console.log('Test 3: Self-Elevation & Privilege Escalation Protection');
  const service = new RoleProvisioningService();

  try {
    await service.assignRole(
      { uid: 'admin-001', role: 'ADMIN' },
      'target-user-002',
      'SUPER_ADMIN'
    );
    throw new Error('Self-elevation guard failed: ADMIN assigned SUPER_ADMIN!');
  } catch (err: any) {
    assert(
      err.message.includes('Only a SUPER_ADMIN can assign the SUPER_ADMIN role'),
      `Unexpected error message: ${err.message}`
    );
  }
  console.log('  ✔ Passed (Non-SUPER_ADMIN blocked from granting SUPER_ADMIN)');
  passed++;

  // TEST 4: Audit Log Privacy Filter (Redacts Sensitive Text)
  console.log('Test 4: Audit Log Privacy Metadata Redaction');
  const rawMetadata = {
    targetEmail: 'member@example.com',
    request: 'Privately logging sensitive prayer request content here',
    contactMessage: 'Privately logging contact inquiry message text here',
    nonSensitiveTag: 'PROVISIONING_METADATA_OK',
  };

  const sanitized = AuditService.sanitizeMetadata(rawMetadata);
  assert(sanitized.request === '[REDACTED_PRIVACY_PROTECTED]', 'Prayer request content was not redacted!');
  assert(sanitized.contactMessage === '[REDACTED_PRIVACY_PROTECTED]', 'Contact message content was not redacted!');
  assert(sanitized.nonSensitiveTag === 'PROVISIONING_METADATA_OK', 'Non-sensitive metadata was incorrectly altered!');
  console.log('  ✔ Passed (Prayer/contact sensitive metadata successfully redacted)');
  passed++;

  // TEST 5: Privacy Domain Access Rules (Prayer vs Contact Isolation)
  console.log('Test 5: Privacy Domain Access Policy Guards');
  // Prayer access: ADMIN should be denied, PRAYER_ADMIN and SUPER_ADMIN allowed
  assertThrows(
    () => PrivilegedCmsService.verifyPrayerAccess('ADMIN'),
    'Unauthorized: Access to prayer submissions requires PRAYER_ADMIN or SUPER_ADMIN',
    'Prayer access denied for ADMIN'
  );
  PrivilegedCmsService.verifyPrayerAccess('PRAYER_ADMIN');
  PrivilegedCmsService.verifyPrayerAccess('SUPER_ADMIN');

  // Contact access: PRAYER_ADMIN should be denied, ADMIN and SUPER_ADMIN allowed
  assertThrows(
    () => PrivilegedCmsService.verifyContactAccess('PRAYER_ADMIN'),
    'Unauthorized: Access to contact inquiries requires ADMIN or SUPER_ADMIN',
    'Contact access denied for PRAYER_ADMIN'
  );
  PrivilegedCmsService.verifyContactAccess('ADMIN');
  PrivilegedCmsService.verifyContactAccess('SUPER_ADMIN');

  console.log('  ✔ Passed (Prayer and Contact privacy domain isolation enforced)');
  passed++;

  console.log('\n--------------------------------------------------');
  console.log(`ALL ${passed} BACKEND ARCHITECTURE TESTS PASSED SUCCESSFULLY!`);
  console.log('--------------------------------------------------\n');
}

runBackendTests().catch((err) => {
  console.error('Backend Test Suite Failed:', err);
  process.exit(1);
});
