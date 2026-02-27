"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { createPost } from "@/lib/actions/portfolio";
import { toast } from "sonner";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    if (file) {
      formData.append("featured_image", file);
    }
    
    try {
      await createPost(formData);
      toast.success("Blog post published!");
      router.push("/admin/blog");
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
          <p className="text-muted-foreground">Share your thoughts with the world.</p>
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
                  <Input id="title" name="title" placeholder="Post title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" placeholder="post-url-slug" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" placeholder="MAPRIMO Team" defaultValue="MAPRIMO Team" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
                <Textarea id="excerpt" name="excerpt" placeholder="A brief summary of the post..." required />
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
                onUpload={() => {}} 
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
                placeholder="Write your post content here..." 
                rows={15}
                required 
              />
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Link href="/admin/blog">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
