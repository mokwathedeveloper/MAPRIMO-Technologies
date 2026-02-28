# Performance Strategy

## Rendering
- **Static vs Dynamic:** Marketing pages use `force-dynamic` to ensure content managed in the CMS is immediately visible without re-deployment.
- **Optimization:** `next/image` is used for all remote patterns (Supabase/Unsplash) to provide WebP format and lazy loading.

## Metrics
- **Lighthouse Goals:** 90+ for Performance and Accessibility.
- **Caching:** Server Actions use `revalidatePath` to surgically purge Vercel Data Cache only when content changes.
