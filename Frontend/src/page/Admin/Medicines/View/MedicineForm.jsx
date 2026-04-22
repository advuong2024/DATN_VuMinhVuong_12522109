import { Form, Input, Select, Button, Space, Row, Col, DatePicker } from "antd";
import { useEffect } from "react";
import { UNIT_OPTIONS } from "../constants/medicine_option";

export const CATEGORY_OPTIONS = [
  { label: "Kháng sinh", value: "KHANG_SINH" },
  { label: "Giảm đau", value: "GIAM_DAU" },
  { label: "Vitamin", value: "VITAMIN" },
];

export default function MedicineForm({ form, initialValues, onSubmit }) {

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    onSubmit({
      ...values,
      expiryDate: values.expiryDate?.format("YYYY-MM-DD"),
    });
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={16}>
        
        <Col span={12}>
          <Form.Item
            label="Medicine Name"
            name="name"
            rules={[{ required: true, message: "Please enter the medicine name" }]}
          >
            <Input placeholder="Enter medicine name" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please enter the price" },
              { pattern: /^[0-9]+$/, message: "Must be a number" },
            ]}
          >
            <Input placeholder="Enter price" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <Input placeholder="Enter quantity" />
          </Form.Item>
        </Col>

        <Col span={12}>
            <Form.Item
                label="Unit"
                name="unit"
                rules={[{ required: true, message: "Please select unit" }]}
            >
                <Select
                placeholder="Select unit"
                options={UNIT_OPTIONS}
                showSearch
                optionFilterProp="label"
                />
            </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Expiry Date"
            name="expiryDate"
            rules={[{ required: true, message: "Please select the expiry date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder="Select a category"
              options={CATEGORY_OPTIONS}
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