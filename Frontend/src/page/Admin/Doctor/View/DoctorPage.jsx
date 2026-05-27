import {
  Space,
  Button,
  Input,
  Row,
  Col,
  Tag,
  Select,
  Modal,
  Descriptions,
  Form,
  DatePicker,
  Image,
  List,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable";
import CustomerForm from "./DoctorForm";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { SPECIALTY_OPTIONS, POSITION_OPTIONS } from "../Constants/doctor_option";
import { getDoctors, deleteDoctor, getCertificates } from "../Api/DoctorApi";
import { toast } from "react-toastify";

export default function PatientManagement() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [viewCerts, setViewCerts] = useState([]);
  const [form] = Form.useForm();

  const fetchDoctors = async () => {
    try {
      const res = await getDoctors();
      const list = res.data?.data || res.data || [];

      const formatted = list.map((item) => ({
        key: item.id_nhan_vien || item.id,
        name: item.ten_nhan_vien,
        phone: item.so_dien_thoai,
        address: item.dia_chi,
        gender: item.gioi_tinh,
        dob: item.ngay_sinh ? dayjs(item.ngay_sinh) : null,
        position: item.chuc_vu,
        specialty: item.chuyen_khoa?.ten_chuyen_khoa || null,
        degree: item.bang_cap || null,
        hinh_anh: item.hinh_anh || null,
        location: item.co_so || null,
        short_desc: item.mo_ta_ngan || null,
        experience: item.nam_kinh_nghiem || null,
        certificates: item.chung_chis || [],
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Tải danh sách bác sĩ thất bại");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      dob: record.dob ? dayjs(record.dob) : null,
    });
    setOpen(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xóa bác sĩ?",
      content: "Bạn có chắc chắn?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        await deleteDoctor(record.key);
        fetchDoctors();
      },
    });
  };

  const handleView = async (record) => {
    setViewRecord(record);
    try {
      const res = await getCertificates(record.key);
      setViewCerts(res.data || []);
    } catch {
      setViewCerts([]);
    }
    setOpenView(true);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "hinh_anh",
      width: 80,
      align: "center",
      render: (url) => (
        url
          ? <Image src={url} width={45} height={45} style={{ borderRadius: "50%", objectFit: "cover" }} />
          : <UserOutlined style={{ fontSize: 24, color: "#8c8c8c" }} />
      ),
    },
    { title: "Họ và tên", dataIndex: "name", width: 155 },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      align: "center",
      width: 130,
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      align: "center",
      width: 85,
      render: (g) => (g === "NAM" ? "Nam" : "Nữ"),
    },
    { title: "SĐT", dataIndex: "phone", width: 120 },
    { title: "Chức vụ", dataIndex: "position", width: 130, ellipsis: true },
    {
      title: "Chuyên khoa",
      dataIndex: "specialty",
      width: 130,
      render: (value) =>
        value ? <Tag color="blue">{value}</Tag> : <Tag>Không</Tag>,
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "experience",
      width: 120,
      align: "center",
      render: (v) => (v ? `${v} năm` : "-"),
    },
    {
      title: "Thao tác",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space>
          <EyeOutlined
            style={{ fontSize: 18, color: "#1677ff", cursor: "pointer", marginRight: 8 }}
            onClick={() => handleView(record)}
          />
          <EditOutlined
            style={{ fontSize: 18, color: "#faad14", cursor: "pointer", marginRight: 8 }}
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            style={{ fontSize: 18, color: "#ff4d4f", cursor: "pointer" }}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3>Quản lý bác sĩ</h3>

      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col span={5}>
          <Input placeholder="Tìm theo tên / SĐT" />
        </Col>
        <Col>
          <Button
            type="primary"
            style={{ marginLeft: 10, backgroundColor: "#af050e" }}
            onClick={handleAdd}
          >
            THÊM
          </Button>
        </Col>
      </Row>

      <DataTable columns={columns} data={data} />

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
        title={
          <div style={{ textAlign: "center" }}>
            {editingRecord ? "CẬP NHẬT" : "THÊM"} BÁC SĨ
          </div>
        }
      >
        <CustomerForm
          form={form}
          initialValues={editingRecord}
          onSuccess={() => {
            setOpen(false);
            fetchDoctors();
          }}
        />
      </Modal>

      <Modal
        open={openView}
        onCancel={() => setOpenView(false)}
        footer={null}
        width={700}
        title={<div style={{ textAlign: "center" }}>CHI TIẾT BÁC SĨ</div>}
        centered
      >
        {viewRecord && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {viewRecord.hinh_anh ? (
                <Image src={viewRecord.hinh_anh} width={100} height={100} style={{ borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <UserOutlined style={{ fontSize: 80, color: "#8c8c8c" }} />
              )}
            </div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Họ và tên" span={2}>{viewRecord.name}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{viewRecord.dob ? dayjs(viewRecord.dob).format("DD/MM/YYYY") : "-"}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">{viewRecord.gender === "NAM" ? "Nam" : "Nữ"}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{viewRecord.phone}</Descriptions.Item>
              <Descriptions.Item label="Chức vụ">{viewRecord.position}</Descriptions.Item>
              <Descriptions.Item label="Chuyên khoa">{viewRecord.specialty || "-"}</Descriptions.Item>
              <Descriptions.Item label="Bằng cấp">{viewRecord.degree || "-"}</Descriptions.Item>
              <Descriptions.Item label="Kinh nghiệm">{viewRecord.experience ? `${viewRecord.experience} năm` : "-"}</Descriptions.Item>
              <Descriptions.Item label="Cơ sở">{viewRecord.location || "-"}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>{viewRecord.address || "-"}</Descriptions.Item>
              <Descriptions.Item label="Mô tả ngắn" span={2}>{viewRecord.short_desc || "-"}</Descriptions.Item>
            </Descriptions>

            {(viewCerts.length > 0) && (
              <div style={{ marginTop: 20 }}>
                <h4>Chứng chỉ</h4>
                <List
                  size="small"
                  dataSource={viewCerts}
                  renderItem={(cc) => (
                    <List.Item>
                      <Space>
                        <SafetyCertificateOutlined style={{ color: "#52c41a" }} />
                        <span><strong>{cc.ten_chung_chi}</strong></span>
                        {cc.noi_cap && <span>{cc.noi_cap}</span>}
                        {cc.nam_cap && <span>({cc.nam_cap})</span>}
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
