import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export async function POST(request: Request) {
  try {
    const { html, filename } = await request.json();

    const browser = await puppeteer.launch(
      process.env.NODE_ENV === "production"
        ? {
            args: [
              ...chromium.args,
              "--no-sandbox",
              "--disable-setuid-sandbox",
            ],
            executablePath: await chromium.executablePath(),
            headless: true,
          }
        : {
            headless: true,
          }
    );

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Aspetta che tutte le immagini siano caricate
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.onload = img.onerror = resolve;
              })
          )
      );
    });

    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

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
