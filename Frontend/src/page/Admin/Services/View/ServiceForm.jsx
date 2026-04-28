import { Form, Input, Select, Button, Space, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { getCategory, getSpecialty } from "../Api/ServicesApi";

export default function ServiceForm({ form, initialValues, onSubmit }) {
  const [categories, setCategories] = useState([]);
  const [specialty, setSpecialty] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchSpecialty();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const fetchCategories = async () => {
    const res = await getCategory();

    const options = res.data.map((item) => ({
      label: item.ten_danh_muc,
      value: item.id_danh_muc,
    }));

    setCategories(options);
  };

  const fetchSpecialty = async () => {
    const res = await getSpecialty();

    const options = res.data.map((item) => ({
      label: item.ten_chuyen_khoa,
      value: item.id_chuyen_khoa,
    }));

    setSpecialty(options);
  };

  const handleFinish = (values) => {
    console.log("FORM VALUES:", values);
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

        <Col span={12}>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              { required: true, message: "Please select category" },
            ]}
          >
            <Select
              placeholder="Select category"
              options={categories}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Specialty"
            name="specialty"
            rules={[
              { required: true, message: "Please select specialty" },
            ]}
          >
            <Select
              placeholder="Select specialty"
              options={specialty}
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