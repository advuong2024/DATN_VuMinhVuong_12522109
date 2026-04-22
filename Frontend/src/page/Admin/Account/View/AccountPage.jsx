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
} from "antd";
import { useState } from "react";
import DataTable from "@/components/common/DataTable";
import AccountForm from "./AccountForm";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const mockData = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    username: "admin01",
    password: "123456",
    role: "Admin",
    status: "HOAT_DONG",
  },
  {
    key: "2",
    name: "Trần Thị B",
    username: "staff01",
    password: "123456",
    role: "Staff",
    status: "NGUNG",
  },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "HOAT_DONG", color: "#52c41a" },
  { label: "Inactive", value: "NGUNG", color: "#ff4d4f" },
];

export default function AccountManagement() {
  const [data, setData] = useState(mockData);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      width: 230,
    },
    {
      title: "Account Name",
      dataIndex: "username",
      width: 180,
    },
    {
      title: "Password",
      dataIndex: "password",
      align: "center",
      width: 150,
      render: () => "••••••••",
    },
    {
      title: "Role",
      dataIndex: "role",
      align: "center",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      align: "center",
      render: (status, record) => (
        <Select
            value={status}
            style={{ width: 130 }}
            onChange={(value) => handleChangeStatus(value, record)}
            options={STATUS_OPTIONS.map((opt) => ({
                value: opt.value,
                label: <span style={{ color: opt.color }}>{opt.label}</span>,
            }))}
            labelRender={(option) => {
                const opt = STATUS_OPTIONS.find(o => o.value === option.value);
                return (
                <span style={{ color: opt?.color }}>
                    {opt?.label}
                </span>
                );
            }}
        />
      ),
    },
    {
      title: "Actions",
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
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    setViewRecord(record);
    setOpenView(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setOpen(true);
  };

  const handleDelete = (record) => {
    const newData = data.filter((item) => item.key !== record.key);
    setData(newData);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setOpen(true);
  };
  
  const handleChangeStatus = (value, record) => {
    const newData = data.map((item) =>
        item.key === record.key
        ? { ...item, status: value }
        : item
    );

    setData(newData);
  };

  const handleSubmit = (values) => {
    if (editingRecord) {
        setData(prev =>
        prev.map(item =>
            item.key === editingRecord.key ? { ...item, ...values } : item
        )
        );
    } else {
        setData(prev => [
        ...prev,
        { key: Date.now().toString(), ...values },
        ]);
    }

    setOpen(false);
  };

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3 style={{ marginBottom: 16 }}>Account Management</h3>

      <Row gutter={16} justify="end" style={{ marginBottom: 16 }}>
        <Col span={5}>
          <Input placeholder="Search by name / username" />
        </Col>

        <Col span={3}>
            <Select
                placeholder="Select Status"
                style={{ width: "100%" }}
                allowClear
                options={STATUS_OPTIONS}
            />
        </Col>

        <Col>
          <Button
            type="primary"
            style={{ backgroundColor: "#af050e" }}
            onClick={handleAdd}
          >
            ADD
          </Button>
        </Col>
      </Row>

      <DataTable columns={columns} data={data} loading={false} />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={
            <div style={{ textAlign: "center", width: "100%" }}>
                {editingRecord ? "UPDATE ACCOUNT" : "ADD ACCOUNT"}
            </div>
        }
      >
        <AccountForm
            initialValues={editingRecord}
            onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={openView}
        onCancel={() => setOpenView(false)}
        footer={null}
        title={
          <div style={{ textAlign: "center", fontWeight: 600 }}>
            Account Details
          </div>
        }
        >
        {viewRecord && (
            <Descriptions column={1} bordered>
            <Descriptions.Item label="Full Name">
                {viewRecord.name}
            </Descriptions.Item>

            <Descriptions.Item label="Username">
                {viewRecord.username}
            </Descriptions.Item>

            <Descriptions.Item label="Mật khẩu">
                <Space>
                    <span>
                    {showPassword ? viewRecord.password : "••••••••"}
                    </span>

                    {showPassword ? (
                    <EyeInvisibleOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(false)}
                    />
                    ) : (
                    <EyeOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(true)}
                    />
                    )}
                </Space>
            </Descriptions.Item>

            <Descriptions.Item label="Role">
                {viewRecord.role}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
                <Tag color={viewRecord.status === "HOAT_DONG" ? "green" : "red"}>
                {viewRecord.status === "HOAT_DONG" ? "Active" : "Inactive"}
                </Tag>
            </Descriptions.Item>
            </Descriptions>
        )}
      </Modal>

    </div>
  );
}