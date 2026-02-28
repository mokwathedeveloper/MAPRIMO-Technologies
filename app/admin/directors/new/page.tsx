"use client";
import { logger } from "@/lib/logger";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDirector } from "@/lib/actions/portfolio";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";

const STAGES = [
  { label: "Validating profile...", progress: 20 },
  { label: "Uploading photo...", progress: 50 },
  { label: "Saving member...", progress: 80 },
  { label: "Finalizing...", progress: 95 },
];

export default function NewDirectorPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stageIndex, setStageIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [file, setFile] = useState<File | null>(null);

  // Perceived progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPending && stageIndex < STAGES.length - 1) {
      const duration = stageIndex === -1 ? 500 : 1500;
      timer = setTimeout(() => {
        setStageIndex((prev) => prev + 1);
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [isPending, stageIndex]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!file) {
      toast.error("Please upload a profile photo.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("image", file);

    startTransition(async () => {
      setStageIndex(0);
      try {
        const result = await createDirector(formData);
        
        if (result.ok) {
          toast.success("Director created successfully!");
          router.push("/admin/directors");
          router.refresh();
        } else {
          setError(result.error.message);
          if (result.error.fieldErrors) {
            setFieldErrors(result.error.fieldErrors);
          }
          toast.error(result.error.message);
          setStageIndex(-1);
        }
      } catch (err) {
        logger.error("Submission error:", err);
        const msg = "A network error occurred. Please try again.";
        setError(msg);
        toast.error(msg);
        setStageIndex(-1);
      }
    });
  }

  const isLoading = isPending || stageIndex !== -1;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/directors">
          <Button variant="outline" size="icon" disabled={isLoading}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Director</h1>
          <p className="text-muted-foreground">Add a new member to the leadership team.</p>
        </div>
      </div>

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
                    placeholder="e.g. John Doe" 
                    required 
                    disabled={isLoading}
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
                    placeholder="e.g. Chief Executive Officer" 
                    required 
                    disabled={isLoading}
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
                  placeholder="Professional background and expertise..." 
                  required 
                  className="min-h-[150px]"
                  disabled={isLoading}
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
                onFileSelect={setFile} 
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL (Optional)</Label>
                  <Input 
                    id="linkedin_url" 
                    name="linkedin_url" 
                    placeholder="https://linkedin.com/in/..." 
                    disabled={isLoading}
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
                    placeholder="https://twitter.com/..." 
                    disabled={isLoading}
                  />
                  {fieldErrors.twitter_url && (
                    <p className="text-xs text-red-500">{fieldErrors.twitter_url[0]}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading && stageIndex !== -1 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{STAGES[stageIndex].label}</span>
                <span>{STAGES[stageIndex].progress}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${STAGES[stageIndex].progress}%` }}
                />
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Link href="/admin/directors">
              <Button variant="outline" type="button" disabled={isLoading}>Cancel</Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="gap-2 min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Director
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
