# HYGILOG — AI Agent Instructions

This file mirrors the core rules in `CLAUDE.md` for non-Claude coding agents.

## Required sequence
Audit → Understand → Plan → Implement → Test → Review → Commit → Document → Validate

## Priority order
1. P0 Infrastructure
2. J1 Audit/RBAC
3. J2 Sync/Critical Bugs
4. J3 Documentation/Handover

## Hard rules
- Do not perform large rewrites without approval.
- Do not bypass backend authorization.
- Do not expose secrets.
- Do not hardcode tenant IDs.
- Do not hardcode permission logic across controllers/pages.
- Do not make destructive production database changes without backup and rollback.
- Do not mark milestones complete before validation.

## Security
Backend is the authorization source of truth.
Tenant isolation is mandatory.
Cross-tenant access must be tested.
401 = unauthenticated.
403 = authenticated but unauthorized.

## Git
Use small reviewable commits and PRs.
Keep documentation updated together with code.
