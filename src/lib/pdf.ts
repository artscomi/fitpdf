import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const LOCAL_CHROME_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export async function generatePDF(html: string): Promise<Buffer> {
  let browser;
  try {
    if (process.env.NODE_ENV === "production") {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
        ignoreHTTPSErrors: true,
      });
    } else {
      browser = await puppeteerCore.launch({
        executablePath: LOCAL_CHROME_PATH,
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
    return pdf;
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}
