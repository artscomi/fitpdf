export async function generatePDF(
  element: HTMLElement,
  filename: string
): Promise<boolean> {
  try {
    // Crea una nuova finestra
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      throw new Error("Impossibile aprire la finestra di stampa");
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
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `;

    // Scrivi l'HTML nella nuova finestra
    printWindow.document.write(html);
    printWindow.document.close();

    // Aspetta che il contenuto sia caricato
    printWindow.onload = () => {
      // Apri il dialogo di stampa
      printWindow.print();
    };

    return true;
  } catch (error) {
    console.error("Errore durante la generazione del PDF:", error);
    return false;
  }
}
