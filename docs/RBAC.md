# RBAC — Role-Based Access Control

## Objective
Implement six roles with permission-based access control.

## Role Matrix
| Role | Description | Scope | Notes |
|---|---|---|---|
| Role 1 | TBD | TBD | Replace after audit |
| Role 2 | TBD | TBD | |
| Role 3 | TBD | TBD | |
| Role 4 | TBD | TBD | |
| Role 5 | TBD | TBD | |
| Role 6 | TBD | TBD | |

## Permission Naming
Pattern:
`resource.action`

Examples:
- users.view
- users.create
- users.update
- users.delete
- reports.view
- reports.export
- haccp.view
- haccp.create
- haccp.update
- haccp.approve

## Backend Design
Suggested:
- AuthGuard
- PermissionGuard
- TenantGuard
- `@Permissions()`
- CurrentUser context
- AuthorizationService

## Frontend Design
- protected routes
- dynamic menus
- action visibility
- login redirect
- /403 handling

## API Permission Matrix
| Endpoint | Method | Permission | Tenant Scope |
|---|---|---|---|

## RBAC Acceptance Tests
- [ ] Allowed permission returns success
- [ ] Missing permission returns 403
- [ ] Missing auth returns 401
- [ ] Tenant A cannot access Tenant B
- [ ] Disabled user blocked
- [ ] Expired token blocked
