# Project Nehemiah — Firebase Integration & Security Architecture

This directory contains the centralized Firebase Web SDK integration layer, domain-driven service boundaries, and security architecture for Church of God – Subic.

---

## 1. Required Firebase Environment Variables

Configure the following environment variables using standard Vite conventions in `.env` or deployment runtime secrets:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_ENABLE_MOCK_ADMIN=false
```

> **Security Note:** Never commit actual API keys or secret values into version control. Use `.env.example` as a key blueprint.

---

## 2. Initialization & Module Architecture

Firebase services are initialized defensively in `src/firebase/firebase.ts`:

- `src/firebase/config.ts`: Environment variable inspection and validation.
- `src/firebase/firebase.ts`: Central SDK initialization (`app`, `auth`, `db`, `storage`).
- `src/firebase/errors.ts`: Error normalizer with strict privacy guards.
- `src/firebase/auth.ts`: Auth service boundary (`signInWithGoogle`, `signOutUser`, `getUserTokenClaims`, state listeners).
- `src/firebase/firestore.ts`: Database service boundary (`getCollectionDocs`, `setDocById`, etc.).
- `src/firebase/storage.ts`: Asset storage boundary (`uploadAsset`, `deleteAsset`).
- `src/firebase/types.ts`: Collection name constants and taxonomy.
- `src/types/rbac.ts`: Canonical Admin Roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `MEDIA_ADMIN`, `PRAYER_ADMIN`, `MINISTRY_EDITOR`, `READ_ONLY`) and granular `Permission` keys.
- `src/config/rbac.ts`: Centralized Role-Permission Matrix.
- `src/context/AuthorizationContext.tsx`: Granular authorization state management and ID token custom claim inspection.

---

## 3. Role-Based Access Control (RBAC) Architecture (Stage 6C)

### Core Security Philosophy
1. **Authentication Proves Identity (`AuthContext`)**: Verifies who the user is via Google Identity.
2. **Authorization Determines Permissions (`AuthorizationContext`)**: Inspects Firebase ID Token custom claims (`role`, `permissions`) to authorize module access and UI actions.
3. **Canonical Technical Roles vs. Organizational Titles**: Technical roles (`SUPER_ADMIN`, `EDITOR`, etc.) determine system privileges. Church titles (e.g. Pastor, Bishop, Secretary) are display metadata only.
4. **Server-Side Custom Claim Authority**: Custom claims (`request.auth.token.role`) MUST be set via the Firebase Admin SDK in a trusted server environment. Client React code cannot self-assign custom claims.
5. **Fail-Closed Security**: Unrecognized or missing roles result in immediate `unauthorized` status and access denial.

### Canonical Role Matrix

| Technical Role | Description | Core Scope |
| :--- | :--- | :--- |
| `SUPER_ADMIN` | System Owner | Unrestricted access across all CMS modules, user management, and security audit logs. |
| `ADMIN` | General Administrator | Broad CMS content, media, governance, and site settings management. (Excludes `users.manage` & private prayer/contact access by default). |
| `EDITOR` | Content Publisher | Public website content editing (`pages`, `sermons`, `events`, `ministries`, `churches`, `leadership`). |
| `MEDIA_ADMIN` | Media Specialist | Asset library upload/deletion, sermon video/audio media archives. |
| `PRAYER_ADMIN` | Prayer Lead | Confidential prayer requests (`prayer.read`, `prayer.update`) & contact inquiries (`contact.read`, `contact.update`). |
| `MINISTRY_EDITOR` | Department Lead | Scoped editing for assigned church ministries and events. |
| `READ_ONLY` | Auditor / Inspector | Read-only inspection across CMS modules with zero mutation rights. |

---

## 4. Collection Taxonomy & Private Data Boundaries

### Public / Published CMS Collections
- `site_settings`: Global header/footer parameters, service times, branding configuration.
- `pages`: Dynamic page content and SEO metadata.
- `ministries`: Department profiles, leaders, meeting schedules.
- `sermons`: Public sermon archive records and video links.
- `sermon_series`: Audio/video sermon series groupings.
- `events`: Church calendar events and announcements.
- `churches`: Subic sanctuary record and candidate church locations across Zambales.
- `leaders`: Verified leadership roster.
- `media`: Centralized media asset library metadata.
- `users`: Administrative RBAC user accounts and metadata.

### STRICTLY PRIVATE COLLECTIONS (Restricted Access)
- `prayer_requests`: Confidential prayer submissions.
- `contact_inquiries`: Private website contact form messages.

> **Security Boundary Architecture:**
> - **UI / Repository Guard** = Application safety boundary (prevents accidental public UI reads).
> - **Firestore Security Rules** = Actual client database authorization boundary (Stage 6E).
> - **Trusted Firebase Admin SDK/backend** = Privileged server boundary.
>
> *Important:* Until Stage 6E Firestore Security Rules are deployed, client-side repository guards serve strictly as application safety mechanisms and MUST NOT be described as database-level authorization boundaries.

---

## 5. Security Rules Architecture (`firestore.rules`) — Stage 6E

Firestore Security Rules enforce custom claim roles directly at the database level:

### Core Authority Principles
1. **Server-Issued Custom Claim Authority**: Custom claim `request.auth.token.role` is the ONLY source of truth for database authorization. User documents (`users/{uid}.role`) are profile metadata and NEVER grant authorization.
2. **Fail-Closed Enforcement**: Unrecognized or missing roles receive zero privileged access.
3. **Public CMS Read Filtering**: Unauthenticated public reads are allowed ONLY when `resource.data.status == 'published'`. Drafts, archived, and pending-verification items are restricted to authorized CMS administrators.
4. **Strict Privacy Isolation**:
   - `prayer_requests`: Admin access allowed for `SUPER_ADMIN` and `PRAYER_ADMIN` ONLY (`ADMIN` is explicitly denied). Public `create` supported with strict field allowlists and type constraints. Public reads/updates/deletes are strictly denied.
   - `contact_inquiries`: Admin access allowed for `SUPER_ADMIN` and `ADMIN` ONLY (`PRAYER_ADMIN` is explicitly denied). Public `create` supported with strict field allowlists and type constraints. Public reads/updates/deletes are strictly denied.
5. **Audit Logs & User Account Safety**: `audit_logs` writes are denied to browser clients (server Admin SDK only). Users cannot self-elevate security fields (`role`, `permissions`, `claims`) on `users/{uid}`.

### Firebase Emulator Testing Plan & Verification (Stage 6E.1)
- **Local Emulator Command**: `firebase emulators:start --only firestore`
- **Environment Dependency Analysis**: `firebase` CLI v15.24.0 is available, but the local Java runtime (`java`) is not installed in the container environment. The Firestore Emulator `.jar` requires Java JRE/JDK 11+ to start.
- **Static Security & Schema Audit (Stage 6E.1 Executed)**:
  - **Fail-Closed Custom Claim Handling**: Corrected `getUserRole()` helper in `/firestore.rules` to check custom claims against an explicit list of canonical roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `MEDIA_ADMIN`, `PRAYER_ADMIN`, `MINISTRY_EDITOR`, `READ_ONLY`). Missing, malformed, or unknown roles (e.g., `"PASTOR"`, `"SUPERADMIN"`, `""`, `null`) return `'NONE'` and fail closed.
  - **Prayer & Contact Schema Alignment**: Verified and expanded `create` rules in `prayer_requests` and `contact_inquiries` to validate all fields (`visibility`, `consent`, `submittedAt`/`createdAt`, `name`, `email`, `phone`, `request`/`message`), enforcing string size limits and required boolean consent flags.
  - **Adversarial Field Injection Rejection**: Confirmed that `hasOnly` strict allowlists reject unauthorized field injection (`assignedTo`, `internalNotes`, `verifiedBy`, `permissions`, `role`).
  - **Privacy Isolation Verification**: `PRAYER_ADMIN` cannot read `contact_inquiries`, and `ADMIN` cannot read `prayer_requests`. Both private collections are completely hidden from public reads.

> **Deployment Warning:** Do NOT deploy `firestore.rules` to a production Firebase project or run data migration until Stage 6G. Ensure custom claims are properly provisioned via trusted server Admin SDK before switching production builds to `VITE_DATA_SOURCE=firestore`.

---

## 6. Firestore Repository Architecture (Stage 6D)

### Repository Layer Hierarchy
```
React UI
  ↓
Domain Service
  ↓
Repository Interface (src/repositories/types.ts)
  ↓                                  ↓
Local Adapter (src/repositories/local)    Firestore Adapter (src/repositories/firestore)
  ↓                                  ↓
Static Demo Data                   Firebase Firestore SDK (with converters)
```

### Data Converters & Serialization (`src/firebase/converters/`)
- `src/firebase/converters/timestamp.ts`: Normalizes Firestore `Timestamp` objects, ISO strings, and JS `Date` instances into ISO 8601 strings. Converts dates to `Timestamp.fromDate()` or `serverTimestamp()` on writes.
- `src/firebase/converters/index.ts`: Type-safe Firestore converters for `sermons`, `events`, `ministries`, `churches`, `leaders`, `pages`, `site_settings`, `users`, and `governance_queue`.

### Repository Interfaces & Adapters
1. **Sermons (`ISermonRepository`)**: `getById`, `getBySlug`, `list`, `listPublished`, `getFeatured`, `create`, `update`, `archive`.
2. **Events (`IEventRepository`)**: `getById`, `getBySlug`, `list`, `listPublished`, `getFeatured`, `create`, `update`, `archive`.
3. **Ministries (`IMinistryRepository`)**: `getById`, `getBySlug`, `list`, `listPublished`, `getFeatured`, `create`, `update`, `archive`.
4. **Churches (`IChurchRepository`)**: `getById`, `getBySlug`, `list`, `listPublished`, `create`, `update`, `archive`.
5. **Leadership (`ILeadershipRepository`)**: `getById`, `list`, `listPublished`, `create`, `update`.
6. **Pages (`IPageRepository`)**: `getBySlug`, `list`, `update`.
7. **Site Settings (`ISiteSettingsRepository`)**: `getGlobalSettings`, `updateGlobalSettings`.
8. **Navigation (`INavigationRepository`)**: `listNavItems`, `updateNavItem`.
9. **Users (`IUserRepository`)**: `getByUid`, `list`, `create`, `update`.
10. **Governance Queue (`IGovernanceRepository`)**: `listPendingItems`, `getById`, `create`, `updateStatus`.

---

## 7. Migration Strategy & Duplication Cleanup

### Current Static Data Mapping
- `sermonData.ts` → `sermons` collection
- `eventData.ts` → `events` collection
- `ministryData.ts` → `ministries` collection
- `churchData.ts` → `churches` collection
- `aboutData.ts` → `leaders`, `pages/about` collections
- `visitData.ts` → `pages/visit` collection
- `contactData.ts` → `pages/contact` collection

### Legacy Duplication Resolution
Currently, `churchData.ts` embeds duplicate copies of `sermonsData`, `eventsData`, and `ministriesData`.
**Canonical Resolution Rule:** The standalone datasets (`sermonData.ts`, `eventData.ts`, `ministryData.ts`) are designated as the sole canonical source during data migration to avoid duplicate records in Firestore.

---

## 8. Firestore Index Planning

Required composite indexes for Stage 6E/6F deployment:
1. `sermons`: `status` (ASC) + `date` (DESC)
2. `sermons`: `status` (ASC) + `featured` (ASC) + `date` (DESC)
3. `events`: `status` (ASC) + `startDate` (ASC)
4. `events`: `status` (ASC) + `category` (ASC) + `startDate` (ASC)
5. `ministries`: `status` (ASC) + `displayOrder` (ASC)
6. `churches`: `status` (ASC) + `province` (ASC) + `displayOrder` (ASC)
7. `leaders`: `status` (ASC) + `displayOrder` (ASC)
8. `governance_queue`: `currentStatus` (ASC) + `submittedAt` (DESC)

---

## 9. Implementation Roadmap

- **Stage 6A (Complete):** Firebase Foundation & Configuration Layer.
- **Stage 6B (Complete):** Firebase Authentication & Google Identity (`/admin/login`, `AuthContext`, `AdminRouteGuard`).
- **Stage 6C (Complete):** Role-Based Access Control Foundation (`AuthorizationContext`, `PermissionGate`, canonical roles, navigation filtering).
- **Stage 6C.1 (Complete):** Final RBAC Security Audit & Permission Decoupling.
- **Stage 6D (Complete):** Firestore Data Architecture & Repository Foundation.
- **Stage 6E (Complete):** Firestore Security Rules (`firestore.rules`) & Field Validation.
- **Stage 6F (Complete):** Private Collections & Submission Workflows (`prayer_requests`, `contact_inquiries`).
- **Stage 6G (Complete):** Trusted Backend Architecture, Admin SDK Isolation & Role Provisioning Foundation (`backend/`).
- **Stage 6H:** Live Admin CMS Migration & Storage Asset Uploads.

