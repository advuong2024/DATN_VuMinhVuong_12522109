import { Form, Input, Button, Select, Row, Col, Divider } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  findPatientByPhone,
  createBooking,
  getCK,
  getDoctorCK, getCanBook
} from "../Api/BookingApi";
import { toast } from "react-toastify";

export default function OldPatientForm() {
  const [form] = Form.useForm();
  const [patient, setPatient] = useState(null);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const selectedService = Form.useWatch("service", form);
  const [canBookState, setCanBookState] = useState(true);
  const [canBookMessage, setCanBookMessage] = useState("");

  useEffect(() => {
    const fetchCK = async () => {
      const res = await getCK();

      const options = (res || []).map((ck) => ({
        label: ck.ten_chuyen_khoa,
        value: ck.id_chuyen_khoa,
      }));

      setServiceOptions(options);
    };

    fetchCK();
  }, []);

  const handleSearch = async (value) => {
    if (!value) return;

    let query = {};

    if (/^[0-9]{10}$/.test(value)) {
        query.phone = value;
    } else if (/^[0-9]{12}$/.test(value)) {
        query.cccd = value;
    } else {
        return;
    }

    const res = await findPatientByPhone(query);

    if (res?.data) {
        setPatient(res.data);

        form.setFieldsValue({
            name: res.data.ten_benh_nhan,
        });

        try {
            const check = await canBook(res.data.id_benh_nhan);

            setCanBookState(check.data.canBook);
            setCanBookMessage(check.data.message || "");
        } catch (err) {
            setCanBookState(false);
            setCanBookMessage("Không thể kiểm tra lịch hẹn");
        }
    } else {
        setPatient(null);
        form.setFieldsValue({
            name: undefined,
            service: undefined,
            doctor: undefined,
        });
    }
  };

  const handleServiceChange = async (value) => {
    form.setFieldValue("doctor", undefined);

    if (!value) {
        setDoctors([]);
        return;
    }

    const res = await getDoctorCK(value);

    setDoctors(
        (res || []).map((d) => ({
        label: d.ten_nhan_vien,
        value: d.id_nhan_vien,
        }))
    );
  };

  const handleFinish = async (values) => {
    if (!patient?.id_benh_nhan) return;

    if (!canBookState) {
        toast.warning(canBookMessage || "Bệnh nhân không thể đặt lịch");
        return;
    }

    if (!values.doctor) {
        return alert("Vui lòng chọn bác sĩ");
    }

    const payload = {
        id_benh_nhan: patient.id_benh_nhan,
        id_bac_si: values.doctor,
        id_chuyen_khoa: values.service,
        ly_do: values.note || "",
        trang_thai: "DA_DAT",
        thoi_gian: dayjs().toISOString(),
    };

    console.log("PAYLOAD:", payload);

    await createBooking(payload);
    toast.success("Đặt lịch thành công");

    form.resetFields();
    setPatient(null);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Divider>Tìm bệnh nhân</Divider>

      <Row gutter={16}>
        <Col span={12}>
            <Form.Item
            name="keyword"
            rules={[{ required: true, message: "Vui lòng nhập SĐT hoặc CCCD" }]}
            >
            <Input.Search
                placeholder="Nhập SĐT hoặc CCCD"
                enterButton="Tìm"
                onSearch={handleSearch}
            />
            </Form.Item>
        </Col>
      </Row>

      {patient && (
        <>
          <Divider>Thông tin</Divider>

          <Form.Item name="name" label="Họ tên">
            <Input disabled />
          </Form.Item>

          <Divider>Đặt lịch</Divider>

          <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                    name="service"
                    label="Chuyên khoa"
                    rules={[{ required: true }]}
                >
                    <Select
                    options={serviceOptions}
                    onChange={handleServiceChange}
                    placeholder="Chọn chuyên khoa"
                    />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="doctor"
                    label="Bác sĩ"
                    rules={[{ required: true }]}
                >
                    <Select
                        options={doctors}
                        placeholder="Chọn bác sĩ"
                        disabled={!selectedService}
                    />
                </Form.Item>
            </Col>
          </Row>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Tạo lịch hẹn
          </Button>
        </>
      )}
    </Form>
  );
}