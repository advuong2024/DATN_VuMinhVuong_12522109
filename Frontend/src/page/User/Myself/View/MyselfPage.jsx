import React from "react";
import { Card, Row, Col, Typography, Button, Space, Divider, ConfigProvider } from "antd";
import {
  EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined, MailOutlined,
  CalendarOutlined, RightOutlined, MedicineBoxOutlined, SafetyCertificateOutlined,
  ExperimentOutlined, HeartOutlined, TeamOutlined, BulbOutlined,
  ArrowRightOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const values = [
  {
    icon: <BulbOutlined />,
    title: "Tầm Nhìn",
    desc: "Trở thành hệ thống y tế tư nhân hàng đầu, mang đến dịch vụ chăm sóc sức khỏe đạt chuẩn quốc tế cho mọi gia đình Việt.",
    color: "#034ea5",
    bg: "#e6f4ff",
  },
  {
    icon: <HeartOutlined />,
    title: "Sứ Mệnh",
    desc: "Cung cấp dịch vụ y tế toàn diện, chất lượng cao với chi phí hợp lý, đặt sức khỏe và sự hài lòng của bệnh nhân lên hàng đầu.",
    color: "#eb2f96",
    bg: "#fff0f6",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Giá Trị Cốt Lõi",
    desc: "Tận tâm - Chuyên nghiệp - Minh bạch - Đổi mới. Cam kết mang đến trải nghiệm y tế an toàn và nhân văn nhất.",
    color: "#722ed1",
    bg: "#f9f0ff",
  },
];

const milestones = [
  { year: "2015", title: "Thành Lập", desc: "Phòng khám Đa khoa An Tâm được thành lập với đội ngũ 5 bác sĩ đầu ngành, 10 phòng khám chuyên khoa cơ bản." },
  { year: "2017", title: "Mở Rộng", desc: "Mở rộng quy mô lên 20 phòng khám chuyên khoa, đầu tư hệ thống máy móc xét nghiệm tự động hiện đại." },
  { year: "2020", title: "Đạt Chuẩn ISO", desc: "Đạt chứng nhận ISO 9001:2015 về quản lý chất lượng, triển khai hệ thống hồ sơ bệnh án điện tử." },
  { year: "2023", title: "50.000+ Bệnh Nhân", desc: "Phục vụ hơn 50.000 bệnh nhân, hợp tác với các bệnh viện tuyến trung ương trong điều trị chuyên sâu." },
  { year: "2025", title: "Phát Triển Mới", desc: "Khai trương cơ sở mới tại Hưng Yên với quy mô 30 phòng khám, trang bị hệ thống MRI, CT 128 dãy." },
];

const facilities = [
  { title: "Phòng Khám Tổng Quát", img: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=280&fit=crop",},
  { title: "Hệ Thống Xét Nghiệm", img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=280&fit=crop", },
  { title: "Khu Nội Soi & Thủ Thuật", img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=280&fit=crop",},
  { title: "Khu Hồi Sức Cấp Cứu", img: "https://images.pexels.com/photos/8942262/pexels-photo-8942262.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&fit=crop",},
];

const contactInfo = [
  { icon: <EnvironmentOutlined />, title: "Địa Chỉ", content: "Đường Nguyễn Thiện Thuật, Phường Nhân Hoà, Tỉnh Hưng Yên" },
  { icon: <PhoneOutlined />, title: "Hotline", content: "1900 1234", highlight: true },
  { icon: <ClockCircleOutlined />, title: "Giờ Làm Việc", content: "Sáng: 7h - 12h | Chiều: 13h - 17h\nCấp cứu: 24/24" },
  { icon: <MailOutlined />, title: "Email", content: "contact@antamclinic.vn" },
];

const MyselfPage = () => {
  const navigate = useNavigate();

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 12,
          colorPrimary: "#034ea5",
        },
      }}
    >
      <main className="w-full bg-white min-h-screen font-sans">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fv-section { padding: 50px 5%; }
          .fv-title {
            position: relative;
            display: inline-block;
            margin-bottom: 16px;
          }
          .fv-title::after {
            content: "";
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 60px;
            height: 4px;
            background: #034ea5;
            border-radius: 2px;
          }
          .fv-title-center {
            position: relative;
            display: inline-block;
            margin-bottom: 16px;
          }
          .fv-title-center::after {
            content: "";
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: #034ea5;
            border-radius: 2px;
          }
        `}} />

        <section style={{
          position: "relative",
          padding: "80px 5% 100px",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80) center/cover no-repeat",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(0,35,75,0.85) 0%, rgba(3,78,165,0.6) 100%)",
          }} />
          <div style={{
            position: "absolute", top: -80, right: -80,
            width: 450, height: 450,
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />
          <div style={{
            position: "absolute", bottom: -100, left: -60,
            width: 300, height: 300,
            background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />

          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <Row align="middle" gutter={[48, 32]}>
              <Col xs={24} lg={16}>
                <Text strong style={{
                  color: "rgba(255,255,255,0.7)", textTransform: "uppercase",
                  letterSpacing: "3px", fontSize: 13, display: "block", marginBottom: 12,
                }}>
                  Về phòng khám
                </Text>
                <Title level={1} style={{
                  color: "#fff", fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 800, lineHeight: 1.2, marginBottom: 16,
                }}>
                  Phòng Khám Đa Khoa An Tâm
                </Title>
                <Paragraph style={{
                  color: "rgba(255,255,255,0.7)", fontSize: 17,
                  maxWidth: 560, marginBottom: 0, lineHeight: 1.8,
                }}>
                  Đồng hành cùng sức khỏe cộng đồng hơn 10 năm, chúng tôi tự hào là địa chỉ y tế
                  tin cậy với đội ngũ bác sĩ giỏi và công nghệ hiện đại.
                </Paragraph>
              </Col>
              <Col xs={24} lg={8}>
                <div style={{
                  display: "flex", justifyContent: "center", alignItems: "center",
                  width: 180, height: 180, background: "rgba(255,255,255,0.08)",
                  borderRadius: "50%", backdropFilter: "blur(8px)", margin: "0 auto",
                }}>
                  <TeamOutlined style={{ fontSize: 80, color: "rgba(255,255,255,0.6)" }} />
                </div>
              </Col>
            </Row>
          </div>
        </section>

        <section className="fv-section" style={{ background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Row gutter={[48, 32]} align="middle">
              <Col xs={24} lg={12}>
                <Text strong style={{ color: "#034ea5", letterSpacing: "2px", fontSize: 12, textTransform: "uppercase", marginBottom: 8, display: "block" }}>
                  Giới thiệu
                </Text>
                <Title level={2} className="fv-title" style={{ fontSize: 32, fontWeight: 700 }}>
                  Về Chúng Tôi
                </Title>
                <Paragraph style={{ fontSize: 15, color: "#595959", lineHeight: 1.9, marginBottom: 20 }}>
                  Phòng khám Đa khoa An Tâm được thành lập vào năm 2015 với sứ mệnh mang đến
                  dịch vụ chăm sóc sức khỏe toàn diện, chất lượng cao cho người dân. Trải qua
                  hơn 10 năm phát triển, chúng tôi đã trở thành một trong những cơ sở y tế tư
                  nhân uy tín tại khu vực.
                </Paragraph>
                <Paragraph style={{ fontSize: 15, color: "#595959", lineHeight: 1.9, marginBottom: 28 }}>
                  Với đội ngũ hơn 50 bác sĩ, chuyên gia giàu kinh nghiệm cùng hệ thống trang
                  thiết bị y tế hiện đại, chúng tôi cam kết mang đến cho bệnh nhân những giải
                  pháp chăm sóc sức khỏe tối ưu nhất.
                </Paragraph>
                <Space direction="column" size={12}>
                  {[
                    "Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm",
                    "Hệ thống máy móc, thiết bị y tế nhập khẩu chính hãng",
                    "Quy trình khám chữa bệnh khép kín, chuyên nghiệp",
                    "Chi phí minh bạch, hỗ trợ bảo hiểm y tế",
                  ].map((item) => (
                    <Space key={item}>
                      <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 16 }} />
                      <Text style={{ fontSize: 14 }}>{item}</Text>
                    </Space>
                  ))}
                </Space>
              </Col>
              <Col xs={24} lg={12}>
                <div style={{
                  background: "#f0f5ff", borderRadius: 20, overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(3, 78, 165, 0.1)",
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=450&fit=crop"
                    alt="Phòng khám"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </section>

        <section className="fv-section" style={{ background: "#f8fbff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Text strong style={{ color: "#034ea5", letterSpacing: "2px", fontSize: 12, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Định hướng phát triển
              </Text>
              <Title level={2} className="fv-title-center" style={{ fontSize: 32, fontWeight: 700 }}>
                Tầm Nhìn - Sứ Mệnh - Giá Trị
              </Title>
            </div>
            <Row gutter={[24, 24]}>
              {values.map((v) => (
                <Col xs={24} md={8} key={v.title}>
                  <Card
                    hoverable
                    bordered={false}
                    style={{
                      borderRadius: 16, height: "100%",
                      border: `1px solid ${v.color}15`,
                      transition: "all 0.3s ease",
                      textAlign: 'center', display: 'flex',
                      alignContent: 'center', flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = v.color;
                      e.currentTarget.style.boxShadow = `0 12px 40px ${v.color}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${v.color}15`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: 14,
                      color: v.color,display: "flex", alignItems: "center", 
                      justifyContent: "center", fontSize: 48, margin: '0px auto 20px', 
                      textAlign: 'center', 
                    }}>
                      {v.icon}
                    </div>
                    <Title level={4} style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700 }}>
                      {v.title}
                    </Title>
                    <Text style={{ color: "#595959", fontSize: 14, lineHeight: 1.8 }}>
                      {v.desc}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        <section className="fv-section" style={{ background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Text strong style={{ color: "#034ea5", letterSpacing: "2px", fontSize: 12, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Chặng đường phát triển
              </Text>
              <Title level={2} className="fv-title-center" style={{ fontSize: 32, fontWeight: 700 }}>
                Lịch Sử Hình Thành
              </Title>
            </div>
            <div style={{ position: "relative", paddingLeft: 40, maxWidth: 700, margin: "0 auto" }}>
              <div style={{
                position: "absolute", left: 15, top: 0, bottom: 0,
                width: 3, background: "linear-gradient(180deg, #034ea5, #91caff)",
                borderRadius: 2,
              }} />
              {milestones.map((m, idx) => (
                <div key={m.year} style={{ position: "relative", marginBottom: idx < milestones.length - 1 ? 32 : 0 }}>
                  <div style={{
                    position: "absolute", left: -32, top: 6,
                    width: 16, height: 16, borderRadius: "50%",
                    background: "#034ea5", border: "3px solid #e6f4ff",
                    boxShadow: "0 0 0 3px #034ea5",
                    zIndex: 1,
                  }} />
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 12, marginLeft: 24,
                      border: "1px solid #f0f0f0",
                      transition: "all 0.3s ease",
                    }}
                    hoverable
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#034ea5";
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(3,78,165,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#f0f0f0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Space align="center" style={{ marginBottom: 8 }}>
                      <div style={{
                        background: "#034ea5", color: "#fff", borderRadius: 8,
                        padding: "4px 14px", fontWeight: 700, fontSize: 14,
                      }}>
                        {m.year}
                      </div>
                      <Text strong style={{ fontSize: 16 }}>{m.title}</Text>
                    </Space>
                    <Paragraph style={{ margin: 0, color: "#595959", fontSize: 14 }}>
                      {m.desc}
                    </Paragraph>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fv-section" style={{ background: "#f8fbff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Text strong style={{ color: "#034ea5", letterSpacing: "2px", fontSize: 12, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Cơ sở vật chất
              </Text>
              <Title level={2} className="fv-title-center" style={{ fontSize: 32, fontWeight: 700 }}>
                Trang Thiết Bị & Cơ Sở Hạ Tầng
              </Title>
            </div>
            <Row gutter={[24, 24]}>
              {facilities.map((f) => (
                <Col xs={24} sm={12} lg={6} key={f.title}>
                  <Card
                    hoverable
                    bordered={false}
                    style={{
                      borderRadius: 16, overflow: "hidden",
                      height: "100%",
                    }}
                    cover={
                      <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                        <img
                          src={f.img}
                          alt={f.title}
                          style={{
                            width: "100%", height: "100%", objectFit: "cover",
                            transition: "all 0.4s ease",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                        />
                      </div>
                    }
                  >
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                      <Text strong style={{ fontSize: 14, display: 'block' }}>{f.title}</Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        <section className="fv-section" style={{ background: "#fff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Text strong style={{ color: "#034ea5", letterSpacing: "2px", fontSize: 12, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Liên hệ
              </Text>
              <Title level={2} className="fv-title-center" style={{ fontSize: 32, fontWeight: 700 }}>
                Thông Tin Liên Hệ
              </Title>
            </div>
            <Row gutter={[24, 24]}>
              {contactInfo.map((c) => (
                <Col xs={24} sm={12} lg={6} key={c.title}>
                  <div style={{
                    textAlign: "center", padding: "32px 20px",
                    background: "#f8fbff", borderRadius: 16,
                    border: "1px solid #f0f5ff",
                    transition: "all 0.3s ease",
                    height: "100%",
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#034ea5";
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(3,78,165,0.08)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#f0f5ff";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: c.highlight ? "#ff4d4f" : "#e6f4ff",
                      color: c.highlight ? "#fff" : "#034ea5",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, margin: "0 auto 16px",
                    }}>
                      {c.icon}
                    </div>
                    <Title level={5} style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700 }}>
                      {c.title}
                    </Title>
                    <Text style={{
                      color: c.highlight ? "#ff4d4f" : "#595959",
                      fontSize: 14, fontWeight: c.highlight ? 700 : 400,
                      whiteSpace: "pre-line",
                    }}>
                      {c.content}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      </main>
    </ConfigProvider>
  );
};

export default MyselfPage;
