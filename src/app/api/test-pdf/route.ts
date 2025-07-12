// app/api/test-pdf/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdf";

export async function GET() {
  try {
    const testHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test PDF</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #7159b5; color: white; padding: 20px; text-align: center; border-radius: 15px; }
            .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 8px; color: white !important; }
            .header p { font-size: 1.1rem; opacity: 0.9; font-weight: 300; color: white !important; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏋️‍♀️ Guida Completa Workout Casalingo</h1>
            <p>Il tuo circuito personalizzato con video tutorial</p>
          </div>
          <div>
            <h2>Test Content</h2>
            <p>Questo è un test per verificare che il titolo sia visibile nel PDF.</p>
          </div>
        </body>
      </html>
    `;

    console.log("Generating test PDF...");
    const pdf = await generatePDF(testHtml);
    console.log("Test PDF generated successfully, size:", pdf.length, "bytes");

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=test-pdf.pdf",
        "Content-Length": pdf.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating test PDF:", error);
    return new NextResponse(`Error generating test PDF: ${error}`, { status: 500 });
  }
} 