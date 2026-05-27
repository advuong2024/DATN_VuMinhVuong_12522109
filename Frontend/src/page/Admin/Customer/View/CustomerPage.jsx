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
import CustomerForm from "./CustomerForm";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../Api/CustomerApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { customerUrl } from "@/routes/urls";

export default function PatientManagement() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData({ search });
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const role = user?.vai_tro;

  const filtered = data.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.includes(search)
  );

  const fetchData = async () => {
    try {
      const res = await getPatients();

      const formatted = res.data.map((item) => ({
        key: item.id_benh_nhan,
        name: item.ten_benh_nhan,
        dob: item.ngay_sinh,
        gender: item.gioi_tinh,
        phone: item.so_dien_thoai,
        address: item.dia_chi,
        medicalHistory: item.tien_su_benh,
        cccd: item.CCCD,
        email: item.email || "N/A",
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

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
    Modal.confirm({
      title: "Xóa bệnh nhân?",
      content: "Bạn có chắc chắn?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        await deletePatient(record.key);
        fetchData();
      },
    });
  };

  const handleChangeStatus = (value, record) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === record.key ? { ...item, status: value } : item
      )
    );

  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await updatePatient(editingRecord.key, values);
        toast.success("Cập nhật thành công!");
      } else {
        await createPatient(values);
        toast.success("Tạo mới thành công!");
      }

      setOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi!");
    }
  };

  const columns = [
    { title: "Họ và tên", dataIndex: "name", width: 190 },

    {
      title: "Ngày sinh",
      dataIndex: "dob",
      align: "center",
      width: 130,
      render: (d) => dayjs(d).format("DD/MM/YYYY"),
    },

    {
      title: "Giới tính",
      dataIndex: "gender",
      align: "center",
      width: 100,
      render: (g) => (g === "NAM" ? "Nam" : "Nữ"),
    },

    { title: "SĐT", dataIndex: "phone", width: 120 },

    {
      title: "CCCD",
      dataIndex: "cccd",
      width: 120,
      render: (cccd) => {
        if (!cccd) return "";
        return `${cccd.slice(0, 4)}****${cccd.slice(-4)}`;
      },
    },

    { title: "Email", dataIndex: "email", width: 170, ellipsis: true, },

    {
      title: "Địa chỉ",
      dataIndex: "address",
      ellipsis: true,
      width: 170,
    },
    {
      title: "Thao tác",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space>
          <Space>
            <EyeOutlined
              style={{ fontSize: 18, color: "#1677ff", cursor: "pointer", marginRight: 8 }}
              onClick={() => navigate(`${customerUrl}/${record.key}`)}
            />
            {
              ["ADMIN", "LE_TAN"].includes(role) && (
                <EditOutlined
                  style={{
                    fontSize: 18,
                    color: "#faad14",
                    cursor: "pointer",
                    marginRight: 8,
                  }}
                  onClick={() =>
                    handleEdit(record)
                  }
                />
              )
            }

            {
              role === "ADMIN" && (
                <DeleteOutlined
                  style={{
                    fontSize: 18,
                    color: "#ff4d4f",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleDelete(record)
                  }
                />
              )
            }
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3>Quản lý bệnh nhân</h3>

      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col span={5}>
          <Input
            placeholder="Tìm theo tên / SĐT"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col>
          {
            ["ADMIN", "LE_TAN"].includes(role) && ( 
              <Button
                type="primary"
                style={{ marginLeft: 10, backgroundColor: "#af050e" }}
                onClick={handleAdd}
              >
                THÊM
              </Button>
            )
          }
        </Col>
      </Row>

      <DataTable columns={columns} data={filtered} />

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={
          <div style={{ textAlign: "center" }}>
            {editingRecord ? "CẬP NHẬT" : "THÊM"} BỆNH NHÂN
          </div>
        }
        >
        <CustomerForm
          form={form}
          initialValues={editingRecord}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}