import { Layout, theme } from "antd";

const { Header } = Layout;

export default function AppHeader() {
  console.log("HEADER ĐANG CHẠY");
  const { token } = theme.useToken(); 

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#ffffff",
        borderBottom: "1px solid #eee",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20 }}>🚀 Admin Dashboard </h2>

      <div style={{ fontSize: 18 }}>Hello, Admin</div>
    </Header>
  );
}
