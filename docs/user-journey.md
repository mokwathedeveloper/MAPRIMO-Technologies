# User Journeys

## Public User
1. Lands on Home → Views specialized sections (Directors/Podcasts).
2. Navigates to `/work` → Reads Case Studies.
3. Fills Contact Form → Rate limited if multiple attempts; success toast on completion.

## Admin User
1. Navigates to `/admin`.
2. Redirected to `/login` if session missing.
3. Authenticates → Directed back to Admin Dashboard.
4. Manages content:
   - Create Project → Upload cover → Published immediately.
   - Delete Podcast → DB record removed → Storage file purged.
