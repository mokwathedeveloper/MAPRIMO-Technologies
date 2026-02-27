"use client";

import { useOptimistic, useTransition } from "react";
import { MessageSquare, Quote } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DeleteTestimonialButton } from "@/components/admin/delete-testimonial-button";
import { EmptyState } from "@/components/admin/empty-state";
import type { Testimonial } from "@/lib/types";

export function TestimonialList({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [optimisticTestimonials, removeOptimisticTestimonial] = useOptimistic(
    initialTestimonials,
    (state, id: string) => state.filter((t) => t.id !== id)
  );
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(() => {
      removeOptimisticTestimonial(id);
    });
  };

  if (optimisticTestimonials.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No testimonials yet"
        description="Client feedback will appear here. Add your first one to build trust."
        actionLabel="New Testimonial"
        actionHref="/admin/testimonials/new"
      />
    );
  }

  return (
    <div className="grid gap-6">
      {optimisticTestimonials.map((t: Testimonial) => (
        <Card key={t.id} className="relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {t.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-lg font-bold">{t.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{t.role} at {t.company}</p>
              </div>
            </div>
            <DeleteTestimonialButton id={t.id!} name={t.name} onDelete={handleDelete} />
          </CardHeader>
          <CardContent className="relative">
            <Quote className="absolute -top-1 -left-1 h-8 w-8 text-primary/5 -rotate-12" />
            <p className="text-sm leading-relaxed italic bg-muted/30 p-4 rounded-md border-l-4 border-primary/20">
              "{t.quote}"
            </p>
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <span>Added on {new Date(t.created_at).toLocaleDateString()}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
