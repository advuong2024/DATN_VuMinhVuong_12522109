import React, { useState } from "react";
import { Input, Button, Typography, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../Api/loginApi";
import { saveAuth } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await login({
        username,
        password,
      });

      const { accessToken, refreshToken, user } = res;

      saveAuth({ accessToken, refreshToken, user });
      setUser(user);

      toast.success("Login success");

      navigate("/admin");
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      toast.error(err.response?.data?.message  || err.response?.data?.error || "Login failed");
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
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          width: 560,
          background: "#fff",
          padding: "38px 34px",
          borderRadius: 14,
          boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            style={{ width: 110 }}
            alt="logo"
          />
        </div>

        <Title level={3} style={{ textAlign: "center", marginBottom: 28 }}>
          Welcome back
        </Title>

        <Input
          size="large"
          placeholder="Username"
          prefix={<UserOutlined />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ height: 54, fontSize: 16 }}
        />

        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<LockOutlined />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ height: 54, fontSize: 16, marginTop: 16 }}
        />

        <div style={{ marginTop: 14 }}>
          <Checkbox>Remember me</Checkbox>
        </div>

        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleLogin}
          style={{
            marginTop: 22,
            height: 50,
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;