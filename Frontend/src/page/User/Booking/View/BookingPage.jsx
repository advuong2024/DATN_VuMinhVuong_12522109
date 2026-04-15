import {
  Form,
  Select,
  Input,
  Button,
  Checkbox,
  Upload,
  Row,
  Col,
  Card,
  Typography,
  Steps
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Title } = Typography;

const services = [
  { label: "Khám tổng quát", value: "general" },
  { label: "Da liễu", value: "skin" },
  { label: "Răng hàm mặt", value: "dental" },
];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientType, setPatientType] = useState("old");
  const [patientLoaded, setPatientLoaded] = useState(false);
  const [timeError, setTimeError] = useState("");
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const dates = [0, 1, 2, 3].map((i) => {
    const d = dayjs().add(i, "day");
    return {
      value: d.format("YYYY-MM-DD"),
      label: d.format("DD/MM"),
      day: d.format("dddd"),
    };
  });

  const generateTimeSlots = () => {
    const morning = [];
    const afternoon = [];

    for (let hour = 7; hour <= 16; hour++) {
      if (hour === 12) continue;

      const time = `${hour.toString().padStart(2, "0")}:00`;

      if (hour < 12) {
        morning.push(time);
      } else {
        afternoon.push(time);
      }
    }

    return { morning, afternoon };
  };

  const { morning, afternoon } = generateTimeSlots();

  const isPastTime = (time) => {
    if (!selectedDate) return false;

    const now = dayjs();
    const selected = dayjs(`${selectedDate} ${time}`);

    return selected.isBefore(now);
  };

  const nextStep = async () => {
    try {
        await form.validateFields(["service", "reason", "date"]);

        const time = form.getFieldValue("time");

        if (!time) {
        setTimeError("Vui lòng chọn giờ khám");
        return;
        }

        setTimeError("");
        setStep(1);
    } catch (err) {}
  };

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div
      style={{
        background: "#f5f7fa",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <Card
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          borderRadius: 12,
        }}
      >
        <Title level={3} style={{ textAlign: "center", color: "#034ea5" }}>
          THÔNG TIN ĐẶT LỊCH HẸN
        </Title>

        <Steps
          current={step}
          items={[
            { title: "Chọn lịch" },
            { title: "Thông tin" },
          ]}
          style={{ marginBottom: 30 }}
        />

        <Form layout="vertical" form={form} onFinish={onFinish}>
          {step === 0 && (
            <>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Dịch vụ"
                    name="service"
                    rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn dịch vụ"
                      options={services}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Thời gian khám"
                    required
                    validateStatus={timeError ? "error" : ""}
                    help={timeError}
                  >

                    <Row gutter={12}>
                        {dates.map((item) => (
                        <Col key={item.value}>
                            <div
                            onClick={() => {
                                setSelectedDate(item.value);
                                setSelectedTime(null);
                                setTimeError("");
                                form.setFieldsValue({
                                date: item.value,
                                time: null,
                                });
                            }}
                            style={{
                                padding: "12px 18px",
                                borderRadius: 10,
                                cursor: "pointer",
                                textAlign: "center",
                                border:
                                selectedDate === item.value
                                    ? "2px solid #1677ff"
                                    : "1px solid #ddd",
                                background:
                                selectedDate === item.value
                                    ? "#e6f4ff"
                                    : "#fff",
                                minWidth: 90,
                            }}
                            >
                            <div style={{ fontWeight: 600 }}>
                                {item.label}
                            </div>
                            <small>{item.day}</small>
                            </div>
                        </Col>
                        ))}
                    </Row>

                    {selectedDate && (
                        <div style={{ marginTop: 20 }}>
                            <div style={{ marginBottom: 10, fontWeight: 600 }}>
                                Chọn giờ khám *
                            </div>

                            <div style={{ marginBottom: 10 }}>🌤 Ca sáng</div>
                            <Row gutter={[10, 10]}>
                                {morning.map((time) => {
                                const disabled = isPastTime(time);

                                return (
                                    <Col key={time} flex="0 0 90px">
                                    <div
                                        onClick={() => {
                                            if (disabled) return;
                                            setSelectedTime(time);
                                            setTimeError("");
                                            form.setFieldsValue({ time });
                                        }}
                                        style={{
                                        padding: "10px 18px",
                                        borderRadius: 20,
                                        cursor: disabled
                                            ? "not-allowed"
                                            : "pointer",
                                        border:
                                            selectedTime === time
                                            ? "2px solid #1677ff"
                                            : "1px solid #ddd",
                                        background:
                                            selectedTime === time
                                            ? "#1677ff"
                                            : disabled
                                            ? "#f5f5f5"
                                            : "#fff",
                                        color:
                                            selectedTime === time
                                            ? "#fff"
                                            : disabled
                                            ? "#999"
                                            : "#000",
                                        fontWeight: 500,
                                        }}
                                    >
                                        {time}
                                    </div>
                                    </Col>
                                );
                                })}
                            </Row>

                            <div style={{ margin: "15px 0 10px" }}>
                                🌙 Ca chiều
                            </div>
                            <Row gutter={[10, 10]} wrap >
                                {afternoon.map((time) => {
                                const disabled = isPastTime(time);

                                return (
                                <Col key={time} flex="0 0 90px">
                                    <div
                                        onClick={() => {
                                            if (disabled) return;
                                            setSelectedTime(time);
                                            setTimeError("");
                                            form.setFieldsValue({ time });
                                        }}
                                        style={{
                                            padding: "10px 18px",
                                            borderRadius: 20,
                                            cursor: disabled
                                                ? "not-allowed"
                                                : "pointer",
                                            border:
                                                selectedTime === time
                                                ? "2px solid #1677ff"
                                                : "1px solid #ddd",
                                            background:
                                                selectedTime === time
                                                ? "#1677ff"
                                                : disabled
                                                ? "#f5f5f5"
                                                : "#fff",
                                            color:
                                                selectedTime === time
                                                ? "#fff"
                                                : disabled
                                                ? "#999"
                                                : "#000",
                                            fontWeight: 500,
                                            textAlign: "center",
                                        }}
                                    >
                                        {time}
                                    </div>
                                </Col>
                                );
                              })}
                            </Row>
                        </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Lý do khám bệnh"
                name="reason"
                rules={[{ required: true, message: "Vui lòng nhập lý do khám" }]}
              >
                <TextArea rows={5} placeholder="Triệu chứng của bạn..." />
              </Form.Item>

              <Form.Item label="Hình ảnh triệu chứng (nếu có)">
                <Upload>
                  <Button type="primary" icon={<UploadOutlined />}>Tải lên</Button>
                </Upload>
              </Form.Item>

              <Button type="primary" size="large" block onClick={nextStep}>
                Tiếp theo
              </Button>
            </>
          )}

          {step === 1 && (
          <>
            <Title level={4}>Thông tin khách hàng</Title>

            <Row gutter={16} align="bottom">
              <Col span={6}>
                <Form.Item label="Bạn là">
                  <Select
                    value={patientType}
                    onChange={(value) => {
                      setPatientType(value);
                      setPatientLoaded(false);
                      form.resetFields([
                          "patient_code",
                          "ten_benh_nhan",
                          "so_dien_thoai",
                          "ngay_sinh",
                          "gioi_tinh",
                          "cccd",
                          "email",
                          "dia_chi",
                          "tien_su_benh",
                        ]);
                    }}
                    options={[
                      { label: "Đã từng khám", value: "old" },
                      { label: "Khách mới", value: "new" },
                    ]}
                  />
                </Form.Item>
              </Col>

              {patientType === "old" && (
                <>
                  <Col span={10}>
                    <Form.Item
                      label="Mã bệnh nhân"
                      name="patient_code"
                      rules={[
                        { required: true, message: "Nhập mã bệnh nhân" },
                        {
                          pattern: /^0\d{9}$/,
                          message: "Chỉ nhập số không chứa chữ cái và ký tự đặc biệt",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập mã..." />
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item label=" ">
                      <Button
                        type="primary"
                        block
                        onClick={() => {
                          const fakeData = {
                            ten_benh_nhan: "Nguyễn Văn A",
                            so_dien_thoai: "0123456789",
                            ngay_sinh: "2000-01-01",
                            gioi_tinh: "NAM",
                            cccd: "123456789012",
                            email: "a@gmail.com",
                            dia_chi: "Hà Nội",
                          };
                          form.setFieldsValue(fakeData);
                          setOriginalData(fakeData);
                          setPatientLoaded(true);
                          setIsEditing(false);
                        }}
                      >
                        Tìm
                      </Button>
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
            {patientType === "old" && patientLoaded && (
              <div style={{ marginBottom: 20 }}>
                {!isEditing ? (
                  <Button type="primary" onClick={() => setIsEditing(true)}>
                    Sửa thông tin
                  </Button>
                ) : (
                  <>
                    <Button
                      type="primary"
                      onClick={() => {
                        setIsEditing(false);
                      }}
                    >
                      Lưu
                    </Button>
                    <Button
                      style={{ marginLeft: 20 }}
                      onClick={() => {
                        form.setFieldsValue(originalData);
                        setIsEditing(false);
                      }}
                    >
                      Hủy
                    </Button>
                  </>
                )}
              </div>
            )}

            {(patientType === "new" || patientLoaded) && (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="ten_benh_nhan"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ tên" },
                        {
                          pattern: /^[A-Za-zÀ-ỹ\s]+$/,
                          message: "Họ tên không được chứa số hoặc ký tự đặc biệt",
                        },
                      ]}
                    >
                      <Input size="large" disabled={patientType === "old" && !isEditing} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="so_dien_thoai"
                      rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại" },
                        {
                          pattern: /^0\d{9}$/,
                          message: "Số điện thoại phải gồm 10 số và bắt đầu bằng 0",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        maxLength={10}
                        disabled={patientType === "old" && !isEditing}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) e.preventDefault();
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Ngày sinh"
                      name="ngay_sinh"
                      rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
                    >
                      <Input type="date" size="large" disabled={patientType === "old" && !isEditing} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Giới tính"
                      name="gioi_tinh"
                      rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                    >
                      <Select
                        size="large"
                        disabled={patientType === "old" && !isEditing}
                        options={[
                          { label: "Nam", value: "NAM" },
                          { label: "Nữ", value: "NU" },
                          { label: "Khác", value: "KHAC" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="CCCD"
                      name="cccd"
                      rules={[
                        { required: true, message: "Vui lòng nhập CCCD" },
                        {
                          pattern: /^\d{12}$/,
                          message: "CCCD phải gồm đúng 12 số",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        maxLength={12}
                        disabled={patientType === "old" && !isEditing}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) e.preventDefault();
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ type: "email", message: "Email không hợp lệ" }]}
                    >
                      <Input size="large" disabled={patientType === "old" && !isEditing} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Địa chỉ"
                  name="dia_chi"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input size="large" disabled={patientType === "old" && !isEditing} />
                </Form.Item>

                <Form.Item label="Tiền sử bệnh" name="tien_su_benh">
                  <TextArea rows={3} disabled={patientType === "old" && !isEditing} />
                </Form.Item>
              </>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <Button type = "primary"  size="large" onClick={() => setStep(0)}>
                Quay lại
              </Button>

              {patientType === "new" && (
                <Button type="primary" size="large" htmlType="submit">
                  Xác nhận đặt lịch
                </Button>
              )}
            </div>
          </>
        )}
        </Form>
      </Card>
    </div>
  );
}