import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Avatar,
  Progress,
  Tag,
  Button,
  Select,
  Spin,
} from "antd";

import {
  TeamOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  RiseOutlined,
} from "@ant-design/icons";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";

import dayjs from "dayjs";

import {
  getDashboardData,
  getRevenueChartData,
  getSpecialtyStats,
} from "../API/DashboardApi";

const { Content } = Layout;

export default function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [loading, setLoading] =
    useState(false);

  const [dashboard, setDashboard] =
    useState({
      summary: {},
      recentPatients: [],
      performance: {},
    });

  const [range, setRange] =
    useState("7");

  const [revenueData, setRevenueData] =
    useState([]);

  const [specialtyStats, setSpecialtyStats] =
    useState([]);

  const now = new Date();
  const [specialtyMonth, setSpecialtyMonth] = useState(now.getMonth() + 1);
  const [specialtyYear, setSpecialtyYear] = useState(now.getFullYear());

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    fetchSpecialtyStats();
  }, [specialtyMonth, specialtyYear]);

  useEffect(() => {
    fetchRevenueChart();
  }, [range]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res =
        await getDashboardData();

      setDashboard(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialtyStats = async () => {
    try {
      const res = await getSpecialtyStats({ month: specialtyMonth, year: specialtyYear });
      setSpecialtyStats(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRevenueChart = async () => {
    try {
      const res = await getRevenueChartData({ range });

      const grouped = {};

      res.data.data.forEach((item) => {
        const date = dayjs(item.date);

        let key;

        if (range === "30") {
          const week = Math.ceil(date.date() / 7);
          key = `Week ${week}`;
        } else {
          key = date.format("DD/MM");
        }

        if (!grouped[key]) {
          grouped[key] = 0;
        }

        grouped[key] += Number(item.revenue);
      });

      const mapped = Object.entries(grouped).map(
        ([key, value]) => ({
          name: key,
          revenue: value,
        })
      );

      setRevenueData(mapped);
    } catch (error) {
      console.log(error);
    }
  };

  const patientColumns = [
    {
      title: "Bệnh nhân",
      dataIndex: "name",
      key: "name",

      render: (text) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Avatar icon={<UserOutlined />} />
          {text}
        </div>
      ),
    },

    {
      title: "Bác sĩ",
      dataIndex: "doctor",
      key: "doctor",
    },

    {
      title: "Ngày hẹn",
      dataIndex: "date",
      key: "date",
    },

    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",

        render: (status) => {
            let color = "default";
            let text = status;

            if (status === "CHO_KHAM") {
            color = "orange";
            text = "Chờ khám";
            }

            if (status === "DANG_KHAM") {
            color = "blue";
            text = "Đang khám";
            }

            if (status === "HOAN_THANH") {
            color = "green";
            text = "Hoàn thành";
            }

            if (status === "DA_HUY") {
            color = "red";
            text = "Đã hủy";
            }

            return (
            <Tag color={color}>
                {text}
            </Tag>
            );
        },
    },
  ];

  const patientData = useMemo(() => {
    return (
      dashboard.recentPatients?.map(
        (item) => ({
          key: item.id_phieu_kham,

          name:
            item.benh_nhan
              ?.ten_benh_nhan,

          doctor:
            item.bac_si
              ?.ten_nhan_vien,

          date: dayjs(
            item.ngay_kham
          ).format("DD/MM/YYYY"),

          status: item.trang_thai,
        })
      ) || []
    );
  }, [dashboard]);

  if (user?.vai_tro !== "ADMIN") {
    return (
      <Layout
        style={{
          minHeight: "82vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fb",
        }}
      >
        <Card
          variant ={false}
          style={{
            width: 500,
            borderRadius: 20,
            textAlign: "center",
            padding: 20,
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              marginBottom: 10,
              color: "#0f172a",
            }}
          >
            Xin chào,{" "}
            {
              user?.nhan_vien
                ?.ten_nhan_vien
            }
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "#64748b",
              margin: 0,
            }}
          >
            Chúc bạn một ngày làm việc
            hiệu quả và tràn đầy năng lượng.
          </p>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <Content style={{ margin: 20 }}>
        <Spin spinning={loading}>
          <Row gutter={[20, 20]}>
            <Col
              xs={24}
              sm={12}
              lg={6}
            >
              <Card
                variant ={false}
                style={{
                  borderRadius: 16,
                }}
              >
                <Statistic
                  title="Tổng bệnh nhân"
                  value={
                    dashboard.summary
                      ?.totalPatients || 0
                  }
                  prefix={
                    <TeamOutlined />
                  }
                />
              </Card>
            </Col>

            <Col
              xs={24}
              sm={12}
              lg={6}
            >
              <Card
                bordered={false}
                style={{
                  borderRadius: 16,
                }}
              >
                <Statistic
                  title="Bác sĩ"
                  value={
                    dashboard.summary
                      ?.totalDoctors || 0
                  }
                  prefix={
                    <UserOutlined />
                  }
                />
              </Card>
            </Col>

            <Col
              xs={24}
              sm={12}
              lg={6}
            >
              <Card
                bordered={false}
                style={{
                  borderRadius: 16,
                }}
              >
                <Statistic
                  title="Lịch hẹn hôm nay"
                  value={
                    dashboard.summary
                      ?.todayAppointments ||
                    0
                  }
                  prefix={
                    <CalendarOutlined />
                  }
                />
              </Card>
            </Col>

            <Col
              xs={24}
              sm={12}
              lg={6}
            >
              <Card
                bordered={false}
                style={{
                  borderRadius: 16,
                }}
              >
                <Statistic
                  title="Doanh thu"
                  value={
                    Number(
                      dashboard.summary
                        ?.totalRevenue
                    ) || 0
                  }
                  prefix={
                    <DollarOutlined />
                  }
                  suffix="VNĐ"
                />
              </Card>
            </Col>
          </Row>

          <Row
            gutter={[20, 20]}
            style={{
              marginTop: 20,
            }}
          >
            <Col span={24}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 16,
                }}
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 10,
                    }}
                  >
                    <RiseOutlined />
                    Phân tích doanh thu
                  </div>
                }
                extra={
                  <Select
                    value={range}
                    onChange={setRange}
                    style={{
                      width: 150,
                    }}
                    options={[
                      {
                        label:
                          "7 ngày qua",
                        value: "7",
                      },

                      {
                        label:
                          "15 ngày qua",
                        value: "15",
                      },

                      {
                        label:
                          "1 tháng qua",
                        value: "30",
                      },
                    ]}
                  />
                }
              >
                <div
                  style={{
                    width: "100%",
                    height: 350,
                  }}
                >
                  <ResponsiveContainer>
                    <AreaChart
                      data={revenueData}
                    >
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1677ff"
                            stopOpacity={
                              0.4
                            }
                          />

                          <stop
                            offset="95%"
                            stopColor="#1677ff"
                            stopOpacity={
                              0
                            }
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="name" />

                      <YAxis />

                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1677ff"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
            <Col span={24}>
              <Card
                bordered={false}
                style={{ borderRadius: 16 }}
                title={
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>
                      Thống kê theo chuyên khoa
                    </span>
                    <Select
                      value={`${specialtyYear}-${String(specialtyMonth).padStart(2, "0")}`}
                      onChange={(val) => {
                        const [y, m] = val.split("-").map(Number);
                        setSpecialtyYear(y);
                        setSpecialtyMonth(m);
                      }}
                      style={{ width: 150 }}
                      options={(() => {
                        const opts = [];
                        const d = new Date();
                        for (let i = 0; i < 12; i++) {
                          const y = d.getFullYear();
                          const m = d.getMonth() + 1;
                          opts.push({
                            label: `Tháng ${m}/${y}`,
                            value: `${y}-${String(m).padStart(2, "0")}`,
                          });
                          d.setMonth(d.getMonth() - 1);
                        }
                        return opts;
                      })()}
                    />
                  </div>
                }
              >
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  {specialtyStats.map((khoa, idx) => {
                    const colors = [
                      "#1677ff", "#52c41a", "#faad14", "#ff4d4f",
                      "#722ed1", "#13c2c2", "#eb2f96", "#fa8c16",
                      "#2f54eb", "#a0d911",
                    ];
                    const c = colors[idx % colors.length];
                    return (
                      <Col xs={12} sm={8} md={6} lg={4} key={khoa.id_chuyen_khoa}>
                        <div style={{
                          background: `${c}08`,
                          borderRadius: 12,
                          border: `1px solid ${c}20`,
                          padding: "14px 12px",
                          textAlign: "center",
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1f1f1f", marginBottom: 8 }}>
                            {khoa.ten_chuyen_khoa}
                          </div>
                          <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>
                            {khoa.so_bac_si} Bác sĩ · {khoa.so_luot_kham} Lượt khám
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: c }}>
                            {Number(khoa.doanh_thu).toLocaleString()} VNĐ
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>

                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={specialtyStats}>
                      <CartesianGrid stroke="#e0e0e0" strokeDasharray="4 4" vertical={true} />
                      <XAxis 
                        dataKey="ten_chuyen_khoa" 
                        interval={0}
                        height={60}
                        tick={(props) => {
                          const { x, y, payload } = props;
                          const words = payload.value.split(" ");
                          if (words.length <= 2) {
                            return (
                              <text x={x} y={y + 16} textAnchor="middle" fill="#666" fontSize={12}>
                                {payload.value}
                              </text>
                            );
                          }
                          return (
                            <text x={x} y={y + 10} textAnchor="middle" fill="#666" fontSize={11}>
                              <tspan x={x} dy={0}>{words.slice(0, 2).join(" ")}</tspan>
                              <tspan x={x} dy={14}>{words.slice(2).join(" ")}</tspan>
                            </text>
                          );
                        }}
                      />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "doanh_thu") return [Number(value).toLocaleString() + " VNĐ", "Doanh thu"];
                          return [value, "Số lượt khám"];
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="so_luot_kham" name="Số lượt khám" fill="#1677ff" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="doanh_thu" name="Doanh thu" fill="#52c41a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row
            gutter={[20, 20]}
            style={{
              marginTop: 20,
            }}
          >
            <Col xs={24} lg={16}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 16,
                }}
                title="Phiếu khám gần đây"
                // extra={
                //   <Button type="primary">
                //     View All
                //   </Button>
                // }
              >
                <Table
                  columns={
                    patientColumns
                  }
                  dataSource={
                    patientData
                  }
                  pagination={false}
                />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 16,
                }}
                title="Hiệu suất phòng khám"
              >
                <div
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <p>
                    Tỷ lệ đặt lịch
                  </p>

                  <Progress
                    percent={
                      dashboard
                        .performance
                        ?.appointmentRate ||
                      0
                    }
                  />
                </div>

                <div
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <p>
                    Hài lòng
                    bệnh nhân
                  </p>

                  <Progress
                    percent={
                      dashboard
                        .performance
                        ?.patientSatisfaction ||
                      0
                    }
                    status="active"
                  />
                </div>

                <div>
                  <p>
                    Hoàn thành
                    điều trị
                  </p>

                  <Progress
                    percent={
                      dashboard
                        .performance
                        ?.completionRate ||
                      0
                    }
                    strokeColor="#52c41a"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Spin>
      </Content>
    </Layout>
  );
}