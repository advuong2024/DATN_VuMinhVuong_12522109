import React, { useState } from "react";
import { Input, Button, Typography, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../Api/loginApi";
import { saveAuth } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await login({ username, password });

      const { accessToken, refreshToken, user } = res;

      saveAuth({ accessToken, refreshToken, user });
      setUser(user);

      toast.success("Đăng nhập thành công");

      navigate("/admin");
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      toast.error("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e8f0fe 0%, #d4e4f7 50%, #f0f4ff 100%)",
      }}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card {
          animation: fadeSlideUp 0.6s ease;
        }
        .login-input input::placeholder {
          color: #a0a0a0 !important;
        }
      `}</style>

      <div
        className="login-card"
        style={{
          width: 500,
          background: "#fff",
          padding: "44px 40px",
          borderRadius: 20,
          borderTop: "4px solid #1677ff",
          boxShadow: "0 20px 60px rgba(0, 21, 64, 0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src="/logo.svg"
            style={{ width: 80, height: 80 }}
            alt="logo"
          />
          <div style={{ fontSize: 22, fontWeight: 700, color: "#034ea5", marginTop: 8, letterSpacing: 1 }}>
            PHÒNG KHÁM ĐA KHOA
          </div>
        </div>

        <Title level={3} style={{ textAlign: "center", marginBottom: 4, color: "#1f1f1f" }}>
          Đăng nhập
        </Title>

        <Text style={{ display: "block", textAlign: "center", color: "#8c8c8c", marginBottom: 32, fontSize: 14 }}>
          Hệ thống quản lý phòng khám
        </Text>

        <Input
          size="large"
          placeholder="Tên đăng nhập"
          prefix={<UserOutlined style={{ color: "#1677ff" }} />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
          style={{ height: 54, fontSize: 16, borderRadius: 12 }}
        />

        <Input.Password
          size="large"
          placeholder="Mật khẩu"
          prefix={<LockOutlined style={{ color: "#1677ff" }} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          style={{ height: 54, fontSize: 16, marginTop: 16, borderRadius: 12 }}
        />

        <div style={{ marginTop: 16 }}>
          <Checkbox style={{ color: "#595959" }}>Ghi nhớ đăng nhập</Checkbox>
        </div>

        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleLogin}
          style={{
            marginTop: 24,
            height: 50,
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 16,
            boxShadow: "0 4px 16px rgba(22, 119, 255, 0.3)",
          }}
        >
          Đăng nhập
        </Button>

        <Text style={{ display: "block", textAlign: "center", color: "#bfbfbf", fontSize: 12, marginTop: 24 }}>
          PHÒNG KHÁM ĐA KHOA © 2026
        </Text>
      </div>
    </div>
  );
};

export default LoginForm;
