import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const isProd = process.env.NODE_ENV === "production";

// Enhanced logging for debugging
console.log("Environment:", isProd ? "Production" : "Development");
console.log("Chromium path:", await chromium.executablePath());
console.log("Chromium args:", JSON.stringify(chromium.args, null, 2));

export async function generatePDF(html: string): Promise<Buffer> {
  const executablePath = isProd
    ? await chromium.executablePath()
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

  console.log("Using executable path:", executablePath);
  console.log("Using args:", isProd ? chromium.args : []);
  console.log("Chromium headless:", chromium.headless);

  const browser = await puppeteer.launch({
    args: isProd ? chromium.args : [],
    executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

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
}
