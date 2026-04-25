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
import { useState } from "react";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable";
import CustomerForm from "./CustomerForm";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const mockData = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    dob: "2000-01-01",
    gender: "NAM",
    phone: "0123456789",
    address: "Hà Nội",
    medicalHistory: "Không có",
    cccd: "012345678901",
    email: "a@gmail.com",
  },
];

export default function PatientManagement() {
  const [data, setData] = useState(mockData);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [form] = Form.useForm();

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

  const handleView = (record) => {
    setViewRecord(record);
    setOpenView(true);
  };

  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
  };

  const handleChangeStatus = (value, record) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === record.key ? { ...item, status: value } : item
      )
    );
  };

  const handleSubmit = (values) => {
    const newValues = {
      ...values,
      dob: values.dob.format("YYYY-MM-DD"),
    };

    if (editingRecord) {
      setData((prev) =>
        prev.map((item) =>
          item.key === editingRecord.key
            ? { ...item, ...newValues }
            : item
        )
      );
    } else {
      setData((prev) => [
        ...prev,
        { key: Date.now().toString(), ...newValues },
      ]);
    }

    setOpen(false);
  };

  const columns = [
    { title: "Full Name", dataIndex: "name", width: 190 },

    {
      title: "Date of Birth",
      dataIndex: "dob",
      align: "center",
      width: 150,
      render: (d) => dayjs(d).format("DD/MM/YYYY"),
    },

    {
      title: "Gender",
      dataIndex: "gender",
      align: "center",
      width: 100,
      render: (g) => (g === "NAM" ? "Nam" : "Nữ"),
    },

    { title: "Phone", dataIndex: "phone", width: 120 },

    {
      title: "CCCD",
      dataIndex: "cccd",
      width: 120,
      render: (cccd) => {
        if (!cccd) return "";
        return `${cccd.slice(0, 4)}****${cccd.slice(-4)}`;
      },
    },

    { title: "Email", dataIndex: "email", width: 170 },

    {
      title: "Address",
      dataIndex: "address",
      ellipsis: true,
      width: 170,
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
      <h3>Patient Management</h3>

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
            {editingRecord ? "UPDATE" : "ADD"} PATIENT
          </div>
        }
        >
        <CustomerForm
          form={form}
          initialValues={editingRecord}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={openView}
        onCancel={() => setOpenView(false)}
        footer={null}
        title={<div style={{ textAlign: "center" }}>Patient Details</div>}
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

            <Descriptions.Item label="CCCD">
              {viewRecord.cccd}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {viewRecord.email}
            </Descriptions.Item>

            <Descriptions.Item label="Address">
              {viewRecord.address}
            </Descriptions.Item>

            <Descriptions.Item label="Medical History">
              {viewRecord.medicalHistory}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}