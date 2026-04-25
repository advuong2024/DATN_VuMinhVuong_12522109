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
  Tooltip,
} from "antd";
import { useState, useEffect } from "react";
import DataTable from "@/components/common/DataTable";
import AccountForm from "./AccountForm";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { 
  getAccounts, updateAccount, updateAccountStatus, 
  createAccount, resetPassword, updateAccountRole 
} from "../Api/AccountApi";
import { toast } from "react-toastify";
import { ROLE_OPTIONS } from "../Constants/account_option"

const STATUS_OPTIONS = [
  { label: "Active", value: "HOAT_DONG", color: "#52c41a" },
  { label: "Locked", value: "KHOA", color: "#ff4d4f" },
];

export default function AccountManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    let temp = [...data];

    if (searchText) {
      temp = temp.filter(item =>
        item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.username?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      temp = temp.filter(item => item.status === statusFilter);
    }

    setFilteredData(temp);
  }, [searchText, statusFilter, data]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await getAccounts();

      const mapped = res.data.map((item) => ({
        id: item.id_tai_khoan,
        name: item.nhan_vien?.ten_nhan_vien || "N/A",
        employeeId: item.nhan_vien?.id_nhan_vien,
        username: item.username,
        password: item.password,
        role: item.vai_tro,
        status: item.trang_thai,
      }));

      setData(mapped);
      setFilteredData(mapped);
    } catch (err) {
      toast.error("Load failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (record) => {
    Modal.confirm({
      title: "Xác nhận reset mật khẩu?",
      content: "Mật khẩu sẽ được đặt lại về 123456",
      onOk: async () => {
        try {
          await resetPassword(record.id, "123456");
          toast.success("Đã reset");
        } catch {
          toast.error("Lỗi");
        }
      },
    });
  };

  const getRoleLabel = (value) => {
    return ROLE_OPTIONS.find(r => r.value === value)?.label || value;
  };

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
      render: (role, record) => (
        <Select
            value={role}
            style={{ width: 130 }}
            onChange={(value) => handleChangeRole(value, record)}
            options={ROLE_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label
            }))}
            labelRender={(option) => {
                const opt = ROLE_OPTIONS.find(o => o.value === option.value);
                return (
                  opt?.label
                );
            }}
        />
      ),
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
          <Tooltip title="Show detail">
            <EyeOutlined
              style={{ fontSize: 18, color: "#1677ff", cursor: "pointer", marginRight: 8 }}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Reset password">
            <Button
              onClick={() => handleResetPassword(record)}
              type="primary"
              danger
            >
              Reset
            </Button>
          </Tooltip>
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
  
  const handleChangeStatus = async (value, record) => {
    try {
      await updateAccountStatus(record.id, value);
      toast.success("Updated!");
      fetchAccounts();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleChangeRole = async (value, record) => {
    try {
      await updateAccountRole(record.id, value);
      toast.success("Updated!");
      fetchAccounts();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await updateAccount(editingRecord.id, values);
        toast.success("Updated!");
      } else {
        await createAccount(values);
        toast.success("Created!");
      }

      fetchAccounts();
      setOpen(false);
    } catch (err) {
      toast.error("Error!");
    }
  };

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3 style={{ marginBottom: 16 }}>Account Management</h3>

      <Row gutter={16} justify="end" style={{ marginBottom: 16 }}>
        <Col span={5}>
          <Input
            placeholder="Search by name / username"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col span={3}>
          <Select
            placeholder="Select Status"
            style={{ width: "100%" }}
            allowClear
            options={STATUS_OPTIONS}
            onChange={(value) => setStatusFilter(value)}
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

      <DataTable columns={columns} data={filteredData} loading={false} />

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
                {viewRecord.status === "HOAT_DONG" ? "Active" : "Locked"}
              </Tag>
            </Descriptions.Item>
            </Descriptions>
        )}
      </Modal>

    </div>
  );
}