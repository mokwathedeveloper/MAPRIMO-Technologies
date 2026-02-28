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
import { ImageUpload } from "@/components/admin/image-upload";
import { createPost } from "@/lib/actions/portfolio";
import { toast } from "sonner";

const STAGES = [
  { label: "Validating content...", progress: 20 },
  { label: "Uploading featured image...", progress: 50 },
  { label: "Saving post...", progress: 80 },
  { label: "Revalidating cache...", progress: 95 },
];

export default function NewBlogPostPage() {
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

    const formData = new FormData(e.currentTarget);
    
    if (file) {
      formData.set("featured_image", file);
    }
    
    startTransition(async () => {
      setStageIndex(0);
      try {
        const result = await createPost(formData);
        
        if (result.ok) {
          toast.success("Blog post published successfully!");
          router.push("/admin/blog");
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
        <Link href="/admin/blog">
          <Button variant="outline" size="icon" disabled={isLoading}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
          <p className="text-muted-foreground">Share insights and engineering updates with your audience.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="e.g. Scaling Technical Teams" 
                    required 
                    disabled={isLoading}
                  />
                  {fieldErrors.title && (
                    <p className="text-xs text-red-500">{fieldErrors.title[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input 
                    id="slug" 
                    name="slug" 
                    placeholder="e.g. scaling-technical-teams" 
                    required 
                    disabled={isLoading}
                  />
                  {fieldErrors.slug && (
                    <p className="text-xs text-red-500">{fieldErrors.slug[0]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input 
                  id="author" 
                  name="author" 
                  placeholder="MAPRIMO Team" 
                  defaultValue="MAPRIMO Team" 
                  disabled={isLoading}
                />
                {fieldErrors.author && (
                  <p className="text-xs text-red-500">{fieldErrors.author[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
                <Textarea 
                  id="excerpt" 
                  name="excerpt" 
                  placeholder="A brief summary of the post for the listing page..." 
                  required 
                  disabled={isLoading}
                />
                {fieldErrors.excerpt && (
                  <p className="text-xs text-red-500">{fieldErrors.excerpt[0]}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload 
                label="Upload Post Image" 
                onFileSelect={setFile} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content (Markdown Supported)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                id="content" 
                name="content" 
                placeholder="Write your post content here using Markdown..." 
                rows={15}
                required 
                disabled={isLoading}
              />
              {fieldErrors.content && (
                <p className="text-xs text-red-500">{fieldErrors.content[0]}</p>
              )}
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
            <Link href="/admin/blog">
              <Button variant="outline" type="button" disabled={isLoading}>Cancel</Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="gap-2 min-w-[140px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Publish Post
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
