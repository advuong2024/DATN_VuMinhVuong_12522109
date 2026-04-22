import { Form, Input, Select, Button, Space, Row, Col } from "antd";
import { useEffect } from "react";

export const CATEGORY_OPTIONS = [
  { label: "Khám bệnh", value: "KHAM" },
  { label: "Xét nghiệm", value: "XET_NGHIEM" },
  { label: "Phẫu thuật", value: "PHAU_THUAT" },
];

export default function ServiceForm({ form, initialValues, onSubmit }) {

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={16}>
        
        <Col span={12}>
          <Form.Item
            label="Service Name"
            name="name"
            rules={[
              { required: true, message: "Please enter service name" },
            ]}
          >
            <Input placeholder="Enter service name" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please enter price" },
              { pattern: /^[0-9]+$/, message: "Must be a number" },
            ]}
          >
            <Input placeholder="Enter price" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              { required: true, message: "Please select category" },
            ]}
          >
            <Select
              placeholder="Select category"
              options={CATEGORY_OPTIONS}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter description"
            />
          </Form.Item>
        </Col>

      </Row>

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