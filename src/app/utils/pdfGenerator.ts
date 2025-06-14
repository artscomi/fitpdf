// Funzione per convertire un'immagine in base64
async function getBase64FromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return url; // Ritorna l'URL originale in caso di errore
  }
}

export async function generatePDF(
  element: HTMLElement,
  filename: string
): Promise<boolean> {
  try {
    // Converti tutte le immagini di YouTube in base64
    const images = element.getElementsByTagName("img");
    for (const img of Array.from(images)) {
      if (img.src.includes("youtube.com")) {
        img.src = await getBase64FromUrl(img.src);
      }
    }

    // Raccogli tutti gli stili dal documento originale
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch {
          // Se non possiamo accedere alle regole (CORS), prova a ottenere l'href
          if (styleSheet.href) {
            return `<link rel="stylesheet" href="${styleSheet.href}">`;
          }
          return "";
        }
      })
      .join("\n");

    // Prepara l'HTML con tutti gli stili necessari
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            ${styles}
            body {
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `;

    // Invia la richiesta all'API
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html, filename }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    // Scarica il PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return true;
  } catch (error) {
    console.error("Errore durante la generazione del PDF:", error);
    return false;
  }
}
