import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Divider,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { createBooking, getCK, getDoctorCK, createPatient } from "../../Api/BookingApi";
import { GENDER_OPTIONS } from "@/components/common/Options";
import { toast } from "react-toastify";

export default function NewPatientForm() {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const selectedService = Form.useWatch("service", form);

  useEffect(() => {
    getCK().then((res) => {
      setServices(
        res.map((s) => ({
          label: s.ten_chuyen_khoa,
          value: s.id_chuyen_khoa,
        }))
      );
    });
  }, []);

  const handleServiceChange = async (value) => {
    form.setFieldsValue({ doctor: undefined });
    setDoctors([]);

    if (!value) return;

    const res = await getDoctorCK(value);

    setDoctors(
        res.map((d) => ({
        label: d.ten_nhan_vien,
        value: d.id_nhan_vien,
        }))
    );
  };

  const handleFinish = async (values) => {
    try {
        if (!values.doctor) {
            toast.error("Please select doctor");
            return;
        }

        const patientPayload = {
          name: values.name,
          phone: values.phone,
          gender: values.gender,
          dob: values.dob?.format("YYYY-MM-DD"),
          address: values.address,
          cccd: values.cccd,
          email: values.email,
          medicalHistory: values.medicalHistory,
        };

        const newPatient = await createPatient(patientPayload);

        console.log("NEW PATIENT:", newPatient);
        const patientId = newPatient?.data?.id_benh_nhan;

        if (!patientId) {
            throw new Error("Create patient failed");
        }

        const bookingPayload = {
          id_benh_nhan: patientId,
          id_chuyen_khoa: Number(values.service),
          id_bac_si: Number(values.doctor),
          thoi_gian: dayjs().toISOString(),
          ly_do: values.note || "",
          trang_thai: "DA_DEN",
        };

        console.log("BOOKING:", bookingPayload);

        await createBooking(bookingPayload);
        toast.success("Booking successfully");

        form.resetFields();
        setDoctors([]);
    } catch (err) {
        console.error("Error:", err);
        toast.error("Failed");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Divider>Patient Info</Divider>

      <Row gutter={12}>
        <Col span={8}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
                { required: true, message: "Please enter name" },
                { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="dob"
            label="DOB"
            rules={[{ required: true, message: "Please select date of birth" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY"/>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select options={GENDER_OPTIONS} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
                { required: true, message: "Please enter phone number" },
                {
                pattern: /^[0-9]{10}$/,
                message: "Phone must be exactly 10 digits",
                },
            ]}
          >
            <Input maxLength={10} 
                onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="cccd"
            label="CCCD"
            rules={[
                { required: true, message: "Please enter CCCD" },
                {
                pattern: /^[0-9]{12}$/,
                message: "CCCD must be exactly 12 digits",
                },
            ]}
          >
            <Input maxLength={12} 
                onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="address"
            label="Address"
            rules={[
                { required: true, message: "Please enter address" },
                { min: 5, message: "Address is too short" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Divider>Booking</Divider>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item name="service" label="Specialty" rules={[{ required: true }]}>
            <Select options={services} onChange={handleServiceChange} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="doctor" label="Doctor" rules={[{ required: true }]}>
            <Select options={doctors} disabled={!selectedService}/>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="note" label="Note">
        <Input.TextArea />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Create
      </Button>
    </Form>
  );
}