import { useState, useEffect, useCallback } from "react";
import { Layout, Badge, Dropdown, Avatar, Divider, Button } from "antd";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../common/axiosClient";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../../../page/Admin/Notification/Api/notificationApi";

const { Header } = Layout;

const LOAI_ICON = {
  BOOKING: { color: "#1677ff", bg: "#e6f4ff" },
  PAYMENT: { color: "#52c41a", bg: "#f6ffed" },
  ENCOUNTER: { color: "#fa8c16", bg: "#fff7e6" },
  MEDICINE: { color: "#ff4d4f", bg: "#fff2f0" },
  SYSTEM: { color: "#722ed1", bg: "#f9f0ff" },
};

function timeAgo(dateStr) {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export default function AppHeader() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [count, list] = await Promise.all([
        getUnreadCount(),
        getNotifications(10),
      ]);
      setUnreadCount(count);
      setNotifications(list);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
  };

  const handleNotifClick = async (item) => {
    if (!item.da_doc) {
      await markAsRead(item.id_thong_bao);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) =>
          n.id_thong_bao === item.id_thong_bao ? { ...n, da_doc: true } : n
        )
      );
    }
    if (item.duong_dan) {
      navigate(item.duong_dan);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, da_doc: true })));
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const userMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "Hồ sơ",
        onClick: () => navigate("/admin/profile"),
      },
      { type: "divider" },
      {
        key: "logout",
        danger: true,
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        onClick: handleLogout,
      },
    ],
  };

  const notifItems = notifications.map((n) => {
    const style = LOAI_ICON[n.loai] || LOAI_ICON.SYSTEM;
    return {
      key: n.id_thong_bao,
      onClick: () => handleNotifClick(n),
      label: (
        <div
          style={{
            minWidth: 300,
            display: "flex",
            gap: 12,
            padding: "4px 0",
            opacity: n.da_doc ? 0.6 : 1,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: style.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <BellOutlined style={{ color: style.color, fontSize: 14 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: n.da_doc ? 400 : 600,
                color: "#0f172a",
                lineHeight: 1.4,
              }}
            >
              {n.tieu_de}
            </div>
            {n.noi_dung && (
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginTop: 2,
                  lineHeight: 1.3,
                }}
              >
                {n.noi_dung}
              </div>
            )}
            <div
              style={{
                fontSize: 11,
                color: "#94a3b8",
                marginTop: 4,
              }}
            >
              {timeAgo(n.created_at)}
            </div>
          </div>
          {!n.da_doc && (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#1677ff",
                flexShrink: 0,
                marginTop: 6,
              }}
            />
          )}
        </div>
      ),
    };
  });

  const notifMenu = {
    items: notifItems,
    style: { maxHeight: 140, overflowY: "auto" },
  };

  const roleMap = {
    ADMIN: "QUẢN TRỊ VIÊN",
    BAC_SI: "BÁC SĨ",
    LE_TAN: "LỄ TÂN",
    THU_NGAN: "THU NGÂN",
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
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0px 50px",
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
            PHÒNG KHÁM ĐA KHOA
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
          dropdownRender={(menu) => {
            if (notifications.length === 0) {
              return (
                <div style={{ textAlign: "center", padding: "16px 0", color: "#94a3b8", fontSize: 13, background: "#fff", borderRadius: 8 }}>
                  Không có thông báo
                </div>
              );
            }
            return (
              <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
                <div style={{ maxHeight: 350, overflowY: "auto" }}>{menu}</div>
                <Divider style={{ margin: 0 }} />
                <div style={{ padding: "4px 8px", textAlign: "center" }}>
                  <Button type="link" size="small" style={{ width: "100%" }} onClick={handleMarkAllRead}>
                    Đánh dấu đã đọc
                  </Button>
                </div>
              </div>
            );
          }}
        >
          <Badge count={unreadCount} size="small">
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
              src={user.nhan_vien?.hinh_anh}
              style={{
                background: !user.nhan_vien?.hinh_anh ? "linear-gradient(135deg, #0ea5e9, #6366f1)" : undefined,
                fontWeight: 600,
              }}
            >
              {!user.nhan_vien?.hinh_anh && user.nhan_vien?.ten_nhan_vien?.charAt(0)}
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
                {user.nhan_vien?.ten_nhan_vien}
              </span>

              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                }}
              >
                {roleMap[user?.vai_tro]}
              </span>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
