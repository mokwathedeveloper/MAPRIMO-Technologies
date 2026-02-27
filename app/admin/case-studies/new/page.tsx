"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCaseStudy } from "@/lib/actions/portfolio";
import { caseStudySchema, type CaseStudyFormData } from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import { toast } from "sonner";

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [results, setResults] = useState<string[]>([""]);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase.from("projects").select("id, title").order("title");
      if (data) setProjects(data as Project[]);
    }
    fetchProjects();
  }, []);

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
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const projectId = formData.get("project_id") as string;
    const problem = formData.get("problem") as string;
    const solution = formData.get("solution") as string;

    const filteredResults = results.filter(r => r.trim() !== "");

    try {
      const validation = caseStudySchema.safeParse({
        project_id: projectId,
        problem,
        solution,
        results: filteredResults,
      });

      if (!validation.success) {
        throw new Error(validation.error.errors[0].message);
      }

      const submissionData = new FormData();
      submissionData.append("project_id", projectId);
      submissionData.append("problem", problem);
      submissionData.append("solution", solution);
      submissionData.append("results", JSON.stringify(filteredResults));
      screenshotFiles.forEach(file => {
        submissionData.append("screenshots", file);
      });

      await createCaseStudy(submissionData);
      toast.success("Case study created successfully!");
      router.push("/admin/case-studies");
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
        <Link href="/admin/case-studies">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Case Study</h1>
          <p className="text-muted-foreground">Deep dive into a successful project.</p>
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
                >
                  <option value="">-- Choose a project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
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
                <Textarea id="problem" name="problem" placeholder="What was the client facing?" rows={5} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution">Our Solution</Label>
                <Textarea id="solution" name="solution" placeholder="How did we solve it?" rows={5} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Key Results</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addResult}>
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
                  />
                  {results.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeResult(index)}>
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
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="screenshots">Upload Multiple Images</Label>
                <Input id="screenshots" name="screenshots" type="file" multiple accept="image/*" onChange={handleFileChange} />
                <p className="text-xs text-muted-foreground mt-2">
                  Selected {screenshotFiles.length} files.
                </p>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Link href="/admin/case-studies">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading} className="gap-2 font-bold h-12 px-8">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Case Study"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
