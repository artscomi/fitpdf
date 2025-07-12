import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { html, filename } = await request.json();
    
    if (!html) {
      return new NextResponse("HTML content is required", { status: 400 });
    }
    
    console.log("Starting fallback PDF generation for:", filename);
    
    // Per ora, restituiamo un PDF semplice con il contenuto HTML
    // In futuro, potremmo implementare una soluzione alternativa come jsPDF
    
    const simplePdfContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              background: #7159b5; 
              color: white; 
              padding: 20px; 
              text-align: center; 
              border-radius: 15px; 
              margin-bottom: 30px; 
            }
            .header h1 { 
              font-size: 2.5rem; 
              font-weight: 700; 
              margin-bottom: 8px; 
              color: white !important; 
            }
            .header p { 
              font-size: 1.1rem; 
              opacity: 0.9; 
              font-weight: 300; 
              color: white !important; 
            }
            .section { margin: 20px 0; }
            .section-title { 
              font-size: 1.5rem; 
              font-weight: 600; 
              color: #333; 
              margin-bottom: 20px; 
              border-bottom: 3px solid #7159b5; 
            }
            .highlight { 
              background: #7159b5; 
              color: white; 
              padding: 20px; 
              border-radius: 10px; 
              text-align: center; 
              margin: 20px 0; 
            }
            .exercise-card { 
              border: 1px solid #ddd; 
              padding: 10px; 
              margin: 10px 0; 
              border-radius: 8px;
            }
            .exercise-number { 
              background: #7159b5; 
              color: white; 
              width: 25px; 
              height: 25px; 
              border-radius: 50%; 
              display: inline-flex; 
              align-items: center; 
              justify-content: center; 
              margin-right: 10px;
              font-weight: bold;
            }
            @media print {
              body { font-size: 12px; }
              .header h1 { font-size: 2rem; }
              .section-title { font-size: 1.2rem; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏋️‍♀️ Guida Completa Workout Casalingo</h1>
            <p>Il tuo circuito personalizzato con video tutorial</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">📋 Schema del Circuito</h2>
            <div class="exercise-card">
              <div class="exercise-number">1</div>
              <strong>Piegamenti</strong> - 2×10 → 2×15 → 3×15
            </div>
            <div class="exercise-card">
              <div class="exercise-number">2</div>
              <strong>Squat</strong> - 2×10 → 2×15 → 3×15
            </div>
            <div class="exercise-card">
              <div class="exercise-number">3</div>
              <strong>Rematore</strong> - 2×10 → 2×15 → 3×15
            </div>
            <div class="exercise-card">
              <div class="exercise-number">4</div>
              <strong>Affondi</strong> - 2×10 → 2×15 → 3×15
            </div>
            <div class="exercise-card">
              <div class="exercise-number">5</div>
              <strong>Alzate Laterali</strong> - 2×10 → 2×15 → 3×15
            </div>
          </div>
          
          <div class="highlight">
            ⏱ Recupero tra esercizi: 1 minuto e 30 secondi
          </div>
          
          <div class="section">
            <h2 class="section-title">⚠️ Note Importanti sulla Sicurezza</h2>
            <ul>
              <li><strong>Riscaldamento:</strong> 5-10 minuti di marcia sul posto</li>
              <li><strong>Idratazione:</strong> Bevi acqua prima, durante e dopo</li>
              <li><strong>Respirazione:</strong> Non trattenere mai il respiro</li>
              <li><strong>Forma:</strong> Tecnica corretta sempre</li>
              <li><strong>Dolore:</strong> Fermati se senti dolore acuto</li>
            </ul>
          </div>
          
          <div class="highlight">
            🏆 Ricorda: la costanza è la chiave del successo!
          </div>
        </body>
      </html>
    `;

    // Per ora restituiamo l'HTML come risposta
    // In futuro potremmo implementare jsPDF o un'altra soluzione
    return new NextResponse(simplePdfContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${filename}.html"`,
      },
    });
    
  } catch (error) {
    console.error("Error in fallback PDF generation:", error);
    return new NextResponse(`Error generating fallback PDF: ${error}`, { status: 500 });
  }
} 