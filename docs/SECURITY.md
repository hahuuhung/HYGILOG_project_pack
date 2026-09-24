# Security

## Scope
- authentication
- authorization
- tenant isolation
- API
- database
- infrastructure
- frontend
- mobile
- NFC
- secrets

## Security Rules
- No secrets in Git.
- Backend is authorization source of truth.
- Tenant isolation enforced in data access.
- No destructive production changes without backup and rollback.
- Do not expose stack traces in production.

## Review Checklist
### Authentication
- [ ] brute-force protection
- [ ] password handling
- [ ] token expiry
- [ ] logout/revocation

### Authorization
- [ ] RBAC
- [ ] IDOR protection
- [ ] tenant isolation

### API
- [ ] validation
- [ ] rate limiting
- [ ] CORS
- [ ] secure headers

### Infrastructure
- [ ] AWS secrets
- [ ] Cloudflare tokens
- [ ] environment isolation
- [ ] production secrets

### Mobile
- [ ] secure token storage
- [ ] no hardcoded secrets
- [ ] endpoint validation

## Findings
| ID | Severity | Finding | Impact | Remediation | Status |
|---|---|---|---|---|---|
