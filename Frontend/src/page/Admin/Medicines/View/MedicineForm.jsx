import { Form, Input, Select, Button, Space, Row, Col, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { UNIT_OPTIONS } from "../constants/medicine_option";
import { getCategory } from "../Api/MedicinesApi";
import dayjs from "dayjs";

export default function MedicineForm({ form, initialValues, onSubmit }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        expiryDate: initialValues.expiryDate
          ? dayjs(initialValues.expiryDate)
          : null,
      });
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
            label="Tên thuốc"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên thuốc" }]}
          >
            <Input placeholder="Nhập tên thuốc" />
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
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <Input placeholder="Nhập số lượng" />
          </Form.Item>
        </Col>

        <Col span={12}>
            <Form.Item
                label="ĐVT"
                name="unit"
                rules={[{ required: true, message: "Vui lòng chọn ĐVT" }]}
            >
                <Select
                placeholder="Chọn ĐVT"
                options={UNIT_OPTIONS}
                showSearch
                optionFilterProp="label"
                />
            </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Hạn sử dụng"
            name="expiryDate"
            rules={[{ required: true, message: "Vui lòng chọn hạn sử dụng" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select
              placeholder="Chọn danh mục"
              options={categories}
            />
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