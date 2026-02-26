"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { leadSchema, type LeadFormData } from "@/lib/validations";

export function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data: LeadFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
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

      setMessage({ type: "success", text: "Thanks! We'll be in touch soon." });
      e.currentTarget.reset();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input name="name" placeholder="Your Name" required />
      </div>
      <div>
        <Input name="email" type="email" placeholder="Your Email" required />
      </div>
      <div>
        <Input name="company" placeholder="Company (optional)" />
      </div>
      <div>
        <Textarea name="message" placeholder="Tell us about your project" required rows={5} />
      </div>
      <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending..." : "Send Message"}
      </Button>
      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
