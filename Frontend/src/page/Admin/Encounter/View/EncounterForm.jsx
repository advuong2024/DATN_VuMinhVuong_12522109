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
import { useEffect, useState, useRef } from "react";
import { GENDER_OPTIONS } from "@/components/common/Options";
import { createBooking, findPatientByPhone } from "../Api/BookingApi";
import { toast } from "react-toastify";

export default function BookingForm({
  initialValues,
  services,
  doctors,
  staffs,
}) {
  const [form] = Form.useForm();
  const timeoutRef = useRef(null);
  const [isOldPatient, setIsOldPatient] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);

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

  const handleFindPatient = () => {
    const phone = form.getFieldValue("phone");
    const cccd = form.getFieldValue("cccd");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (!phone && !cccd) {
        setIsOldPatient(false);
        return;
      }

      const isValidPhone = phone && phone.length === 10;
      const isValidCCCD = cccd && cccd.length === 12;

      const isTypingPhone = phone && phone.length > 0 && phone.length < 10;
      const isTypingCCCD = cccd && cccd.length > 0 && cccd.length < 12;

      if (!isValidPhone && !isValidCCCD) {
        setIsOldPatient(false);

        form.resetFields([
          "name",
          "dob",
          "gender",
          "address",
          "phone",
          "cccd",
        ]);
        return;
      }

      if (!phone && !cccd) {
        setIsOldPatient(false);

        form.resetFields([
          "name",
          "dob",
          "gender",
          "address",
        ]);

        return;
      }

      try {
        setLoadingPatient(true);

        const res = await findPatientByPhone({
          phone,
          cccd,
        });

        if (res?.data) {
          const patient = res.data;

          form.setFieldsValue({
            name: patient.ten_benh_nhan,
            dob: patient.ngay_sinh ? dayjs(patient.ngay_sinh) : null,
            gender: patient.gioi_tinh,
            address: patient.dia_chi,
            // cccd: patient.CCCD,
          });

          setIsOldPatient(true);
          toast.info("Đã tìm thấy bệnh nhân cũ");
        } else {
          setIsOldPatient(false);
        }
      } catch {
        setIsOldPatient(false);
      } finally {
        setLoadingPatient(false);
      }
    }, 500);
  };

  const handleFinish = async (values) => {
    try {
      const payload = {
        patient: {
          name: values.name,
          dob: values.dob.format("YYYY-MM-DD"),
          gender: values.gender,
          phone: values.phone,
          cccd: values.cccd,
          address: values.address,
        },
        booking: {
          service: values.service,
          doctor: values.doctor,
          date: values.date?.format("YYYY-MM-DD"),
          time: values.time,
          reason: values.reason,
          staff: values.staff,
        },
      };

      await createBooking(payload);

      toast.success("Create success!");
      form.resetFields();
      setIsOldPatient(false);
    } catch (error) {
      console.error(error);
      toast.error("Create failed!");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      onValuesChange={(changedValues) => {
        if ("phone" in changedValues || "cccd" in changedValues) {
          handleFindPatient();
        }
      }}
    >
      <Divider orientation="left">Customer Information</Divider>

      {isOldPatient && (
        <div style={{ color: "green", marginBottom: 10 }}>
          ✔ Bệnh nhân cũ
        </div>
      )}

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
            <Input placeholder="Enter name" disabled={isOldPatient} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Date Of Birth"
            name="dob"
            rules={[{ required: true }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabled={isOldPatient}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select gender"
              options={GENDER_OPTIONS}
              disabled={isOldPatient}
            />
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
            <Input
              placeholder="Enter phone"
              maxLength={10}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
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
            <Input
              placeholder="Enter CCCD"
              maxLength={12}
              disabled={isOldPatient}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter address" disabled={isOldPatient} />
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
          <Button type="primary" htmlType="submit" loading={loadingPatient}>
            Create
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}