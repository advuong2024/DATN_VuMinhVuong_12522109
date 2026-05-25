import { useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function useExportPDF() {
  const contentRef = useRef(null);

  const exportPDF = useCallback(async (filename = "document.pdf") => {
    const element = contentRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const ratio = pdfWidth / canvas.width;
    const pageCanvasHeight = pdfHeight / ratio;

    let remaining = canvas.height;
    let srcY = 0;

    while (remaining > 0) {
      const h = Math.min(pageCanvasHeight, remaining);

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = h;
      const ctx = pageCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, srcY, canvas.width, h, 0, 0, canvas.width, h);

      if (srcY > 0) pdf.addPage();
      pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, pdfWidth, h * ratio);

      srcY += h;
      remaining -= h;
    }

    pdf.save(filename);
  }, []);

  return { contentRef, exportPDF };
}
