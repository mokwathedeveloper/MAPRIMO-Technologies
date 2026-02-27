"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProject } from "@/lib/actions/portfolio";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import type { Project } from "@/lib/types";

const STAGES = [
  { label: "Validating changes...", progress: 20 },
  { label: "Uploading new cover...", progress: 60 },
  { label: "Updating database...", progress: 85 },
  { label: "Done!", progress: 100 },
];

export function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stageIndex, setStageIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPending && stageIndex < STAGES.length - 1) {
      const duration = stageIndex === -1 ? 400 : 1200;
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

    const formData = new FormData(e.currentTarget);
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      formData.set("cover_image", file);
    }
    
    formData.append("current_cover_url", project.cover_url);
    const stackRaw = formData.get("stack") as string;
    const stack = stackRaw.split(",").map(s => s.trim()).filter(Boolean);
    formData.set("stack", JSON.stringify(stack));
    
    const isPublished = formData.get("published") === "on";
    formData.set("published", String(isPublished));

    startTransition(async () => {
      setStageIndex(0);
      try {
        const result = await updateProject(project.id, formData);
        
        if (result.ok) {
          toast.success("Project updated successfully!");
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
        const msg = "A network error occurred. Please try again.";
        setError(msg);
        toast.error(msg);
        setStageIndex(-1);
      }
    });
  }

  const isLoading = isPending || stageIndex !== -1;

  return (
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
                  defaultValue={project.title} 
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
                  defaultValue={project.slug} 
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
                defaultValue={project.summary}
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
                defaultValue={project.stack.join(", ")} 
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
              defaultValue={project.cover_url}
              onFileSelect={setFile} 
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="repo_url">Repository URL (Optional)</Label>
                <Input 
                  id="repo_url" 
                  name="repo_url" 
                  defaultValue={project.repo_url || ""} 
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="live_url">Live URL (Optional)</Label>
                <Input 
                  id="live_url" 
                  name="live_url" 
                  defaultValue={project.live_url || ""} 
                  disabled={isLoading}
                />
              </div>
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
              <Switch 
                id="published" 
                name="published" 
                defaultChecked={project.published} 
                disabled={isLoading}
              />
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
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2 min-w-[140px]">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Project
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
