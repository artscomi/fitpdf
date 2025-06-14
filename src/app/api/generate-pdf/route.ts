import { NextResponse } from "next/server";
import { makePDFFromHTML } from "@/lib/pdf";

export async function POST(request: Request) {
  try {
    const { html, filename } = await request.json();

    const pdf = await makePDFFromHTML(html);

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
