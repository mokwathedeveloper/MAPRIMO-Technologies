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
import { toast } from "sonner";

const STAGES = [
  { label: "Validating content...", progress: 20 },
  { label: "Uploading new screenshots...", progress: 50 },
  { label: "Updating database...", progress: 80 },
  { label: "Finalizing...", progress: 95 },
];

export function EditCaseStudyForm({ caseStudy }: { caseStudy: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stageIndex, setStageIndex] = useState(-1);
  const [results, setResults] = useState<string[]>(caseStudy.results || [""]);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
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
    const problem = formData.get("problem") as string;
    const solution = formData.get("solution") as string;
    const filteredResults = results.filter(r => r.trim() !== "");

    const submissionData = new FormData();
    submissionData.append("problem", problem);
    submissionData.append("solution", solution);
    submissionData.append("results", JSON.stringify(filteredResults));
    submissionData.append("current_screenshots", JSON.stringify(currentScreenshots));
    
    screenshotFiles.forEach(file => {
      submissionData.append("screenshots", file);
    });

    startTransition(async () => {
      setStageIndex(0);
      try {
        const result = await updateCaseStudy(caseStudy.id, submissionData);
        
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
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Associated Project</p>
              <p className="text-xl font-black">{caseStudy.projects?.title || "Unknown Project"}</p>
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
            <CardTitle>Visuals (Screenshots)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentScreenshots.length > 0 && (
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
