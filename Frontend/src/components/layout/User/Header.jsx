import { Layout, theme, Space, Button } from "antd";
import {
  CalendarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

export default function AppHeader() {
  const navigate = useNavigate();
  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        padding: "0px 120px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src="/logo.svg"
          alt="Logo"
          style={{ width: 70, height: 70 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            lineHeight: 1.2,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              color: "#034ea5",
              fontWeight: 700,
            }}
          >
            PHÒNG KHÁM ĐA KHOA
          </h2>

          <p
            style={{
              margin: "2px 0 0",
              color: "#8c8c8c",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Đặt lịch khám nhanh chóng & tiện lợi
          </p>
        </div>
      </div>
      <Space size="middle">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderRadius: 14,
            background:"#034ea5",
            color: "#fff",
            fontWeight: 700,
            boxShadow:
              "0 4px 12px rgba(22,119,255,0.25)",
            lineHeight: 1.2,
          }}
        >
          <PhoneOutlined />
          <span>Hotline: 1900 1234</span>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<CalendarOutlined />}
          style={{
            borderRadius: 10,
            fontWeight: 600,
          }}
          onClick={() => navigate("/")}
        >
          Đặt lịch ngay
        </Button>
      </Space>
    </Header>
  );
}