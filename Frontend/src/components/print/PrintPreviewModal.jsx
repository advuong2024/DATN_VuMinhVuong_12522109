import { Modal, Button, Spin } from "antd";
import { useState } from "react";
import useExportPDF from "./useExportPDF";

export default function PrintPreviewModal({
  open,
  onClose,
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
      width={850}
      centered
      title="Xem trước"
    >
      <div
        ref={contentRef}
        style={{
          background: "#fff",
          marginBottom: 12
        }}
      >
        {children}
      </div>

      <div style={{ textAlign: "right"}}>
        <Button
          type="primary"
          onClick={handleDownload}
          loading={loading}
        >
          Tải PDF
        </Button>
      </div>
    </Modal>
  );
}
