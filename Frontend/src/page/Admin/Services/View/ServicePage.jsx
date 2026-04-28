import {
  Space,
  Button,
  Input,
  Row,
  Col,
  Modal,
  Descriptions,
  Form,
} from "antd";
import { useEffect, useState } from "react";
import DataTable from "@/components/common/DataTable";
import ServiceForm from "./ServiceForm";
import { EyeOutlined, EditOutlined, DeleteOutlined, } from "@ant-design/icons";
import {
  getServices, createService,
  updateService, deleteService,
} from "../Api/ServicesApi";
import { toast } from "react-toastify";

export default function ServiceManagement() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await getServices();

      const formatted = res.data.map((item) => ({
        key: item.id_dich_vu,
        name: item.ten_dich_vu,
        price: item.price || item.gia,
        category: item.danh_muc?.ten_danh_muc,
        specialty: item.chuyen_khoa?.ten_chuyen_khoa,
        description: item.mo_ta || null,
      }));

      setData(formatted);
      setFilteredData(formatted);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      let temp = [...data];

      if (searchText) {
        const keyword = searchText.toLowerCase();

        temp = temp.filter((item) =>
          item.name?.toLowerCase().includes(keyword) ||
          item.category?.toLowerCase().includes(keyword) ||
          item.specialty?.toLowerCase().includes(keyword)
        );
      }

      setFilteredData(temp);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchText, data]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleView = (record) => {
    setViewRecord(record);
    setOpenView(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xóa dịch vụ?",
      content: "Bạn có chắc muốn xóa không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        await deleteService(record.key);
        fetchServices();
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await updateService(editingRecord.key, values);
        toast.success("Update!")
      } else {
        await createService(values);
        toast.success("Created!");
      }

      fetchServices();
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Error!");
    }
  };

  const columns = [
    { title: "Service Name", dataIndex: "name", width: 250 },

    {
      title: "Price",
      dataIndex: "price",
      width: 200,
      render: (p) =>
        p ? `${Number(p).toLocaleString()} VND` : "0 VND",
    },

    {
      title: "Category",
      dataIndex: "category",
      width: 200,
    },

    {
      title: "Specialty",
      dataIndex: "specialty",
      width: 200,
    },

    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },

    {
      title: "Actions",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space>
          <EyeOutlined
            style={{ color: "#1677ff", cursor: "pointer", marginRight: 8 }}
            onClick={() => handleView(record)}
          />
          <EditOutlined
            style={{ color: "#faad14", cursor: "pointer", marginRight: 8 }}
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            style={{ color: "#ff4d4f", cursor: "pointer" }}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3>Service Management</h3>

      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder="Search by service, category, specialty "
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col>
          <Button style={{ marginLeft: 10, backgroundColor: "#af050e" }} onClick={handleAdd}>
            ADD
          </Button>
        </Col>
      </Row>

      <DataTable columns={columns} data={filteredData} />

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={
          <div style={{ textAlign: "center" }}>
            {editingRecord ? "UPDATE" : "ADD"} SERVICE
          </div>
        }
      >
        <ServiceForm
          form={form}
          initialValues={editingRecord}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={openView}
        onCancel={() => setOpenView(false)}
        footer={null}
        title={<div style={{ textAlign: "center" }}>SERVICE DETAILS</div>}
      >
        {viewRecord && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Service Name">
              {viewRecord.name}
            </Descriptions.Item>

            <Descriptions.Item label="Price">
              {viewRecord.price
                ? `${Number(viewRecord.price).toLocaleString()} VND`
                : "—"
              }
            </Descriptions.Item>

            <Descriptions.Item label="Category">
              { viewRecord.category}
            </Descriptions.Item>

            <Descriptions.Item label="Specialty">
              { viewRecord.specialty}
            </Descriptions.Item>

            <Descriptions.Item label="Description">
              {viewRecord.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}