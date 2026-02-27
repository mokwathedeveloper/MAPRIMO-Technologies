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
import { updateDirector } from "@/lib/actions/portfolio";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import type { Director } from "@/lib/types";

export function EditDirectorForm({ director }: { director: Director }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    if (file) {
      formData.set("image", file);
    }
    formData.set("current_image_url", director.image_url);

    startTransition(async () => {
      try {
        const result = await updateDirector(director.id, formData);
        
        if (result.ok) {
          toast.success("Director updated successfully!");
          router.push("/admin/directors");
          router.refresh();
        } else {
          setError(result.error.message);
          if (result.error.fieldErrors) {
            setFieldErrors(result.error.fieldErrors);
          }
          toast.error(result.error.message);
        }
      } catch (err) {
        console.error("Submission error:", err);
        const msg = "A network error occurred. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Director Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={director.name}
                  placeholder="e.g. John Doe" 
                  required 
                  disabled={isPending}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-500">{fieldErrors.name[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role / Position</Label>
                <Input 
                  id="role" 
                  name="role" 
                  defaultValue={director.role}
                  placeholder="e.g. Chief Executive Officer" 
                  required 
                  disabled={isPending}
                />
                {fieldErrors.role && (
                  <p className="text-xs text-red-500">{fieldErrors.role[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                defaultValue={director.bio}
                placeholder="Professional background and expertise..." 
                required 
                className="min-h-[150px]"
                disabled={isPending}
              />
              {fieldErrors.bio && (
                <p className="text-xs text-red-500">{fieldErrors.bio[0]}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media & Socials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUpload 
              label="Profile Photo" 
              defaultValue={director.image_url}
              onFileSelect={setFile} 
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL (Optional)</Label>
                <Input 
                  id="linkedin_url" 
                  name="linkedin_url" 
                  defaultValue={director.linkedin_url}
                  placeholder="https://linkedin.com/in/..." 
                  disabled={isPending}
                />
                {fieldErrors.linkedin_url && (
                  <p className="text-xs text-red-500">{fieldErrors.linkedin_url[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_url">Twitter URL (Optional)</Label>
                <Input 
                  id="twitter_url" 
                  name="twitter_url" 
                  defaultValue={director.twitter_url}
                  placeholder="https://twitter.com/..." 
                  disabled={isPending}
                />
                {fieldErrors.twitter_url && (
                  <p className="text-xs text-red-500">{fieldErrors.twitter_url[0]}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link href="/admin/directors">
            <Button variant="outline" type="button" disabled={isPending}>Cancel</Button>
          </Link>
          <Button type="submit" disabled={isPending} className="gap-2 min-w-[120px]">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Director
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
