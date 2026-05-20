import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Typography, Spin, Space, Tag, Divider, ConfigProvider, Breadcrumb, Empty, Collapse, List } from "antd";
import { CheckCircleOutlined, MedicineBoxOutlined, WarningOutlined, RightOutlined } from "@ant-design/icons";
import { getServiceById } from "../Api/ServiceDetailApi";
import { getAllServices } from "../Api/ServiceApi";
import { SERVICE_DETAIL_MAP } from "../Common/Service_help";

const { Title, Text, Paragraph } = Typography;

const getDetail = (name) => {
  const lower = (name || "").toLowerCase();
  for (const entry of SERVICE_DETAIL_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry;
  }
  return {
    subtitle: null,
    noi_bat: [
      "Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm",
      "Trang thiết bị y tế hiện đại",
      "Quy trình khám chữa bệnh chuyên nghiệp",
      "Dịch vụ chăm sóc tận tâm",
    ],
    chi_tiet: [
      {
        category: "Dịch vụ chính",
        items: ["Thăm khám và tư vấn bởi bác sĩ chuyên khoa"],
      },
    ],
    luu_y: [
      "Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục",
    ],
  };
};

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [data, services] = await Promise.all([
          getServiceById(id),
          getAllServices(),
        ]);
        setService(data);
        setAllServices(services || []);
      } catch (err) {
        console.error("Lỗi tải chi tiết dịch vụ:", err);
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
        <Paragraph style={{ marginTop: 16, color: "#8c8c8c" }}>Đang tải thông tin dịch vụ...</Paragraph>
      </div>
    );
  }

  if (!service) {
    return <Empty description="Không tìm thấy dịch vụ" style={{ padding: 120 }} />;
  }

  const data = getDetail(service.ten_dich_vu);
  const otherServices = allServices.filter((s) => s.id_dich_vu !== service.id_dich_vu);

  return (
    <ConfigProvider theme={{ token: { borderRadius: 12, colorPrimary: "#034ea5" } }}>
      <main className="w-full bg-white min-h-screen font-sans">
        <section style={{
          position: "relative",
          height: 420,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `url(${service.hinh_anh || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"}) center/cover no-repeat`,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)",
          }} />
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1, width: "100%" }}>
            <Breadcrumb items={[
              { title: <Link to="/" style={{ color: "rgba(255,255,255,0.6)" }}>Trang chủ</Link> },
              { title: <Link to="/service" style={{ color: "rgba(255,255,255,0.6)" }}>Dịch vụ</Link> },
              { title: <span style={{ color: "rgba(255,255,255,0.85)" }}>{service.ten_dich_vu}</span> },
            ]} style={{ marginBottom: 16, fontSize: 14 }} />
            <Title level={1} style={{ color: "#fff", fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 800, marginBottom: 8 }}>
              {service.ten_dich_vu}
            </Title>
            {data.subtitle && (
              <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, maxWidth: 600, margin: 0 }}>
                {data.subtitle}
              </Paragraph>
            )}
          </div>
        </section>

        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
          <Row gutter={[48, 32]}>
            <Col xs={24} lg={17}>
              {service.mo_ta && (
                <div style={{ marginBottom: 48 }}>
                  <div style={{ marginBottom: 16 }}>
                    <Title level={2} style={{ fontSize: 22, fontWeight: 700, color: "#1f1f1f", marginBottom: 8 }}>
                      Tổng quan
                    </Title>
                    <div style={{ width: 50, height: 4, background: "#034ea5", borderRadius: 2 }} />
                  </div>
                  <div className="tiptap-view" style={{ fontSize: 15, color: "#595959", lineHeight: 1.8, margin: 0 }}
                    dangerouslySetInnerHTML={{ __html: service.mo_ta }}
                  />
                </div>
              )}

              {data.noi_bat.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <div style={{ marginBottom: 20 }}>
                    <Title level={2} style={{ fontSize: 22, fontWeight: 700, color: "#1f1f1f", marginBottom: 8 }}>
                      Ưu điểm nổi bật
                    </Title>
                    <div style={{ width: 50, height: 4, background: "#034ea5", borderRadius: 2 }} />
                  </div>
                  <Row gutter={[16, 16]}>
                    {data.noi_bat.map((item, i) => (
                      <Col xs={24} sm={12} key={i}>
                        <div style={{
                          background: "#f8fbff", borderRadius: 12, padding: "16px 20px", height: "100%",
                          border: "1px solid #e6f4ff", display: "flex", alignItems: "flex-start", gap: 12,
                          transition: "all 0.3s",
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(3,78,165,0.08)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                          <CheckCircleOutlined style={{ fontSize: 20, color: "#52c41a", marginTop: 2, flexShrink: 0 }} />
                          <Text style={{ color: "#595959", fontSize: 14, lineHeight: 1.6 }}>{item}</Text>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {data.chi_tiet.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <div style={{ marginBottom: 20 }}>
                    <Title level={2} style={{ fontSize: 22, fontWeight: 700, color: "#1f1f1f", marginBottom: 8 }}>
                      Danh mục chi tiết
                    </Title>
                    <div style={{ width: 50, height: 4, background: "#034ea5", borderRadius: 2 }} />
                  </div>
                  <Collapse
                    defaultActiveKey={[0]}
                    items={data.chi_tiet.map((section, idx) => ({
                      key: idx,
                      label: <Text strong style={{ fontSize: 15 }}>{section.category}</Text>,
                      children: (
                        <List
                          size="small"
                          dataSource={section.items}
                          renderItem={(item) => (
                            <List.Item style={{ padding: "6px 0" }}>
                              <Space size={10}>
                                <CheckCircleOutlined style={{ color: "#034ea5", fontSize: 12 }} />
                                <Text style={{ color: "#595959", fontSize: 14 }}>{item}</Text>
                              </Space>
                            </List.Item>
                          )}
                        />
                      ),
                    }))}
                    style={{ background: "#fff", borderRadius: 12 }}
                  />
                </div>
              )}

              {data.luu_y.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <div style={{ marginBottom: 20 }}>
                    <Title level={2} style={{ fontSize: 22, fontWeight: 700, color: "#1f1f1f", marginBottom: 8 }}>
                      Lưu ý trước khi khám
                    </Title>
                    <div style={{ width: 50, height: 4, background: "#034ea5", borderRadius: 2 }} />
                  </div>
                  <div style={{ background: "#fffbe6", borderRadius: 12, padding: "20px 24px", border: "1px solid #fff1b8" }}>
                    <List
                      size="small"
                      dataSource={data.luu_y}
                      renderItem={(item) => (
                        <List.Item style={{ padding: "8px 0" }}>
                          <Space size={12} align="start">
                            <WarningOutlined style={{ color: "#faad14", fontSize: 16, marginTop: 2 }} />
                            <Text style={{ color: "#8c8c8c", fontSize: 14 }}>{item}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              )}
            </Col>

            <Col xs={24} lg={7}>
              {otherServices.length > 0 && (
                <div style={{
                  position: "sticky", top: 100,
                  background: "#fff", borderRadius: 16,
                  border: "1px solid #f0f0f0", padding: 24,
                }}>
                  <Title level={4} style={{ fontSize: 16, fontWeight: 700, color: "#1f1f1f", marginBottom: 16 }}>
                    Dịch vụ khác
                  </Title>
                  <List
                    size="small"
                    dataSource={otherServices.slice(0, 8)}
                    renderItem={(s) => (
                      <List.Item style={{ padding: "8px 0", border: "none" }}>
                        <Link
                          to={`/dich-vu/${s.id_dich_vu}`}
                          style={{ color: "#595959", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}
                        >
                          <RightOutlined style={{ fontSize: 10, color: "#034ea5" }} />
                          {s.ten_dich_vu}
                        </Link>
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </Col>
          </Row>
        </section>
      </main>
    </ConfigProvider>
  );
};

export default ServiceDetailPage;
