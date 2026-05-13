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
  Steps,
  Modal,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { getCK, getDoctorCK, getCustomer, 
  postBook, postCustomer, updateCustomer, 
  getBookedSlots, getFindPatient,
} from "../Api/BookingApi"
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Title } = Typography;


export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientType, setPatientType] = useState("old");
  const [patientLoaded, setPatientLoaded] = useState(false);
  const [timeError, setTimeError] = useState("");
  const [form] = Form.useForm();
  const [lookupForm] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [specialty, setSpecialty] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientCode, setPatientCode] = useState(null);

  useEffect(() => {
    fetchCK();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      fetchBookedSlots();
    }
  }, [selectedDate, selectedDoctor]);

  const fetchCK = async () => {
    try {
      const data = await getCK();
      setSpecialty(
        data.map((item) => ({
          label: item.ten_chuyen_khoa,
          value: item.id_chuyen_khoa,
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Không tìm thấy thông tin chuyên khoa")
    }
  };

  const handleChangeCK = async (value) => {
    try {
      const data = await getDoctorCK(value);

      setDoctors(
        data.map((item) => ({
          label: item.ten_nhan_vien,
          value: item.id_nhan_vien,
        }))
      );

      form.setFieldsValue({ doctor: null });
      setSelectedDoctor(null);

    } catch (err) {
      console.error("Lỗi load bác sĩ:", err);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      if (!selectedDoctor || !selectedDate) return;

      const data = await getBookedSlots({
        id_bac_si: selectedDoctor,
        date: selectedDate,
      });

      const times = data.map((item) =>
        dayjs(item.thoi_gian).format("HH:mm")
      );

      setBookedSlots(times);
    } catch (err) {
      console.error("Lỗi load slot:", err);
    }
  };

  const handleFindPatient = async () => {
    try {
      const code = form.getFieldValue("patient_code");

      if (!code) return;

      const data = await getCustomer(code);

      form.setFieldsValue({
        ...data,
        ngay_sinh: data.ngay_sinh
          ? dayjs(data.ngay_sinh).format("YYYY-MM-DD")
          : null,
      });

      setOriginalData({
        ...data,
        ngay_sinh: data.ngay_sinh
          ? dayjs(data.ngay_sinh).format("YYYY-MM-DD")
          : null,
      });
      setPatientLoaded(true);
      setIsEditing(false);
    } catch (err) {
      console.error("Lỗi tìm bệnh nhân:", err);
    }
  };

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
        await form.validateFields(["specialty", "doctor", "reason", "date", "time"]);

        const time = form.getFieldValue("time");

        if (!time) {
        setTimeError("Vui lòng chọn giờ khám");
        return;
        }

        setTimeError("");
        setStep(1);
    } catch (err) {}
  };

  const onFinish = async () => {
    const values = form.getFieldsValue(true);
    let isNewPatient = false;
    try {
      let patientId = null;

      if (patientType === "new") {
        const customerRes = await postCustomer({
          name: values.ten_benh_nhan,
          phone: values.so_dien_thoai,
          dob: values.ngay_sinh,
          gender: values.gioi_tinh,
          cccd: values.CCCD,
          email: values.email,
          address: values.dia_chi,
          medicalhistory: values.tien_su_benh,
        });

        patientId = customerRes?.id_benh_nhan || customerRes?.data?.id_benh_nhan;
        isNewPatient = true;
      }

      if (patientType === "old") {
        patientId = values.patient_code;
      }

      const thoi_gian = new Date(`${values.date}T${values.time}:00+07:00`);

      await postBook({
        id_benh_nhan: Number(patientId),
        id_bac_si: Number(values.doctor),
        id_chuyen_khoa: Number(values.specialty),
        thoi_gian,
        ly_do: values.reason,
      });

      Modal.success({
        title: "Đặt lịch thành công 🎉",
        content: (
          <div>
            <p>Bạn đã đặt lịch khám thành công.</p>

            {isNewPatient && (
              <p>
                👉 <b>Mã bệnh nhân của bạn là: {patientId}</b>
              </p>
            )}

            <p>Vui lòng lưu lại để sử dụng cho lần sau.</p>
          </div>
        ),
      });

      // form.resetFields();
      // setStep(0);
    } catch (err) {
      console.error("Lỗi đặt lịch:", err);
      toast.error("Đặt lịch thất bại ❌");
    }
  };

  const handleUpdatePatient = async () => {
    try {
      const values = form.getFieldsValue(true);

      await updateCustomer(values.id_benh_nhan, {
        name: values.ten_benh_nhan,
        phone: values.so_dien_thoai,
        dob: values.ngay_sinh,
        gender: values.gioi_tinh,
        cccd: values.CCCD,
        email: values.email,
        address: values.dia_chi,
        medicalhistory: values.tien_su_benh,
      });

      setOriginalData(values);
      setIsEditing(false);

      toast.success("cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Lỗi update:", err);
      toast.error("cập nhật thông tin thất bại!");
    }
  };

  const isBooked = (time) => {
    return bookedSlots.includes(time);
  };

  const handleChangeDoctor = (value) => {
    setSelectedDoctor(value);
    setBookedSlots([]);
    form.setFieldsValue({ time: null });
    setSelectedTime(null);
  };

  const handleSearch = async (values) => {
    try {
      setLoading(true);
      setPatientCode(null);

      const keyword = values.keyword;

      const isPhone = /^0\d{9}$/.test(keyword);

      const res = await getFindPatient({
        phone: isPhone ? keyword : "",
        cccd: isPhone ? "" : keyword,
      });

      setPatientCode(res.id_benh_nhan);
    } catch (err) {
      console.error(err);
      toast.error("Không tìm thấy bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  const maskedCCCD = form
    .getFieldValue("CCCD")
    ?.replace(/^(\d{3})\d{6}(\d{3})$/, "$1******$2");

  return (
    <div
      style={{
        background: "#f5f7fa",
        minHeight: "70vh",
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

        <Form layout="vertical" form={form} onFinish={onFinish} preserve>
          <Form.Item name="date" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="time" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="id_benh_nhan" hidden>
            <Input />
          </Form.Item>

          {step === 0 && (
            <>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Chuyên khoa"
                    name="specialty"
                    rules={[{ required: true, message: "Vui lòng chọn chuyên khoa" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn chuyên khoa"
                      options={specialty}
                      onChange={handleChangeCK}
                    />
                  </Form.Item>

                  <Form.Item shouldUpdate>
                    {() => (
                      <Form.Item
                        label="Bác sĩ"
                        name="doctor"
                        rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
                      >
                        <Select
                          size="large"
                          placeholder="Chọn bác sĩ"
                          options={doctors}
                          disabled={!form.getFieldValue("specialty")}
                          onChange={handleChangeDoctor}
                        />
                      </Form.Item>
                    )}
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
                                const disabled = isPastTime(time) || isBooked(time);

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
                                          isBooked(time)
                                            ? "#ff4d4f"
                                              : selectedTime === time
                                            ? "#1677ff"
                                              : disabled
                                            ? "#f5f5f5"
                                              : "#fff",
                                        color:
                                          isBooked(time)
                                            ? "#fff"
                                              : selectedTime === time
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
                                const disabled = isPastTime(time) || isBooked(time);

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
                                          isBooked(time)
                                            ? "#ff4d4f"
                                            : selectedTime === time
                                            ? "#1677ff"
                                            : disabled
                                            ? "#f5f5f5"
                                            : "#fff",
                                        color:
                                          isBooked(time)
                                            ? "#fff"
                                            : selectedTime === time
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
                        "CCCD",
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
                          pattern: /^\d+$/,
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
                        onClick={handleFindPatient}
                      >
                        Tìm
                      </Button>
                    </Form.Item>
                  </Col>

                  {!patientLoaded && (
                    <Col span={4}>
                      <Form.Item label=" ">
                        <Button
                          type="primary"
                          block
                          onClick={() => setOpen(true)}
                        >
                          Quên mã bệnh nhân
                        </Button>
                      </Form.Item>
                    </Col>
                  )}
                </>
              )}
            </Row>

            <Modal
              open={open}
              title="Tra cứu mã bệnh nhân"
              footer={null}
              onCancel={() => {
                setOpen(false);
                lookupForm.resetFields();
                setPatientCode(null);
              }}
            >
              <Form
                form={lookupForm}
                layout="vertical"
                onFinish={handleSearch}
              >
                <Form.Item
                  label="CCCD hoặc số điện thoại"
                  name="keyword"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập CCCD hoặc số điện thoại",
                    },
                  ]}
                >
                  <Input placeholder="Nhập CCCCD hoặc số điện thoại" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Tra cứu
                </Button>
              </Form>

              {patientCode && (
                <div
                  style={{
                    marginTop: 20,
                    padding: 12,
                    border: "1px solid #d9d9d9",
                    borderRadius: 8,
                  }}
                >
                  <b>Mã bệnh nhân:</b> {patientCode}
                </div>
              )}
            </Modal>

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
                      onClick={handleUpdatePatient}
                    >
                      Lưu
                    </Button>
                    <Button
                      type="primary"
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
                    <Form.Item label="CCCD"
                      name="CCCD"
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
                        value={
                          patientType === "old" && !isEditing
                            ? form
                                .getFieldValue("CCCD")
                                ?.replace(
                                  /^(\d{3})\d{6}(\d{3})$/,
                                  "$1******$2"
                                )
                            : form.getFieldValue("CCCD")
                        }
                        onFocus={() => {
                          if (patientType === "old") {
                            setIsEditing(true);
                          }
                        }}
                        disabled={patientType === "old" && !isEditing}
                        onChange={(e) => {
                          form.setFieldsValue({
                            CCCD: e.target.value,
                          });
                        }}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
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

              {(patientType === "new" || patientLoaded) && (
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                >
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