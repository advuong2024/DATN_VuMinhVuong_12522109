import { Form, Input, Select, Button, Space, Row, Col, Switch } from "antd";
import { useEffect, useState } from "react";
import { getCategory, getSpecialty } from "../Api/ServicesApi";
import ImageUpload from "@/components/common/ImageUpload";
import RichTextEditor from "@/components/common/RichTextEditor";

export default function ServiceForm({ form, initialValues, onSubmit }) {
  const [categories, setCategories] = useState([]);
  const [specialty, setSpecialty] = useState([]);

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

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Tên dịch vụ"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
          >
            <Input placeholder="Nhập tên dịch vụ" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập giá" },
              { pattern: /^[0-9]+$/, message: "Phải là số" },
            ]}
          >
            <Input placeholder="Nhập giá" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select placeholder="Chọn danh mục" options={categories} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Chuyên khoa"
            name="specialty"
            rules={[{ required: true, message: "Vui lòng chọn chuyên khoa" }]}
          >
            <Select placeholder="Chọn chuyên khoa" options={specialty} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Ảnh" name="hinh_anh">
            <ImageUpload />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Mô tả ngắn" name="shortDescription">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn cho trang chủ..." />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Mô tả" name="description">
            <RichTextEditor />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Hiển thị trên trang người dùng" name="hien_thi" valuePropName="checked">
            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" defaultChecked />
          </Form.Item>
        </Col>
      </Row>

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
