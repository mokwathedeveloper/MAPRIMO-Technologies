# System Design: Request Lifecycle

## 1. Request Flow
1. **Routing:** Request hits Next.js Middleware. Session is verified.
2. **Authorization:** If path is `/admin/*`, the system checks the `admins` table.
3. **Rendering:** 
   - **Public Pages:** Use `force-dynamic` to fetch latest content directly from Supabase.
   - **Admin Pages:** Use `createServerSupabase` for authenticated fetching.
4. **Data Mutation:** Server Actions handle POST/DELETE requests.

## 2. Storage Handling
The system uses a "Shadow Cleanup" pattern:
- **Upload:** Files are stored in `portfolio/`, `blog/`, etc., using UUID-based paths.
- **Deletion:** The Server Action first deletes the DB record, then identifies the storage path from the URL and invokes `supabase.storage.remove()`.

## 3. Error Strategy
- **Client Side:** `sonner` toasts for immediate feedback.
- **Server Side:** Structured JSON logs sent to stdout (captured by Vercel/Sentry).
- **Global:** `app/error.tsx` acts as a safety net for unhandled RSC failures.
