import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialList } from "@/components/admin/testimonial-list";
import type { Testimonial } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">Manage client feedback and social proof.</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Testimonial
          </Button>
        </Link>
      </div>

      <TestimonialList initialTestimonials={(testimonials || []) as Testimonial[]} />
    </div>
  );
}
