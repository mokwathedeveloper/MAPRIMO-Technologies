"use client";

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
import { updatePost } from "@/lib/actions/portfolio";
import { toast } from "sonner";
import type { Post } from "@/lib/types";

const STAGES = [
  { label: "Validating content...", progress: 20 },
  { label: "Uploading image (if changed)...", progress: 50 },
  { label: "Updating database...", progress: 80 },
  { label: "Finalizing...", progress: 95 },
];

export function EditBlogPostForm({ post }: { post: Post }) {
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
    formData.set("current_image_url", post.image_url);
    
    startTransition(async () => {
      setStageIndex(0);
      try {
        const result = await updatePost(post.id, formData);
        
        if (result.ok) {
          toast.success("Blog post updated successfully!");
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
        console.error("Submission error:", err);
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
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={post.title}
                  placeholder="Post title" 
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
                  defaultValue={post.slug}
                  placeholder="post-url-slug" 
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
                defaultValue={post.author}
                placeholder="MAPRIMO Team" 
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
                defaultValue={post.excerpt}
                placeholder="A brief summary of the post..." 
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
              defaultValue={post.image_url}
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
              defaultValue={post.content}
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
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Post
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
