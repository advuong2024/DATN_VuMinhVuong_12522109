import {
  Form,
  Select,
  Input,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Steps,
  Modal,
  Tooltip,
} from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getCK, getDoctorCK,
  postBook, postCustomer, updateCustomer, 
  getBookedSlots, getHistory,
  getCanBook, getNhanVienById,
} from "../Api/BookingApi"
import { toast } from "react-toastify";
import HistoryFrom from "./BookingFrom";
import { useAuth } from "@/page/Login/context/AuthContext";

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
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [specialty, setSpecialty] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [canBook, setCanBook] = useState(true);
  const [searchParams] = useSearchParams();
  const { user, isLoggedIn, isPatient, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && isPatient && user?.benh_nhan) {
      const bn = user.benh_nhan;
      form.setFieldsValue({
        ten_benh_nhan: bn.ten_benh_nhan,
        so_dien_thoai: bn.so_dien_thoai,
        ngay_sinh: bn.ngay_sinh ? dayjs(bn.ngay_sinh).format("YYYY-MM-DD") : null,
        gioi_tinh: bn.gioi_tinh,
        CCCD: bn.CCCD,
        email: bn.email || "",
        dia_chi: bn.dia_chi || "",
        tien_su_benh: bn.tien_su_benh || "",
        id_benh_nhan: bn.id_benh_nhan,
        patient_code: bn.id_benh_nhan,
      });
      setPatientLoaded(true);
      setPatientType("old");
      setOriginalData({
        ...bn,
        ngay_sinh: bn.ngay_sinh ? dayjs(bn.ngay_sinh).format("YYYY-MM-DD") : null,
      });
    }
  }, [isLoggedIn, isPatient, user]);

  useEffect(() => {
    const init = async () => {
      await fetchCK();

      const doctorId = searchParams.get("doctorId");
      const specialtyId = searchParams.get("specialtyId");

      if (!doctorId && !specialtyId) return;

      let targetSpecialtyId = specialtyId ? Number(specialtyId) : null;
      let targetDoctorId = doctorId ? Number(doctorId) : null;

      if (!targetSpecialtyId && targetDoctorId) {
        try {
          const doctorData = await getNhanVienById(targetDoctorId);
          targetSpecialtyId = doctorData.id_chuyen_khoa;
        } catch (err) {
          console.error("Lỗi lấy thông tin bác sĩ:", err);
          return;
        }
      }

      if (targetSpecialtyId) {
        form.setFieldsValue({ specialty: targetSpecialtyId });

        const doctorList = await getDoctorCK(targetSpecialtyId);
        setDoctors(
          doctorList.map((item) => ({
            label: item.ten_nhan_vien,
            value: item.id_nhan_vien,
          }))
        );

        if (targetDoctorId) {
          form.setFieldsValue({ doctor: targetDoctorId });
          setSelectedDoctor(targetDoctorId);
        }
      }
    };

    init();
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

  const checkCanBook = async (patientId) => {
    try {
      const date = form.getFieldValue("date");
      const res = await getCanBook(patientId, date);

      setCanBook(res.data.canBook);
    } catch (err) {
      console.error(err);
      setCanBook(false);
    }
  };

  const handleOpenHistory = async () => {
    try {
      const id = form.getFieldValue("patient_code");
      console.log("id: ", id)

      const res = await getHistory({ id });

      setHistoryData(res.data);

      setOpenHistory(true);
    } catch (err) {
      console.error(err);
      toast.error("Không lấy được lịch sử khám");
    }
  };

  const handleChangeCK = async (value) => {
    try {
      const data = await getDoctorCK(value, selectedDate);

      setDoctors(
        data.map((item) => {
          const conLai = item.con_lai !== null ? item.con_lai : null;
          return {
            label: item.ten_nhan_vien,
            value: item.id_nhan_vien,
            disabled: conLai !== null && conLai <= 0,
            conLai,
            max: item.so_luong_toi_da,
          };
        })
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

      if (patientType === "old") {
        const patientIdCheck = form.getFieldValue("patient_code");
        const date = form.getFieldValue("date");

        const res = await getCanBook(patientIdCheck, date);

        if (!res.data.canBook) {
          toast.error("Bạn hôm nay đã đặt lịch không thể đặt thêm khi chưa hoàn thành khám");
          return;
        }
      }

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
              <>
                <p>
                  👉 <b>Mã bệnh nhân của bạn là: {patientId}</b>
                </p>
                <p>Vui lòng lưu lại để sử dụng cho lần sau.</p>
              </>
            )}

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

  if (!isLoggedIn || !isPatient) {
    return (
      <Card style={{ maxWidth: 500, margin: "100px auto", textAlign: "center", padding: 40 }}>
        <Title level={4}>Bạn cần đăng nhập để đặt lịch</Title>
        <Button type="primary" size="large" style={{ marginTop: 20 }}
          onClick={() => navigate('/dang-nhap?redirect=/booking')}>
          Đăng nhập
        </Button>
      </Card>
    );
  }

  return (
    <div
      style={{
        background: "#f5f7fa",
        minHeight: "70vh",
        padding: "30px 0",
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 20px",
            background: "#f6ffed",
            borderRadius: 10,
            border: "1px solid #b7eb8f",
            marginBottom: 20,
          }}
        >
          <div>
            <UserOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            <strong>Xin chào, {user?.benh_nhan?.ten_benh_nhan}</strong>
            <span style={{ color: "#8c8c8c", marginLeft: 12, fontSize: 13 }}>
              (Mã BN: {user?.benh_nhan?.id_benh_nhan})
            </span>
          </div>
          <Button
            size="small"
            icon={<LogoutOutlined />}
            onClick={() => { logout(); window.location.reload(); }}
            style={{ borderRadius: 6 }}
          >
            Đăng xuất
          </Button>
        </div>

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
                          optionRender={(option) => {
                            const d = option.data;
                            const label = d.conLai !== null
                              ? `${d.label} (còn ${d.conLai}/${d.max})`
                              : d.label;
                            return d.disabled ? (
                              <Tooltip title="Bác sĩ này hôm nay đã tới giới hạn bệnh nhân được khám">
                                <span style={{ color: "#999" }}>{label}</span>
                              </Tooltip>
                            ) : (
                              <span>{label}</span>
                            );
                          }}
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

            <div style={{ marginBottom: 20 }}>
              <Button 
                type="primary" 
                style={{ marginRight: 12 }}
                onClick={handleOpenHistory}
              >
                Lịch sử đặt lịch
              </Button>
              {!isEditing ? (
                <Button type="primary" onClick={() => setIsEditing(true)}>
                  Sửa thông tin
                </Button>
              ) : (
                <>
                  <Button
                    type="primary"
                    style={{ marginRight: 12 }}
                    onClick={handleUpdatePatient}
                  >
                    Lưu
                  </Button>
                  <Button
                    type="primary"
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

            <Modal
              open={openHistory}
              footer={null}
              width={1200}
              onCancel={() => setOpenHistory(false)}
            >
              <HistoryFrom data={historyData} />
            </Modal>

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
                  <Input size="large" disabled={!isEditing} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="so_dien_thoai"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^0\d{9}$/, message: "Số điện thoại phải gồm 10 số và bắt đầu bằng 0" },
                  ]}
                >
                  <Input
                    size="large"
                    maxLength={10}
                    disabled
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
                  <Input type="date" size="large" disabled={!isEditing} />
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
                    disabled={!isEditing}
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
                <Form.Item label="CCCD" name="CCCD" rules={[
                  { required: true, message: "Vui lòng nhập CCCD" },
                  { pattern: /^\d{12}$/, message: "CCCD phải gồm đúng 12 số" },
                ]}>
                  <Input
                    size="large"
                    maxLength={12}
                    disabled={!isEditing}
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
                  <Input size="large" disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Địa chỉ"
              name="dia_chi"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input size="large" disabled={!isEditing} />
            </Form.Item>

            <Form.Item label="Tiền sử bệnh" name="tien_su_benh">
              <TextArea rows={3} disabled={!isEditing} />
            </Form.Item>

            <div style={{ display: "flex", gap: 10 }}>
              <Button type="primary" size="large" onClick={() => setStep(0)}>
                Quay lại
              </Button>
              <Button type="primary" size="large" htmlType="submit">
                Xác nhận đặt lịch
              </Button>
            </div>
          </>
        )}
        </Form>
      </Card>
    </div>
  );
}