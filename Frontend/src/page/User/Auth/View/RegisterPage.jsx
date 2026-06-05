import { useState } from "react";
import { Input, Button, Typography, Form, Row, Col, Select, Steps } from "antd";
import { PhoneOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerPatient } from "../Api/authUserApi";
import { getFindPatient } from "../../Booking/Api/BookingApi";
import { useAuth } from "@/page/Login/context/AuthContext";
import { BookUrl } from "@/routes/urls";

const { Title, Text } = Typography;

export default function PatientRegisterPage() {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [existingPatient, setExistingPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const checkPhone = async () => {
    if (!phone || !/^0\d{9}$/.test(phone)) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ (10 số, bắt đầu bằng 0)");
      return;
    }
    try {
      setChecking(true);
      const res = await getFindPatient({ phone, cccd: "" });
      setExistingPatient(res);
      setStep(1);
    } catch {
      setExistingPatient(null);
      setStep(1);
    } finally {
      setChecking(false);
    }
  };

  const handleRegister = async () => {
    if (!password || password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);

      const registerData = {
        phone,
        password,
        patientData: existingPatient
          ? { id_benh_nhan: existingPatient.id_benh_nhan }
          : patientData,
      };

      const res = await registerPatient(registerData);
      const { accessToken, refreshToken, user } = res;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);

      toast.success("Đăng ký tài khoản thành công!");
      navigate(BookUrl);
    } catch (err) {
      const msg = err.response?.data?.error || "Đăng ký thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 50%, #e8f4fd 100%)",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 500,
          background: "#fff",
          padding: "40px 36px",
          borderRadius: 16,
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          borderTop: "4px solid #52c41a",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src="/logo.svg" alt="logo" style={{ width: 64, height: 64 }} />
          <Title level={4} style={{ margin: "8px 0 4px", color: "#034ea5" }}>
            ĐĂNG KÝ TÀI KHOẢN
          </Title>
          <Text style={{ color: "#8c8c8c", fontSize: 14 }}>
            Tạo tài khoản để đặt lịch và theo dõi lịch sử khám
          </Text>
        </div>

        <Steps
          current={step}
          size="small"
          items={[{ title: "Số điện thoại" }, { title: "Thông tin" }]}
          style={{ marginBottom: 28 }}
        />

        {step === 0 && (
          <>
            <Input
              size="large"
              placeholder="Số điện thoại"
              prefix={<PhoneOutlined style={{ color: "#52c41a" }} />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ height: 50, borderRadius: 10, fontSize: 16 }}
              maxLength={10}
              onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
              onKeyDown={(e) => { if (e.key === "Enter") checkPhone(); }}
            />

            <Button
              type="primary"
              block
              size="large"
              loading={checking}
              onClick={checkPhone}
              style={{
                height: 50,
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 16,
                marginTop: 20,
                background: "#52c41a",
                borderColor: "#52c41a",
              }}
            >
              Tiếp theo
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <div
              style={{
                padding: "12px 16px",
                background: "#f6ffed",
                borderRadius: 8,
                marginBottom: 20,
                border: "1px solid #b7eb8f",
              }}
            >
              <Text>
                Số điện thoại: <strong>{phone}</strong>
                {existingPatient
                  ? " (Bạn đã từng khám tại phòng khám)"
                  : " (Khách mới)"}
              </Text>
            </div>

            {!existingPatient && (
              <>
                <Form layout="vertical">
                  <Form.Item label="Họ và tên" required>
                    <Input
                      size="large"
                      placeholder="Nhập họ tên"
                      prefix={<UserOutlined />}
                      value={patientData?.ten_benh_nhan || ""}
                      onChange={(e) =>
                        setPatientData({ ...patientData, ten_benh_nhan: e.target.value })
                      }
                      style={{ borderRadius: 10 }}
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Ngày sinh" required>
                        <Input
                          type="date"
                          size="large"
                          value={patientData?.ngay_sinh || ""}
                          onChange={(e) =>
                            setPatientData({ ...patientData, ngay_sinh: e.target.value })
                          }
                          style={{ borderRadius: 10 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Giới tính" required>
                        <Select
                          size="large"
                          placeholder="Chọn giới tính"
                          value={patientData?.gioi_tinh || undefined}
                          onChange={(val) =>
                            setPatientData({ ...patientData, gioi_tinh: val })
                          }
                          style={{ borderRadius: 10 }}
                          options={[
                            { label: "Nam", value: "NAM" },
                            { label: "Nữ", value: "NU" },
                            { label: "Khác", value: "KHAC" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="CCCD" required>
                    <Input
                      size="large"
                      placeholder="Nhập CCCD (12 số)"
                      maxLength={12}
                      value={patientData?.CCCD || ""}
                      onChange={(e) =>
                        setPatientData({ ...patientData, CCCD: e.target.value })
                      }
                      style={{ borderRadius: 10 }}
                      onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                    />
                  </Form.Item>

                  <Form.Item label="Địa chỉ">
                    <Input
                      size="large"
                      placeholder="Nhập địa chỉ"
                      value={patientData?.dia_chi || ""}
                      onChange={(e) =>
                        setPatientData({ ...patientData, dia_chi: e.target.value })
                      }
                      style={{ borderRadius: 10 }}
                    />
                  </Form.Item>

                  <Form.Item label="Email">
                    <Input
                      size="large"
                      placeholder="Nhập email"
                      value={patientData?.email || ""}
                      onChange={(e) =>
                        setPatientData({ ...patientData, email: e.target.value })
                      }
                      style={{ borderRadius: 10 }}
                    />
                  </Form.Item>
                </Form>
              </>
            )}

            <Input.Password
              size="large"
              placeholder="Mật khẩu (ít nhất 6 ký tự)"
              prefix={<LockOutlined style={{ color: "#52c41a" }} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ height: 50, borderRadius: 10, fontSize: 16, marginTop: 8 }}
            />

            <Input.Password
              size="large"
              placeholder="Xác nhận mật khẩu"
              prefix={<LockOutlined style={{ color: "#52c41a" }} />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ height: 50, borderRadius: 10, fontSize: 16, marginTop: 12 }}
              onKeyDown={(e) => { if (e.key === "Enter") handleRegister(); }}
            />

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <Button size="large" onClick={() => setStep(0)} style={{ borderRadius: 10, flex: 1 }}>
                Quay lại
              </Button>
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleRegister}
                style={{
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 16,
                  flex: 2,
                  background: "#52c41a",
                  borderColor: "#52c41a",
                }}
              >
                Đăng ký
              </Button>
            </div>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text style={{ color: "#8c8c8c" }}>
            Đã có tài khoản?{" "}
            <Link to="/dang-nhap" style={{ color: "#52c41a", fontWeight: 600 }}>
              Đăng nhập
            </Link>
          </Text>
        </div>

        <div style={{ textAlign: "center", marginTop: 8 }}>
          <Link to={BookUrl} style={{ color: "#8c8c8c", fontSize: 13 }}>
            ← Quay lại đặt lịch
          </Link>
        </div>
      </div>
    </div>
  );
}
