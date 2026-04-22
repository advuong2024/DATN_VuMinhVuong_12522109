import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  Divider,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

export const GENDER_OPTIONS = [
  { label: "Nam", value: "NAM" },
  { label: "Nữ", value: "NU" },
  { label: "Khác", value: "KHAC" },
];

export default function BookingForm({
  initialValues,
  onSubmit,
  services,
  doctors,
  staffs,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dob: initialValues.dob ? dayjs(initialValues.dob) : null,
        date: initialValues.date ? dayjs(initialValues.date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const payload = {
      patient: {
        name: values.name,
        dob: values.dob.format("YYYY-MM-DD"),
        gender: values.gender,
        phone: values.phone,
        cccd: values.cccd,
        email: values.email,
        address: values.address,
      },
      booking: {
        service: values.service,
        doctor: values.doctor,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time,
        reason: values.reason,
        staff: values.staff,
      },
    };

    onSubmit(payload);
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Divider orientation="left">Customer Information</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Customer Name"
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
            label="Date Of Birth"
            name="dob"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select placeholder="Select gender" options={GENDER_OPTIONS} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true },
              { pattern: /^[0-9]{10}$/, message: "10 số" },
            ]}
          >
            <Input placeholder="Enter phone" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="cccd"
            label="CCCD"
            rules={[
              { required: true },
              { pattern: /^[0-9]{12}$/, message: "12 số" },
            ]}
          >
            <Input placeholder="Enter CCCD" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Booking Information</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="service"
            label="Specialty"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select specialty" options={services} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="doctor"
            label="Doctor"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select doctor" options={doctors} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" htmlType="submit"> 
            Create
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}