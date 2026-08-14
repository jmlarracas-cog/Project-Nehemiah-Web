# Project Nehemiah — Production Security & Data Governance Architecture
## Church of God – Subic Digital Ministry Platform

This document outlines the security architecture, threat model mitigations, privacy boundaries, and pre-launch hardening measures implemented for **Project Nehemiah** (Church of God – Subic).

---

## 1. Client vs. Server Security Boundaries

### Client-Side (Vite / React)
- **UI Safety & UX Guidance Only**: Role switches, feature toggles, and UI permission gates (`hasPermission()`, `PermissionGate`) improve user experience and navigation.
- **Untrusted Environment**: Client state, local variables, and browser controls are strictly treated as unauthenticated/untrusted inputs by the backend.
- **Development Mock Mode**: Role simulation (`isMockAdmin`) is purely local client state (`useState`). It does **NOT** mint Firebase Auth custom claims, update Firestore permissions, or bypass database rules.

### Backend & Database (Firestore Rules & Trusted Backend)
- **Authoritative Security Boundary**: Database Security Rules (`firestore.rules`) enforce true authorization.
- **Custom Claims Model**: `request.auth.token.role` is the **ONLY** authoritative source for RBAC permissions evaluated by Firestore.
- **Document Metadata**: User documents (`users/{uid}`) hold profile metadata only and are never queried by Firestore rules to grant privileges.

---

## 2. Role-Based Access Control (RBAC) & Canonical Roles

Project Nehemiah enforces seven canonical administrative roles via custom claims:

| Role | Domain Scope & Access Rights |
|---|---|
| `SUPER_ADMIN` | Full root governance across all modules, settings, users, and audit logs. Can manage official brand assets. |
| `ADMIN` | General administrative management across CMS, settings, and **Contact Inquiries**. Denied access to private **Prayer Requests**. |
| `EDITOR` | CMS content creation and updates (Sermons, Events, Ministries, Pages). Denied access to private submissions and system settings. |
| `MEDIA_ADMIN` | Media library and sermon media asset operations. Restricted from modifying official brand asset flags or deleting official assets. |
| `PRAYER_ADMIN` | Strictly isolated read and update access for private **Prayer Requests**. Denied access to **Contact Inquiries**. |
| `MINISTRY_EDITOR` | Scoped editor permissions limited to ministry pages and records. |
| `READ_ONLY` | Read-only administrative preview access. Strictly prohibited from creating, updating, or deleting any documents. |

---

## 3. Privacy & Domain Isolation Boundaries

### Private Domain 1: Prayer Requests (`prayer_requests`)
- **Access Boundary**: Accessible **ONLY** by `SUPER_ADMIN` and `PRAYER_ADMIN`.
- **Exclusion**: `ADMIN`, `EDITOR`, `MEDIA_ADMIN`, `MINISTRY_EDITOR`, and public users are strictly denied read/write access.
- **Public Submissions**: Allowed via unauthenticated `create` rules with strict schema validation, length bounds (10–3000 chars), required consent boolean, and field allowlists.

### Private Domain 2: Contact Inquiries (`contact_inquiries`)
- **Access Boundary**: Accessible **ONLY** by `SUPER_ADMIN` and `ADMIN`.
- **Exclusion**: `PRAYER_ADMIN`, `EDITOR`, `MEDIA_ADMIN`, and public users are strictly denied read access.
- **Public Submissions**: Allowed via unauthenticated `create` rules with strict schema validation, length bounds (10–2000 chars), required consent boolean, and field allowlists.

---

## 4. Official Brand Asset Protection

- **Metadata Flag**: Official brand assets use `isOfficialBrandAsset == true`.
- **UI Boundary**: Administrative UI disables archive and delete controls for official brand assets.
- **Firestore Rule Boundary**:
  - Non-super-admins cannot set `isOfficialBrandAsset == true` during asset creation.
  - Non-super-admins cannot modify or un-set `isOfficialBrandAsset`.
  - Official brand assets cannot be archived (`status != 'archived'`).
  - Official brand asset URLs and asset types cannot be altered.
  - Official brand assets **CANNOT be deleted** via client SDK calls (`allow delete: if ... && resource.data.isOfficialBrandAsset != true`).

---

## 5. Abuse Protection & Form Hardening

- **Public Form Submission Locks**: Prayer and Contact forms lock submit buttons during pending async requests to prevent double-click duplicate submissions.
- **Input Bounds & Normalization**: Text strings are trimmed and bounded by strict length limits before transmission.
- **Error Sanitization**: Errors thrown during submission or authentication are sanitized via `normalizeFirebaseError` to prevent raw backend stack traces or internal schema details from reaching end users.
- **In-Memory Fallback**: Local fallback repositories retain submissions strictly in memory during offline demo mode—never storing confidential prayer text or contact messages in browser `sessionStorage` or `localStorage`.

---

## 6. External Links & Video Link Governance

- **URI Scheme Sanitization**: Central validators (`validateExternalUrl`, `validateAssetUrl`) reject unsafe URI schemes (`javascript:`, `vbscript:`, `data:`, `file:`, `ftp:`, `blob:`) to eliminate script execution vectors.
- **Target Safety**: All external links opening in new browser tabs specify `target="_blank" rel="noopener noreferrer"`.
- **Video Provider Link Classification**:
  - **YouTube & Vimeo**: Converted to canonical embed URLs (`youtube.com/embed/`, `player.vimeo.com/video/`) for iframe rendering.
  - **Facebook & Google Drive**: Classified as external provider links (`isEmbeddable: false`). Rendered with a fallback button opening the external provider source directly in a new window, respecting provider authentication and access policies.

---

## 7. Firebase App Check Architecture & Enforcement Status

- **Architecture Module**: `src/firebase/appCheck.ts` encapsulates Firebase App Check initialization.
- **Provider Support**: Supports reCAPTCHA Enterprise (`ReCaptchaEnterpriseProvider`) or reCAPTCHA v3 / Debug Tokens.
- **Client Initialization vs. Product Enforcement Distinction**:
  - **APP CHECK CLIENT INITIALIZATION**: Prepared in frontend code (`initAppCheck()`). When valid keys exist, the client initializes the SDK and requests attestation tokens.
  - **APP CHECK PRODUCT ENFORCEMENT**: **NOT DEPLOYED / NOT ENFORCED**. App Check enforcement on Firestore database traffic must be explicitly activated in the Firebase Console security settings after domain verification. Client initialization alone does NOT enforce token verification on backend requests until product enforcement is enabled.
- **Deferred Execution**: Safely defers client initialization when `VITE_RECAPTCHA_SITE_KEY` is absent, allowing local development and testing without blocking site boot.
- **Development Debug Token Guard**: App Check debug token setup is strictly guarded by `import.meta.env.DEV` in `src/firebase/appCheck.ts`. Production builds (`import.meta.env.PROD`) will never execute or set debug token logic.

---

## 8. Production Security Headers & CSP Readiness

- **DEPLOYMENT STATUS: NOT DEPLOYED** (Documentation and readiness architecture only; security headers are not applied in the development/preview sandbox so as not to interfere with AI Studio preview iframe rendering).
- **Modern Header Baseline (Recommended for Production Web Server / Cloud Run / Nginx)**:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **Production Content Security Policy (CSP) Architecture**:
  ```http
  Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com https://www.google.com https://www.gstatic.com https://recaptcha.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: https://*.googleusercontent.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com https://www.google.com; frame-ancestors 'self';
  ```
- **Legacy Deprecation Note**: `X-XSS-Protection` is deprecated in modern web standards and is explicitly excluded from the production header baseline.

---

## 9. Environment Variable & Secret Trust Classification

| Variable Category | Variables | Purpose & Exposure Scope |
|---|---|---|
| **PUBLIC CLIENT CONFIGURATION** | `VITE_FIREBASE_API_KEY`<br>`VITE_FIREBASE_AUTH_DOMAIN`<br>`VITE_FIREBASE_PROJECT_ID`<br>`VITE_FIREBASE_STORAGE_BUCKET`<br>`VITE_FIREBASE_MESSAGING_SENDER_ID`<br>`VITE_FIREBASE_APP_ID`<br>`VITE_FIREBASE_MEASUREMENT_ID`<br>`VITE_RECAPTCHA_SITE_KEY`<br>`VITE_ENABLE_MOCK_ADMIN` | Public Web SDK identifiers and client feature flags. Safe for exposure in browser bundles. |
| **TRUSTED / DEVELOPMENT SECRETS** | App Check Registered Debug Token<br>(e.g. `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN`) | Registered App Check debug tokens for local developer or CI testing. Strictly guarded by `import.meta.env.DEV` in source code. **MUST NOT** be committed to Git or shipped in production client bundles. |
| **TRUSTED / SERVER-ONLY CONFIGURATION** | `GEMINI_API_KEY`<br>`APP_URL`<br>`serviceAccountKey.json`<br>Admin SDK Private Credentials | Server-side runtime secrets and AI Studio platform tooling configuration. **MUST NOT** be prefixed with `VITE_` or imported into client JavaScript code. `GEMINI_API_KEY` is strictly confined to platform server operations and is never bundled into the Vite browser bundle. |

---

## 10. Stage 6L Leadership Preview Environment Classification & Safeguards

- **Centralized Runtime Environment Classification**: `src/config/environment.ts` exports `getAppEnvironment()`, `isLeadershipPreview()`, `isProductionEnvironment()`, and `isDevelopmentEnvironment()`.
- **Preview Environment Variable**: `VITE_APP_ENV` controls runtime mode (`development` | `preview` | `production`). Defaults to `preview` in pre-launch preview builds.
- **Leadership Preview Banner**: Renders unobtrusively at the top of the application layout (`LeadershipPreviewBanner.tsx`) communicating that the platform is under pastoral review and verification prior to public launch.
- **Search Engine Indexing Protection**:
  - In preview mode (`VITE_APP_ENV="preview"` or `isLeadershipPreview()`), `<meta name="robots" content="noindex, nofollow" />` is dynamically applied to prevent search engine indexing of unverified leadership preview builds.
  - `/public/robots.txt` disallows crawler indexing on administrative (`/admin/`), private submission (`/prayer`, `/contact`), and API routes.
- **Private Form Submission Safeguards**:
  - Prayer Request and Contact forms display explicit **LEADERSHIP PREVIEW DEMONSTRATION NOTICE** banners informing leadership that preview submissions are processed locally for UI demonstration purposes and are not delivered to pastoral staff.
  - Preview submissions utilize local in-memory repositories and never persist sensitive demonstration data in `localStorage` or `sessionStorage`.

---

## 11. Pre-Launch Checklist

- [x] Firestore security rules compiled and validated with ESLint security plugin.
- [x] Client/server trust boundary documented and enforced.
- [x] Privacy isolation between Prayer and Contact collections verified.
- [x] Official brand assets protected against client mutation and deletion.
- [x] `target="_blank"` external links audited for `rel="noopener noreferrer"`.
- [x] Executable URI schemes (`javascript:`, `data:`) blocked across all inputs and asset URLs.
- [x] Web storage (`localStorage`/`sessionStorage`) verified clean of confidential submission data.
- [x] App Check client readiness module implemented (`src/firebase/appCheck.ts`).
- [x] App Check production debug-mode protection enforced (`import.meta.env.DEV` guard).
- [x] App Check debug tokens classified under Trusted Development Secrets (excluded from public client config).
- [x] App Check product-side enforcement accurately documented as NOT deployed.
- [x] Modern production CSP & security header architecture documented (Deployment Status: NO).
- [x] Environment variable trust boundaries verified (`GEMINI_API_KEY` isolated from browser bundle).

