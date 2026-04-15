import React, { useState } from "react";
import { Input, Button, Typography, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const LoginForm = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
        flexDirection: "column",
      }}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="logo"
        style={{ width: 160, marginBottom: 30 }}
      />

      {step === 1 && (
        <div style={{ width: 520 }}>
          <Title level={2} style={{ textAlign: "center", fontSize: 35 }}>
            Welcome back
          </Title>

          <Input
            size="large"
            placeholder="Username"
            prefix={<UserOutlined />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ height: 75, fontSize: 20, marginTop: 25 }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 30,
              fontSize: 18,
            }}
          >
            <Checkbox style={{ fontSize: 20, color: "#1890ff" }}>Remember me</Checkbox>
          </div>

          <Button
            type="primary"
            block
            style={{
              marginTop: 30,
              height: 60,
              fontSize: 19,
              borderRadius: 8,
              fontWeight: 600,
            }}
            onClick={() => setStep(2)}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div style={{ width: 520 }}>
          <Title level={3} style={{ textAlign: "center", fontSize: 35 }}>
            Hi <span style={{ color: "#1890ff" }}>{username}</span> 👋
          </Title>

          <Input.Password
            size="large"
            placeholder="Password"
            prefix={<LockOutlined />}
            style={{ height: 75, fontSize: 20, marginTop: 25 }}
          />

          <div style={{ marginTop: 30 }}>
            <a
              onClick={() => setStep(1)}
              style={{ fontSize: 20, color: "#1890ff", cursor: "pointer" }}
            >
              Back to login
            </a>
          </div>

          <Button
            type="primary"
            block
            style={{
              marginTop: 30,
              height: 60,
              fontSize: 19,
              borderRadius: 8,
              fontWeight: 600,
            }}
            onClick={() => {
              localStorage.setItem("user", JSON.stringify({ role: "admin" }));
              navigate("/admin");
            }}
          >
            Login
          </Button>
        </div>
      )}

      <Text style={{ marginTop: 50, fontSize: 15 }}>
        Copyright © 2025 - All rights Reserved
      </Text>
    </div>
  );
};

export default LoginForm;