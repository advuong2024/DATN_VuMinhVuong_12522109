import React, { useState, useEffect } from "react";
import {
  Row, Col, Typography, Select, Input, Spin, Empty, Button, Avatar,
  Space, Tag, ConfigProvider, Breadcrumb, Pagination, Modal, Descriptions,
  List, Divider,
} from "antd";
import {
  SearchOutlined, CalendarOutlined, PhoneOutlined, MedicineBoxOutlined,
  StarOutlined, TeamOutlined, BookOutlined, SafetyCertificateOutlined,
  UserOutlined, RightOutlined, EnvironmentOutlined, CloseOutlined,
  RocketOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { getAllDoctors } from "../Api/DoctorApi";

const { Title, Text, Paragraph } = Typography;

const positionColors = {
  "Trưởng khoa": "red",
  "Phó khoa": "orange",
  "Bác sĩ": "blue",
  "Thạc sĩ": "purple",
  "Tiến sĩ": "green",
  "CKI": "cyan",
  "CKII": "cyan",
};

const getPositionColor = (position) => {
  if (!position) return "default";
  for (const [key, color] of Object.entries(positionColors)) {
    if (position.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return "default";
};

const formatPhone = (phone) => {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)}.${cleaned.slice(4, 7)}.${cleaned.slice(7)}`;
  }
  return phone;
};

const BADGES = [
  { icon: <RocketOutlined />, label: "Chuyên môn cao" },
  { icon: <CheckCircleOutlined />, label: "Giàu kinh nghiệm" },
  { icon: <SafetyCertificateOutlined />, label: "Tận tâm" },
];

const DoctorPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [page, setPage] = useState(1);
  const [modalDoctor, setModalDoctor] = useState(null);
  const pageSize = 9;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setError(null);
        const data = await getAllDoctors();
        setDoctors(data);
      } catch (err) {
        console.error("Lỗi tải danh sách bác sĩ:", err);
        setError("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const doctorKeywords = ["trưởng khoa", "phó khoa", "bác sĩ", "thạc sĩ", "tiến sĩ", "cki", "ckii"];
  const bacSiOnly = doctors.filter((doc) => {
    const title = (doc.chuc_vu || "").toLowerCase();
    return doctorKeywords.some((kw) => title.includes(kw));
  });

  const specialties = [...new Set(bacSiOnly.map((d) => d.chuyen_khoa?.ten_chuyen_khoa).filter(Boolean))];
  const locations = [...new Set(bacSiOnly.map((d) => d.co_so).filter(Boolean))];

  const filteredDoctors = bacSiOnly.filter((doc) => {
    const matchSearch = doc.ten_nhan_vien?.toLowerCase().includes(searchText.toLowerCase());
    const matchSpecialty = selectedSpecialty ? doc.chuyen_khoa?.ten_chuyen_khoa === selectedSpecialty : true;
    const matchLocation = selectedLocation ? doc.co_so === selectedLocation : true;
    return matchSearch && matchSpecialty && matchLocation;
  });

  const paginatedDoctors = filteredDoctors.slice((page - 1) * pageSize, page * pageSize);
  const totalDoctors = bacSiOnly.length;
  const isFiltered = searchText || selectedSpecialty || selectedLocation;

  const handleClearFilter = () => {
    setSearchText("");
    setSelectedSpecialty(null);
    setSelectedLocation(null);
    setPage(1);
  };

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
            background: "url(https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&q=80) center/cover no-repeat",
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
                Đội ngũ y bác sĩ
              </Text>
              <Title level={1} style={{
                color: "#fff", fontSize: "clamp(26px, 3.5vw, 40px)",
                fontWeight: 800, lineHeight: 1.2, marginBottom: 16,
              }}>
                Đội Ngũ Bác Sĩ
              </Title>
              <Paragraph style={{
                color: "rgba(255,255,255,0.7)", fontSize: 15,
                lineHeight: 1.8, marginBottom: 24, maxWidth: 600,
              }}>
                Quy tụ đội ngũ chuyên gia, bác sĩ giàu kinh nghiệm, tận tâm vì sức khỏe bệnh nhân
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

        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "#fff", borderRadius: 12, padding: 20, marginTop: -40,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0",
            position: "relative", zIndex: 2,
          }}>
            <Row gutter={[12, 12]} align="middle">
              <Col xs={24} md={6}>
                <Input
                  size="large"
                  placeholder="Tìm kiếm tên bác sĩ..."
                  prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                  value={searchText}
                  onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
                  allowClear
                  variant="filled"
                />
              </Col>
              <Col xs={12} md={5}>
                <Select
                  size="large"
                  placeholder="Chọn chuyên khoa"
                  style={{ width: "100%" }}
                  value={selectedSpecialty}
                  onChange={(v) => { setSelectedSpecialty(v); setPage(1); }}
                  allowClear
                  variant="filled"
                >
                  {specialties.map((s) => (
                    <Select.Option key={s} value={s}>{s}</Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={12} md={4}>
                <Select
                  size="large"
                  placeholder="Cơ sở"
                  style={{ width: "100%" }}
                  value={selectedLocation}
                  onChange={(v) => { setSelectedLocation(v); setPage(1); }}
                  allowClear
                  variant="filled"
                >
                  {locations.map((l) => (
                    <Select.Option key={l} value={l}>{l}</Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={9}>
                <Space style={{ width: "100%", justifyContent: "flex-end" }} wrap>
                  <Tag color="blue" style={{ borderRadius: 999, padding: "4px 12px", fontWeight: 500, }}>
                    Chuyên gia y tế
                  </Tag>
                  {isFiltered && (
                    <Button type="primary" style={{ padding: "10px 15px" }} icon={<CloseOutlined />} onClick={handleClearFilter}>
                      Xóa lọc
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>
          </div>
        </section>

        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: 16, color: "#8c8c8c" }}>Đang tải danh sách bác sĩ...</Paragraph>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Empty description={error} />
              <Button type="primary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Empty description={
                <Space direction="vertical" size={8}>
                  <Text strong style={{ fontSize: 16 }}>Không tìm thấy bác sĩ phù hợp</Text>
                  <Text type="secondary">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</Text>
                </Space>
              } />
              {isFiltered && <Button style={{ marginTop: 16 }} onClick={handleClearFilter}>Xóa bộ lọc</Button>}
            </div>
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {paginatedDoctors.map((doc) => (
                  <Col xs={24} sm={12} lg={8} key={doc.id_nhan_vien}>
                    <div style={{
                      background: "#fff", borderRadius: 16, overflow: "hidden",
                      border: "1px solid #f0f0f0", height: "100%",
                      display: "flex", flexDirection: "column",
                      transition: "all 0.3s ease",
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
                    >
                      <div style={{
                        background: "linear-gradient(135deg, #f0f5ff 0%, #e6f4ff 100%)",
                        padding: "32px 0 24px", textAlign: "center",
                      }}>
                        <Avatar
                          size={100}
                          src={doc.hinh_anh}
                          icon={!doc.hinh_anh ? <UserOutlined /> : undefined}
                          style={{ background: "#034ea5", color: "#fff", display: "inline-flex" }}
                        />
                        <div style={{ marginTop: 12, padding: "0 16px" }}>
                          <Tag color={getPositionColor(doc.chuc_vu)} style={{ borderRadius: 6, fontSize: 12, padding: "2px 10px" }}>
                            {doc.chuc_vu || "Bác sĩ"}
                          </Tag>
                        </div>
                      </div>

                      <div style={{ padding: "16px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <Title level={3} style={{
                          fontSize: 16, fontWeight: 700, color: "#1f1f1f",
                          margin: "0 0 4px", textAlign: "center",
                        }}>
                          {doc.ten_nhan_vien}
                        </Title>

                        {doc.bang_cap && (
                          <Text style={{
                            color: "#8c8c8c", fontSize: 12, display: "block",
                            textAlign: "center", marginBottom: 12,
                          }}>
                            {doc.bang_cap}
                          </Text>
                        )}

                        <div style={{ marginBottom: 12 }}>
                          {doc.chuyen_khoa && (
                            <Text style={{ fontSize: 13, color: "#595959", display: "block", marginBottom: 4 }}>
                              <MedicineBoxOutlined style={{ color: "#034ea5", marginRight: 6 }} />
                              {doc.chuyen_khoa.ten_chuyen_khoa}
                            </Text>
                          )}
                          {doc.co_so && (
                            <Text style={{ fontSize: 13, color: "#595959", display: "block", marginBottom: 4 }}>
                              <EnvironmentOutlined style={{ color: "#8c8c8c", marginRight: 6 }} />
                              {doc.co_so}
                            </Text>
                          )}
                          {doc.nam_kinh_nghiem && (
                            <Text style={{ fontSize: 13, color: "#595959", display: "block" }}>
                              <StarOutlined style={{ color: "#faad14", marginRight: 6 }} />
                              {doc.nam_kinh_nghiem} năm kinh nghiệm
                            </Text>
                          )}
                        </div>

                        {doc.mo_ta_ngan && (
                          <Paragraph style={{
                            fontSize: 13, color: "#8c8c8c", lineHeight: 1.6,
                            margin: "0 0 16px",
                            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}>
                            {doc.mo_ta_ngan}
                          </Paragraph>
                        )}

                        <Space style={{ marginTop: "auto", width: "100%", justifyContent: "space-between" }}>
                          <Button
                            type="link"
                            icon={<RightOutlined />}
                            style={{ fontSize: 13, padding: 0 }}
                            onClick={() => setModalDoctor(doc)}
                          >
                            Xem chi tiết
                          </Button>
                          <Button
                            type="primary"
                            size="small"
                            icon={<CalendarOutlined />}
                            style={{ borderRadius: 8, fontWeight: 600, height: 32, fontSize: 13 }}
                            onClick={() => navigate("/booking")}
                          >
                            Đặt lịch
                          </Button>
                        </Space>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              {filteredDoctors.length > pageSize && (
                <Pagination
                  current={page}
                  total={filteredDoctors.length}
                  pageSize={pageSize}
                  onChange={setPage}
                  style={{ textAlign: "center", marginTop: 40 }}
                  showSizeChanger={false}
                />
              )}
            </>
          )}
        </section>
      </main>

      <Modal
        title={null}
        open={!!modalDoctor}
        onCancel={() => setModalDoctor(null)}
        footer={null}
        width={600}
        centered
      >
        {modalDoctor && (
          <div style={{ padding: "8px 0" }}>
            <Space direction="vertical" style={{ width: "100%", textAlign: "center", marginBottom: 24 }}>
                <Avatar size={80} src={modalDoctor.hinh_anh} icon={!modalDoctor.hinh_anh ? <UserOutlined /> : undefined} style={{ background: "#034ea5", color: "#fff" }} />
              <div>
                <Title level={4} style={{ margin: "0 0 4px", fontSize: 18 }}>{modalDoctor.ten_nhan_vien}</Title>
                <Tag color={getPositionColor(modalDoctor.chuc_vu)} style={{ borderRadius: 6 }}>
                  {modalDoctor.chuc_vu || "Bác sĩ"}
                </Tag>
              </div>
            </Space>

            <Descriptions column={1} size="small" bordered
              styles={{
                label: { fontWeight: 600, background: "#f8fbff", width: 140 },
              }}
            >
              {modalDoctor.bang_cap && (
                <Descriptions.Item label="Bằng cấp">{modalDoctor.bang_cap}</Descriptions.Item>
              )}
              <Descriptions.Item label="Chuyên khoa">
                {modalDoctor.chuyen_khoa?.ten_chuyen_khoa || "Đa khoa"}
              </Descriptions.Item>
              {modalDoctor.co_so && (
                <Descriptions.Item label="Cơ sở">{modalDoctor.co_so}</Descriptions.Item>
              )}
              {modalDoctor.nam_kinh_nghiem && (
                <Descriptions.Item label="Kinh nghiệm">{modalDoctor.nam_kinh_nghiem} năm</Descriptions.Item>
              )}
              {modalDoctor.so_dien_thoai && (
                <Descriptions.Item label="Điện thoại">{formatPhone(modalDoctor.so_dien_thoai)}</Descriptions.Item>
              )}
              {modalDoctor.mo_ta_ngan && (
                <Descriptions.Item label="Mô tả">{modalDoctor.mo_ta_ngan}</Descriptions.Item>
              )}
            </Descriptions>

            {modalDoctor.chung_chis?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <Title level={5} style={{ fontSize: 15, marginBottom: 12 }}>Chứng chỉ</Title>
                <List
                  dataSource={modalDoctor.chung_chis}
                  renderItem={(cc) => (
                    <List.Item style={{ padding: "8px 0" }}>
                      <Space>
                        <SafetyCertificateOutlined style={{ color: "#52c41a" }} />
                        <div>
                          <Text strong style={{ fontSize: 13 }}>{cc.ten_chung_chi}</Text>
                          {cc.noi_cap && (
                            <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                              {cc.noi_cap}{cc.nam_cap ? ` - ${cc.nam_cap}` : ""}
                            </Text>
                          )}
                        </div>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            )}

            <Divider />
            <Button
              type="primary"
              block
              icon={<CalendarOutlined />}
              style={{ height: 42, borderRadius: 8, fontWeight: 600 }}
              onClick={() => { setModalDoctor(null); navigate("/booking"); }}
            >
              Đặt lịch khám với {modalDoctor.ten_nhan_vien}
            </Button>
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
};

export default DoctorPage;
