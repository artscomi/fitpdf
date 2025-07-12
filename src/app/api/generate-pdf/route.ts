// app/api/generate-pdf/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdf";

export async function POST(request: Request) {
  try {
    const { html, filename } = await request.json();
    
    if (!html) {
      return new NextResponse("HTML content is required", { status: 400 });
    }
    
    console.log("Starting PDF generation for:", filename);
    const pdf = await generatePDF(html);
    console.log("PDF generated successfully, size:", pdf.length, "bytes");

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length": pdf.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    
    // Fornisci messaggi di errore più specifici
    let errorMessage = "Error generating PDF";
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        errorMessage = "PDF generation timed out. Please try again.";
        statusCode = 408;
      } else if (error.message.includes("memory")) {
        errorMessage = "Insufficient memory for PDF generation.";
        statusCode = 507;
      } else {
        errorMessage = `PDF generation failed: ${error.message}`;
      }
    }
    
    return new NextResponse(errorMessage, { status: statusCode });
  }
}
