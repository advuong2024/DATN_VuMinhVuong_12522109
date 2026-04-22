import { Form, Input, Button, Space } from "antd";
import { useEffect } from "react";

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
      payload.type = "MEDICINE";
    } else if (activeTab === "service") {
      payload.type = "SERVICE";
    }
    onSubmit(payload);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        label={activeTab === "specialty" ? "Specialty Name" : "Category Name"}
        name="name"
        rules={[{ required: true, message: "Please enter name" }]}
      >
        <Input placeholder="Enter name" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter description" }]}
      >
        <Input.TextArea rows={3} />
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