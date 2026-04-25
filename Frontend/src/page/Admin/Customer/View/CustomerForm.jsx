import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { GENDER_OPTIONS } from "../Constants/customer_option";

export default function PatientForm({ initialValues, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dob: initialValues.dob ? dayjs(initialValues.dob) : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      dob: values.dob.format("YYYY-MM-DD"),
    };

    onSubmit(payload);
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Patient Name"
            name="name"
            rules={[
              { required: true, message: "Please enter name" },
              { pattern: /^[^\d]+$/, message: "No numbers allowed" },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: "Select date" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select gender" options={GENDER_OPTIONS} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true },
              { pattern: /^[0-9]{10}$/, message: "10 digits" },
            ]}
          >
            <Input placeholder="Enter phone" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="CCCD"
            name="cccd"
            rules={[
              { required: true },
              { pattern: /^[0-9]{12}$/, message: "12 digits" },
            ]}
          >
            <Input placeholder="Enter CCCD" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
          >
            <Input placeholder="Enter email" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item 
            label="Address" 
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Medical History" name="medicalHistory">
            <Input.TextArea rows={3} placeholder="Enter history" />
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