import { Layout, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

import {
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  MailOutlined,
  FacebookOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

const QUICK_LINKS = [
  { label: "Trang chủ", path: "/" },
  { label: "Chuyên khoa", path: "/specialty" },
  { label: "Dịch vụ", path: "/service" },
  { label: "Bác sĩ", path: "/doctor" },
  { label: "Đặt lịch khám", path: "/booking" },
  { label: "Về chúng tôi", path: "/myself" },
];

const LOCATIONS = [
  {
    name: "Cơ sở 1 - TP. Hưng Yên",
    address: "Số 12 Đường Hoàng Hoa Thám, Phường Lam Sơn, TP. Hưng Yên",
    hours: "Sáng 7h-12h | Chiều 13h-17h",
    phone: "1900 1234",
    emergency: "0243.xxx.xxx",
  },
  {
    name: "Cơ sở 2 - Phố Nối",
    address: "Đường Nguyễn Thiện Thuật, Phường Nhân Hoà, Tỉnh Hưng Yên",
    hours: "Sáng 7h-12h | Chiều 13h-17h",
    phone: "1900 5678",
    emergency: "0243.xxx.xxx",
  },
];

export default function AppFooter() {
  const navigate = useNavigate();

  return (
    <Footer
      style={{
        background: "#034ea5",
        color: "#fff",
        padding: "50px 60px 0",
      }}
    >
      <Row gutter={[32, 40]} style={{ paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
        <Col xs={24} md={7}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <img src="/logo.svg" alt="Logo" style={{ width: 56, height: 56 }} />
            <div>
              <h3 style={{ color: "#fff", margin: 0, fontWeight: 700, fontSize: 18 }}>
                PHÒNG KHÁM ĐA KHOA AN TÂM
              </h3>
              <p style={{ margin: "2px 0 0", color: "#91d5ff", fontSize: 14, fontWeight: 500 }}>
                PHÒNG KHÁM ĐA KHOA AN TÂM
              </p>
            </div>
          </div>
          <p style={{ color: "#bae7ff", lineHeight: 1.8, fontSize: 14, fontStyle: "italic" }}>
            "Phòng Khám Đa khoa An tâm góp phần kiến tạo một cộng đồng khỏe mạnh và hạnh phúc. Chúng tôi dành 
            trọn tâm huyết, kết hợp sự tận tâm và tinh hoa y học để thắp sáng niềm hy vọng trên hành trình chữa lành."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <MailOutlined style={{ fontSize: 16, color: "#91d5ff" }} />
            <span style={{ color: "#bae7ff", fontSize: 14 }}>contact@antamclinic.vn</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <PhoneOutlined style={{ fontSize: 16, color: "#91d5ff" }} />
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Tổng đài: 1900 1234</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1877f2" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)" }}
            >
              <FacebookOutlined style={{ fontSize: 18, color: "#fff" }} />
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#ff0000" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)" }}
            >
              <YoutubeOutlined style={{ fontSize: 18, color: "#fff" }} />
            </div>
          </div>
        </Col>

        <Col xs={24} md={5}>
          <h4 style={{ color: "#fff", marginBottom: 20, fontSize: 18, fontWeight: 700 }}>Liên kết nhanh</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QUICK_LINKS.map((link) => (
              <div key={link.label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "2px 0", transition: "all 0.3s" }}
                onClick={() => navigate(link.path)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)" }}
              >
                <span style={{ color: "#69c0ff", fontSize: 10 }}>▸</span>
                <span style={{ color: "#bae7ff", fontSize: 14 }}>{link.label}</span>
              </div>
            ))}
          </div>
        </Col>

        {LOCATIONS.map((loc) => (
          <Col xs={24} md={6} key={loc.name}>
            <h4 style={{ color: "#fff", marginBottom: 20, fontSize: 15, fontWeight: 700 }}>
              {loc.name}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <EnvironmentOutlined style={{ fontSize: 16, color: "#91d5ff", marginTop: 3 }} />
                <span style={{ color: "#bae7ff", fontSize: 13, lineHeight: 1.6 }}>{loc.address}</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <ClockCircleOutlined style={{ fontSize: 16, color: "#91d5ff", marginTop: 3 }} />
                <span style={{ color: "#bae7ff", fontSize: 13, lineHeight: 1.6 }}>{loc.hours}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PhoneOutlined style={{ fontSize: 16, color: "#91d5ff" }} />
                <strong style={{ color: "#fff", fontSize: 15 }}>{loc.phone}</strong>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,77,79,0.15)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,77,79,0.3)" }}>
                <PhoneOutlined style={{ fontSize: 14, color: "#ff4d4f" }} />
                <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                  <span style={{ color: "#ff7875", fontSize: 11 }}>Cấp cứu 24/24:</span>
                  <strong style={{ color: "#fff", fontSize: 14 }}>{loc.emergency}</strong>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", color: "#91d5ff", fontSize: 13, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        © {new Date().getFullYear()} Phòng khám Đa khoa An Tâm. Đã đăng ký bản quyền.
      </div>
    </Footer>
  );
}