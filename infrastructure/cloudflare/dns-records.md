# Cloudflare DNS Records Configuration

| Type  | Name             | Content                                 | Proxy Status | Notes                               |
|-------|------------------|-----------------------------------------|--------------|-------------------------------------|
| CNAME | app              | <amplify-app-id>.amplifyapp.com         | Proxied      | Frontend App                        |
| CNAME | api              | <api-server-domain>.compute.amazonaws.com| Proxied      | API Server                          |
| CNAME | www              | hygilog.com                             | Proxied      | Redirects to apex                   |
| CNAME | _acm-validation  | <aws-validation-target>.acm-validations.aws | DNS Only     | DO NOT PROXY! Used for AWS ACM cert |

## SSL/TLS Configuration
- **SSL Mode:** Full (Strict)
- **Always HTTPS:** On
- **HSTS:** Enabled
- **Minimum TLS Version:** 1.2
