import { useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
  FiHome,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { PiInvoice } from "react-icons/pi";
import { FaUserDoctor, FaFlask } from "react-icons/fa6";
import { RiAccountCircleLine, RiServiceLine } from "react-icons/ri";
import { GiMedicines } from "react-icons/gi";
import { BsClipboardCheck } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useNavigate, useLocation } from "react-router-dom";
import { icons } from "antd/es/image/PreviewGroup";
import { getUser } from "../../common/utils/auth"

const { Sider } = Layout;

const menuItems = [
  {
    key: "/admin",
    label: "Tổng quan",
    icon: <FiHome size={16} />,
    roles: ["ADMIN", "BAC_SI", "LE_TAN", "THU_NGAN"],
  },

  {
    key: "/admin/account",
    label: "Tài khoản",
    icon: <RiAccountCircleLine size={16} />,
    roles: ["ADMIN"],
  },

  {
    key: "/admin/booking",
    label: "Đặt lịch",
    icon: <FiCalendar size={16} />,
    roles: ["ADMIN", "LE_TAN"],
  },

  {
    key: "/admin/encounter",
    label: "Khám bệnh",
    icon: <BsClipboardCheck size={16} />,
    roles: ["ADMIN", "BAC_SI"],
  },

  {
    key: "/admin/service-execution",
    label: "Thực hiện dịch vụ",
    icon: <FaFlask size={16} />,
    roles: ["ADMIN", "BAC_SI", "KY_THUAT_VIEN"],
  },

  {
    key: "/admin/customer",
    label: "Bệnh nhân",
    icon: <FiUser size={16} />,
    roles: ["ADMIN", "BAC_SI", "LE_TAN"],
  },

  {
    key: "/admin/doctor",
    label: "Bác sĩ",
    icon: <FaUserDoctor size={16} />,
    roles: ["ADMIN"],
  },

  {
    key: "/admin/service",
    label: "Dịch vụ",
    icon: <RiServiceLine size={16} />,
    roles: ["ADMIN"],
  },

  {
    key: "/admin/medicine",
    label: "Thuốc",
    icon: <GiMedicines size={16} />,
    roles: ["ADMIN", "BAC_SI"],
  },

  {
    key: "/admin/category",
    label: "Danh mục",
    icon: <MdOutlineCategory size={16} />,
    roles: ["ADMIN"],
  },

  {
    key: "/admin/bill",
    label: "Hóa đơn",
    icon: <PiInvoice size={16} />,
    roles: ["ADMIN", "LE_TAN", "THU_NGAN"],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const user = getUser();
  const [openKeys, setOpenKeys] = useState(["hq"]);

  const onOpenChange = (keys) => {
    const latest = keys.find((k) => !openKeys.includes(k));
    setOpenKeys(latest ? [latest] : []);
  };

  const selectedKey =
  [...menuItems]
    .sort((a, b) => b.key.length - a.key.length)
    .find(item => location.pathname.startsWith(item.key))
  ?.key;

  const filteredMenuItems =
    menuItems.filter((item) =>
      item.roles.includes(user?.vai_tro)
    );

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
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        onClick={(e) => navigate(e.key)}
        items={filteredMenuItems}
        style={{
          background: "transparent",
          fontSize: 18,
          padding: "10px",
        }}
      />
      <div
        onClick={onToggle}
        style={{
          position: "absolute",
          top: "50%",
          right: -35,
          transform: "translate(-50%, -50%)",
          width: 35,
          height: 35,
          borderRadius: "50%",
          background: "#93c2f1d5",
          color: "#000000",
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
