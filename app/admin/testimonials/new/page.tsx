import { logger } from "@/lib/logger";
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTestimonial } from "@/lib/actions/portfolio";
import { toast } from "sonner";

export default function NewTestimonialPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      company: formData.get("company") as string,
      quote: formData.get("quote") as string,
    };

    startTransition(async () => {
      try {
        const result = await createTestimonial(data);
        
        if (result.ok) {
          toast.success("Testimonial added successfully!");
          router.push("/admin/testimonials");
          router.refresh();
        } else {
          setError(result.error.message);
          if (result.error.fieldErrors) {
            setFieldErrors(result.error.fieldErrors);
          }
          toast.error(result.error.message);
        }
      } catch (err) {
        logger.error("Submission error:", err);
        const msg = "A network error occurred. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/testimonials">
          <Button variant="outline" size="icon" disabled={isPending}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Testimonial</h1>
          <p className="text-muted-foreground">Add social proof from a satisfied partner.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="e.g. John Doe" 
                  required 
                  disabled={isPending}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-500">{fieldErrors.name[0]}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role" 
                    name="role" 
                    placeholder="e.g. CTO" 
                    required 
                    disabled={isPending}
                  />
                  {fieldErrors.role && (
                    <p className="text-xs text-red-500">{fieldErrors.role[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    name="company" 
                    placeholder="e.g. TechStream" 
                    required 
                    disabled={isPending}
                  />
                  {fieldErrors.company && (
                    <p className="text-xs text-red-500">{fieldErrors.company[0]}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="quote">Content</Label>
                <Textarea 
                  id="quote" 
                  name="quote" 
                  placeholder="What did they say about MAPRIMO?" 
                  rows={6}
                  required 
                  disabled={isPending}
                />
                {fieldErrors.quote && (
                  <p className="text-xs text-red-500">{fieldErrors.quote[0]}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Link href="/admin/testimonials">
              <Button variant="outline" type="button" disabled={isPending}>Cancel</Button>
            </Link>
            <Button type="submit" disabled={isPending} className="gap-2 min-w-[140px]">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Testimonial
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
