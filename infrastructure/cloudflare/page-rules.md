# Cloudflare Page Rules Configuration

1. **WWW Redirect**
   - **URL Match:** `www.hygilog.com/*`
   - **Setting:** Forwarding URL (Status Code: 301 - Permanent Redirect)
   - **Destination URL:** `https://hygilog.com/$1`

2. **API Cache Bypass**
   - **URL Match:** `*.hygilog.com/api/*`
   - **Setting:** Cache Level: Bypass
