import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: Request) {
  try {
    const { html, filename } = await request.json();

    // Avvia il browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });

    // Crea una nuova pagina
    const page = await browser.newPage();

    // Intercetta le richieste di immagini
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.resourceType() === "image") {
        request.continue();
      } else {
        request.continue();
      }
    });

    // Imposta il contenuto HTML
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Aspetta un po' per assicurarsi che le immagini siano caricate
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Genera il PDF
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

    // Chiudi il browser
    await browser.close();

    // Restituisci il PDF come risposta
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
