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
import { createCaseStudy } from "@/lib/actions/portfolio";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import { toast } from "sonner";

const STAGES = [
  { label: "Validating inputs...", progress: 20 },
  { label: "Uploading screenshots...", progress: 50 },
  { label: "Linking to project...", progress: 80 },
  { label: "Finalizing...", progress: 95 },
];

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stageIndex, setStageIndex] = useState(-1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [results, setResults] = useState<string[]>([""]);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase.from("projects").select("id, title").order("title");
      if (data) setProjects(data as Project[]);
    }
    fetchProjects();
  }, []);

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

    const formData = new FormData(e.currentTarget);
    const projectId = formData.get("project_id") as string;
    const problem = formData.get("problem") as string;
    const solution = formData.get("solution") as string;
    const filteredResults = results.filter(r => r.trim() !== "");

    const submissionData = new FormData();
    submissionData.append("project_id", projectId);
    submissionData.append("problem", problem);
    submissionData.append("solution", solution);
    submissionData.append("results", JSON.stringify(filteredResults));
    screenshotFiles.forEach(file => {
      submissionData.append("screenshots", file);
    });

    startTransition(async () => {
      setStageIndex(0);
      try {
        const result = await createCaseStudy(submissionData);
        
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
          <p className="text-muted-foreground">Deep dive into a successful project transformation.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Association</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="project_id">Select Project</Label>
                <select 
                  id="project_id" 
                  name="project_id" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                  disabled={isLoading}
                >
                  <option value="">-- Choose a project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                {fieldErrors.project_id && (
                  <p className="text-xs text-red-500">{fieldErrors.project_id[0]}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="problem">The Challenge (Problem)</Label>
                <Textarea 
                  id="problem" 
                  name="problem" 
                  placeholder="What was the client facing before MAPRIMO?" 
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
                  placeholder="How did our engineering and QA approach solve it?" 
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
              {fieldErrors.results && (
                <p className="text-xs text-red-500">{fieldErrors.results[0]}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visuals (Screenshots)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="screenshots">Upload Multiple Images</Label>
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
                  Processing...
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
