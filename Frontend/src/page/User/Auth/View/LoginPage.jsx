import { useState } from "react";
import { Input, Button, Typography } from "antd";
import { PhoneOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginPatient } from "../Api/authUserApi";
import { useAuth } from "@/page/Login/context/AuthContext";
import { BookUrl } from "@/routes/urls";

const { Title, Text } = Typography;

export default function PatientLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if (!phone || !password) {
      toast.error("Vui lòng nhập số điện thoại và mật khẩu");
      return;
    }
    try {
      setLoading(true);
      const res = await loginPatient({ username: phone, password });
      const { accessToken, refreshToken, user } = res;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);

      toast.success("Đăng nhập thành công");
      navigate(BookUrl);
    } catch (err) {
      const msg = err.response?.data?.error || "Đăng nhập thất bại";
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
          width: 440,
          background: "#fff",
          padding: "40px 36px",
          borderRadius: 16,
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          borderTop: "4px solid #52c41a",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src="/logo.svg" alt="logo" style={{ width: 72, height: 72 }} />
          <Title level={4} style={{ margin: "12px 0 4px", color: "#034ea5" }}>
            PHÒNG KHÁM ĐA KHOA AN TÂM
          </Title>
          <Text style={{ color: "#8c8c8c", fontSize: 14 }}>
            Đăng nhập để đặt lịch khám nhanh hơn
          </Text>
        </div>

        <Input
          size="large"
          placeholder="Số điện thoại"
          prefix={<PhoneOutlined style={{ color: "#52c41a" }} />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ height: 50, borderRadius: 10, fontSize: 16 }}
          maxLength={10}
          onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
        />

        <Input.Password
          size="large"
          placeholder="Mật khẩu"
          prefix={<LockOutlined style={{ color: "#52c41a" }} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ height: 50, borderRadius: 10, fontSize: 16, marginTop: 16 }}
          onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
        />

        <Button
          type="primary"
          block
          size="large"
          loading={loading}
          onClick={handleLogin}
          style={{
            height: 50,
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            marginTop: 24,
            background: "#52c41a",
            borderColor: "#52c41a",
            boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)",
          }}
        >
          Đăng nhập
        </Button>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text style={{ color: "#8c8c8c" }}>
            Chưa có tài khoản?{" "}
            <Link to="/dang-ky" style={{ color: "#52c41a", fontWeight: 600 }}>
              Đăng ký ngay
            </Link>
          </Text>
        </div>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link to={BookUrl} style={{ color: "#8c8c8c", fontSize: 13 }}>
            ← Quay lại đặt lịch
          </Link>
        </div>
      </div>
    </div>
  );
}
