# HYGILOG – Senior Full-Stack Stabilization, Security & Handover Mission

## 1. Project Context

HYGILOG is an existing hospitality SaaS platform focused on HACCP compliance, food safety operations, hygiene monitoring, traceability, temperature controls, inspections, checklists, and operational compliance.

The platform is already live in production and currently includes:

- Web application
- iOS application
- Android application
- Backend APIs
- MongoDB database
- AWS infrastructure
- Cloudflare DNS / SSL
- NFC-related functionality
- Multi-user / multi-organization SaaS capabilities

This is **NOT a greenfield development project**.

The mission is to take ownership of an existing production codebase, understand the current architecture, stabilize it, improve security and authorization, resolve synchronization and infrastructure issues, document the system, and prepare the platform for future development.

The primary technology stack is:

### Frontend Web
- React
- Next.js
- TypeScript / JavaScript
- REST APIs and/or existing API communication layer

### Backend
- Node.js
- NestJS
- MongoDB
- Authentication / authorization
- SaaS multi-tenant logic

### Mobile
- Flutter
- iOS
- Android

### Infrastructure
- AWS Amplify
- AWS services already connected to the project
- Cloudflare
- DNS
- SSL/TLS
- CDN / proxy configuration where applicable

### Other
- NFC integration
- GitHub
- Existing production environments
- Existing domain/subdomains
- Existing authentication/session system

---

# 2. Overall Mission

Act as a **Senior Full-Stack Engineer / Technical Lead** responsible for recovering, stabilizing, securing, documenting, and handing over the HYGILOG platform.

Primary objectives:

1. Restore stable infrastructure and domain connectivity.
2. Audit the existing architecture and source code.
3. Implement a complete RBAC authorization system.
4. Validate SaaS multi-tenant isolation.
5. Stabilize Web ↔ API ↔ Mobile synchronization.
6. Fix critical and high-priority production bugs.
7. Improve security and operational reliability.
8. Produce technical documentation.
9. Prepare the platform for clean handover and future development.

Avoid unnecessary rewrites.

Prefer:

> Diagnose → Stabilize → Refactor only where necessary → Test → Document.

---

# 3. Priority Order

All work MUST respect the following priority hierarchy.

## PRIORITY #0 — AWS Amplify ↔ Cloudflare DNS / SSL

This issue blocks or threatens production availability and must be investigated first.

Tasks:

- Audit existing DNS configuration.
- Identify domain and subdomain architecture.
- Review Cloudflare DNS records.
- Review AWS Amplify custom domain configuration.
- Verify DNS ownership validation.
- Verify CNAME records.
- Verify A/AAAA records if applicable.
- Review SSL certificate provisioning.
- Review HTTPS redirects.
- Review Cloudflare proxy mode.
- Review DNS-only vs proxied configuration.
- Review Cloudflare SSL/TLS mode.
- Detect redirect loops.
- Detect certificate mismatches.
- Detect expired or incorrectly issued certificates.
- Detect invalid CNAME chains.
- Verify Amplify domain association.
- Verify DNS propagation.
- Verify IPv4 / IPv6 inconsistencies.
- Verify www vs non-www behavior.
- Review HTTP → HTTPS redirection.
- Review Cloudflare caching rules.
- Review Cloudflare Page Rules / Redirect Rules if present.
- Review security rules that could block Amplify.
- Test production domain from external networks.

Expected output:

### Infrastructure Diagnosis Report

Include:

- Root cause
- Current DNS architecture
- Corrected DNS configuration
- Correct Cloudflare configuration
- Correct Amplify configuration
- SSL status
- Redirect status
- Risks found
- Recommended long-term setup

Acceptance criteria:

- Production domain resolves correctly.
- HTTPS certificate is valid.
- No SSL warnings.
- No infinite redirects.
- Required subdomains resolve.
- Application loads consistently.
- Amplify deployment remains operational after DNS changes.

---

# 4. PRIORITY #1 — Architecture Audit

Before making major code changes, perform a structured technical audit.

Review:

## Web

- Next.js version
- React version
- routing architecture
- middleware
- page protection
- API clients
- authentication
- state management
- caching
- environment variables
- error handling
- build pipeline
- SSR / CSR / SSG usage
- security risks
- dependency vulnerabilities

## Backend

Audit NestJS:

- modules
- controllers
- services
- repositories
- guards
- middleware
- interceptors
- DTOs
- validation
- authentication
- authorization
- tenant isolation
- logging
- error handling
- MongoDB schemas
- indexes
- API security

## Mobile

Audit Flutter application:

- architecture
- state management
- login
- token lifecycle
- API integration
- offline behavior
- synchronization
- NFC functionality
- error handling
- platform-specific code
- iOS / Android differences

## Infrastructure

Audit:

- Amplify
- environment variables
- CI/CD
- Cloudflare
- domain configuration
- secrets
- production/staging separation
- deployment procedures

---

# 5. Architecture Documentation

Create a high-level architecture map:

```text
Users
 │
 ├── Web Application
 │      Next.js / React
 │
 ├── iOS Application
 │      Flutter
 │
 └── Android Application
        Flutter
          │
          ▼
       API Layer
        NestJS
          │
          ├── Authentication
          ├── Authorization / RBAC
          ├── Business Logic
          ├── NFC-related services
          ├── Synchronization
          │
          ▼
       MongoDB
```

Infrastructure:

```text
Internet
   │
Cloudflare
   │
DNS / SSL / CDN
   │
AWS Amplify
   │
Next.js Web App
```

API and other services should be added to this diagram according to the actual codebase.

Do NOT assume components that do not exist.

Document the real architecture after inspection.

---

# 6. PRIORITY #1 — RBAC Implementation

Implement a production-grade Role-Based Access Control system.

The system must support **6 roles**.

If existing role names exist in the database or product specification, use them.

If they do not yet exist, make the roles configurable rather than hard-coding business-specific names.

Example conceptual hierarchy:

1. Super Admin
2. Organization Admin
3. Site / Facility Manager
4. Supervisor
5. Employee / Operator
6. Viewer / Auditor

These names are examples only.

Final role names must match actual HYGILOG business requirements.

---

# 7. Permission Model

Do NOT implement authorization purely as:

```text
if role == "admin"
```

Implement:

```text
Role → Permissions → Resources → Actions
```

Example permission identifiers:

```text
organization.view
organization.create
organization.update
organization.delete

users.view
users.create
users.update
users.delete

roles.view
roles.manage

sites.view
sites.create
sites.update
sites.delete

haccp.view
haccp.create
haccp.update
haccp.approve

temperature.view
temperature.create
temperature.update

checklists.view
checklists.execute
checklists.manage

reports.view
reports.export

settings.view
settings.manage

audit_logs.view
```

Final permissions must reflect real HYGILOG modules.

---

# 8. RBAC Data Model

Recommended conceptual structure:

```text
User
 ├── organizationId
 ├── roleId
 └── status

Role
 ├── name
 ├── code
 └── permissions[]

Permission
 ├── resource
 └── action
```

For larger tenants, optionally support:

```text
User
 └── RoleAssignment[]

RoleAssignment
 ├── userId
 ├── roleId
 ├── organizationId
 └── siteId
```

Select the least complex architecture that satisfies actual product requirements.

---

# 9. Multi-Tenant Security

HYGILOG is a SaaS platform.

Tenant isolation is mandatory.

Review every relevant backend operation.

Every tenant-owned entity should be scoped by something equivalent to:

```text
organizationId
tenantId
companyId
```

depending on the existing schema.

Example:

BAD:

```javascript
findById(documentId)
```

PREFERRED:

```javascript
findOne({
  _id: documentId,
  organizationId: currentUser.organizationId
})
```

Verify that a user from Company A cannot access:

- Company B users
- Company B HACCP records
- Company B locations
- Company B reports
- Company B files
- Company B device/NFC information
- Company B configuration

Test cross-tenant access explicitly.

---

# 10. Backend RBAC

Implement NestJS authorization using appropriate patterns such as:

- Guards
- Decorators
- Metadata
- JWT/session claims
- Permission services

Desired developer experience:

```typescript
@Permissions('users.read')
@Get()
findUsers() {}
```

or equivalent.

Create centralized authorization logic.

Do not duplicate permission logic across controllers.

Required elements:

- AuthGuard
- PermissionGuard
- Roles/Permissions decorator
- Tenant guard or tenant validation
- User context
- Consistent forbidden responses

Expected:

```text
401 = unauthenticated
403 = authenticated but unauthorized
```

---

# 11. Protected API Routes

Create an API permission matrix.

Example:

| Endpoint | Method | Permission |
|---|---|---|
| /users | GET | users.view |
| /users | POST | users.create |
| /users/:id | PATCH | users.update |
| /users/:id | DELETE | users.delete |
| /reports | GET | reports.view |
| /reports/export | POST | reports.export |

Document the real API matrix.

---

# 12. Frontend Route Protection

Web frontend must not rely only on hidden menus.

Implement proper protected routes.

Flow:

```text
User opens page
       │
       ▼
Check authentication
       │
       ├── No → /login
       │
       ▼
Check permission
       │
       ├── Unauthorized → /403
       │
       ▼
Render page
```

Protect:

- pages
- routes
- page actions
- buttons
- forms
- API requests where appropriate

Frontend protection improves UX.

Backend remains the source of truth for security.

---

# 13. Dynamic Menu

Sidebar and navigation must react to permissions.

Example:

```text
Dashboard

Operations
 ├── HACCP
 ├── Temperature
 └── Checklists

Management
 ├── Users
 ├── Sites
 └── Reports

Administration
 ├── Roles
 ├── Permissions
 └── Settings
```

A user must see only items they are authorized to access.

Do NOT maintain separate hardcoded sidebars for each role.

Prefer:

```text
Menu Item
+
Required Permission
```

Example:

```typescript
{
  label: "Users",
  path: "/users",
  permission: "users.view"
}
```

---

# 14. Login Redirect

After login:

```text
Authenticate
       │
       ▼
Load user
       │
       ▼
Load role + permissions
       │
       ▼
Determine allowed landing page
       │
       ▼
Redirect
```

Examples:

Admin:

```text
/dashboard
```

Employee:

```text
/tasks
```

Auditor:

```text
/reports
```

Do not redirect users to unauthorized pages.

---

# 15. Session & Token Security

Audit:

- JWT generation
- access token duration
- refresh tokens
- localStorage usage
- secure storage on mobile
- logout
- token revocation
- expired sessions
- password reset
- email verification
- session reuse
- organization switching if supported

Ensure mobile uses secure storage for sensitive tokens.

---

# 16. RBAC Testing

Create automated tests for authorization.

At minimum:

```text
Role A → allowed endpoint → 200

Role A → forbidden endpoint → 403

Unauthenticated user → protected endpoint → 401

Tenant A user → Tenant B resource → forbidden/not found

Disabled user → blocked

Expired token → blocked
```

Also test frontend route guards.

---

# 17. PRIORITY #2 — Web ↔ Mobile Synchronization

Analyze synchronization between:

```text
Web
 ↕
Backend API
 ↕
MongoDB
 ↕
Mobile
```

Identify issues such as:

- stale data
- inconsistent schemas
- duplicated records
- different validation rules
- date/time inconsistencies
- timezone bugs
- offline edits
- race conditions
- failed API requests
- missing retries
- mobile cache not refreshing
- web cache not refreshing
- incompatible enum values
- different API versions

---

# 18. Synchronization Rules

Define which system owns each type of data.

Example:

```text
MongoDB / API = source of truth
```

Web and mobile should synchronize against the authoritative backend.

Avoid independent conflicting business rules.

Create documentation:

```text
Entity
Source of truth
Web behavior
Mobile behavior
Conflict strategy
Refresh strategy
Offline behavior
```

---

# 19. Mobile Offline Scenarios

Determine whether Flutter currently supports offline operation.

If yes, review:

- local database/cache
- pending action queue
- retry policy
- sync state
- conflict resolution
- temporary IDs
- duplicate prevention

Suggested state:

```text
LOCAL_PENDING
SYNCING
SYNCED
SYNC_FAILED
```

Do not introduce complex offline-first infrastructure unless required by existing product behavior.

---

# 20. Conflict Handling

For concurrent updates, evaluate:

```text
Last Write Wins
```

versus:

```text
Version-based optimistic locking
```

Example:

```text
record.version = 5

Client attempts update using version = 4

→ Reject as stale
```

Use advanced conflict resolution only where business data requires it.

---

# 21. Date / Time Standardization

HACCP systems frequently contain timestamps.

Normalize backend data to UTC.

Store:

```text
ISO 8601 UTC
```

Example:

```text
2026-09-24T08:00:00Z
```

Convert to local timezone only for presentation.

Test:

- browser timezone
- mobile timezone
- device clock
- DST where applicable
- export/report timestamps

---

# 22. NFC Audit

Review NFC implementation.

Document:

- NFC use case
- tag type
- tag format
- read flow
- write flow if supported
- device compatibility
- permissions
- duplicate scan protection
- backend validation
- security implications

Flow example:

```text
NFC Tag
   │
   ▼
Flutter App
   │
Read Identifier
   │
Validate locally
   │
   ▼
API
   │
Validate tenant/device/resource
   │
   ▼
Business Action
```

Do not trust arbitrary NFC payloads without backend validation.

---

# 23. Critical Bug Process

Create a bug register.

Each issue:

```text
BUG-ID
Title
Severity
Platform
Environment
Steps to reproduce
Expected result
Actual result
Root cause
Fix
Commit
Test
Status
```

Severity:

```text
P0 — Production unavailable/security issue
P1 — Core workflow blocked
P2 — Major degradation
P3 — Minor issue
```

J2 primarily targets P0 and P1 issues.

---

# 24. Security Audit

Review at minimum:

## Authentication
- login
- brute-force protection
- password handling
- password reset

## Authorization
- RBAC
- tenant separation
- IDOR

## API
- validation
- injection
- rate limiting
- CORS
- headers
- file uploads

## Database
- exposed MongoDB
- indexes
- excessive privileges
- sensitive fields

## Infrastructure
- AWS keys
- secrets
- Amplify environment variables
- GitHub secrets
- Cloudflare tokens

## Frontend
- XSS
- exposed secrets
- debug information
- insecure client checks

## Mobile
- secure storage
- hardcoded secrets
- certificate handling
- API endpoint configuration

Never commit credentials to GitHub.

---

# 25. Dependency Audit

Audit:

```text
npm audit
```

and Flutter dependencies.

Classify vulnerabilities as:

```text
Critical
High
Medium
Low
```

Do not blindly upgrade major framework versions during stabilization.

Prefer targeted safe upgrades.

---

# 26. Logging

Implement or improve structured backend logging.

Include:

- timestamp
- requestId
- userId where appropriate
- tenantId
- endpoint
- status code
- error code

Never log:

- passwords
- full access tokens
- secret keys
- sensitive HACCP data unnecessarily

---

# 27. Audit Trail

For sensitive actions, evaluate an audit log.

Example:

```text
actor
tenant
action
resource
resourceId
timestamp
metadata
```

Examples:

```text
USER_CREATED
USER_ROLE_CHANGED
HACCP_RECORD_UPDATED
REPORT_EXPORTED
CONFIG_CHANGED
```

Audit logs should not be editable by normal users.

---

# 28. Error Handling

Normalize API errors.

Example:

```json
{
  "statusCode": 403,
  "code": "INSUFFICIENT_PERMISSION",
  "message": "You do not have permission to perform this action",
  "requestId": "..."
}
```

Avoid exposing stack traces in production.

---

# 29. CI/CD Review

Review current GitHub and deployment flow.

Recommended:

```text
Feature Branch
      │
      ▼
Pull Request
      │
      ▼
Lint
      │
      ▼
Tests
      │
      ▼
Build
      │
      ▼
Review
      │
      ▼
Merge
      │
      ▼
Deploy
```

Production deployment should not rely on undocumented manual steps.

---

# 30. Git Workflow

All development must use GitHub.

Recommended branch strategy:

```text
main
develop
feature/*
fix/*
hotfix/*
```

Examples:

```text
fix/amplify-cloudflare-ssl
feature/rbac-permissions
fix/mobile-sync
docs/technical-handover
```

Commit format:

```text
feat(rbac): add permission guard
fix(auth): correct tenant validation
fix(sync): prevent duplicate records
docs(api): document authentication flow
```

---

# 31. Weekly GitHub Requirement

At least once per week:

- push source code
- push documentation
- push tests
- push migration scripts where applicable
- create PRs
- update changelog

No large untracked code drops at the end of the project.

---

# 32. Environments

Clearly identify:

```text
Development
Staging
Production
```

Document:

- URLs
- infrastructure
- database
- environment variables
- deployment process

Never use production data casually for development.

---

# 33. Database Review

Audit MongoDB:

- schemas
- collection naming
- tenant fields
- indexes
- unique constraints
- relationships
- unused collections
- data consistency
- migration risks

Identify slow queries.

Review indexes for frequent filters:

```text
tenantId
organizationId
userId
createdAt
status
```

Use compound indexes where justified.

---

# 34. Migration Safety

Never make destructive schema changes directly in production.

For any data changes:

1. Backup.
2. Write migration.
3. Test migration.
4. Run against staging.
5. Validate.
6. Prepare rollback.
7. Deploy to production.

---

# 35. API Documentation

Generate or improve API documentation.

Prefer Swagger/OpenAPI if NestJS supports it.

Document:

- authentication
- permissions
- parameters
- request bodies
- response bodies
- status codes
- examples

---

# 36. Technical Documentation Package

J3 must produce a complete handover package.

Required documents:

### 01 — System Overview

```text
HYGILOG_SYSTEM_OVERVIEW.md
```

### 02 — Architecture

```text
ARCHITECTURE.md
```

### 03 — Local Setup

```text
LOCAL_DEVELOPMENT.md
```

### 04 — Deployment

```text
DEPLOYMENT.md
```

### 05 — Infrastructure

```text
AWS_CLOUDFLARE_INFRASTRUCTURE.md
```

### 06 — Authentication

```text
AUTHENTICATION.md
```

### 07 — RBAC

```text
RBAC.md
```

### 08 — API

```text
API.md
```

### 09 — Database

```text
DATABASE.md
```

### 10 — Mobile

```text
MOBILE_ARCHITECTURE.md
```

### 11 — Synchronization

```text
WEB_MOBILE_SYNC.md
```

### 12 — NFC

```text
NFC.md
```

### 13 — Troubleshooting

```text
TROUBLESHOOTING.md
```

### 14 — Security

```text
SECURITY.md
```

### 15 — Handover

```text
HANDOVER.md
```

---

# 37. Main README

Root README must allow a new developer to understand the project quickly.

Include:

```text
Project description
Architecture
Requirements
Installation
Environment setup
Run web
Run backend
Run Flutter
Testing
Deployment
Documentation links
Troubleshooting
```

---

# 38. Secrets Documentation

Do NOT document actual credentials.

Instead document required variables.

Example:

```env
MONGODB_URI=
JWT_SECRET=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AMPLIFY_APP_ID=
CLOUDFLARE_API_TOKEN=
```

Indicate which environment requires each variable.

---

# 39. Handover Training

Conduct technical training covering:

1. Architecture
2. Local setup
3. Deployment
4. RBAC
5. Tenant isolation
6. Web ↔ mobile synchronization
7. Infrastructure
8. Cloudflare
9. Amplify
10. MongoDB
11. Troubleshooting
12. Git workflow

Training must be based on written documentation.

---

# 40. Delivery Timeline

Total mission duration:

**Approximately 1 month**

---

## J1 — 10–12 Days

Scope:

### Infrastructure
- Amplify / Cloudflare fix

### Audit
- architecture
- code
- database
- infrastructure
- security

### RBAC
- six roles
- permissions
- backend guards
- tenant checks
- frontend routes
- dynamic menus
- login redirect
- tests

### Deliverables

```text
Infrastructure diagnosis
Architecture audit
RBAC matrix
RBAC implementation
Protected APIs
Protected web routes
Dynamic menus
RBAC tests
Security findings
GitHub commits/PRs
```

### J1 Acceptance Criteria

J1 is validated only when:

- AWS/Cloudflare problem is resolved or documented with verified external blocker.
- Six-role model is implemented.
- Permissions work.
- Protected APIs return correct authorization responses.
- Unauthorized web routes are inaccessible.
- Dynamic menus work.
- Login redirect respects permissions.
- Tenant isolation has been tested.
- Critical RBAC tests pass.
- Code has been pushed to GitHub.
- Technical notes are delivered.

---

# 41. J2 — 7–10 Days

Scope:

- Web/mobile sync
- mobile/API compatibility
- critical bugs
- production reliability
- NFC bugs where applicable

Deliverables:

```text
Sync issue report
Sync fixes
P0/P1 bug fixes
Mobile compatibility fixes
Regression tests
Updated issue tracker
GitHub PRs
```

### J2 Acceptance Criteria

- Critical web/mobile synchronization flows work.
- P0 bugs are closed.
- Agreed P1 bugs are closed or documented.
- No known regression blocks core workflows.
- Tested on Android and iOS where relevant.
- Tested on web.
- All changes pushed to GitHub.

---

# 42. J3 — 3–5 Days

Scope:

- final documentation
- deployment guide
- architecture documentation
- handover
- training

Deliverables:

```text
Technical documentation package
Architecture diagrams
API docs
RBAC docs
Deployment docs
Infrastructure docs
Troubleshooting docs
Training session
Final repository cleanup
Known issues list
Technical debt backlog
```

### J3 Acceptance Criteria

A new competent developer should be able to:

- clone the repository
- configure the development environment
- understand architecture
- understand RBAC
- run web/backend/mobile
- deploy using documentation
- troubleshoot common issues

without relying entirely on undocumented tribal knowledge.

---

# 43. Payment & Validation Rule

The project uses milestone-based payment.

Payment occurs only after written milestone validation.

General process:

```text
Developer delivers milestone
          │
          ▼
Technical review
          │
          ▼
Testing
          │
          ▼
Issues returned if necessary
          │
          ▼
Developer resolves issues
          │
          ▼
Written validation
          │
          ▼
Milestone accepted
          │
          ▼
Payment
```

No milestone should be considered complete merely because code was written.

Completion requires agreed deliverables and successful validation.

---

# 44. Daily Working Model

Freelance deliverables-based engagement.

Expected cadence:

### Daily

15-minute synchronization meeting.

Discuss:

```text
Yesterday
Today
Blockers
Production risks
Decisions required
```

Avoid long status meetings.

---

# 45. Weekly On-Site Requirement

Engineer must be based in Ho Chi Minh City.

Expected:

```text
1 day/week at HYGILOG office
```

On-site work may be used for:

- system review
- production debugging
- knowledge transfer
- mobile/NFC testing
- architecture decisions
- handover

---

# 46. Engineering Principles

The engineer must follow these rules:

### Rule 1

Do not rewrite stable code without a clear reason.

### Rule 2

Fix root causes rather than hiding symptoms.

### Rule 3

Security is enforced server-side.

### Rule 4

Frontend authorization is UX, not the security boundary.

### Rule 5

Tenant isolation must exist at data access level.

### Rule 6

No production credentials in source control.

### Rule 7

Every important infrastructure change must be documented.

### Rule 8

Every critical bug must have reproduction steps.

### Rule 9

Every major change should be testable.

### Rule 10

Do not introduce unnecessary technologies during stabilization.

---

# 47. Prohibited Actions

Do not:

- rewrite the entire platform
- migrate databases without approval
- change cloud providers unnecessarily
- replace Flutter
- replace NestJS
- replace Next.js
- expose production secrets
- make destructive production DB changes
- push directly to main without agreed workflow
- disable security mechanisms as a workaround
- bypass RBAC for convenience
- hardcode tenant IDs
- hardcode user roles across the codebase
- remove production functionality without approval

---

# 48. Required Engineering Reports

Maintain:

```text
AUDIT_REPORT.md
BUG_REGISTER.md
TECHNICAL_DEBT.md
CHANGELOG.md
KNOWN_ISSUES.md
DECISIONS.md
```

For technical decisions:

```text
Decision
Context
Options
Selected option
Reason
Impact
Rollback
Date
```

---

# 49. Definition of Done

A task is DONE only if:

```text
Code completed
+
Code reviewed
+
Tests completed
+
Security considered
+
No known regression
+
Documentation updated
+
GitHub pushed
+
Acceptance criteria satisfied
```

---

# 50. First 48 Hours

Immediately after receiving repository and system access:

## Step 1

Clone and run:

- web
- backend
- mobile

## Step 2

Identify:

- production
- staging
- environments
- databases
- AWS resources
- Cloudflare configuration

## Step 3

Investigate Amplify/Cloudflare.

## Step 4

Map current architecture.

## Step 5

Map authentication.

## Step 6

Map existing user roles.

## Step 7

Map tenant structure.

## Step 8

Create initial risk register.

## Step 9

Create bug baseline.

## Step 10

Prepare J1 implementation plan.

---

# 51. Initial Risk Register

Immediately flag issues in:

```text
P0 Production
P0 Security
P0 Data Loss

P1 Authentication
P1 Authorization
P1 Tenant Isolation
P1 Synchronization

P2 Performance
P2 Maintainability
P2 Technical Debt
```

---

# 52. Questions That Must Be Answered During Audit

The audit must determine:

1. Where is authentication implemented?
2. How are sessions/tokens managed?
3. Where are roles currently stored?
4. Does permission logic already exist?
5. What defines a tenant?
6. Can users belong to multiple tenants?
7. Can users belong to multiple sites?
8. Are mobile and web using the same API?
9. Are API versions different?
10. Which entities support offline operation?
11. How is NFC used?
12. How are production deployments made?
13. Where are secrets stored?
14. Is there a staging environment?
15. Are database backups configured?
16. Is there monitoring?
17. Is there logging?
18. Is there an audit trail?
19. What are the known production bugs?
20. What technical debt is currently highest risk?

---

# 53. Candidate / Engineer Requirements

The engineer taking responsibility for this mission should have:

- 5+ years professional full-stack development experience.
- Strong React.
- Strong Next.js.
- Strong Node.js.
- Strong NestJS.
- Production Flutter experience.
- MongoDB experience.
- SaaS architecture experience.
- Multi-tenant system experience.
- Proven RBAC implementation experience.
- AWS Amplify experience.
- Cloudflare experience.
- DNS troubleshooting experience.
- SSL/TLS troubleshooting experience.
- GitHub workflow experience.
- Production debugging skills.
- Strong written and spoken English.

Must be:

- Based in Ho Chi Minh City.
- Available immediately.
- Able to attend the office approximately one day per week.

---

# 54. Technical Interview Topics

Shortlisted engineers should be evaluated on:

### RBAC

Ask candidate to explain:

```text
User → Role → Permission → API
```

Then ask how they prevent:

```text
Tenant A → Tenant B record access
```

### NestJS

Ask candidate to design:

```text
@Permissions()
PermissionGuard
TenantGuard
```

### AWS / Cloudflare

Present:

```text
Cloudflare
   ↓
Amplify
```

with SSL failure.

Ask for debugging sequence.

### Synchronization

Ask:

```text
Mobile changes record offline.
Web changes same record.
Mobile reconnects.

What happens?
```

### Security

Ask about:

- IDOR
- JWT
- refresh token
- secrets
- rate limits
- multi-tenant security

---

# 55. Short Technical Test

Suggested technical test:

Create a small NestJS service containing:

```text
3 roles
5 permissions
2 tenants
```

Implement:

```text
GET /records
POST /records
DELETE /records/:id
```

Rules:

- users only access own tenant
- permissions control actions
- unauthorized returns 403
- unauthenticated returns 401

Candidate should explain architecture and testing.

The test should be short enough to assess engineering quality rather than unpaid project work.

---

# 56. Expected Final State

At the end of the mission, HYGILOG should have:

```text
Stable DNS / SSL
        +
Documented architecture
        +
Secure RBAC
        +
Tenant isolation
        +
Protected APIs
        +
Protected frontend routes
        +
Dynamic menus
        +
Correct login redirects
        +
Stable web/mobile synchronization
        +
Critical bugs resolved
        +
Improved production security
        +
Documented infrastructure
        +
Documented deployment process
        +
Documented mobile architecture
        +
GitHub history
        +
Technical handover
```

---

# 57. Agent Working Instructions

When working as an AI coding agent on this repository:

DO NOT immediately modify large portions of the codebase.

First produce:

```text
1. Repository analysis
2. Current architecture
3. Risks
4. Authentication flow
5. RBAC state
6. Tenant model
7. Infrastructure findings
8. Recommended implementation sequence
```

Before each major change:

```text
Explain:
- current problem
- root cause
- files affected
- proposed change
- security impact
- regression risk
- testing approach
```

Then implement in small, reviewable commits.

For every completed task report:

```text
TASK
STATUS
FILES CHANGED
ROOT CAUSE
IMPLEMENTATION
TESTS
SECURITY IMPACT
KNOWN LIMITATIONS
NEXT STEP
```

If the existing codebase contradicts assumptions in this specification, the actual repository is the source of technical truth.

Do not invent missing architecture.

Inspect first, then propose.

---

# 58. Final Success Criteria

The mission succeeds when HYGILOG is no longer dependent on undocumented individual knowledge and can be safely maintained by another engineering team.

The final platform must be:

**Stable**

**Secure**

**Multi-tenant safe**

**Permission-controlled**

**Deployable**

**Documented**

**Testable**

**Maintainable**

with all critical changes stored and traceable through GitHub.