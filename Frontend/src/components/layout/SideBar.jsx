import { useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
  FiFileText,
  FiSend,
  FiList,
  FiTruck,
  FiCreditCard,
  FiFolder,
  FiDatabase,
  FiSettings,
  FiTool,
  FiHelpCircle,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { icons } from "antd/es/image/PreviewGroup";

const { Sider } = Layout;

const menuItems = [
  {
    key: "/",
    label: "Dashboard",
    icon: <FiFileText size={22}/>,
  }
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const [openKeys, setOpenKeys] = useState(["hq"]);

  const onOpenChange = (keys) => {
    const latest = keys.find((k) => !openKeys.includes(k));
    setOpenKeys(latest ? [latest] : []);
  };

  return (
    <Sider
      collapsible={false}
      collapsed={collapsed}
      width={260}
      collapsedWidth={80}
      trigger={null}
      style={{
        position: "fixed",
        left: 0,
        top: 100,
        height: "calc(100vh - 100px)",
        background: "#fff",
        borderRight: "1px solid #eee",
        transition: "all 0.2s",
        paddingTop: 20,
      }}
    >
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[location.pathname]}
        onClick={(e) => navigate(e.key)}
        items={menuItems}
        style={{
          background: "transparent",
          fontSize: 23,
          padding: "10px",
        }}
        itemRender={(item, dom) => (
          <div
            style={{
              borderRadius: 8,
              padding: "4px 8px",
            }}
          >
            {dom}
          </div>
        )}
      />
      <div
        onClick={onToggle}
        style={{
          position: "absolute",
          top: "50%",
          right: -45,
          transform: "translate(-50%, -50%)",
          width: 45,
          height: 45,
          borderRadius: "50%",
          background: "#1890ff",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        {collapsed ? ">" : "<"}
      </div>
    </Sider>
  );
}
