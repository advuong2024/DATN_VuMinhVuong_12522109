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
} from "@ant-design/icons";
import { SPECIALTY_OPTIONS, POSITION_OPTIONS } from "../Constants/doctor_option";
import { getDoctors, deleteDoctor } from "../Api/DoctorApi";
import { toast } from "react-toastify";

export default function PatientManagement() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDoctors();
  }, []);

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
        dob:  item.ngay_sinh ? dayjs(item.ngay_sinh) : null,

        position: item.chuc_vu,
        specialty: item.chuyen_khoa?.ten_chuyen_khoa || null,
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Load doctors failed");
    }
  }

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
        content: "Bạn có chắc muốn xóa không?",
        okText: "Xóa",
        cancelText: "Hủy",
        onOk: async () => {
          await deleteDoctor(record.key);
          fetchDoctors();
        },
      });
  };

  const handleView = (record) => {
    setViewRecord(record);
    setOpenView(true);
  };

  const handleChangeStatus = (value, record) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === record.key ? { ...item, status: value } : item
      )
    );
  };

  const columns = [
    { title: "Full Name", dataIndex: "name", width: 190, },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      align: "center",
      width: 150,
      render: (d) => d ? dayjs(d).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      align: "center",
      width: 100,
      render: (g) => (g === "NAM" ? "Nam" : "Nữ"),
    },
    { title: "Phone", dataIndex: "phone", width: 120 },
    { title: "Address", dataIndex: "address", ellipsis: true, width: 200 },
    {
      title: "Position",
      dataIndex: "position",
      width: 130,
      render: (p) =>
        POSITION_OPTIONS.find((x) => x.value === p)?.label,
    },
    {
      title: "Specialty",
      dataIndex: "specialty",
      width: 130,
      render: (value) =>
        value ? <Tag color="blue">{value}</Tag> : <Tag>Chưa có</Tag>
    },
    {
      title: "Actions",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space>
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
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3>Doctor Management</h3>

      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col span={5}>
          <Input placeholder="Search by name / phone" />
        </Col>

        <Col>
          <Button
            style={{ marginLeft: 10, backgroundColor: "#af050e" }}
            onClick={handleAdd}
          >
            ADD
          </Button>
        </Col>
      </Row>

      <DataTable columns={columns} data={data} />

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={
            <div style={{ textAlign: "center" }}>
            {editingRecord ? "UPDATE" : "ADD"} DOCTOR
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
        title={<div style={{ textAlign: "center" }}>DOCTOR DETAILS</div>}
      >
        {viewRecord && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Full Name">
              {viewRecord.name}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {dayjs(viewRecord.dob).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {viewRecord.gender === "NAM" ? "Nam" : "Nữ"}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {viewRecord.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {viewRecord.address}
            </Descriptions.Item>
            <Descriptions.Item label="Position">
              {
                POSITION_OPTIONS.find(
                  (x) => x.value === viewRecord.position
                )?.label
              }
            </Descriptions.Item>
            <Descriptions.Item label="Specialty">
              {
                SPECIALTY_OPTIONS.find(
                  (x) => x.value === viewRecord.specialty
                )?.label
              }
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}