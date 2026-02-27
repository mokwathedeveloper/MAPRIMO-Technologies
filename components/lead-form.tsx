"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { leadSchema, type LeadFormData } from "@/lib/validations";
import { User, Mail, Building, MessageSquare, Send, Calendar as CalendarIcon } from "lucide-react";
import * as analytics from "@/lib/analytics";

export function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setMessage(null);

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
      setMessage({ type: "error", text: validation.error.errors[0].message });
      setLoading(false);
      return;
    }

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

      setMessage({ type: "success", text: "Thanks! We'll be in touch soon." });
      form.reset();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input name="name" placeholder="Your Name" required className="pl-10" />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input name="email" type="email" placeholder="Your Email" required className="pl-10" />
        </div>
        <div className="relative">
          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input name="company" placeholder="Company (optional)" className="pl-10" />
        </div>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            name="requested_date" 
            type="datetime-local" 
            placeholder="Preferred Meeting Time (Optional)" 
            className="pl-10" 
          />
          <p className="text-[10px] text-muted-foreground mt-1 ml-1">Optional: Request a strategy call time</p>
        </div>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Textarea 
            name="message" 
            placeholder="Tell us about your project" 
            required 
            rows={5} 
            className="pl-10"
          />
        </div>
      </div>
      
      <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          "Sending..."
        ) : (
          <>
            Send Message <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
      
      {message && (
        <p className={`text-sm text-center p-3 rounded-md ${
          message.type === "success" 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
