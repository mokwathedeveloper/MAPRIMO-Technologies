# Security Model

## Threat Model
- **Unauthorized Data Mutation:** Prevented by RLS and Server Action admin checks.
- **SQL Injection:** Prevented by PostgREST (Supabase) and parameterized queries.
- **XSS:** Prevented by Next.js/React auto-escaping.
- **Form Spam:** Mitigated by a hidden honeypot field and IP-based rate limiting in `lib/rate-limit.ts`.

## Hardened Headers
Configured in `next.config.mjs`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
