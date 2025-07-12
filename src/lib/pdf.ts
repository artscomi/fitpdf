import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const isProd = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

console.log("Environment:", isProd ? "Production" : "Development");
console.log("Is Vercel:", isVercel);
console.log("Chromium path:", await chromium.executablePath());
console.log("Chromium args:", JSON.stringify(chromium.args, null, 2));

export async function generatePDF(html: string): Promise<Buffer> {
  const executablePath = isProd
    ? await chromium.executablePath()
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

  const filteredArgs = isProd
    ? [
        ...chromium.args.filter((arg) => !arg.startsWith("--headless")),
        "--headless=new",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-features=TranslateUI",
        "--disable-ipc-flooding-protection",
        // Argomenti specifici per Vercel
        ...(isVercel ? [
          "--disable-extensions",
          "--disable-plugins",
          "--disable-images",
          "--disable-javascript",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
        ] : []),
      ]
    : [];

  console.log("Using executable path:", executablePath);
  console.log("Using args:", filteredArgs);
  console.log("Chromium headless:", chromium.headless);

  let browser;
  try {
    browser = await puppeteer.launch({
      args: filteredArgs,
      executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
      timeout: 30000,
    });

    const page = await browser.newPage();
    
    // Imposta un timeout per il caricamento della pagina
    page.setDefaultTimeout(30000);
    
    // Imposta le dimensioni della viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Imposta il contenuto HTML
    await page.setContent(html, { 
      waitUntil: "networkidle0",
      timeout: 30000 
    });

    // Aspetta che tutte le immagini siano caricate
    await page.waitForFunction(() => {
      const images = Array.from(document.images);
      return images.every((img) => img.complete);
    }, { timeout: 10000 });

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
      timeout: 30000,
    });

    return pdf;
  } catch (error) {
    console.error("Error in generatePDF:", error);
    throw error;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
}
