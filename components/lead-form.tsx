"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { leadSchema, type LeadFormData } from "@/lib/validations";
import { User, Mail, Building, MessageSquare, Send, Calendar as CalendarIcon, Loader2, CheckCircle2 } from "lucide-react";
import * as analytics from "@/lib/analytics";
import { cn } from "@/lib/utils";

const STAGES = [
  { label: "Securing Connection...", progress: 30 },
  { label: "Validating Specification...", progress: 60 },
  { label: "Transmitting Data...", progress: 90 },
  { label: "Syncing with Google...", progress: 98 },
];

export function LeadForm() {
  const [isPending, startTransition] = useTransition();
  const [stageIndex, setStageIndex] = useState(-1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Perceived progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPending && stageIndex < STAGES.length - 1) {
      const duration = stageIndex === -1 ? 400 : 1200;
      timer = setTimeout(() => {
        setStageIndex((prev) => prev + 1);
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [isPending, stageIndex]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setMessage(null);
    setFieldErrors({});

    const formData = new FormData(form);
    const data: LeadFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
      requested_date: formData.get("requested_date") as string,
      honeypot: formData.get("honeypot") as string,
    };

    const validation = leadSchema.safeParse(data);
    if (!validation.success) {
      const errors: Record<string, string[]> = {};
      validation.error.errors.forEach(err => {
        const path = err.path[0] as string;
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      });
      setFieldErrors(errors);
      return;
    }

    startTransition(async () => {
      setStageIndex(0);
      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to submit");
        }

        analytics.event({
          action: "submit_lead",
          category: "Contact",
          label: data.company || "Individual",
        });

        setMessage({ type: "success", text: "Transmission successful. Our engineering team will reach out shortly." });
        form.reset();
        setStageIndex(-1);
      } catch (error) {
        setMessage({ type: "error", text: error instanceof Error ? error.message : "Network protocol error" });
        setStageIndex(-1);
      }
    });
  }

  const isLoading = isPending || stageIndex !== -1;

  if (message?.type === "success") {
    return (
      <div className="py-12 px-6 text-center space-y-6 animate-in fade-in zoom-in duration-700">
        <div className="mx-auto w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/20 border-2 border-primary/20">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-3xl font-black tracking-tight font-heading">Protocol Completed.</h3>
        <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-sm mx-auto">
          Your technical requirements have been received. We'll be in touch within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setMessage(null)} className="rounded-xl font-bold border-2">
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Full Name</Label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                id="name"
                name="name" 
                placeholder="John Doe" 
                required 
                className="h-14 pl-12 rounded-2xl border-2 border-muted bg-muted/20 focus-visible:ring-primary focus-visible:border-primary font-medium" 
                disabled={isLoading}
                data-testid="lead-name"
              />
            </div>
            {fieldErrors.name && <p className="text-[10px] font-bold text-red-500 ml-1" data-testid="error-name">{fieldErrors.name[0]}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Email Address</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                id="email"
                name="email" 
                type="email" 
                placeholder="john@company.com" 
                required 
                className="h-14 pl-12 rounded-2xl border-2 border-muted bg-muted/20 focus-visible:ring-primary focus-visible:border-primary font-medium" 
                disabled={isLoading}
                data-testid="lead-email"
              />
            </div>
            {fieldErrors.email && <p className="text-[10px] font-bold text-red-500 ml-1" data-testid="error-email">{fieldErrors.email[0]}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Company / Project</Label>
            <div className="relative group">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                id="company"
                name="company" 
                placeholder="TechStream Inc." 
                className="h-14 pl-12 rounded-2xl border-2 border-muted bg-muted/20 focus-visible:ring-primary focus-visible:border-primary font-medium" 
                disabled={isLoading}
                data-testid="lead-company"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requested_date" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Preferred Meeting</Label>
            <div className="relative group">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                id="requested_date"
                name="requested_date" 
                type="datetime-local" 
                className="h-14 pl-12 rounded-2xl border-2 border-muted bg-muted/20 focus-visible:ring-primary focus-visible:border-primary font-medium" 
                disabled={isLoading}
                data-testid="lead-date"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Project Specification</Label>
          <div className="relative group">
            <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Textarea 
              id="message"
              name="message" 
              placeholder="Tell us about your technical challenges..." 
              required 
              rows={5} 
              className="pl-12 pt-4 rounded-2xl border-2 border-muted bg-muted/20 focus-visible:ring-primary focus-visible:border-primary font-medium resize-none"
              disabled={isLoading}
              data-testid="lead-message"
            />
          </div>
          {fieldErrors.message && <p className="text-[10px] font-bold text-red-500 ml-1" data-testid="error-message">{fieldErrors.message[0]}</p>}
        </div>
      </div>
      
      <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
      
      <div className="space-y-4">
        <Button type="submit" disabled={isLoading} className="w-full h-16 rounded-2xl font-black text-lg gap-3 shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01]" data-testid="lead-submit">
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Initiate Discovery <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        {isLoading && stageIndex !== -1 && (
          <div className="space-y-2 animate-in fade-in duration-500">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <span>{STAGES[stageIndex].label}</span>
              <span>{STAGES[stageIndex].progress}%</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${STAGES[stageIndex].progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {message && message.type === "error" && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center animate-shake">
          {message.text}
        </div>
      )}

      <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">
        Secure Encrypted Submission // End-to-End Encryption
      </p>
    </form>
  );
}
