import { logger } from "@/lib/logger";
"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProjectFromFormData } from "@/lib/actions/portfolio";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";

const STAGES = [
  { label: "Validating...", progress: 20 },
  { label: "Uploading cover image...", progress: 50 },
  { label: "Saving to database...", progress: 80 },
  { label: "Finalizing...", progress: 95 },
];

export default function NewProjectPage() {
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
      toast.error("Please upload a cover image.");
      return;
    }

    // Client-side size validation (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("cover", file);
    
    const stackRaw = formData.get("stack") as string;
    const stack = stackRaw.split(",").map(s => s.trim()).filter(Boolean);
    formData.set("stack", JSON.stringify(stack));
    
    const isPublished = formData.get("published") === "on";
    formData.set("published", String(isPublished));

    startTransition(async () => {
      setStageIndex(0);
      try {
        const result = await createProjectFromFormData(formData);
        
        if (result.ok) {
          toast.success("Project created successfully!");
          router.push("/admin/projects");
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
        const msg = err instanceof Error ? err.message : "A network error occurred. Please try again.";
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
        <Link href="/admin/projects">
          <Button variant="outline" size="icon" disabled={isLoading}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
          <p className="text-muted-foreground">Add a new item to your portfolio.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="e.g. My Awesome App" 
                    required 
                    disabled={isLoading}
                  />
                  {fieldErrors.title && (
                    <p className="text-xs text-red-500">{fieldErrors.title[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input 
                    id="slug" 
                    name="slug" 
                    placeholder="e.g. my-awesome-app" 
                    required 
                    disabled={isLoading}
                  />
                  {fieldErrors.slug && (
                    <p className="text-xs text-red-500">{fieldErrors.slug[0]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Short Summary</Label>
                <Textarea 
                  id="summary" 
                  name="summary" 
                  placeholder="A brief description of the project..." 
                  required 
                  disabled={isLoading}
                />
                {fieldErrors.summary && (
                  <p className="text-xs text-red-500">{fieldErrors.summary[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stack">Stack (comma separated)</Label>
                <Input 
                  id="stack" 
                  name="stack" 
                  placeholder="Next.js, TypeScript, Tailwind" 
                  required 
                  disabled={isLoading}
                />
                {fieldErrors.stack && (
                  <p className="text-xs text-red-500">{fieldErrors.stack[0]}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload 
                label="Cover Image" 
                onFileSelect={setFile} 
              />

              <div className="space-y-2">
                <Label htmlFor="live_url">Live URL (Optional)</Label>
                <Input 
                  id="live_url" 
                  name="live_url" 
                  placeholder="https://..." 
                  disabled={isLoading}
                />
                {fieldErrors.live_url && (
                  <p className="text-xs text-red-500">{fieldErrors.live_url[0]}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">Make this project visible on the website.</p>
                </div>
                <Switch id="published" name="published" disabled={isLoading} />
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
            <Link href="/admin/projects">
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
                  Save Project
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
