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
} from "recharts";

import dayjs from "dayjs";

import {
  getDashboardData,
  getRevenueChartData,
} from "../API/DashboardApi";

const { Content } = Layout;

export default function Dashboard() {
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

  useEffect(() => {
    fetchDashboard();
  }, []);

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

  const fetchRevenueChart = async () => {
    try {
        const res =
        await getRevenueChartData({
            range,
        });

        const mapped = res.data.data.map((item, index) => ({
            name:
            range === "30"
                ? `Week ${index + 1}`
                : dayjs(item.date).format(
                    "DD/MM"
                ),

            revenue: Number(
            item.revenue
            ),
        }));

        setRevenueData(mapped);
    } catch (error) {
        console.log(error);
    }
  };

  const patientColumns = [
    {
      title: "Patient",
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
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
    },

    {
      title: "Appointment Date",
      dataIndex: "date",
      key: "date",
    },

    {
        title: "Status",
        dataIndex: "status",
        key: "status",

        render: (status) => {
            let color = "default";
            let text = status;

            if (status === "CHO_KHAM") {
            color = "orange";
            text = "Waiting";
            }

            if (status === "DANG_KHAM") {
            color = "blue";
            text = "Examining";
            }

            if (status === "HOAN_THANH") {
            color = "green";
            text = "Completed";
            }

            if (status === "DA_HUY") {
            color = "red";
            text = "Cancelled";
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
                bordered={false}
                style={{
                  borderRadius: 16,
                }}
              >
                <Statistic
                  title="Total Patients"
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
                  title="Doctors"
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
                  title="Today's Appointments"
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
                  title="Revenue"
                  value={
                    Number(
                      dashboard.summary
                        ?.totalRevenue
                    ) || 0
                  }
                  prefix={
                    <DollarOutlined />
                  }
                  suffix="VND"
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
                    Revenue Analytics
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
                          "Last 7 Days",
                        value: "7",
                      },

                      {
                        label:
                          "Last 15 Days",
                        value: "15",
                      },

                      {
                        label:
                          "Last 1 Month",
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
                title="Recent Medical Records"
                extra={
                  <Button type="primary">
                    View All
                  </Button>
                }
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
                title="Clinic Performance"
              >
                <div
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <p>
                    Appointment Rate
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
                    Patient
                    Satisfaction
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
                    Completed
                    Treatments
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