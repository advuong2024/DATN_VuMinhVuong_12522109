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

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  }, []);

  return { contentRef, exportPDF };
}
