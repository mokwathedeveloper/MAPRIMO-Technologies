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
import { ImageUpload } from "@/components/admin/image-upload";
import { createCaseStudy } from "@/lib/actions/portfolio";
import { toast } from "sonner";

const STAGES = [
  { label: "Validating content...", progress: 20 },
  { label: "Uploading media...", progress: 50 },
  { label: "Saving to database...", progress: 80 },
  { label: "Finalizing...", progress: 95 },
];

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stageIndex, setStageIndex] = useState(-1);
  const [results, setResults] = useState<string[]>([""]);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScreenshotFiles(Array.from(e.target.files));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!coverFile) {
      toast.error("Please upload a cover image.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("cover", coverFile);
    
    const filteredResults = results.filter(r => r.trim() !== "");
    formData.set("results", JSON.stringify(filteredResults));
    
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];
    formData.set("tags", JSON.stringify(tags));

    screenshotFiles.forEach(file => {
      formData.append("screenshots", file);
    });

    startTransition(async () => {
      setStageIndex(0);
      try {
        const result = await createCaseStudy(formData);
        
        if (result.ok) {
          toast.success("Case study created successfully!");
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/case-studies">
          <Button variant="outline" size="icon" disabled={isLoading}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Case Study</h1>
          <p className="text-muted-foreground">Detail a successful project transformation.</p>
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
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
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
                onFileSelect={setCoverFile} 
              />

              <div className="space-y-2">
                <Label htmlFor="screenshots">Detailed Screenshots (Optional)</Label>
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
                  Selected {screenshotFiles.length} files.
                </p>
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Case Study
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
