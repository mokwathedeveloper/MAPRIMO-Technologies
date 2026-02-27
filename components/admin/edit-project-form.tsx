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
import { projectSchema, type ProjectFormData } from "@/lib/validations";
import type { Project } from "@/lib/types";

export function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    const data: ProjectFormData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      summary: formData.get("summary") as string,
      stack: (formData.get("stack") as string).split(",").map(s => s.trim()).filter(Boolean),
      cover_url: formData.get("cover_url") as string,
      repo_url: formData.get("repo_url") as string,
      live_url: formData.get("live_url") as string,
      published: formData.get("published") === "on",
    };

    try {
      const result = projectSchema.safeParse(data);
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }

      await updateProject(project.id, data);
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
            <div className="space-y-2">
              <Label htmlFor="cover_url">Cover Image URL</Label>
              <Input id="cover_url" name="cover_url" defaultValue={project.cover_url} required />
            </div>

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
