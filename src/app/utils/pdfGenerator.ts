export const generatePDF = async (element: HTMLElement, filename: string) => {
  console.log("Starting PDF generation...");
  console.log("Element to convert:", element);

  try {
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 10,
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    console.log("Generating PDF with options:", opt);
    const pdf = html2pdf().set(opt);
    console.log("PDF object created");

    await pdf.from(element).save();
    console.log("PDF generated successfully");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
