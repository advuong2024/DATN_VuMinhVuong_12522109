import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Spin, Empty, Button, Space, Tag, ConfigProvider, Breadcrumb } from "antd";
import {
  SafetyCertificateOutlined, CalendarOutlined, ArrowRightOutlined,
  RocketOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import { FaStethoscope, FaBaby, FaPersonPregnant, FaTooth, FaEarListen, FaHandSparkles, FaEye, FaBone, FaHeartPulse, FaFlask } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";
import { getAllSpecialties } from "../Api/SpecialtyApi";

const { Title, Text, Paragraph } = Typography;

const SPECIALTY_META = {
  "Nội Tổng Quát": { icon: <FaStethoscope />, color: "#1677ff" },
  "Nhi Khoa": { icon: <FaBaby />, color: "#52c41a" },
  "Sản Phụ Khoa": { icon: <FaPersonPregnant />, color: "#eb2f96" },
  "Răng Hàm Mặt": { icon: <FaTooth />, color: "#faad14" },
  "Tai Mũi Họng": { icon: <FaEarListen />, color: "#13c2c2" },
  "Da Liễu": { icon: <FaHandSparkles />, color: "#722ed1" },
  "Mắt": { icon: <FaEye />, color: "#1677ff" },
  "Cơ Xương Khớp": { icon: <FaBone />, color: "#52c41a" },
  "Tim Mạch": { icon: <FaHeartPulse />, color: "#eb2f96" },
  "Xét Nghiệm": { icon: <FaFlask />, color: "#8c8c8c" },
};

const getMeta = (name) => {
  if (!name) return { icon: <FaStethoscope />, color: "#1677ff", bg: "#e6f4ff" };
  const exact = SPECIALTY_META[name];
  if (exact) return exact;
  for (const [key, val] of Object.entries(SPECIALTY_META)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { icon: <FaStethoscope />, color: "#1677ff", bg: "#e6f4ff" };
};

const SpecialtyPage = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllSpecialties();
        setSpecialties(data);
      } catch (err) {
        console.error("Lỗi tải chuyên khoa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const badges = [
    { icon: <RocketOutlined />, label: "Công nghệ hiện đại" },
    { icon: <CheckCircleOutlined />, label: "Chuẩn quốc tế" },
    { icon: <SafetyCertificateOutlined />, label: "An toàn - Tận tâm" },
  ];

  return (
    <ConfigProvider theme={{ token: { borderRadius: 12, colorPrimary: "#034ea5" } }}>
      <main className="w-full bg-white min-h-screen font-sans">
        <section style={{
          position: "relative",
          padding: "60px 5% 80px",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "url(https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80) center/cover no-repeat",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(0,35,75,0.85) 0%, rgba(3,78,165,0.6) 100%)",
          }} />
          <div style={{
            position: "absolute", top: -80, right: -80,
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />

          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 700 }}>
              <Text strong style={{
                color: "rgba(255,255,255,0.7)", textTransform: "uppercase",
                letterSpacing: "3px", fontSize: 13, display: "block", marginBottom: 12,
              }}>
                Hệ thống chuyên khoa sâu
              </Text>
              <Title level={1} style={{
                color: "#fff", fontSize: "clamp(28px, 3.5vw, 42px)",
                fontWeight: 800, lineHeight: 1.2, marginBottom: 16,
              }}>
                Danh Sách Chuyên Khoa
              </Title>
              <Paragraph style={{
                color: "rgba(255,255,255,0.7)", fontSize: 15,
                lineHeight: 1.8, marginBottom: 24, maxWidth: 600,
              }}>
                Phòng khám Đa khoa An Tâm trang bị hệ thống máy móc và thiết bị y tế hiện đại,
                từ chẩn đoán hình ảnh đến điều trị chuyên sâu, đảm bảo mang đến sự chăm sóc
                tốt nhất cho bệnh nhân.
              </Paragraph>

              <Space size={12} wrap>
                {badges.map((b) => (
                  <Tag
                    key={b.label}
                    icon={b.icon}
                    style={{
                      borderRadius: 20, padding: "4px 16px", fontSize: 13,
                      background: "rgba(255,255,255,0.12)", color: "#fff",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {b.label}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Title level={2} style={{
              fontSize: 28, fontWeight: 700, color: "#1f1f1f", marginBottom: 8,
              position: "relative", display: "inline-block",
            }}>
              Khám & Điều Trị Chuyên Sâu
            </Title>
            <div style={{
              width: 60, height: 4, background: "#034ea5",
              borderRadius: 2, margin: "12px auto 0",
            }} />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: 16, color: "#8c8c8c" }}>Đang tải danh sách chuyên khoa...</Paragraph>
            </div>
          ) : specialties.length === 0 ? (
            <Empty description="Chưa có chuyên khoa nào" />
          ) : (
            <Row gutter={[24, 24]}>
              {specialties.map((khoa) => {
                const meta = getMeta(khoa.ten_chuyen_khoa);
                return (
                  <Col xs={24} sm={12} lg={6} key={khoa.id_chuyen_khoa}>
                    <Card
                      hoverable
                      bordered={false}
                      style={{
                        borderRadius: 16, height: "280px",
                        border: "1px solid #f0f0f0",
                        transition: "all 0.3s ease",
                      }}
                      styles={{ body: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' } }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#034ea5";
                        e.currentTarget.style.boxShadow = "0 12px 40px rgba(3,78,165,0.1)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#f0f0f0";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      <div style={{
                        width: 76, height: 126, borderRadius: 14,
                        color: meta.color,display: "flex", 
                        alignItems: "center", justifyContent: "center",
                        fontSize: 88, marginBottom: 20,
                      }}>
                        {meta.icon || ""}
                      </div>

                      <Title level={3} style={{
                        fontSize: 18, fontWeight: 700, color: "#1f1f1f",
                        flex: 1, marginBottom: 12, textAlign: 'center',
                      }}>
                        {khoa.ten_chuyen_khoa}
                      </Title>

                      <Button
                        type="primary" ghost block
                        icon={<ArrowRightOutlined />}
                        style={{ borderRadius: 8, fontWeight: 600, height: 38, fontSize: 13 }}
                        onClick={() => navigate(`/chuyen-khoa/${khoa.id_chuyen_khoa}`)}
                      >
                        Tìm hiểu ngay
                      </Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </section>

        <section style={{
          position: "relative",
          textAlign: "center", padding: "60px 5%",
          overflow: "hidden",
          color: "#fff",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "url(https://images.unsplash.com/photo-1551076805-e1869033e561?w=1920&q=80) center/cover no-repeat",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(0,35,75,0.85) 0%, rgba(3,78,165,0.6) 100%)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Title level={2} style={{ color: "#fff", margin: "0 0 12px", fontSize: 28 }}>
              Bảo Vệ Sức Khỏe Cho Bạn Và Gia Đình
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, maxWidth: 500, margin: "0 auto 32px" }}>
              Đặt lịch khám ngay để được tư vấn bởi các chuyên gia đầu ngành
            </Paragraph>
            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<CalendarOutlined />}
                style={{
                  height: 48, padding: "0 32px", fontSize: 15, fontWeight: 600,
                  background: "#fff", color: "#034ea5", borderColor: "#fff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
                onClick={() => navigate("/booking")}
              >
                Đăng ký khám trực tuyến
              </Button>
            </Space>
          </div>
        </section>
      </main>
    </ConfigProvider>
  );
};

export default SpecialtyPage;
