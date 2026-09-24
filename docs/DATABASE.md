# Database

## Database
MongoDB

## Tenant Identifier
TBD after audit.

## Collections
| Collection | Purpose | Tenant Scoped | Key Indexes | Notes |
|---|---|---|---|---|

## Index Review
Review common filters:
- tenantId / organizationId
- userId
- createdAt
- status

## Migration Safety
BACKUP → MIGRATION → LOCAL TEST → STAGING TEST → VALIDATION → PRODUCTION → VERIFY

## Backup / Restore

## Data Integrity Risks
