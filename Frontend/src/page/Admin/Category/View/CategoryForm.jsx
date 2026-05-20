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
            label={activeTab === "specialty" ? "Specialty Name" : "Category Name"}
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
        </Col>

        {activeTab === "specialty" && (
          <Col span={12}>
            <Form.Item label="Image" name="hinh_anh">
              <ImageUpload />
            </Form.Item>
          </Col>
        )}
      </Row>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter description" }]}
      >
        <Input.TextArea rows={5} />
      </Form.Item>

      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" htmlType="submit">
            {initialValues ? "Update" : "Create"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}