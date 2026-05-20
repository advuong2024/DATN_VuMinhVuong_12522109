import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Space, 
  Avatar, 
  ConfigProvider,
  Divider,
  Spin
} from 'antd';
import { 
  PhoneOutlined, 
  UserOutlined, 
  CalendarOutlined,
  TeamOutlined, 
  SafetyCertificateOutlined, 
  DollarOutlined, 
  CustomerServiceOutlined,
  TrophyOutlined,
  RobotOutlined,
  LikeOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  SmileOutlined,
  EyeOutlined,
  SoundOutlined,
  HeartOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getHomeData } from '../Api/HomeApi';

const { Title, Text, Paragraph } = Typography;

const SPECIALTY_META = {
  "Nội Tổng Quát": { icon: <MedicineBoxOutlined />, color: "#1677ff", bg: "#e6f4ff" },
  "Nhi Khoa": { icon: <SmileOutlined />, color: "#52c41a", bg: "#f6ffed" },
  "Sản Phụ Khoa": { icon: <HeartOutlined />, color: "#eb2f96", bg: "#fff0f6" },
  "Răng Hàm Mặt": { icon: <ExperimentOutlined />, color: "#faad14", bg: "#fffbe6" },
  "Tai Mũi Họng": { icon: <SoundOutlined />, color: "#13c2c2", bg: "#e6fffb" },
  "Da Liễu": { icon: <ExperimentOutlined />, color: "#722ed1", bg: "#f9f0ff" },
  "Mắt": { icon: <EyeOutlined />, color: "#1677ff", bg: "#e6f4ff" },
  "Cơ Xương Khớp": { icon: <SafetyCertificateOutlined />, color: "#52c41a", bg: "#f6ffed" },
  "Tim Mạch": { icon: <HeartOutlined />, color: "#eb2f96", bg: "#fff0f6" },
};

const getMeta = (name) => {
  if (!name) return { icon: <MedicineBoxOutlined />, color: "#1677ff", bg: "#e6f4ff" };
  const exact = SPECIALTY_META[name];
  if (exact) return exact;
  for (const [key, val] of Object.entries(SPECIALTY_META)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { icon: <MedicineBoxOutlined />, color: "#1677ff", bg: "#e6f4ff" };
};

const doctorKeywords = ["trưởng khoa", "phó khoa", "bác sĩ", "thạc sĩ", "tiến sĩ", "cki", "ckii"];

const reasons = [
  {
    title: 'Chuyên gia đầu ngành',
    desc: 'Đội ngũ bác sĩ từ các bệnh viện trung ương, giàu kinh nghiệm.',
    icon: <TrophyOutlined />,
    color: '#1677ff',
  },
  {
    title: 'Thiết bị hiện đại',
    desc: 'Hệ thống máy móc nội soi, siêu âm 4D, xét nghiệm tự động.',
    icon: <RobotOutlined />,
    color: '#52c41a',
  },
  {
    title: 'Chi phí minh bạch',
    desc: 'Giá niêm yết công khai, hỗ trợ BHYT linh hoạt.',
    icon: <DollarOutlined />,
    color: '#faad14',
  },
  {
    title: 'Dịch vụ chu đáo',
    desc: 'Quy trình khép kín, đặt lịch online giảm thời gian chờ.',
    icon: <LikeOutlined />,
    color: '#722ed1',
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomeData();
        setSpecialties(data.specialties || []);
        setDoctors(data.doctors || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu trang chủ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });
    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const bacSiOnly = doctors.filter((doc) => {
    const title = (doc.chuc_vu || "").toLowerCase();
    return doctorKeywords.some((kw) => title.includes(kw));
  });

  const displayedSpecialties = specialties.slice(0, 6);

  const quickServices = [
    {
      icon: <CalendarOutlined />,
      title: 'Đặt lịch khám',
      benefits: ['Không mất thời gian chờ đợi', 'Tiết kiệm thời gian', 'Thao tác dễ dàng'],
      action: () => navigate('/Booking'),
      actionText: 'Đặt ngay',
      color: '#1677ff',
    },
    {
      icon: <UserOutlined />,
      title: 'Tìm bác sĩ',
      benefits: ['Chọn theo tên', 'Chọn theo chuyên môn', 'Xem lịch làm việc'],
      action: () => navigate('/doctor'),
      actionText: 'Xem ngay',
      color: '#52c41a',
    },
    {
      icon: <PhoneOutlined />,
      title: 'Hỗ trợ giải đáp',
      benefits: ['Tư vấn mọi thông tin', 'Giải đáp dịch vụ y tế', 'Hỗ trợ 24/7'],
      action: () => navigate('/booking'),
      actionText: 'Gọi ngay',
      color: '#faad14',
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 12,
          colorPrimary: '#1677ff',
        },
      }}
    >
      <div className="home-container" style={{ overflowX: 'hidden' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .home-container {
            background-color: #fff;
          }

          .top-bar {
            background: #034ea5;
            color: #fff;
            padding: 10px 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            letter-spacing: 0.3px;
          }
          @media (max-width: 768px) {
            .top-bar { flex-direction: column; gap: 6px; text-align: center; }
          }
          .top-bar-emergency {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 14px;
          }
          .top-bar-emergency span {
            background: #ff4d4f;
            padding: 3px 12px;
            border-radius: 4px;
            font-size: 13px;
          }

          .hero-section {
            background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
            padding: 80px 5% 140px 5%;
            position: relative;
            overflow: hidden;
          }
          .hero-section::before {
            content: "";
            position: absolute;
            top: -100px;
            right: -100px;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(22, 119, 255, 0.1) 0%, transparent 70%);
            border-radius: 50%;
          }
          .hero-content { z-index: 1; }
          .hero-image-container {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .hero-image-blob {
            position: absolute;
            width: 100%;
            height: 100%;
            background: #91caff;
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            opacity: 0.3;
            animation: blob-animate 8s ease-in-out infinite;
          }
          @keyframes blob-animate {
            0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
            50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
            100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          }
          .hero-img {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }

          .qs-section {
            background: #fff;
            margin-top: -80px;
            padding: 0 5%;
            z-index: 2;
            position: relative;
          }
          .qs-card-wrapper {
            background: #fff;
            padding: 32px 28px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #f0f0f0;
            height: 100%;
            transition: all 0.4s ease;
          }
          .qs-card-wrapper:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          }
          .qs-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            margin-bottom: 20px;
          }
          .qs-benefits {
            list-style: none;
            padding: 0;
            margin: 0 0 20px;
          }
          .qs-benefits li {
            color: #8c8c8c;
            font-size: 14px;
            padding: 4px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .floating-card {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
            transition: all 0.4s ease;
            border: 1px solid #f0f0f0;
          }
          .floating-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
          }

          .section-padding { padding: 60px 5%; }

          .specialty-card {
            height: 100%;
            border-radius: 16px;
            transition: all 0.4s ease;
            overflow: hidden;
            border: 1px solid #f0f0f0;
          }
          .specialty-card:hover {
            border-color: #1677ff;
            background: #f0f7ff;
            transform: scale(1.03);
            box-shadow: 0 12px 40px rgba(22, 119, 255, 0.12);
          }
          .specialty-icon {
            font-size: 32px;
            margin-bottom: 20px;
            display: inline-block;
            padding: 12px;
            border-radius: 12px;
            transition: all 0.3s ease;
          }

          .doctor-card {
            border-radius: 20px;
            overflow: hidden;
            border: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            transition: all 0.4s ease;
          }
          .doctor-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
          }

          .reason-icon-wrapper {
            width: 60px;
            height: 60px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
          }
          .reason-icon-wrapper:hover {
            transform: scale(1.1) rotate(-5deg);
          }

          .custom-title {
            position: relative;
            display: inline-block;
            margin-bottom: 40px;
          }
          .custom-title::after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 4px;
            background: #1677ff;
            border-radius: 2px;
          }

          .fade-in-section {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }
          .fade-in-section.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
          .stagger-1 { transition-delay: 0s; }
          .stagger-2 { transition-delay: 0.1s; }
          .stagger-3 { transition-delay: 0.2s; }
          .stagger-4 { transition-delay: 0.3s; }
          .stagger-5 { transition-delay: 0.4s; }
          .stagger-6 { transition-delay: 0.5s; }

          @keyframes glow {
            0%, 100% { box-shadow: 0 8px 20px rgba(22, 119, 255, 0.3); }
            50% { box-shadow: 0 8px 45px rgba(22, 119, 255, 0.6); }
          }
          .glow-btn {
            animation: glow 2s ease-in-out infinite;
          }

          @keyframes slideDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .top-bar {
            animation: slideDown 0.5s ease;
          }
        `}} />

        <div className="hero-section">
          <Row align="middle" gutter={[48, 48]}>
            <Col xs={24} lg={12} className="hero-content">
              <Text strong style={{ color: '#1677ff', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '16px' }}>
                Hệ thống Y khoa đạt chuẩn
              </Text>
              <Title level={1} style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.2, fontWeight: 800, color: '#00234b', marginBottom: '24px' }}>
                Vì Sức Khỏe <br /> <span style={{ color: '#1677ff' }}>Của Bạn Và Gia Đình</span>
              </Title>
              <Paragraph style={{ fontSize: '18px', color: '#4e5969', marginBottom: '40px', maxWidth: '500px' }}>
                Phòng khám Đa khoa An Tâm cung cấp dịch vụ chăm sóc sức khỏe toàn diện với công nghệ tiên tiến nhất và đội ngũ bác sĩ tận tâm.
              </Paragraph>
            </Col>
            <Col xs={24} lg={12} className="hero-image-container">
              <div className="hero-image-blob"></div>
              <img 
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=500&fit=crop&auto=format" 
                alt="Doctor" 
                className="hero-img"
                style={{ width: '100%', maxWidth: '500px', borderRadius: '24px', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
              />
            </Col>
          </Row>
        </div>

        <div className="qs-section">
          <Row gutter={[24, 24]}>
            {quickServices.map((svc, i) => (
              <Col xs={24} md={8} key={i}>
                <div className={`qs-card-wrapper stagger-${i + 1}`}>
                  <div className="qs-icon" style={{ background: `${svc.color}15`, color: svc.color }}>
                    {svc.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: 16 }}>{svc.title}</Title>
                  <ul className="qs-benefits">
                    {svc.benefits.map((b, j) => (
                      <li key={j}>
                        <CheckCircleOutlined style={{ color: svc.color, fontSize: 14 }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="primary"
                    ghost
                    block
                    icon={<ArrowRightOutlined />}
                    style={{ borderRadius: 8, fontWeight: 600, height: 40 }}
                    onClick={svc.action}
                  >
                    {svc.actionText}
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div className="section-padding fade-in-section">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2} className="custom-title">Chuyên Khoa Mũi Nhọn</Title>
            <Paragraph style={{ fontSize: '16px', color: '#8c8c8c' }}>
              Chúng tôi cung cấp đa dạng các dịch vụ y tế chuyên sâu, đáp ứng mọi nhu cầu chăm sóc sức khỏe.
            </Paragraph>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: 16, color: '#8c8c8c' }}>Đang tải chuyên khoa...</Paragraph>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {displayedSpecialties.map((item, idx) => {
                const meta = getMeta(item.ten_chuyen_khoa);
                return (
                  <Col xs={24} sm={12} md={8} key={item.id_chuyen_khoa}>
                    <Card className="specialty-card" bordered={false}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="specialty-icon" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                        {meta.icon}
                      </div>
                      <Title level={4} style={{ marginBottom: '12px' }}>{item.ten_chuyen_khoa}</Title>
                      <Button type="link" icon={<ArrowRightOutlined />} style={{ padding: 0 }} onClick={() => navigate(`/chuyen-khoa/${item.id_chuyen_khoa}`)}>
                        Xem chi tiết
                      </Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>

        <div className="section-padding fade-in-section" style={{ backgroundColor: '#f8fbff' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={10}>
              <Text strong style={{ color: '#1677ff', display: 'block', marginBottom: '16px' }}>Ưu điểm vượt trội</Text>
              <Title level={2} style={{ marginBottom: '24px', fontSize: '32px' }}>Tại Sao Nên Chọn <br /> Phòng Khám An Tâm?</Title>
              <Paragraph style={{ fontSize: '16px', color: '#595959', marginBottom: '32px' }}>
                Với phương châm "Lấy bệnh nhân làm trung tâm", chúng tôi không ngừng nỗ lực để mang lại trải nghiệm y tế tốt nhất.
              </Paragraph>
              <Button type="primary" size="large" onClick={() => navigate('/Booking')}>
                Liên hệ ngay
              </Button>
            </Col>
            <Col xs={24} lg={14}>
              <Row gutter={[24, 24]}>
                {reasons.map((reason, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <Card className="floating-card" style={{ height: '100%', borderRadius: '20px' }}>
                      <div className="reason-icon-wrapper" style={{ backgroundColor: `${reason.color}15`, color: reason.color }}>
                        {reason.icon}
                      </div>
                      <Title level={4}>{reason.title}</Title>
                      <Text type="secondary">{reason.desc}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>

        <div className="section-padding fade-in-section">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2} className="custom-title">Đội Ngũ Chuyên Gia</Title>
            <Paragraph style={{ fontSize: '16px', color: '#8c8c8c' }}>
              Quy tụ những bác sĩ có trình độ chuyên môn cao và tâm huyết với nghề.
            </Paragraph>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: 16, color: '#8c8c8c' }}>Đang tải danh sách bác sĩ...</Paragraph>
            </div>
          ) : bacSiOnly.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="secondary">Chưa có thông tin bác sĩ</Text>
            </div>
          ) : (
            <Row gutter={[32, 32]}>
              {bacSiOnly.slice(0, 3).map((doc, idx) => (
                <Col xs={24} sm={12} md={8} key={doc.id_nhan_vien}>
                  <Card className="doctor-card"
                    style={{ animationDelay: `${idx * 0.15}s` }}
                  >
                    <div style={{ textAlign: 'center', padding: '20px 0 0' }}>
                      <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
                    </div>
                    <Card.Meta
                      style={{ textAlign: 'center', marginTop: 16 }}
                      title={<Title level={4} style={{ margin: 0 }}>{doc.ten_nhan_vien}</Title>}
                      description={
                        <Space direction="vertical" size={4} style={{ width: '100%', marginTop: '8px' }}>
                          <Text strong style={{ color: '#1677ff' }}>{doc.chuc_vu || 'Bác sĩ'}</Text>
                          {doc.chuyen_khoa && (
                            <Text type="secondary">{doc.chuyen_khoa.ten_chuyen_khoa}</Text>
                          )}
                          <Divider style={{ margin: '12px 0' }} />
                          <Button block type="primary" ghost icon={<CalendarOutlined />} onClick={() => navigate('/Booking')}>
                            Đặt lịch hẹn
                          </Button>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>

        <div className="section-padding" style={{ position: 'relative', textAlign: 'center', color: '#fff', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: "url(https://images.unsplash.com/photo-1551076805-e1869033e561?w=1920&q=80) center/cover no-repeat",
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(0,35,75,0.85) 0%, rgba(3,78,165,0.6) 100%)',
          }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '60px 5%' }}>
            <Title level={2} style={{ color: '#fff', marginBottom: '24px' }}>Bắt đầu hành trình chăm sóc sức khỏe ngay hôm nay</Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', marginBottom: '40px' }}>
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi.
            </Paragraph>
            <Space size="large">
              <Button size="large" type="primary" onClick={() => navigate('/Booking')}>Đặt lịch khám ngay</Button>
            </Space>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
