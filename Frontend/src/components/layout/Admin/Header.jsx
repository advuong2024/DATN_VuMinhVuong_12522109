import {
  Layout,
  Input,
  Badge,
  Dropdown,
  Avatar,
  Space,
} from "antd";

import {
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

export default function AppHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    navigate("/login");
  };
  const notifications = [
    {
      key: 1,
      text: "New patient booking",
      time: "2 mins ago",
    },
    {
      key: 2,
      text: "Doctor updated schedule",
      time: "10 mins ago",
    },
  ];

  const userMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "Profile",
      },
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Settings",
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        danger: true,
        icon: <LogoutOutlined />,
        label: "Log out",
        onClick: handleLogout,
      },
    ],
  };

  const notifMenu = {
    items: notifications.map((n) => ({
      key: n.key,
      label: (
        <div
          style={{
            minWidth: 240,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#0f172a",
            }}
          >
            {n.text}
          </span>

          <span
            style={{
              fontSize: 11,
              color: "#94a3b8",
            }}
          >
            {n.time}
          </span>
        </div>
      ),
    })),
  };

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 100,
        padding: "0 28px",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0px 50px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <img
          src="/logo.svg"
          alt="Logo"
          style={{ width: 80, height: 80 }}
        />
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.1,
            }}
          >
            POLYCLINIC
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Dropdown
          menu={notifMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Badge count={2} size="small">
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "#fff",
              }}
            >
              <BellOutlined
                style={{
                  fontSize: 18,
                  color: "#334155",
                }}
              />
            </div>
          </Badge>
        </Dropdown>

        <Dropdown
          menu={userMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div
            style={{
              height: 46,
              padding: "0 12px",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              background: "#fff",
            }}
          >
            <Avatar
              size={34}
              style={{
                background:
                  "linear-gradient(135deg, #0ea5e9, #6366f1)",
                fontWeight: 600,
              }}
            >
              AD
            </Avatar>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.2,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                Admin
              </span>

              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                }}
              >
                Administrator
              </span>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}