"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Music, ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPodcast } from "@/lib/actions/portfolio";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";

export default function NewPodcastPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!coverFile) {
      toast.error("Please upload a cover image.");
      return;
    }

    if (!audioFile) {
      toast.error("Please upload an audio file.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("cover", coverFile);
    formData.set("audio", audioFile);

    startTransition(async () => {
      try {
        const result = await createPodcast(formData);
        
        if (result.ok) {
          toast.success("Podcast episode created successfully!");
          router.push("/admin/podcasts");
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/podcasts">
          <Button variant="outline" size="icon" disabled={isPending}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Episode</h1>
          <p className="text-muted-foreground">Publish a new podcast episode to your audience.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Episode Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Episode Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="e.g. Scaling Technical Teams" 
                    required 
                    disabled={isPending}
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
                    placeholder="e.g. scaling-technical-teams" 
                    required 
                    disabled={isPending}
                  />
                  {fieldErrors.slug && (
                    <p className="text-xs text-red-500">{fieldErrors.slug[0]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="A brief summary of the conversation..." 
                  required 
                  className="min-h-[100px]"
                  disabled={isPending}
                />
                {fieldErrors.description && (
                  <p className="text-xs text-red-500">{fieldErrors.description[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    placeholder="e.g. 45:12" 
                    required 
                    disabled={isPending}
                  />
                  {fieldErrors.duration && (
                    <p className="text-xs text-red-500">{fieldErrors.duration[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author / Host</Label>
                  <Input 
                    id="author" 
                    name="author" 
                    defaultValue="MAPRIMO Team"
                    required 
                    disabled={isPending}
                  />
                  {fieldErrors.author && (
                    <p className="text-xs text-red-500">{fieldErrors.author[0]}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <ImageUpload 
                label="Cover Image" 
                onFileSelect={setCoverFile} 
              />

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Audio File (.mp3)
                </Label>
                <div className="grid gap-2">
                  <Input 
                    type="file" 
                    accept="audio/*" 
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                    disabled={isPending}
                  />
                  {audioFile && (
                    <p className="text-xs text-green-600 font-medium">
                      Selected: {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
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
            <Link href="/admin/podcasts">
              <Button variant="outline" type="button" disabled={isPending}>Cancel</Button>
            </Link>
            <Button type="submit" disabled={isPending} className="gap-2 min-w-[150px]">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading & Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Publish Episode
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
