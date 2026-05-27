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
import { createBooking, getCK, getDoctorCK, createPatient } from "../Api/BookingApi";
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
            toast.error("Vui lòng chọn bác sĩ");
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
            throw new Error("Tạo bệnh nhân thất bại");
        }

        const bookingPayload = {
          id_benh_nhan: patientId,
          id_chuyen_khoa: Number(values.service),
          id_bac_si: Number(values.doctor),
          thoi_gian: dayjs().toISOString(),
          ly_do: values.note || "",
          trang_thai: "DA_DAT",
        };

        console.log("BOOKING:", bookingPayload);

        await createBooking(bookingPayload);
        toast.success("Đặt lịch thành công");

        form.resetFields();
        setDoctors([]);
    } catch (err) {
        console.error("Error:", err);
        toast.error("Thất bại");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Divider>Thông tin bệnh nhân</Divider>

      <Row gutter={12}>
        <Col span={8}>
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[
                { required: true, message: "Vui lòng nhập họ tên" },
                { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="dob"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY"/>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select options={GENDER_OPTIONS} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="phone"
            label="SĐT"
            rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                pattern: /^[0-9]{10}$/,
                message: "SĐT phải có đúng 10 số",
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
                { required: true, message: "Vui lòng nhập CCCD" },
                {
                pattern: /^[0-9]{12}$/,
                message: "CCCD phải có đúng 12 số",
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
            label="Địa chỉ"
            rules={[
                { required: true, message: "Vui lòng nhập địa chỉ" },
                { min: 5, message: "Địa chỉ quá ngắn" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Divider>Đặt lịch</Divider>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item name="service" label="Chuyên khoa" rules={[{ required: true }]}>          
            <Select options={services} onChange={handleServiceChange} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="doctor" label="Bác sĩ" rules={[{ required: true }]}>          
            <Select options={doctors} disabled={!selectedService}/>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="note" label="Ghi chú">
        <Input.TextArea />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Tạo lịch hẹn
      </Button>
    </Form>
  );
}