"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
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

export function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Add file and process data
    if (file) {
      formData.append("cover_image", file);
    }
    formData.append("current_cover_url", project.cover_url);
    const stack = (formData.get("stack") as string).split(",").map(s => s.trim()).filter(Boolean);
    formData.set("stack", JSON.stringify(stack));
    formData.set("published", String(formData.get("published") === "on"));

    try {
      await updateProject(project.id, formData);
      toast.success("Project updated successfully!");
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

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
                <Input id="title" name="title" defaultValue={project.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" name="slug" defaultValue={project.slug} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Short Summary</Label>
              <Textarea 
                id="summary" 
                name="summary" 
                defaultValue={project.summary}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stack">Stack (comma separated)</Label>
              <Input id="stack" name="stack" defaultValue={project.stack.join(", ")} required />
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
                <Input id="repo_url" name="repo_url" defaultValue={project.repo_url || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="live_url">Live URL (Optional)</Label>
                <Input id="live_url" name="live_url" defaultValue={project.live_url || ""} />
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
              <Switch id="published" name="published" defaultChecked={project.published} />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link href="/admin/projects">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Update Project"}
          </Button>
        </div>
      </div>
    </form>
  );
}
