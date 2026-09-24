# API Documentation

## Base URLs
- Development:
- Staging:
- Production:

## Authentication

## Error Format
Recommended:
```json
{
  "statusCode": 403,
  "code": "INSUFFICIENT_PERMISSION",
  "message": "You do not have permission to perform this action",
  "requestId": "..."
}
```

## Endpoints
| Module | Method | Endpoint | Permission | Description |
|---|---|---|---|---|

## Status Codes
- 200/201 success
- 400 validation
- 401 unauthenticated
- 403 unauthorized
- 404 not found
- 409 conflict
- 500 unexpected server error
