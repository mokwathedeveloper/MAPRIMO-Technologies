"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Music, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePodcast } from "@/lib/actions/portfolio";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import type { Podcast } from "@/lib/types";

const STAGES = [
  { label: "Validating changes...", progress: 20 },
  { label: "Uploading media (if changed)...", progress: 50 },
  { label: "Updating database...", progress: 80 },
  { label: "Finalizing...", progress: 95 },
];

export function EditPodcastForm({ episode }: { episode: Podcast }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stageIndex, setStageIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

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
    if (coverFile) {
      formData.set("cover", coverFile);
    }
    if (audioFile) {
      formData.set("audio", audioFile);
    }
    if (videoFile) {
      formData.set("video", videoFile);
    }
    formData.set("current_cover_url", episode.cover_url);
    formData.set("current_audio_url", episode.audio_url);
    formData.set("current_video_url", episode.video_url || "");

    startTransition(async () => {
      setStageIndex(0);
      try {
        const result = await updatePodcast(episode.id, formData);
        
        if (result.ok) {
          toast.success("Podcast episode updated successfully!");
          router.push("/admin/podcasts");
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
            <CardTitle>Episode Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Episode Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={episode.title}
                  placeholder="e.g. Scaling Technical Teams" 
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
                  defaultValue={episode.slug}
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
              <Label htmlFor="description">Short Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={episode.description}
                placeholder="A brief summary of the conversation..." 
                required 
                className="min-h-[100px]"
                disabled={isLoading}
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
                  defaultValue={episode.duration}
                  placeholder="e.g. 45:12" 
                  required 
                  disabled={isLoading}
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
                  defaultValue={episode.author}
                  required 
                  disabled={isLoading}
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
              defaultValue={episode.cover_url}
              onFileSelect={setCoverFile} 
            />

            <div className="space-y-4">
              <Label htmlFor="youtube_url" className="flex items-center gap-2">
                <Play className="h-4 w-4 text-red-600" />
                YouTube Video URL (Optional)
              </Label>
              <Input 
                id="youtube_url"
                name="youtube_url"
                defaultValue={episode.youtube_url}
                placeholder="https://youtube.com/watch?v=..."
                disabled={isLoading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
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
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground italic">
                    Current file: {episode.audio_url.split('/').pop()}
                  </p>
                  {audioFile && (
                    <p className="text-xs text-green-600 font-medium">
                      New file selected: {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4" />
                  Video File (.mp4)
                </Label>
                <div className="grid gap-2">
                  <Input 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                    disabled={isLoading}
                  />
                  {episode.video_url && (
                    <p className="text-xs text-muted-foreground italic">
                      Current file: {episode.video_url.split('/').pop()}
                    </p>
                  )}
                  {videoFile && (
                    <p className="text-xs text-green-600 font-medium">
                      New file selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
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
          <Link href="/admin/podcasts">
            <Button variant="outline" type="button" disabled={isLoading}>Cancel</Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="gap-2 min-w-[150px]">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Episode
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
