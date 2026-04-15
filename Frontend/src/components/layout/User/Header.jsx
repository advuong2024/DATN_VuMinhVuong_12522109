import { Layout, theme } from "antd";

const { Header } = Layout;

export default function AppHeader() {
  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>
          Trang đặt lịch khám bệnh
        </h2>
      </div>
    </Header>
  );
}