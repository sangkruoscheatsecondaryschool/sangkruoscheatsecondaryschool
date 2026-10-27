import "server-only";
import { google } from "googleapis";

export async function getGoogleSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Replace \n with actual newlines (common issue with env vars)
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Missing Google Service Account credentials in env.");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: key,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

export async function overwriteSheetTab(
  sheets: any,
  spreadsheetId: string,
  tabName: string,
  data: any[][],
) {
  // 1. Clear existing data
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${tabName}!A:Z`,
    });
  } catch (error) {
    // If tab doesn't exist, create it
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: tabName } } }],
      },
    });
  }

  if (data.length === 0) return;

  // 2. Write new data
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${tabName}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: data },
  });
}