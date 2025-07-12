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
        "--disable-extensions",
        "--disable-plugins",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--font-render-hinting=none",
        "--disable-font-subpixel-positioning",
        "--disable-lcd-text",
        "--disable-subpixel-font-positioning",
        "--disable-font-smoothing",
        // Argomenti specifici per Vercel
        "--disable-background-networking",
        "--disable-default-apps",
        "--disable-sync",
        "--metrics-recording-only",
        "--no-default-browser-check",
        "--no-pings",
        "--password-store=basic",
        "--use-mock-keychain",
        "--disable-domain-reliability",
        "--disable-print-preview",
        "--disable-speech-api",
        "--disk-cache-size=33554432",
        "--mute-audio",
        "--hide-scrollbars",
        "--ignore-gpu-blocklist",
        "--in-process-gpu",
        "--window-size=1920,1080",
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--allow-running-insecure-content",
        "--disable-site-isolation-trials",
        "--disable-features=Translate,BackForwardCache,AcceptCHFrame,MediaRouter,OptimizationHints,AudioServiceOutOfProcess,IsolateOrigins,site-per-process",
        "--enable-features=NetworkServiceInProcess2,SharedArrayBuffer",
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
    
    // Intercetta le richieste di font per evitarle
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.resourceType() === 'font' || request.url().includes('font')) {
        request.abort();
      } else {
        request.continue();
      }
    });
    
    // Semplifica l'HTML rimuovendo solo i riferimenti a font esterni problematici
    const simplifiedHtml = html
      .replace(/@font-face[^}]+}/g, '')
      .replace(/src:\s*url\([^)]+\)/g, '')
      .replace(/\/_next\/static\/media\/[^)]+\)/g, '')
      .replace(/\/__nextjs_font\/[^)]+\)/g, '')
      // Preserva il font-family ma sostituisci solo quelli problematici
      .replace(/font-family:\s*['"]?Poppins['"]?[^;]*;/g, 'font-family: Arial, sans-serif;')
      .replace(/font-family:\s*['"]?Inter['"]?[^;]*;/g, 'font-family: Arial, sans-serif;');
    
    // Debug: verifica che il titolo sia presente
    if (!simplifiedHtml.includes("Guida Completa Workout Casalingo")) {
      console.warn("⚠️ Titolo non trovato nell'HTML semplificato!");
      console.log("HTML preview:", simplifiedHtml.substring(0, 1000));
    } else {
      console.log("✅ Titolo trovato nell'HTML semplificato");
    }
    
    // Imposta il contenuto HTML
    await page.setContent(simplifiedHtml, { 
      waitUntil: "domcontentloaded",
      timeout: 30000 
    });

    // Aspetta un po' per il rendering
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Aspetta che tutte le immagini siano caricate (se presenti)
    try {
      await page.waitForFunction(() => {
        const images = Array.from(document.images);
        return images.every((img) => img.complete);
      }, { timeout: 5000 });
    } catch (error) {
      console.log("Timeout waiting for images, continuing anyway");
    }

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
      preferCSSPageSize: false,
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
