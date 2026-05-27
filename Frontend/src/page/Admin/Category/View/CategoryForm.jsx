import { Form, Input, Button, Space, Row, Col } from "antd";
import { useEffect } from "react";
import ImageUpload from "@/components/common/ImageUpload";

export default function CategoryForm({
  form,
  initialValues,
  onSubmit,
  activeTab,
}) {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    let payload = { ...values };

    if (activeTab === "medicine") {
      payload.type = "THUOC";
    } else if (activeTab === "service") {
      payload.type = "DICH_VU";
    }
    onSubmit(payload);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={16}>
        <Col span={activeTab === "specialty" ? 12 : 24}>
          <Form.Item
            label={activeTab === "specialty" ? "Tên chuyên khoa" : "Tên danh mục"}
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>
        </Col>

        {activeTab === "specialty" && (
          <Col span={12}>
            <Form.Item label="Ảnh" name="hinh_anh">
              <ImageUpload />
            </Form.Item>
          </Col>
        )}
      </Row>

      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
      >
        <Input.TextArea rows={5} />
      </Form.Item>

      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" htmlType="submit">
            {initialValues ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}