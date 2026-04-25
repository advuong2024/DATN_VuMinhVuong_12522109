import { useState } from "react";
import { Layout, theme } from "antd";
import Sidebar from "./SideBar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Header />

      <Layout>
        <Sidebar 
          collapsed={collapsed} 
          onToggle={() => setCollapsed(!collapsed)} 
        />

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 260,
            transition: "margin-left 0.2s ease",
            padding: "110px 18px 10px",
            minHeight: "100vh",
          }}
        >
          <Content
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}