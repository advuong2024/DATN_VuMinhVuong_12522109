import { Form, Input, Select, DatePicker, Button, Space, Row, Col } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {
  SPECIALTY_OPTIONS,
  POSITION_OPTIONS,
  GENDER_OPTIONS,
} from "../Constants/doctor_option";
import { createDoctor, updateDoctor,  getSpecialties } from "../Api/DoctorApi";
import { toast } from "react-toastify";

export default function PatientForm({ form, initialValues, onSuccess }) {
  const [specialtyOptions, setSpecialtyOptions] = useState([]);

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

  useEffect(() => {
    const fetchSpecialties = async () => {
        try {
        const res = await getSpecialties();
        const list = res.data?.data || res.data || [];

        setSpecialtyOptions(
            list.map((item) => ({
            label: item.ten_chuyen_khoa,
            value: Number(item.id_chuyen_khoa),
            }))
        );
        } catch (err) {
        console.error(err);
        }
    };

    fetchSpecialties();
  }, []);

  const handleFinish = async (values) => {
    const payload = {
        ...values,
        dob: values.dob.format("YYYY-MM-DD"),
    };

    try {
        if (initialValues) {
        await updateDoctor(initialValues.key, payload);
        toast.success("Update success");
        } else {
        await createDoctor(payload);
        toast.success("Create success");
        }

        onSuccess();
        form.resetFields();
    } catch (err) {
        console.error(err);
        toast.error("Action failed");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    label="Doctor Name"
                    name="name"
                    rules={[
                    { required: true, message: "Please enter doctor name" },
                    { pattern: /^[^\d]+$/, message: "Does not contain numbers" },
                    ]}
                >
                    <Input placeholder="Enter doctor name" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    label="Date of Birth"
                    name="dob"
                    rules={[{ required: true, message: "Please select date of birth" }]}
                >
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" allowClear />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: "Please select gender" }]}
                >
                    <Select placeholder="Select gender" options={GENDER_OPTIONS} />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[
                    { required: true, message: "Please enter phone number" },
                    { pattern: /^[0-9]{10}$/, message: "Must be 10 digits" },
                    ]}
                >
                    <Input 
                        placeholder="Enter phone number" 
                        maxLength={10}
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) e.preventDefault();
                        }} 
                    />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    label="Position"
                    name="position"
                    rules={[{ required: true, message: "Please select position" }]}
                >
                    <Select
                        placeholder="Select position"
                        options={POSITION_OPTIONS}
                    />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    label="Specialty"
                    name="specialty"
                >
                  <Select
                    placeholder="Select specialty"
                    options={specialtyOptions}
                  />
                </Form.Item>
            </Col>

            <Col span={24}>
                <Form.Item label="Address" name="address">
                    <Input placeholder="Enter address" />
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