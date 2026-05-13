import { Layout, Row, Col } from "antd";

import {
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

export default function AppFooter() {
  return (
    <Footer
      style={{
        background: "#034ea5",
        color: "#fff",
        padding: "50px 60px 20px",
      }}
    >
      <Row
        gutter={[40, 40]}
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          paddingBottom: 40,
          marginBottom: 40,
        }}
      >
        <Col xs={24} md={7}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <img
              src="/logo.svg"
              alt="Logo"
              style={{
                width: 60,
                height: 60,
              }}
            />

            <div>
              <h3
                style={{
                  color: "#fff",
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                PHÒNG KHÁM ĐA KHOA
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#d9f2ff",
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                GENERAL CLINIC
              </p>
            </div>
          </div>

          <p
            style={{
              color: "#e6f7ff",
              lineHeight: 1.8,
              fontSize: 15,
              width: "50%",
            }}
          >
            Phòng khám đa khoa cung cấp dịch vụ chăm sóc
            sức khỏe toàn diện với đội ngũ bác sĩ giàu
            kinh nghiệm và hệ thống trang thiết bị hiện
            đại.
          </p>
        </Col>

        <Col xs={24} md={5}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div
              style={{
                minWidth: 44,
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "2px solid #fff",
                background: "#034ea5",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                boxShadow:
                  "0 8px 24px rgba(22,119,255,0.25)",
              }}
            >
              <ClockCircleOutlined
                style={{
                  fontSize: 24,
                  color: "#fff",
                }}
              />
            </div>
            
            <div>
              <h2
                style={{
                  color: "#fff",
                  margin: "0 0 10px",
                  fontWeight: 700,
                  fontSize: 24,
                }}
              >
                Giờ làm việc
              </h2>

              <p
                style={{
                  color: "#d9f2ff",
                  fontSize: 16,
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Buổi sáng: Từ 7h - 12h
                <br />
                Buổi chiều: Từ 13h - 17h
                <br />
                Trực cấp cứu: 24/24
              </p>
            </div>
          </div>
        </Col>

        <Col xs={24} md={5}>
          <h2
            style={{
              color: "#fff",
              marginBottom: 24,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Dịch vụ nổi bật
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {[
              "Khám tổng quát",
              "Xét nghiệm",
              "Khám tim mạch",
              "Tư vấn sức khỏe",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                />

                <span
                  style={{
                    color: "#d9f2ff",
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Col>

        <Col xs={24} md={7}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <EnvironmentOutlined
              style={{
                fontSize: 22,
                marginTop: 5,
              }}
            />

            <div>
              <h2
                style={{
                  color: "#fff",
                  marginBottom: 8,
                  fontSize: 24,
                }}
              >
                Cơ sở chính 
              </h2>

              <p
                style={{
                  color: "#d9f2ff",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Đường Nguyễn Thiện Thuật, Phường Nhân Hoà, Tỉnh Hưng Yên
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <PhoneOutlined
              style={{
                fontSize: 22,
              }}
            />

            <h2
              style={{
                color: "#fff",
                margin: 0,
                fontSize: 24,
              }}
            >
              Hotline: 1900 1234
            </h2>
          </div>
        </Col>
      </Row>

      <div
        style={{
          textAlign: "center",
          color: "#d9f2ff",
          fontSize: 15,
        }}
      >
        © {new Date().getFullYear()} Clinic Booking
        System. All rights reserved.
      </div>
    </Footer>
  );
}