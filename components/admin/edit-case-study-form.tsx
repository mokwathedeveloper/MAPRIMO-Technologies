import { logger } from "@/lib/logger";
"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCaseStudy } from "@/lib/actions/portfolio";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import type { CaseStudy } from "@/lib/types";

const STAGES = [
  { label: "Validating content...", progress: 20 },
  { label: "Uploading media...", progress: 50 },
  { label: "Updating database...", progress: 80 },
  { label: "Finalizing...", progress: 95 },
];

export function EditCaseStudyForm({ caseStudy }: { caseStudy: CaseStudy }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stageIndex, setStageIndex] = useState(-1);
  const [results, setResults] = useState<string[]>(caseStudy.results || [""]);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [currentScreenshots, setCurrentScreenshots] = useState<string[]>(caseStudy.screenshots || []);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

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

  const addResult = () => setResults([...results, ""]);
  const updateResult = (index: number, value: string) => {
    const newResults = [...results];
    newResults[index] = value;
    setResults(newResults);
  };
  const removeResult = (index: number) => setResults(results.filter((_, i) => i !== index));

  const removeExistingScreenshot = (url: string) => {
    setCurrentScreenshots(currentScreenshots.filter(s => s !== url));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScreenshotFiles(Array.from(e.target.files));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    if (coverFile) {
      formData.set("cover", coverFile);
    }
    formData.set("current_cover_url", caseStudy.cover_url || "");
    
    const filteredResults = results.filter(r => r.trim() !== "");
    formData.set("results", JSON.stringify(filteredResults));
    
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];
    formData.set("tags", JSON.stringify(tags));

    formData.set("current_screenshots", JSON.stringify(currentScreenshots));
    
    screenshotFiles.forEach(file => {
      formData.append("screenshots", file);
    });

    startTransition(async () => {
      setStageIndex(0);
      try {
        const result = await updateCaseStudy(caseStudy.id, formData);
        
        if (result.ok) {
          toast.success("Case study updated successfully!");
          router.push("/admin/case-studies");
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
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={caseStudy.title}
                  placeholder="e.g. Scaling TechStream's Infrastructure" 
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
                  defaultValue={caseStudy.slug}
                  placeholder="e.g. techstream-scaling" 
                  required 
                  disabled={isLoading}
                />
                {fieldErrors.slug && (
                  <p className="text-xs text-red-500">{fieldErrors.slug[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input 
                  id="client" 
                  name="client" 
                  defaultValue={caseStudy.client}
                  placeholder="e.g. TechStream Inc." 
                  required 
                  disabled={isLoading}
                />
                {fieldErrors.client && (
                  <p className="text-xs text-red-500">{fieldErrors.client[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  name="tags" 
                  defaultValue={caseStudy.tags?.join(", ")}
                  placeholder="SaaS, Infrastructure, AWS" 
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Brief Summary</Label>
              <Textarea 
                id="summary" 
                name="summary" 
                defaultValue={caseStudy.summary}
                placeholder="A one-sentence summary of the impact..." 
                required 
                disabled={isLoading}
              />
              {fieldErrors.summary && (
                <p className="text-xs text-red-500">{fieldErrors.summary[0]}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Study Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="problem">The Challenge (Problem)</Label>
              <Textarea 
                id="problem" 
                name="problem" 
                defaultValue={caseStudy.problem}
                placeholder="What was the client facing?" 
                rows={5} 
                required 
                disabled={isLoading}
              />
              {fieldErrors.problem && (
                <p className="text-xs text-red-500">{fieldErrors.problem[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Our Solution</Label>
              <Textarea 
                id="solution" 
                name="solution" 
                defaultValue={caseStudy.solution}
                placeholder="How did we solve it?" 
                rows={5} 
                required 
                disabled={isLoading}
              />
              {fieldErrors.solution && (
                <p className="text-xs text-red-500">{fieldErrors.solution[0]}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Key Results</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addResult} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" /> Add Result
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="flex gap-2">
                <Input 
                  value={result} 
                  onChange={(e) => updateResult(index, e.target.value)} 
                  placeholder="e.g. 40% increase in performance" 
                  required 
                  disabled={isLoading}
                />
                {results.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeResult(index)} disabled={isLoading}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visuals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUpload 
              label="Cover Image" 
              defaultValue={caseStudy.cover_url}
              onFileSelect={setCoverFile} 
            />

            <div className="space-y-4">
              <Label>Current screenshots</Label>
              {currentScreenshots.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {currentScreenshots.map((url, i) => (
                    <div key={i} className="relative aspect-video rounded-md overflow-hidden border group">
                      <img src={url} alt="Screenshot" className="object-cover w-full h-full" />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExistingScreenshot(url)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No screenshots uploaded yet.</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="screenshots">Add New Screenshots</Label>
                <Input 
                  id="screenshots" 
                  name="screenshots" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Selected {screenshotFiles.length} new files.
                </p>
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
          <Link href="/admin/case-studies">
            <Button variant="outline" type="button" disabled={isLoading}>Cancel</Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="gap-2 min-w-[160px]">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Case Study
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
