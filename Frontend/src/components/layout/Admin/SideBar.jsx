import { useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
  FiHome,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { PiInvoice } from "react-icons/pi";
import { FaUserDoctor } from "react-icons/fa6";
import { RiAccountCircleLine, RiServiceLine } from "react-icons/ri";
import { GiMedicines } from "react-icons/gi";
import { BsClipboardCheck } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { icons } from "antd/es/image/PreviewGroup";

const { Sider } = Layout;

const menuItems = [
  {
    key: "/admin",
    label: "Dashboard",
    icon: <FiHome size={16}/>,
  },
  {
    key: "/admin/account",
    label: "Accounts",
    icon: <RiAccountCircleLine size={16}/>,
  },
  {
    key: "/admin/booking",
    label: "Booking",
    icon: <FiCalendar size={16}/>,
  },
  {
    key: "/admin/encounter",
    label: "Encounter",
    icon: <BsClipboardCheck size={16}/>,
  },
  {
    key: "/admin/customer",
    label: "Patients",
    icon: <FiUser size={16}/>,
  },
  {
    key: "/admin/doctor",
    label: "Doctors",
    icon: <FaUserDoctor size={16}/>,
  },
  {
    key: "/admin/service",
    label: "Services",
    icon: <RiServiceLine size={16}/>,
  },
  {
    key: "/admin/medicine",
    label: "Medicines",
    icon: <GiMedicines size={16}/>,
  },
  {
    key: "/admin/category",
    label: "Category",
    icon: <MdOutlineCategory size={16}/>,
  },
  {
    key: "/admin/bill",
    label: "Bills",
    icon: <PiInvoice size={16}/>,
  },
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

  const selectedKey =
  [...menuItems]
    .sort((a, b) => b.key.length - a.key.length)
    .find(item => location.pathname.startsWith(item.key))
  ?.key;

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
        items={menuItems}
        style={{
          background: "transparent",
          fontSize: 18,
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
