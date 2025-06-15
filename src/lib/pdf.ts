import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";

async function getBrowser() {
  const REMOTE_PATH =
    process.env.CHROMIUM_REMOTE_EXEC_PATH || "/usr/bin/chromium-browser";
  const LOCAL_PATH =
    process.env.CHROMIUM_LOCAL_EXEC_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

  if (process.env.NODE_ENV === "production") {
    return await puppeteerCore.launch({
      args: chromium.args,
      executablePath: REMOTE_PATH,
      defaultViewport: null,
      headless: true,
    });
  }

  return await puppeteerCore.launch({
    executablePath: LOCAL_PATH,
    defaultViewport: null,
    headless: true,
  });
}

export const makePDFFromHTML = async (html: string): Promise<Buffer> => {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    page.on("pageerror", (err: Error) => {
      throw err;
    });
    page.on("error", (err: Error) => {
      throw err;
    });

    await page.setContent(html, { waitUntil: "networkidle0" });

    // Aspetta che tutte le immagini siano caricate
    await page.waitForFunction(() => {
      const images = Array.from(document.images);
      return images.every((img) => img.complete);
    });

    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      scale: 1.0,
    });

    await browser.close();
    return Buffer.from(pdf);
  } catch (error) {
    throw error;
  }
};
