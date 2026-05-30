import {
  Space,
  Button,
  Input,
  Row,
  Col,
  Tag,
  DatePicker,
  Card,
  Empty,
  Form,
  Modal, Descriptions, Table,
  Breadcrumb
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable";
import { EyeOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getMedicalHistoriesByPatient, getPatientById,
  getMedicalHistoryById
 } from "../../Api/CustomerApi";
import { useNavigate } from "react-router-dom";

export default function MedicalHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [patient, setPatient] = useState(null);
  const [histories, setHistories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPatient();
      fetchHistories();
    }
  }, [id]);

  const fetchPatient = async () => {
    const res = await getPatientById(id);

    setPatient({
      name: res.data.ten_benh_nhan,
      phone: res.data.so_dien_thoai,
      dob: res.data.ngay_sinh,
      gender: res.data.gioi_tinh,
      address: res.data.dia_chi,
      cccd: res.data.CCCD,
      email: res.data.email,
      medical: res.data.tien_su_benh,
    });
  };

  const fetchHistories = async () => {
    const res = await getMedicalHistoriesByPatient(id);

    const formatted = res.data.map((item) => ({
      key: item.id_phieu_kham,
      symptoms: item.trieu_chung,
      diagnosis: item.chan_doan,
      status: item.trang_thai,
      createdAt: item.ngay_kham,
      doctor: item.bac_si?.ten_nhan_vien,
    }));

    setHistories(formatted);
    setFiltered(formatted);
  };

  const applyFilter = () => {
    let result = [...data];

    if (search) {
      result = result.filter(
        (item) =>
          item.patientName?.toLowerCase().includes(search.toLowerCase()) ||
          item.phone?.includes(search) ||
          item.symptoms?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      result = result.filter((item) => item.status === status);
    }

    setFiltered(result);
  };

  const columns = [
    {
      title: "Bác sĩ",
      dataIndex: "doctor",
      width: 140,
    },
    {
      title: "Triệu chứng",
      dataIndex: "symptoms",
      width: 145,
      ellipsis: true,
    },
    {
      title: "Chẩn đoán",
      dataIndex: "diagnosis",
      width: 145,
      ellipsis: true,
    },
    {
      title: "Ngày",
      dataIndex: "createdAt",
      align: "center",
      width: 100,
      render: (d) => dayjs(d).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (v) => {
        const color =
          v === "DA_KHAM" ? "green" :
          v === "DANG_KHAM" ? "blue" : "red";

        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: "Thao tác",
      width: 70,
      align: "center",
      render: (_, record) => (
        <EyeOutlined
          style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
          onClick={async() => {
            const res = await getMedicalHistoryById(record.key);
            setDetail(res.data);
            setOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          Quản lý bệnh nhân
        </Breadcrumb.Item>

        <Breadcrumb.Item>Lịch sử khám</Breadcrumb.Item>
      </Breadcrumb>

      {/* <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder="Search patient / phone / symptom"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col span={8}>
          <Space>
            <Button type="primary" onClick={() => setStatus("DA_KHAM")}>Examined</Button>
            <Button type="primary" onClick={() => setStatus("DANG_KHAM")}>Examining</Button>
            <Button type="primary" onClick={() => setStatus(null)}>All</Button>
          </Space>
        </Col>
      </Row> */}

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Thông tin bệnh nhân">
            {!patient ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    <span style={{ color: "#888", fontWeight: 500 }}>
                      Không có dữ liệu
                    </span>
                }
              />
            ) : (
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Họ tên">
                      <Input value={patient.name} disabled />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Ngày sinh">
                      <Input
                        value={
                          patient.dob
                            ? dayjs(patient.dob).format("DD/MM/YYYY")
                            : ""
                        }
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="SĐT">
                      <Input value={patient.phone} disabled />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Giới tính">
                      <Input
                        value={patient.gender === "NAM" ? "Nam" : "Nữ"}
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="CCCD">
                      <Input
                        value={patient.cccd ? `${patient.cccd.slice(0, 4)}****${patient.cccd.slice(-4)}` : ""}
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Email">
                      <Input value={patient.email || "N/A"} disabled />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Tiền sử bệnh">
                      <Input value={patient.medical || "N/A"} disabled />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Địa chỉ">
                      <Input value={patient.address} disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            )}
          </Card>
        </Col>

        <Col span={16}>
          <DataTable columns={columns} data={filtered} />
        </Col>
      </Row>

      <Modal
        centered
        title="Chi tiết phiếu khám"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        {!detail ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <span style={{ color: "#888", fontWeight: 500 }}>
                  Không có dữ liệu
                </span>
            }
          />
          ) : (
              <>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Bác sĩ">
                    {detail.bac_si?.ten_nhan_vien}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày">
                {dayjs(detail.created_at).format("DD/MM/YYYY")}
              </Descriptions.Item>

              <Descriptions.Item label="Triệu chứng">
                {detail.trieu_chung}
              </Descriptions.Item>

              <Descriptions.Item label="Chẩn đoán">
                {detail.chan_doan}
              </Descriptions.Item>

              <Descriptions.Item label="Ghi chú" span={2}>
                {detail.ghi_chu || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <h4 style={{ marginTop: 16 }}>Dịch vụ</h4>
            <Table
              size="small"
              pagination={false}
              dataSource={detail.chi_tiets || []}
              rowKey="id"
              columns={[
                {
                  title: "Tên dịch vụ",
                  dataIndex: ["dich_vu", "ten_dich_vu"],
                },
                {
                  title: "Số lượng",
                  dataIndex: "so_luong",
                },
                {
                  title: "Đơn giá",
                  dataIndex: ["dich_vu", "gia"],
                },
                {
                  title: "Loại",
                  dataIndex: "loai_chi_tiet",
                  render: (val) =>
                    val === "PHI_KHAM" ? "Phí khám" :
                    val === "DICH_VU" ? "Dịch vụ" : val || "-",
                }
              ]}
            />

            <h4 style={{ marginTop: 16 }}>Thuốc</h4>
            <Table
              size="small"
              pagination={false}
              dataSource={detail.don_thuoc?.chi_tiets || []}
              rowKey="id"
              columns={[
                {
                  title: "Tên thuốc",
                  dataIndex: ["thuoc", "ten_thuoc"],
                },
                {
                  title: "Số lượng",
                  dataIndex: "so_luong",
                },
                {
                  title: "Liều dùng",
                  dataIndex: "lieu_dung",
                },
              ]}
            />
          </>
        )}
      </Modal>
    </div>
  );
}