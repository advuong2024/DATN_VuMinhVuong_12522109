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
import { FaStethoscope, FaBaby, FaPersonPregnant, FaTooth, FaEarListen, FaHandSparkles, 
  FaEye, FaBone, FaHeartPulse, FaCalendarCheck, FaUserDoctor, FaPhone, FaMicroscope, 
  FaFileInvoiceDollar, FaHandHoldingHeart, FaCircleCheck, FaArrowRight 
} from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { getHomeData } from '../Api/HomeApi';
import AnimatedCounter from '../../../../components/common/AnimatedCounter';

const { Title, Text, Paragraph } = Typography;

const SPECIALTY_META = {
  "Nội Tổng Quát": { icon: <FaStethoscope />, color: "#1677ff", bg: "#e6f4ff" },
  "Nhi Khoa": { icon: <FaBaby />, color: "#52c41a", bg: "#f6ffed" },
  "Sản Phụ Khoa": { icon: <FaPersonPregnant />, color: "#eb2f96", bg: "#fff0f6" },
  "Răng Hàm Mặt": { icon: <FaTooth />, color: "#faad14", bg: "#fffbe6" },
  "Tai Mũi Họng": { icon: <FaEarListen />, color: "#13c2c2", bg: "#e6fffb" },
  "Da Liễu": { icon: <FaHandSparkles />, color: "#722ed1", bg: "#f9f0ff" },
  "Mắt": { icon: <FaEye />, color: "#1677ff", bg: "#e6f4ff" },
  "Cơ Xương Khớp": { icon: <FaBone />, color: "#52c41a", bg: "#f6ffed" },
  "Tim Mạch": { icon: <FaHeartPulse />, color: "#eb2f96", bg: "#fff0f6" },
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

const stripHtml = (html) => {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, "").trim();
  return text.length > 90 ? text.slice(0, 90) + "..." : text;
};

const doctorKeywords = ["trưởng khoa", "phó khoa", "bác sĩ", "thạc sĩ", "tiến sĩ", "cki", "ckii"];

const reasons = [
  {
    title: 'Chuyên gia đầu ngành',
    desc: 'Đội ngũ bác sĩ có trình độ chuyên môn cao, dày dặn kinh nghiệm trong khám và điều trị, luôn đặt sức khỏe người bệnh lên hàng đầu.',
    icon: <FaUserDoctor />,
    color: '#1677ff',
  },
  {
    title: 'Thiết bị hiện đại',
    desc: 'Phòng khám được đầu tư hệ thống máy móc, trang thiết bị y tế tiên tiến, hỗ trợ chẩn đoán chính xác và nâng cao hiệu quả điều trị.',
    icon: <FaMicroscope />,
    color: '#52c41a',
  },
  {
    title: 'Chi phí minh bạch',
    desc: 'Bảng giá dịch vụ được niêm yết công khai, minh bạch tại quầy và trên website, cam kết không phát sinh chi phí ngoài thỏa thuận.',
    icon: <FaFileInvoiceDollar />,
    color: '#faad14',
  },
  {
    title: 'Dịch vụ chu đáo',
    desc: 'Quy trình khám tối ưu từ đặt lịch đến thanh toán, nhân viên hướng dẫn tận tình từng bước, giúp bạn tiết kiệm thời gian và an tâm khi khám chữa bệnh.',
    icon: <FaHandHoldingHeart />,
    color: '#722ed1',
  }
];

const statsData = [
  { value: "10+", label: "Năm Kinh Nghiệm", desc: "Hành trình chăm sóc sức khỏe toàn diện" },
  { value: "50+", label: "Chuyên Gia Đầu Ngành", desc: "Đội ngũ bác sĩ tận tâm, giàu kinh nghiệm" },
  { value: "99%", label: "Khách Hàng Hài Lòng", desc: "Đánh giá tích cực về chất lượng dịch vụ" },
  { value: "100k+", label: "Bệnh Nhân Tin Tưởng", desc: "Đã và đang điều trị thành công tại phòng khám" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomeData();
        setServices(data.services || []);
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

  useEffect(() => {
    if (bacSiOnly.length <= 3) return;
    const maxIndex = bacSiOnly.length - 3;
    const interval = setInterval(() => {
      setCurrentDoctorIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [bacSiOnly.length]);

  const displayedServices = services.slice(0, 6);

  const quickServices = [
    {
      icon: <FaCalendarCheck />,
      title: 'Đặt lịch khám',
      benefits: ['Không mất thời gian chờ đợi', 'Tiết kiệm thời gian', 'Thao tác dễ dàng'],
      action: () => navigate('/Booking'),
      actionText: 'Đặt ngay',
      color: '#1677ff',
    },
    {
      icon: <FaUserDoctor />,
      title: 'Tìm bác sĩ',
      benefits: ['Chọn theo tên', 'Chọn theo chuyên môn', 'Xem lịch làm việc'],
      action: () => navigate('/doctor'),
      actionText: 'Xem ngay',
      color: '#52c41a',
    },
    {
      icon: <FaPhone />,
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
            padding: 32px 50px;
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
          .qs-benefits li svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
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

          .service-image-card {
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            height: 280px;
            cursor: pointer;
            background: #f5f5f5;
            transition: all 0.4s ease;
          }
          .service-image-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
          }
          .service-image-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
          }
          .service-image-card:hover img {
            transform: scale(1.08);
          }
          .service-name-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 16px 20px;
            background: linear-gradient(transparent, rgba(0,0,0,0.7));
            color: #fff;
            font-size: 16px;
            font-weight: 700;
            z-index: 2;
            pointer-events: none;
          }
          .service-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 35, 75, 0.88);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px;
            opacity: 0;
            transition: opacity 0.35s ease;
            z-index: 3;
          }
          .service-image-card:hover .service-overlay {
            opacity: 1;
          }
          .service-overlay p {
            color: rgba(255,255,255,0.9);
            font-size: 14px;
            line-height: 1.6;
            text-align: center;
            margin: 0 0 20px;
            max-width: 280px;
          }
          .service-overlay .overlay-btn {
            background: #fff;
            color: #034ea5;
            border: none;
            padding: 10px 28px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.25s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .service-overlay .overlay-btn:hover {
            background: #1677ff;
            color: #fff;
            transform: scale(1.05);
          }
          .service-icon-fallback {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 56px;
            color: #bfbfbf;
          }

          @keyframes slideDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .top-bar {
            animation: slideDown 0.5s ease;
          }

          .doctor-slider-container {
            width: 100%;
            overflow: hidden;
            max-width: 900px;
            margin: 0 auto;
          }
          .doctor-slider-track {
            display: flex;
            transition: transform 0.8s ease;
          }
          .doctor-slide-card {
            flex: 0 0 33.33%;
            padding: 0 12px;
            box-sizing: border-box;
          }

          .doctor-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 32px;
          }
          .doctor-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background: #d9d9d9;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 0;
          }
          .doctor-dot.active {
            width: 28px;
            border-radius: 6px;
            background: #1677ff;
          }
          .doctor-dot:hover {
            background: #91caff;
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
                src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fG1lZGljYWwlMjBjbGluaWN8ZW58MHx8MHx8fDA%3D" 
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div className="qs-icon" 
                      style={{ background: `${svc.color}15`, color: svc.color, 
                        marginBottom: 0, flexShrink: 0, width: 58, height: 58, 
                        fontSize: 30 
                      }}
                    >
                      {svc.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Title level={4} style={{ marginBottom: 12, fontSize: 25 }}>{svc.title}</Title>
                      <ul className="qs-benefits" style={{ marginBottom: 0 }}>
                        {svc.benefits.map((b, j) => (
                          <li key={j}>
                            <FaCircleCheck style={{ color: svc.color, fontSize: 16 }} />
                            <span style={{ fontSize: 18 }}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div className="section-padding fade-in-section">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2} className="custom-title">Dịch Vụ Nổi Bật</Title>
            <Paragraph style={{ fontSize: '16px', color: '#8c8c8c' }}>
              Đa dạng dịch vụ y tế chuyên sâu, đáp ứng mọi nhu cầu chăm sóc sức khỏe của bạn.
            </Paragraph>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: 16, color: '#8c8c8c' }}>Đang tải dịch vụ...</Paragraph>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {displayedServices.map((item, idx) => {
                const khoaName = item.chuyen_khoa?.ten_chuyen_khoa || "";
                const meta = getMeta(khoaName);
                return (
                  <Col xs={24} sm={12} md={8} key={item.id_dich_vu}>
                    <div className="service-image-card"
                      onClick={() => navigate(`/dich-vu/${item.id_dich_vu}`)}
                    >
                      {item.hinh_anh ? (
                        <img src={item.hinh_anh} alt={item.ten_dich_vu} />
                      ) : (
                        <div className="service-icon-fallback" style={{ color: meta.color }}>
                          {meta.icon}
                        </div>
                      )}
                      <div className="service-name-bar">
                        {item.ten_dich_vu}
                      </div>
                      <div className="service-overlay">
                        <p>{item.mo_ta_ngan || stripHtml(item.mo_ta)}</p>
                        <button className="overlay-btn" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dich-vu/${item.id_dich_vu}`);
                        }}>
                          Xem chi tiết <FaArrowRight />
                        </button>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>

        <div className="section-padding fade-in-section" style={{ backgroundColor: '#f8fbff' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={10} >
              <Title level={2} style={{ marginBottom: '24px', fontSize: '35px', color: '#1677ff' }}>Tại Sao Nên Chọn <br /> Phòng Khám An Tâm?</Title>
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
                    <Card className="floating-card" style={{ height: "100%", borderRadius: "20px", textAlign: "center", }}>
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center",}}>
                        <div className="reason-icon-wrapper" style={{ color: reason.color, fontSize: 60}} >
                          {reason.icon}
                        </div>
                        <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
                          {reason.title}
                        </Title>
                        <Text type="secondary">{reason.desc}</Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>

        <div style={{ 
          padding: '40px 24px', 
          backgroundColor: '#d3e9ff',
          borderRadius: 20,
        }}>
          <Row gutter={[32, 32]} justify="center" align="middle">
            {statsData.map((item, index) => (
              <Col xs={24} sm={12} md={6} key={index} style={{ textAlign: 'center' }}>
                <Title 
                  level={1} 
                  style={{ 
                    margin: 0, 
                    fontSize: 42, 
                    fontWeight: 800, 
                    color: '#1677ff',
                    lineHeight: 1.2
                  }}
                >
                  <AnimatedCounter value={item.value} />
                </Title>
                
                <Text 
                  strong 
                  style={{ 
                    display: 'block', 
                    fontSize: 16, 
                    color: '#1f1f1f', 
                    marginTop: 8,
                    marginBottom: 4
                  }}
                >
                  {item.label}
                </Text>
                
                <Text 
                  style={{ 
                    fontSize: 13, 
                    color: '#8c8c8c', 
                    display: 'block',
                    lineHeight: 1.4 
                  }}
                >
                  {item.desc}
                </Text>
              </Col>
            ))}
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
            <div style={{ textAlign: 'center' }}>
              <div className="doctor-slider-container">
                <div
                  className="doctor-slider-track"
                  style={{ transform: `translateX(-${currentDoctorIndex * (100 / 3)}%)` }}
                >
                  {bacSiOnly.map((doc) => (
                    <div className="doctor-slide-card" key={doc.id_nhan_vien}>
                      <Card className="doctor-card" style={{ border: '1px solid #1677ff', height: '100%' }}>
                        <div style={{ textAlign: 'center', padding: '20px 0 0' }}>
                          <Avatar size={100} src={doc.hinh_anh}
                            icon={!doc.hinh_anh ? <FaUserDoctor /> : undefined}
                            style={{ backgroundColor: '#1677ff' }}
                          />
                        </div>
                        <Card.Meta
                          style={{ textAlign: 'center', marginTop: 16 }}
                          title={<Title level={4} style={{ margin: 0 }}>{doc.ten_nhan_vien}</Title>}
                          description={
                            <Space orientation="vertical" size={4} style={{ width: '100%', marginTop: '8px' }}>
                              <Text strong style={{ color: '#1677ff' }}>{doc.chuc_vu || 'Bác sĩ'}</Text>
                              {doc.chuyen_khoa && (
                                <Text type="secondary">{doc.chuyen_khoa.ten_chuyen_khoa}</Text>
                              )}
                              <Divider style={{ margin: '12px 0' }} />
                              <Button block type="primary" ghost icon={<FaCalendarCheck />}
                                onClick={() => navigate(`/booking?doctorId=${doc.id_nhan_vien}`)}
                              >
                                Đặt lịch hẹn
                              </Button>
                            </Space>
                          }
                        />
                      </Card>
                    </div>
                  ))}
                </div>
                <div className="doctor-dots">
                  {bacSiOnly.map((_, idx) => (
                    <button
                      key={idx}
                      className={`doctor-dot${idx === currentDoctorIndex ? ' active' : ''}`}
                      onClick={() => setCurrentDoctorIndex(Math.min(idx, Math.max(0, bacSiOnly.length - 3)))}
                    />
                  ))}
                </div>
              </div>
            </div>
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
