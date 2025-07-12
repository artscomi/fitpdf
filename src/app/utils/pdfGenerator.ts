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

// Funzione di pulizia aggressiva per ridurre il carico di memoria
function cleanHtmlForPdf(html: string): string {
  return html
    // Rimuovi tutti i blocchi @font-face
    .replace(/@font-face\s*\{[^}]*\}/g, '')
    // Rimuovi riferimenti a font esterni
    .replace(/src:\s*url\([^)]+\)/g, '')
    .replace(/\/_next\/static\/media\/[^)]+\)/g, '')
    .replace(/\/__nextjs_font\/[^)]+\)/g, '')
    // Rimuovi classi CSS dinamiche di Next.js
    .replace(/\.__className_[a-zA-Z0-9]+/g, '')
    .replace(/\.__variable_[a-zA-Z0-9]+/g, '')
    // Rimuovi CSS variables complesse ma preserva quelle essenziali
    .replace(/--tw-[^;]+;/g, '')
    .replace(/var\(--[^)]+\)/g, '#333')
    // Rimuovi media queries non essenziali
    .replace(/@media[^{]*\{[^}]*\}/g, '')
    // Rimuovi stili complessi di Tailwind ma preserva quelli di base
    .replace(/\[[^\]]+\][^}]*\{[^}]*\}/g, '')
    // Sostituisci tutti i font-family con Arial
    .replace(/font-family:\s*[^;]+;/g, 'font-family: Arial, sans-serif;')
    // Aggiungi stili di base essenziali con focus sul titolo
    .replace('</head>', `
      <style>
        * { font-family: Arial, sans-serif !important; }
        body { margin: 0; padding: 20px; }
        h1, h2, h3 { color: #7159b5; }
        .header { background: #7159b5; color: white; padding: 20px; text-align: center; border-radius: 15px; margin-bottom: 30px; }
        .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 8px; color: white !important; }
        .header p { font-size: 1.1rem; opacity: 0.9; font-weight: 300; color: white !important; }
        .section { margin: 20px 0; }
        .exercise-card { border: 1px solid #ddd; padding: 10px; margin: 10px 0; }
        .container { max-width: 210mm; margin: 0 auto; padding: 20px; }
        .client-info { background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 30px; }
        .client-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .client-details > div { padding: 8px; background: white; border-radius: 8px; }
        .section-title { font-size: 1.5rem; font-weight: 600; color: #333; margin-bottom: 20px; border-bottom: 3px solid #7159b5; }
        .circuit-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px; }
        .exercise-number { background: #7159b5; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; }
        .progression-table { background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0; }
        .table-header, .table-row { display: grid; grid-template-columns: 1fr 1fr 1fr 2fr; gap: 15px; }
        .table-header { font-weight: 600; padding: 10px 0; border-bottom: 2px solid #e9ecef; }
        .table-row { padding: 8px 0; border-bottom: 1px solid #e9ecef; }
        .highlight { background: #7159b5; color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .exercise-detail { background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #7159b5; }
        .exercise-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
        .exercise-icon { background: #7159b5; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .exercise-details { display: flex; gap: 15px; margin-top: 4px; }
        .exercise-details span { background: #f8f9fa; padding: 4px 8px; border-radius: 8px; }
        .muscles { background: #7159b5; color: white; padding: 8px 15px; border-radius: 10px; display: inline-block; margin-top: 8px; }
        .safety-section { background: #7159b5; border-radius: 10px; padding: 20px; margin: 30px 0; }
        .safety-title { color: white; margin-bottom: 15px; font-weight: 600; }
        .safety-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
        .safety-item { background: white; padding: 15px; border-radius: 8px; }
        .progression-plan { background: #f8f9fa; border-radius: 10px; padding: 25px; margin: 30px 0; }
        .progression-title { font-weight: 600; color: #333; margin-bottom: 20px; }
        .progression-item { margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; }
        strong { color: #7159b5; }
        ul { list-style: none; padding: 0; }
        li { padding: 5px 0 5px 20px; position: relative; }
        li::before { content: "•"; position: absolute; left: 0; color: #7159b5; }
        
        /* Stili specifici per assicurare che il titolo sia sempre visibile */
        .header h1, h1 { 
          display: block !important; 
          visibility: visible !important; 
          opacity: 1 !important; 
          font-size: 2.5rem !important; 
          font-weight: 700 !important; 
          color: white !important; 
          margin-bottom: 8px !important; 
        }
      </style>
    </head>
    `);
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
    let html = `
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

    // Applica la pulizia aggressiva
    html = cleanHtmlForPdf(html);

    // Debug: verifica che il titolo sia presente
    if (!html.includes("Guida Completa Workout Casalingo")) {
      console.warn("⚠️ Titolo non trovato nell'HTML dopo la pulizia!");
      console.log("HTML preview:", html.substring(0, 1000));
    } else {
      console.log("✅ Titolo trovato nell'HTML");
    }

    // Prima prova l'endpoint principale
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html, filename }),
      });

      if (response.ok) {
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
      } else {
        console.warn("⚠️ Endpoint principale fallito, provo il fallback...");
        throw new Error("Main endpoint failed");
      }
    } catch (error) {
      console.log("🔄 Usando endpoint di fallback...");
      
      // Se il principale fallisce, usa il fallback
      const fallbackResponse = await fetch("/api/generate-pdf-fallback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html, filename }),
      });

      if (!fallbackResponse.ok) {
        throw new Error("Both endpoints failed");
      }

      // Il fallback restituisce HTML, quindi lo scarichiamo come file HTML
      const htmlContent = await fallbackResponse.text();
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Mostra un messaggio all'utente
      alert("PDF generato come file HTML (compatibile con stampa). Apri il file e usa 'Stampa' per salvarlo come PDF.");
      
      return true;
    }
  } catch (error) {
    console.error("Errore durante la generazione del PDF:", error);
    alert("Errore nella generazione del PDF. Riprova più tardi.");
    return false;
  }
}
