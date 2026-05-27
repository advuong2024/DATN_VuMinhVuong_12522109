import { useState } from "react";
import { Form, Input, Button, Upload, Space, Descriptions, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { updateServiceResult } from "../Api/ServiceExecutionApi";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Dragger } = Upload;

export default function ServiceExecutionForm({ record, onSuccess, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const patientName = record.phieu_kham?.benh_nhan?.ten_benh_nhan || "-";
  const patientPhone = record.phieu_kham?.benh_nhan?.so_dien_thoai || "-";
  const serviceName = record.dich_vu?.ten_dich_vu || "-";
  const doctorName = record.bac_si?.ten_nhan_vien || "-";

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("ket_qua", values.ket_qua || "");

      if (fileList.length > 0) {
        formData.append("file", fileList[0].originFileObj);
      }

      await updateServiceResult(record.id_chi_tiet, formData);
      toast.success("Cập nhật kết quả thành công!");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật kết quả");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      const isImageOrPdf =
        file.type === "application/pdf" ||
        file.type.startsWith("image/");
      if (!isImageOrPdf) {
        message.error("Chỉ chấp nhận file ảnh hoặc PDF!");
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Descriptions size="small" column={1} bordered style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Bệnh nhân">{patientName}</Descriptions.Item>
        <Descriptions.Item label="SĐT">{patientPhone}</Descriptions.Item>
        <Descriptions.Item label="Dịch vụ">{serviceName}</Descriptions.Item>
        <Descriptions.Item label="Bác sĩ yêu cầu">{doctorName}</Descriptions.Item>
      </Descriptions>

      <Form.Item
        label="Kết quả"
        name="ket_qua"
        rules={[{ required: true, message: "Vui lòng nhập kết quả" }]}
      >
        <TextArea rows={4} placeholder="Nhập kết quả dịch vụ..." />
      </Form.Item>

      <Form.Item label="File kết quả (ảnh / PDF)">
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click hoặc kéo thả file vào đây</p>
          <p className="ant-upload-hint">Chấp nhận file ảnh (JPEG/PNG) hoặc PDF</p>
        </Dragger>
      </Form.Item>

      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Hoàn thành
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
