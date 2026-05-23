import { Modal, Button, Spin } from "antd";
import { useState } from "react";
import useExportPDF from "./useExportPDF";

export default function PrintPreviewModal({
  open,
  onClose,
  title,
  filename,
  children,
}) {
  const { contentRef, exportPDF } = useExportPDF();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    await exportPDF(filename);
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      <div style={{ textAlign: "right", marginBottom: 12 }}>
        <Button
          type="primary"
          onClick={handleDownload}
          loading={loading}
        >
          Tải PDF
        </Button>
      </div>

      <div
        ref={contentRef}
        style={{
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          padding: 0,
          background: "#fff",
        }}
      >
        {children}
      </div>
    </Modal>
  );
}
