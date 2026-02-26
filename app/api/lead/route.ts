import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { leadSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { appendToSheet, createCalendarEvent } from "@/lib/google";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "placeholder");

export async function POST(req: Request) {
  try {
    // ... (rate limiting and validation code)
    const json = await req.json();
    const result = leadSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, company, message, requested_date } = result.data;

    // 1. Save to Supabase
    const { error: supabaseError } = await supabase.from("leads").insert([
      { name, email, company, message, requested_date },
    ]);

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    // 2. Email Notification (to you)
    if (process.env.RESEND_API_KEY) {
      resend.emails.send({
        from: "MAPRIMO Leads <onboarding@resend.dev>", // Replace with your verified domain in production
        to: "hello@maprimo.com", // Your receiving email
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

    // 3. Sync to Google Sheets
    appendToSheet({ name, email, company, message, requested_date }).catch(err => 
      console.error("Failed to sync to Google Sheets:", err)
    );

    // 3. Create Calendar Event if date requested
    if (requested_date) {
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
