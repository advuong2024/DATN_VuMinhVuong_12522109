import { useState } from "react";
import { Upload, Button, message, Image, Spin } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosClient from "./axiosClient";

const ImageUpload = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axiosClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange?.(res.data.url);
      message.success("Tải ảnh lên thành công");
    } catch {
      message.error("Tải ảnh thất bại");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleRemove = () => {
    onChange?.(null);
  };

  return (
    <div>
      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <Image src={value} alt="uploaded" width={200} style={{ borderRadius: 8, objectFit: "cover" }} />
          <Button
            danger
            type="primary"
            size="small"
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            style={{ position: "absolute", top: 4, right: 4 }}
          />
        </div>
      ) : (
        <Upload
          beforeUpload={handleUpload}
          showUploadList={false}
          accept="image/jpeg,image/png,image/webp,image/gif"
        >
          <Button icon={loading ? <Spin /> : <UploadOutlined />} loading={loading}>
            Enter Image
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default ImageUpload;
