import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Typography, Spin, Button, Avatar, Space, Tag, Divider, Card, ConfigProvider, Breadcrumb, Empty } from "antd";
import { MedicineBoxOutlined, UserOutlined, CalendarOutlined, PhoneOutlined, ArrowRightOutlined, TeamOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { getSpecialtyById, getDoctorsBySpecialty } from "../Api/SpecialtyDetailApi";

const { Title, Text, Paragraph } = Typography;

const SPECIALTY_META = {
  "Nội Tổng Quát": { icon: <MedicineBoxOutlined />, color: "#1677ff", bg: "#e6f4ff" },
  "Nhi Khoa": { icon: <MedicineBoxOutlined />, color: "#52c41a", bg: "#f6ffed" },
  "Sản Phụ Khoa": { icon: <MedicineBoxOutlined />, color: "#eb2f96", bg: "#fff0f6" },
  "Răng Hàm Mặt": { icon: <MedicineBoxOutlined />, color: "#faad14", bg: "#fffbe6" },
  "Tai Mũi Họng": { icon: <MedicineBoxOutlined />, color: "#13c2c2", bg: "#e6fffb" },
  "Da Liễu": { icon: <MedicineBoxOutlined />, color: "#722ed1", bg: "#f9f0ff" },
  "Mắt": { icon: <MedicineBoxOutlined />, color: "#1677ff", bg: "#e6f4ff" },
  "Cơ Xương Khớp": { icon: <MedicineBoxOutlined />, color: "#52c41a", bg: "#f6ffed" },
  "Tim Mạch": { icon: <MedicineBoxOutlined />, color: "#eb2f96", bg: "#fff0f6" },
};

const getMeta = (name) => {
  if (!name) return { icon: <MedicineBoxOutlined />, color: "#1677ff", bg: "#e6f4ff" };
  for (const [key, val] of Object.entries(SPECIALTY_META)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { icon: <MedicineBoxOutlined />, color: "#1677ff", bg: "#e6f4ff" };
};

const SpecialtyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [data, bacSi] = await Promise.all([
          getSpecialtyById(id),
          getDoctorsBySpecialty(id),
        ]);
        setSpecialty(data);
        setDoctors(bacSi || []);
      } catch (err) {
        console.error("Lỗi tải chi tiết chuyên khoa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "120px 0" }}>
        <Spin size="large" />
        <Paragraph style={{ marginTop: 16, color: "#8c8c8c" }}>Đang tải thông tin chuyên khoa...</Paragraph>
      </div>
    );
  }

  if (!specialty) {
    return <Empty description="Không tìm thấy chuyên khoa" style={{ padding: 120 }} />;
  }

  const meta = getMeta(specialty.ten_chuyen_khoa);

  return (
    <ConfigProvider theme={{ token: { borderRadius: 12, colorPrimary: "#034ea5" } }}>
      <main className="w-full bg-white min-h-screen font-sans">
        <section style={{
          position: "relative",
          padding: "60px 5%",
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
            <Breadcrumb items={[
              { title: <Link to="/" style={{ color: "rgba(255,255,255,0.6)" }}>Trang chủ</Link> },
              { title: <Link to="/specialty" style={{ color: "rgba(255,255,255,0.6)" }}>Chuyên khoa</Link> },
              { title: <span style={{ color: "rgba(255,255,255,0.85)" }}>{specialty.ten_chuyen_khoa}</span> },
            ]} style={{ marginBottom: 24, fontSize: 14 }} />
            <Row align="middle" gutter={[48, 32]}>
              <Col xs={24} sm={16} md={20}>
                <Title level={1} style={{
                  color: "#fff", fontSize: "clamp(28px, 3.5vw, 40px)",
                  fontWeight: 800, marginBottom: 0,
                }}>
                  {specialty.ten_chuyen_khoa}
                </Title>
              </Col>
            </Row>
          </div>
        </section>

        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
          <Row gutter={[48, 32]}>
            <Col xs={24} lg={12}>
              {specialty.mo_ta && (
                <div style={{ marginBottom: 48 }}>
                  <div style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ fontSize: 25, fontWeight: 700, color: "#1f1f1f", marginBottom: 8 }}>
                      Tổng quan
                    </Title>
                    <div style={{ width: 50, height: 4, background: "#034ea5", borderRadius: 2 }} />
                  </div>
                  <Paragraph style={{ fontSize: 18, color: "#595959", lineHeight: 1.8, margin: 0, textAlign: "justify" }}>
                    {specialty.mo_ta}
                  </Paragraph>
                </div>
              )}
            </Col>

            <Col xs={24} lg={12}>
              {specialty.hinh_anh && (
                <div style={{
                  borderRadius: 16, overflow: "hidden",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                }}>
                  <img
                    src={specialty.hinh_anh}
                    alt={specialty.ten_chuyen_khoa}
                    style={{ width: "100%", minHeight: 400, objectFit: "cover", display: "block", borderRadius: 16 }}
                  />
                </div>
              )}
            </Col>
          </Row>

          <div style={{ marginTop: 48, marginBottom: 32 }}>
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ fontSize: 25, fontWeight: 700, color: "#1f1f1f", marginBottom: 8 }}>
                Đội Ngũ Bác Sĩ
              </Title>
              <div style={{ width: 50, height: 4, background: "#034ea5", borderRadius: 2 }} />
            </div>

            {doctors.length === 0 ? (
              <></>
            ) : (
              <Row gutter={[24, 24]}>
                {doctors.map((doc) => (
                  <Col xs={24} sm={12} md={8} key={doc.id_nhan_vien}>
                    <Card hoverable bordered={false} style={{ borderRadius: 16, height: "100%", border: "1px solid #f0f0f0", textAlign: "center", padding: "32px 20px" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#034ea5"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(3,78,165,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                      <Avatar
                        size={80}
                        src={doc.hinh_anh}
                        icon={!doc.hinh_anh ? <UserOutlined /> : undefined}
                        style={{ backgroundColor: "#034ea5", marginBottom: 16 }}
                      />
                      <Title level={4} style={{ fontSize: 16, marginBottom: 4 }}>{doc.ten_nhan_vien}</Title>
                      <Text type="secondary">{doc.chuc_vu || "Bác sĩ"}</Text>
                      <Divider style={{ margin: "16px 0" }} />
                      <Button block type="primary" ghost icon={<CalendarOutlined />} style={{ borderRadius: 8, fontWeight: 600 }}
                        onClick={() => navigate(`/booking?specialtyId=${id}&doctorId=${doc.id_nhan_vien}`)}>
                        Đặt lịch khám
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </section>
      </main>
    </ConfigProvider>
  );
};

export default SpecialtyDetailPage;
