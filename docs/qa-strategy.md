# QA Strategy

## Current Implementation (Level 3)
- **Unit Tests:** Zod schemas, logic helpers (`lib/utils.ts`), and `ActionResult` handlers.
- **Integration Tests:** Server Action flow verification with mocked Supabase responses.
- **E2E Tests:** Playwright suite covering Lead submission, Admin login, and Project CRUD.
- **Security Tests:** Automated RLS verification ensuring public users cannot access admin tables.

## CI Gating
The `.github/workflows/ci.yml` enforces:
1. `npm audit` (Security vulnerabilities).
2. `npx tsc` (Type safety).
3. `npm run test:unit` (Logic).
4. `npm run test:e2e` (User journeys).
