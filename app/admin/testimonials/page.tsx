import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { Plus, MessageSquare, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  
  const { data: testimonials, error } = await supabase
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
        {/* We can add a "New" button if we implement the form, but let's start with the list */}
        <Button className="flex items-center gap-2" disabled>
          <Plus className="h-4 w-4" />
          New Testimonial
        </Button>
      </div>

      <div className="grid gap-6">
        {testimonials && testimonials.length > 0 ? (
          testimonials.map((t: Testimonial) => (
            <Card key={t.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg font-bold">{t.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t.role} at {t.company}</p>
                </div>
                <Button variant="ghost" size="icon" disabled>
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed italic bg-muted/30 p-4 rounded-md">
                  "{t.quote}"
                </p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Added on {new Date(t.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-xl bg-muted/20">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No testimonials yet</h3>
            <p className="text-sm text-muted-foreground/60">Feedback from your clients will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
