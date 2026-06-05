import { Layout, Space, Button, Dropdown, Avatar } from "antd";
import { CalendarOutlined, DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllSpecialties } from "@/page/User/Specialty/Api/SpecialtyApi";
import { useAuth } from "@/page/Login/context/AuthContext";

const { Header } = Layout;

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [specialties, setSpecialties] = useState([]);
  const { user, isLoggedIn, isPatient, logout } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllSpecialties();
        setSpecialties(data || []);
      } catch (err) {
        console.error("Lỗi tải chuyên khoa cho header:", err);
      }
    };
    fetch();
  }, []);

  const isSpecialtyActive =
    location.pathname === "/specialty" ||
    specialties.some((s) => location.pathname === `/chuyen-khoa/${s.id_chuyen_khoa}`);

  const chuyenKhoaItems = specialties.map((s) => ({
    key: `/chuyen-khoa/${s.id_chuyen_khoa}`,
    label: <span style={{ fontSize: 18 }}>{s.ten_chuyen_khoa}</span>,
  }));

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const navStyle = (active) => ({
    cursor: "pointer",
    color: active ? "#1677ff" : "#333",
    fontWeight: 700,
    fontSize: 18,
    textDecoration: "none",
    userSelect: "none",
    padding: "0 16px",
    height: 60,
    display: "flex",
    alignItems: "center",
    borderBottom: active ? "2px solid #1677ff" : "2px solid transparent",
    transition: "all 0.3s",
  });

  return (<>
    <style>{`
      .nav-item:hover {
        color: #1677ff !important;
        border-bottom-color: #1677ff !important;
      }
      .nav-dropdown-trigger:hover {
        color: #1677ff !important;
        border-bottom-color: #1677ff !important;
      }
      .header-specialty-dropdown .ant-dropdown-menu-item:hover {
        background-color: #e6f4ff !important;
      }
    `}</style>
    <Header
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        height: "auto",
        zIndex: 1000,
        alignItems: "center",
        justifyContent: "space-between",
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        padding: "0px",
      }}
    >
      <div
        style={{
          height: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 50px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
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
                PHÒNG KHÁM ĐA KHOA AN TÂM
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
        </Link>
        <Space size="middle">
          {isLoggedIn && isPatient ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: "Thông tin cá nhân",
                    onClick: () => navigate("/booking"),
                  },
                  {
                    key: "logout",
                    label: "Đăng xuất",
                    icon: <LogoutOutlined />,
                    onClick: () => { logout(); window.location.href = "/"; },
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Button
                size="large"
                icon={<UserOutlined />}
                style={{
                  borderRadius: 10,
                  fontWeight: 600,
                }}
              >
                {user?.benh_nhan?.ten_benh_nhan || "Tài khoản"}
              </Button>
            </Dropdown>
          ) : (
            <Button
              size="large"
              icon={<UserOutlined />}
              style={{
                borderRadius: 10,
                fontWeight: 600,
              }}
              onClick={() => navigate("/dang-nhap")}
            >
              Đăng nhập
            </Button>
          )}
          <Button
            type="primary"
            size="large"
            icon={<CalendarOutlined />}
            style={{
              borderRadius: 10,
              fontWeight: 600,
            }}
            onClick={() => navigate("/booking")}
          >
            Đặt lịch ngay
          </Button>
        </Space>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 60,
          paddingBottom: 20,
          gap: 50,
        }}
      >
        <Link to="/" className="nav-item" style={navStyle(isActive("/"))}>
          TRANG CHỦ
        </Link>

        <Dropdown
          menu={{
            items: chuyenKhoaItems.length > 0
              ? chuyenKhoaItems
              : [{ key: "-", label: "Đang tải..." }],
            onClick: (info) => navigate(info.key),
            className: "header-specialty-dropdown",
          }}
          trigger={["hover"]}
        >
          <span
            className="nav-dropdown-trigger"
            style={navStyle(isSpecialtyActive)}
            onClick={() => navigate("/specialty")}
          >
            CHUYÊN KHOA <DownOutlined style={{ fontSize: 10 }} />
          </span>
        </Dropdown>

        <Link to="/service" className="nav-item" style={navStyle(isActive("/service"))}>
          DỊCH VỤ
        </Link>

        <Link to="/doctor" className="nav-item" style={navStyle(isActive("/doctor"))}>
          BÁC SĨ
        </Link>

        <Link to="/myself" className="nav-item" style={navStyle(isActive("/myself"))}>
          VỀ CHÚNG TÔI
        </Link>

        <Link to="/booking" className="nav-item" style={navStyle(isActive("/booking"))}>
          LIÊN HỆ
        </Link>
      </div>
    </Header>
  </>);
}
