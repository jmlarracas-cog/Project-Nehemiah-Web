# Project Nehemiah — Trusted Backend Architecture (Stage 6G)

## 1. Trust Boundary & Architecture

Project Nehemiah enforces a strict security trust boundary between browser/React code and trusted server environments:

```text
CLIENT ARCHITECTURE (Browser / React):
Browser / React (Vite)
      ↓
Firebase Web Auth SDK / Client Firestore SDK
      ↓
Firestore Security Rules (`firestore.rules`)

TRUSTED BACKEND ARCHITECTURE (Node.js / Cloud Functions):
Trusted Backend (`backend/`)
      ↓
Firebase Admin SDK
      ↓
Firebase Authentication / Firestore (Privileged Administrative Operations)
```

**STRICT ISOLATION RULES:**
- The Vite frontend (`src/`) NEVER imports `firebase-admin` or uses service account keys.
- Client React components NEVER set or mutate custom user claims directly.
- The backend source (`backend/`) lives strictly outside the frontend `src/` directory.

---

## 2. Firebase Admin SDK Setup & Credentials

- **Location:** `backend/src/admin.ts`
- **Credential Architecture:** Uses Application Default Credentials (ADC) or standard `FIREBASE_PROJECT_ID` environment variables.
- **Safety Directive:** NO service account private keys are embedded or committed in code. Server secrets are NEVER prefixed with `VITE_`.

---

## 3. Custom Claim Role Model

Custom claims are used exclusively for authoritative authorization:

```json
{
  "role": "CANONICAL_ROLE"
}
```

**Canonical Roles:**
1. `SUPER_ADMIN` — Unrestricted administrative authority.
2. `ADMIN` — Broad CMS and contact administration.
3. `EDITOR` — Public content publishing.
4. `MEDIA_ADMIN` — Sermon and media asset management.
5. `PRAYER_ADMIN` — Isolated prayer submission administration.
6. `MINISTRY_EDITOR` — Location & ministry scoped content editing.
7. `READ_ONLY` — Read-only inspector access.

The full permission matrix (`ROLE_PERMISSIONS`) is evaluated client-side after validating the canonical role claim.

---

## 4. Role Provisioning Service & Self-Elevation Guards

- **Location:** `backend/src/roles/provisioningService.ts`
- **Methods:**
  - `assignRole(caller, targetUid, targetRole)`
  - `removeRole(caller, targetUid)`
  - `getUserRole(targetUid)`
  - `disableAdminUser(caller, targetUid)`
  - `enableAdminUser(caller, targetUid)`

**Role Validation & Guards:**
- Validates inputs strictly against `CANONICAL_ROLES`. Rejects unknown roles with safe errors; NEVER defaults to `ADMIN` or `SUPER_ADMIN`.
- **Self-Elevation Guard:** Assigning or revoking `SUPER_ADMIN` requires the caller to possess `SUPER_ADMIN` privileges. Non-SUPER_ADMIN accounts cannot modify `SUPER_ADMIN` users.

---

## 5. Initial `SUPER_ADMIN` Bootstrap Procedure

- **Location:** `backend/src/auth/bootstrap.ts`
- **Execution:** Executed via trusted CLI or administrative script: `bootstrapFirstSuperAdmin(targetUid, operatorTag)`.
- **Safety Rule:** NO automatic privilege assignment based on first user created, email matching, domain, or Google sign-in.

---

## 6. Users Profile Synchronization

- Custom claim (`role`) serves as the authorization authority.
- The Firestore document `users/{uid}` mirrors display profile metadata (`role`, `claimsUpdatedAt`, `updatedBy`).
- Changes to `users/{uid}` in Firestore DO NOT automatically grant custom claims. Custom claim assignment must originate from `RoleProvisioningService`.

---

## 7. Authoritative Audit Logging & Privacy Controls

- **Location:** `backend/src/audit/logger.ts`
- **Collection:** `audit_logs`
- **Events Logged:** `ROLE_ASSIGNED`, `ROLE_REMOVED`, `USER_DISABLED`, `USER_ENABLED`, `SUPER_ADMIN_BOOTSTRAPPED`, `CONTENT_PUBLISHED`, `CONTENT_ARCHIVED`, `PRAYER_STATUS_CHANGED`, `CONTACT_STATUS_CHANGED`.
- **Privacy Protections:** Strips prayer text, contact inquiry messages, passwords, and tokens before writing to `audit_logs`.

---

## 8. Authoritative Timestamps

All privileged backend actions use `FieldValue.serverTimestamp()` for authoritative timestamps (`claimsUpdatedAt`, `disabledAt`, `publishedAt`, `audit.timestamp`) to eliminate client clock tampering.

---

## 9. Local Development & Deployment Status

- **Billing Status:** No upgrade to Firebase Blaze plan performed during Stage 6G.
- **Deployment Status:** Cloud Functions are NOT deployed in Stage 6G.
- **Testing:** Local unit test suite is executable via `npm run test --prefix backend`.
- **Emulator Gate:** Firebase Emulator testing remains pending Java availability in the environment (mandatory pre-production gate).
