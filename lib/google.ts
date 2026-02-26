import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function getGoogleSheetsClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.sheets({ version: "v4", auth });
}

export async function appendToSheet(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
  requested_date?: string;
}) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId || !process.env.GOOGLE_CLIENT_ID) {
    console.warn("Google Sheets credentials not fully configured. Skipping sheet update.");
    return;
  }

  try {
    const sheets = await getGoogleSheetsClient();
    const values = [
      [
        new Date().toISOString(),
        data.name,
        data.email,
        data.company || "N/A",
        data.requested_date || "N/A",
        data.message,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });
  } catch (error) {
    console.error("Error appending to Google Sheet:", error);
  }
}

export async function createCalendarEvent(data: {
  summary: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  attendeeEmail: string;
}) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn("Google Calendar credentials not configured.");
    return;
  }

  try {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: data.summary,
        description: data.description,
        start: { dateTime: data.startDateTime },
        end: { dateTime: data.endDateTime },
        attendees: [{ email: data.attendeeEmail }],
        reminders: {
          useDefault: true,
        },
      },
    });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}
