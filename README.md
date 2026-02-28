# MAPRIMO Technologies

A premium, full-stack Next.js application designed for a modern software engineering and QA agency. It features a complete marketing frontend and a robust, secure administrative dashboard.

## 🚀 Features

### Client-Facing Frontend
*   **Immersive Design:** High-impact typography, dark-mode elements, and smooth scroll animations.
*   **Dynamic Portfolio & Case Studies:** Detailed breakdown of project challenges, solutions, and technical stacks.
*   **Engineering Blog:** Markdown-supported articles with featured highlights and reading time estimates.
*   **Podcast Integration:** Built-in audio player and episode listings.
*   **Lead Generation:** Integrated contact form with honeypot bot protection. (TODO: Automated Google Sheets/Calendar sync).

### Admin Dashboard (CMS)
*   **Full CRUD Capabilities:** Manage Projects, Case Studies, Testimonials, Blog Posts, Directors, and Podcasts.
*   **Premium UX:** Consistent forms with perceived progress tracking, optimistic UI updates via `useTransition`, and robust error handling.
*   **Automated Storage Cleanup:** Deleting a database record automatically removes its associated media files from the Supabase storage bucket, preventing orphaned files.
*   **Lead Management:** View comprehensive details of incoming inquiries in a structured dialog.

## 🛠️ Tech Stack
*   **Framework:** Next.js 14 (App Router, Server Actions)
*   **Styling:** Tailwind CSS, shadcn/ui, Lucide Icons
*   **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Storage Buckets)
*   **Validation:** Zod

---

## 💻 Local Development Setup

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment file and fill in your Supabase details:
```bash
cp .env.local.example .env.local
```

### 3. Database Setup (Supabase)
This project requires a specific database schema and Row Level Security (RLS) policies.
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor**.
3. Copy the contents of `bucketv3.sql` (found in the root of this project) and paste it into the editor.
4. Click **Run**. This will create all necessary tables (Projects, Case Studies, Blog, Directors, Podcasts, Leads, Admins), configure RLS, and set up your storage buckets safely.

### 4. Create an Admin User
To access the `/admin` dashboard, your user ID must be present in the `admins` table.
1. Sign up a new user via the `/login` page on your local site.
2. Go to the Supabase Dashboard -> **Authentication** and copy that user's `User UID`.
3. Go to the **Table Editor** -> `admins` table.
4. Insert a new row and paste the `User UID` into the `user_id` column.

### 5. Run the Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌍 Deployment (Vercel)

This application is optimized for zero-config deployment on Vercel.

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New... > Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add all the variables from your `.env.local` file (especially `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Click **Deploy**.

*Note: Since this application uses Next.js Server Actions, it requires a Node.js runtime environment (which Vercel provides automatically). Static exporting (`output: 'export'`) is not supported without refactoring the admin backend to an external API.*

---

## 📈 Analytics

Google Analytics is pre-configured. To enable it:
1. Get your GA4 Measurement ID (e.g., `G-XXXXXXXXXX`).
2. Add it to your `.env.local` (or Vercel Environment Variables) as `NEXT_PUBLIC_GA_ID`.
3. The tracking script will automatically inject into the `<head>` on production builds.

---

## 🧪 Quality Assurance & Production Reliability (Initial Setup)

*This section describes the planned QA architecture. Full implementation is in progress.*

### 🛡️ Security & RLS
*   **RLS Verification:** (TODO: Automated tests for Supabase Row Level Security).
*   **Security Headers:** Next.js is configured with hardened headers (`X-Frame-Options`, `X-Content-Type-Options`, `HSTS`) verified via Playwright.
*   **Dependency Auditing:** (TODO: CI pipeline enforcement).

### 🎨 Visual Regression
*   **Snapshot Testing:** (TODO: Playwright visual regression configuration).

### 📈 Production Monitoring
*   **Error Tracking:** Sentry pre-configured (Requires `NEXT_PUBLIC_SENTRY_DSN`).
*   **Structured Logging:** A custom `logger` (`lib/logger.ts`) provides JSON-formatted logs for observability.
*   **Health Monitoring:** (TODO: Fully automated uptime and database connectivity checks).

### 🚦 Running Tests
```bash
# Run all unit, integration, and security tests
npm run test:unit

# Run E2E and header verification tests
npm run test:e2e

# Run tests in CI mode (Unit + E2E)
npm run test:ci
```

### 📂 Test Structure
*   `tests/unit`: Zod schemas, logic, and `ActionResult` validation.
*   `tests/integration`: Server action flows and database interactions.
*   `tests/e2e`: Critical user flows (Lead Form, Admin Auth) and UI consistency.
*   `tests/security`: Supabase RLS policies and HTTP security header verification.
