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
import { createProject } from "@/lib/actions/portfolio";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!file) {
      setError("Please upload a cover image.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    // Add file and process stack
    formData.append("cover_image", file);
    const stack = (formData.get("stack") as string).split(",").map(s => s.trim()).filter(Boolean);
    formData.set("stack", JSON.stringify(stack));
    formData.set("published", String(formData.get("published") === "on"));

    try {
      await createProject(formData);
      toast.success("Project created successfully!");
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

  // ... in render, replace Input for cover_url
  // <ImageUpload label="Cover Image" onFileSelect={setFile} onUpload={() => {}} />


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="outline" size="icon">
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
                  <Input id="title" name="title" placeholder="e.g. My Awesome App" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input id="slug" name="slug" placeholder="e.g. my-awesome-app" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Short Summary</Label>
                <Textarea 
                  id="summary" 
                  name="summary" 
                  placeholder="A brief description of the project..." 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stack">Stack (comma separated)</Label>
                <Input id="stack" name="stack" placeholder="Next.js, TypeScript, Tailwind" required />
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
                onUpload={() => {}} 
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="repo_url">Repository URL (Optional)</Label>
                  <Input id="repo_url" name="repo_url" placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="live_url">Live URL (Optional)</Label>
                  <Input id="live_url" name="live_url" placeholder="https://..." />
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
                <Switch id="published" name="published" />
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
              {loading ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
