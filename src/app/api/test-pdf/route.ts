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
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <h1>Test PDF Generation</h1>
          <p>This is a test PDF generated on ${new Date().toLocaleString()}</p>
          <p>If you can see this, PDF generation is working correctly!</p>
        </body>
      </html>
    `;

    console.log("Testing PDF generation...");
    const pdf = await generatePDF(testHtml);
    console.log("Test PDF generated successfully, size:", pdf.length, "bytes");

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=test.pdf",
        "Content-Length": pdf.length.toString(),
      },
    });
  } catch (error) {
    console.error("Test PDF generation failed:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Test failed", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
} 