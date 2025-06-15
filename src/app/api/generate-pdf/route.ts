import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdf";

export async function POST(request: Request) {
  try {
    const { html, filename } = await request.json();

    const pdf = await generatePDF(html);

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
