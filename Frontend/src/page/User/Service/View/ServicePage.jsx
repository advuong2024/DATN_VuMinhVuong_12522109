import React, { useState, useEffect, useMemo } from "react";
import {
  Row, Col, Typography, ConfigProvider, Input, Spin, Empty, Tag, Button,
  Modal, Space, Breadcrumb, List, Divider, Card as AntCard,
} from "antd";
import {
  SearchOutlined, CalendarOutlined, PhoneOutlined, CheckCircleOutlined,
  RocketOutlined, SafetyCertificateOutlined, MedicineBoxOutlined,
  HeartOutlined, ExperimentOutlined, SmileOutlined, ScanOutlined,
  RightOutlined, CloseOutlined, InfoCircleOutlined, DollarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { getAllServices, getAllCategories } from "../Api/ServiceApi";
import { SERVICE_HIGHLIGHTS_MAP, BHYT_CARDS} from "../Common/Service_help"

const { Title, Text, Paragraph } = Typography;

const BADGES = [
  { icon: <RocketOutlined />, label: "Công nghệ hiện đại" },
  { icon: <CheckCircleOutlined />, label: "Chuẩn quốc tế" },
  { icon: <SafetyCertificateOutlined />, label: "An toàn - Tận tâm" },
];

const getHighlights = (name) => {
  const lower = (name || "").toLowerCase();
  for (const entry of SERVICE_HIGHLIGHTS_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry;
  }
  return {
    highlights: ["Quy trình khám chữa bệnh chuyên nghiệp", "Đội ngũ bác sĩ giàu kinh nghiệm", "Trang thiết bị y tế hiện đại"],
    audience: "Mọi đối tượng có nhu cầu khám chữa bệnh",
  };
};


const ServicePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [svc, cat] = await Promise.all([getAllServices(), getAllCategories()]);
        setServices(svc);
        setCategories(cat);
      } catch (err) {
        console.error("Lỗi tải dịch vụ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchSearch = !searchText || (s.ten_dich_vu || "").toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = activeCategory === "all" || String(s.id_danh_muc) === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [services, searchText, activeCategory]);

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
            background: "url(https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1920&q=80) center/cover no-repeat",
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
                Danh mục dịch vụ
              </Text>
              <Title level={1} style={{
                color: "#fff", fontSize: "clamp(26px, 3.5vw, 40px)",
                fontWeight: 800, lineHeight: 1.2, marginBottom: 16,
              }}>
                Dịch vụ Y tế & Gói khám Sức khỏe
              </Title>
              <Paragraph style={{
                color: "rgba(255,255,255,0.7)", fontSize: 15,
                lineHeight: 1.8, marginBottom: 24, maxWidth: 600,
              }}>
                Cung cấp giải pháp chăm sóc sức khỏe toàn diện, từ tầm soát sớm, điều trị nội ngoại khoa đến các dịch vụ chăm sóc cao cấp theo yêu cầu.
              </Paragraph>
              <Space size={12} wrap>
                {BADGES.map((b) => (
                  <Tag key={b.label} icon={b.icon} style={{
                    borderRadius: 20, padding: "4px 16px", fontSize: 13,
                    background: "rgba(255,255,255,0.12)", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}>
                    {b.label}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 0" }}>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center",
            justifyContent: "space-between", marginBottom: 24,
          }}>
            <Input
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Tìm kiếm dịch vụ, gói khám..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 320, borderRadius: 8, height: 40 }}
            />
            <Space size={8} wrap>
              <Tag
                style={{
                  borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", border: activeCategory === "all" ? "2px solid #034ea5" : "2px solid transparent",
                  background: activeCategory === "all" ? "#e6f4ff" : "#f5f5f5",
                  color: activeCategory === "all" ? "#034ea5" : "#595959",
                  transition: "all 0.2s",
                }}
                onClick={() => setActiveCategory("all")}
              >
                Tất cả dịch vụ
              </Tag>
              {categories.map((cat) => (
                <Tag
                  key={String(cat.id_danh_muc)}
                  style={{
                    borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", border: activeCategory === String(cat.id_danh_muc) ? "2px solid #034ea5" : "2px solid transparent",
                    background: activeCategory === String(cat.id_danh_muc) ? "#e6f4ff" : "#f5f5f5",
                    color: activeCategory === String(cat.id_danh_muc) ? "#034ea5" : "#595959",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setActiveCategory(String(cat.id_danh_muc))}
                >
                  {cat.ten_danh_muc}
                </Tag>
              ))}
            </Space>
          </div>
        </section>

        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 60px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: 16, color: "#8c8c8c" }}>Đang tải danh sách dịch vụ...</Paragraph>
            </div>
          ) : filtered.length === 0 ? (
            <Empty description="Không tìm thấy dịch vụ phù hợp" />
          ) : (
            <Row gutter={[24, 32]}>
              {filtered.map((svc) => {
                const data = getHighlights(svc.ten_dich_vu);
                                const catName = svc.danh_muc?.ten_danh_muc || "";

                return (
                  <Col xs={24} sm={12} lg={8} key={svc.id_dich_vu}>
                    <div style={{
                      background: "#fff", borderRadius: 16, overflow: "hidden",
                      border: "1px solid #f0f0f0", height: "100%",
                      display: "flex", flexDirection: "column",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
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
                      onClick={() => navigate(`/dich-vu/${svc.id_dich_vu}`)}
                    >
                      <div style={{ width: "100%", height: 200, overflow: "hidden", position: "relative" }}>
                        <img
                          src={svc.hinh_anh || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"}
                          alt={svc.ten_dich_vu}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        {catName && (
                          <Tag style={{
                            position: "absolute", top: 12, left: 12,
                            borderRadius: 6, fontWeight: 600, fontSize: 11,
                            background: "#034ea5", color: "#fff", border: "none",
                          }}>
                            {catName}
                          </Tag>
                        )}
                      </div>
                      <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                        <Title level={3} style={{
                          fontSize: 16, fontWeight: 700, color: "#1f1f1f",
                          margin: "0 0 10px", lineHeight: 1.4,
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {svc.ten_dich_vu}
                        </Title>

                        <List
                          size="small"
                          dataSource={data.highlights.slice(0, 3)}
                          split={false}
                          renderItem={(item) => (
                            <List.Item style={{ padding: "3px 0", border: "none" }}>
                              <Space size={8}>
                                <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 12 }} />
                                <Text style={{ fontSize: 12, color: "#595959" }}>{item}</Text>
                              </Space>
                            </List.Item>
                          )}
                          style={{ marginBottom: 16 }}
                        />

                        <Space style={{ justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: "auto" }}>
                          <Button
                            type="primary"
                            size="small"
                            icon={<RightOutlined />}
                            style={{ borderRadius: 8, fontWeight: 600, height: 32 }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/dich-vu/${svc.id_dich_vu}`); }}
                          >
                            Chi tiết
                          </Button>
                        </Space>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </section>

        {/* <section style={{
          background: "#f0f5ff", padding: "48px 24px",
          borderTop: "3px solid #034ea5",
        }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <Row gutter={[32, 24]} align="middle">
              <Col xs={24} md={10}>
                <div style={{
                  background: "#034ea5", borderRadius: 16,
                  padding: 32, textAlign: "center", color: "#fff",
                }}>
                  <SafetyCertificateOutlined style={{ fontSize: 48, marginBottom: 12 }} />
                  <Title level={3} style={{ color: "#fff", margin: 0, fontSize: 20 }}>
                    Thông tin Bảo hiểm Y tế
                  </Title>
                </div>
              </Col>
              <Col xs={24} md={14}>
                <Title level={4} style={{ color: "#034ea5", fontSize: 17, fontWeight: 700, marginBottom: 12 }}>
                  Thông tuyến Bảo hiểm Y tế (BHYT)
                </Title>
                <Paragraph style={{ color: "#595959", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                  Phòng khám Đa khoa An Tâm áp dụng thanh toán BHYT đúng tuyến cho tất cả các thẻ bảo hiểm trên toàn quốc khi đến khám chữa bệnh nội trú và ngoại trú, giúp tối ưu hóa chi phí cho người bệnh.
                </Paragraph>
                <Space size={8} wrap>
                  {BHYT_CARDS.map((c) => (
                    <Tag key={c} icon={<SafetyCertificateOutlined />} style={{
                      borderRadius: 6, padding: "4px 12px", fontSize: 12,
                      background: "#fff", border: "1px solid #d9d9d9",
                    }}>
                      {c}
                    </Tag>
                  ))}
                </Space>
              </Col>
            </Row>
          </div>
        </section> */}

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

export default ServicePage;
