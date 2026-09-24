# HYGILOG — Claude Code Operating Rules

## Mission
HYGILOG is an existing production hospitality SaaS platform for HACCP compliance.
This is not a greenfield project.

Primary priorities:
1. P0 — Fix AWS Amplify ↔ Cloudflare DNS/SSL.
2. J1 — Audit architecture + implement RBAC.
3. J2 — Stabilize Web ↔ Mobile synchronization + fix critical bugs.
4. J3 — Documentation + handover.

## Mandatory workflow
Always follow:

AUDIT → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → COMMIT → DOCUMENT → VALIDATE

Never start by rewriting large parts of the codebase.

## Source of truth
The repository and deployed system are the technical source of truth.
Do not invent APIs, roles, collections, infrastructure, business rules, or environment variables.

## Engineering principles
- Stability > new features
- Security > convenience
- Data integrity > speed
- Server authorization > UI authorization
- Small safe changes > large rewrites
- Tested code > assumed code
- Documented system > tribal knowledge

## Before major changes
Report:
- Task
- Current behavior
- Root cause
- Files/modules affected
- Proposed change
- Security impact
- Regression risk
- Test plan

## After major changes
Report:
- Task
- Status
- Files changed
- Implementation summary
- Tests run
- Test results
- Security impact
- Known limitations
- Next step

## P0 Infrastructure
Audit and fix:
- Cloudflare DNS
- AWS Amplify custom domain
- CNAME / A / AAAA records
- Proxy mode
- SSL/TLS mode
- HTTPS redirects
- www/non-www
- subdomains
- redirect loops
- certificate mismatch
- cache/security rules

Deliverable: `docs/P0_INFRASTRUCTURE_REPORT.md`

## J1 Audit + RBAC
Audit:
- Next.js / React
- NestJS
- Flutter
- MongoDB
- AWS Amplify
- Cloudflare
- CI/CD
- authentication
- authorization
- tenant model
- secrets
- logs
- tests

RBAC must support 6 roles and permission-based authorization.
Avoid scattered `if (role === 'admin')` checks.

Preferred model:
User → Role → Permission → Resource + Action

Backend is the security authority.
Frontend permission checks are for UX only.

Required:
- protected APIs
- protected routes
- dynamic menus
- permission-aware actions
- login redirect
- tenant isolation
- RBAC tests

## Multi-tenant rule
Every tenant-owned query must enforce tenant ownership.
Cross-tenant access must be explicitly tested.

## HTTP authorization
- 401 = unauthenticated
- 403 = authenticated but unauthorized

## J2 Sync + Bugs
Audit:
- stale data
- duplicate records
- API/schema mismatch
- cache invalidation
- offline behavior
- timezone issues
- race conditions
- NFC flow
- retries and sync failures

Track bugs in `docs/BUG_REGISTER.md`.

## J3 Documentation + Handover
Required docs:
- ARCHITECTURE.md
- LOCAL_DEVELOPMENT.md
- DEPLOYMENT.md
- AWS_CLOUDFLARE_INFRASTRUCTURE.md
- AUTHENTICATION.md
- RBAC.md
- API.md
- DATABASE.md
- MOBILE_ARCHITECTURE.md
- WEB_MOBILE_SYNC.md
- NFC.md
- SECURITY.md
- TROUBLESHOOTING.md
- HANDOVER.md
- KNOWN_ISSUES.md
- TECHNICAL_DEBT.md

## Production safety
Never make destructive production changes without:
BACKUP → MIGRATION → LOCAL TEST → STAGING TEST → VALIDATION → PRODUCTION → VERIFY

Always define rollback.

## Git
Recommended branches:
- main
- develop
- feature/*
- fix/*
- hotfix/*
- docs/*

Commit examples:
- feat(rbac): add permission guard
- fix(auth): enforce tenant isolation
- fix(sync): prevent duplicate mobile records
- fix(infra): correct Cloudflare Amplify routing
- docs(rbac): document permission matrix

Do not merge when CI fails, tests fail, conflicts remain, or validation is missing.

## Definition of Done
CODE + TEST + REVIEW + SECURITY CHECK + NO CRITICAL REGRESSION + DOCUMENTATION + GIT COMMIT + VALIDATION
