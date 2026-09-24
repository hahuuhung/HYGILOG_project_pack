# NFC

## Business Use Case

## Supported Tag Types

## Read Flow
NFC Tag → Flutter App → Parse → Validate → API → Tenant/Device Validation → Business Action

## Write Flow
Document only if supported.

## Security
- Never trust arbitrary NFC payloads.
- Validate identifiers server-side.
- Enforce tenant ownership.
- Prevent duplicate scans where required.

## Device Compatibility

## Error Handling

## Tests
