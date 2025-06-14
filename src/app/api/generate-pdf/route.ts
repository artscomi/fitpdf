import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: Request) {
  try {
    const { html, filename } = await request.json();

    let browser;
    if (process.env.NODE_ENV === "production") {
      const puppeteerCore = await import("puppeteer-core");
      browser = await puppeteerCore.default.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath:
          process.env.CHROME_EXECUTABLE_PATH || "/usr/bin/chromium-browser",
        headless: true,
      });
    } else {
      browser = await puppeteer.launch({
        headless: true,
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Aspetta che tutte le immagini siano caricate
    await page.waitForFunction(() => {
      const images = Array.from(document.images);
      return images.every((img) => img.complete);
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
