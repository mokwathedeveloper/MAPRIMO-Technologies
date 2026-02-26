import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { leadSchema } from "@/lib/validations";
import { appendToSheet, createCalendarEvent } from "@/lib/google";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    // Note: Production-grade rate limiting should be handled via Upstash or Vercel KV.
    const json = await req.json();
    
    // 1. Honeypot check (Bot protection)
    if (json.honeypot && json.honeypot.length > 0) {
      console.warn("Honeypot triggered, possible bot submission.");
      return NextResponse.json({ message: "Success" }, { status: 200 });
    }

    const result = leadSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, company, message, requested_date } = result.data;

    // 2. Save to Supabase (Required)
    const { error: supabaseError } = await supabase.from("leads").insert([
      { name, email, company, message, requested_date },
    ]);

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    // 3. Optional Email Notification (Resend)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      resend.emails.send({
        from: "MAPRIMO Leads <onboarding@resend.dev>",
        to: "hello@maprimo.com",
        subject: `New Lead: ${name} from ${company || "Individual"}`,
        html: `
          <h1>New Website Lead</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "N/A"}</p>
          <p><strong>Meeting Requested:</strong> ${requested_date || "No"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr />
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">View in Dashboard</a></p>
        `,
      }).catch(err => console.error("Resend error:", err));
    }

    // 4. Optional Sync to Google Sheets
    if (process.env.GOOGLE_SHEET_ID) {
      appendToSheet({ name, email, company, message, requested_date }).catch(err => 
        console.error("Failed to sync to Google Sheets:", err)
      );
    }

    // 5. Optional Calendar Event
    if (requested_date && process.env.GOOGLE_CLIENT_ID) {
      const start = new Date(requested_date);
      const end = new Date(start.getTime() + 30 * 60000); // 30 min duration

      createCalendarEvent({
        summary: `Strategy Call: ${name} (${company || 'No Company'})`,
        description: `New lead from website.\n\nMessage: ${message}\nEmail: ${email}`,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        attendeeEmail: email,
      }).catch(err => console.error("Failed to create calendar event:", err));
    }

    return NextResponse.json({ message: "Success" });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
