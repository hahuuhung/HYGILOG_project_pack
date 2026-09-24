# Web ↔ Mobile Synchronization

## Objective
Stabilize Web ↔ API ↔ MongoDB ↔ Mobile data consistency.

## Source of Truth
Define the authoritative source for each entity.

| Entity | Source of Truth | Web Behavior | Mobile Behavior | Offline | Conflict Strategy |
|---|---|---|---|---|---|

## Known Sync Risks
- stale cache
- duplicate records
- schema mismatch
- enum mismatch
- timezone mismatch
- failed retries
- race conditions
- offline writes

## Sync States
Where applicable:
- LOCAL_PENDING
- SYNCING
- SYNCED
- SYNC_FAILED

## Conflict Handling

## Retry Policy

## Timezone Standard
Prefer UTC persistence and local presentation.

## Test Matrix
