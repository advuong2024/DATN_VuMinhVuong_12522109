import {
  Space,
  Button,
  Input,
  Row,
  Col,
  Modal,
  Descriptions,
  Form,
  Image,
} from "antd";
import { useEffect, useState } from "react";
import DataTable from "@/components/common/DataTable";
import ServiceForm from "./ServiceForm";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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

  const fetchServices = async () => {
    try {
      const res = await getServices();
      const formatted = res.data.map((item) => ({
        key: item.id_dich_vu,
        name: item.ten_dich_vu,
        price: item.price || item.gia,
        category: item.danh_muc?.ten_danh_muc,
        categoryId: item.id_danh_muc,
        specialty: item.chuyen_khoa?.ten_chuyen_khoa,
        specialtyId: item.id_chuyen_khoa,
        description: item.mo_ta || null,
        hinh_anh: item.hinh_anh || null,
      }));

      setData(formatted);
      setFilteredData(formatted);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let temp = [...data];
      if (searchText) {
        const keyword = searchText.toLowerCase();
        temp = temp.filter(
          (item) =>
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
    const formValues = { ...record, category: record.categoryId, specialty: record.specialtyId };
    setEditingRecord(formValues);
    form.setFieldsValue(formValues);
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
        toast.success("Update!");
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
    {
      title: "Image",
      dataIndex: "hinh_anh",
      width: 90,
      align: "center",
      render: (url) =>
        url ? (
          <Image src={url} width={48} height={48} style={{ borderRadius: 8, objectFit: "cover" }} />
        ) : (
          <div style={{ width: 48, height: 48, borderRadius: 8, background: "#f0f0f0" }} />
        ),
    },
    { title: "Service Name", dataIndex: "name", width: 200 },
    {
      title: "Price",
      dataIndex: "price",
      width: 150,
      render: (p) => (p ? `${Number(p).toLocaleString()} VND` : "0 VND"),
    },
    { title: "Category", dataIndex: "category", width: 150 },
    { title: "Specialty", dataIndex: "specialty", width: 150 },
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
          <Button
            type="primary"
            style={{ marginLeft: 10, backgroundColor: "#af050e" }}
            onClick={handleAdd}
          >
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
        width={700}
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
          <>
            {viewRecord.hinh_anh && (
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <Image
                  src={viewRecord.hinh_anh}
                  alt={viewRecord.name}
                  width={300}
                  style={{ borderRadius: 12, objectFit: "cover" }}
                />
              </div>
            )}
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
                {viewRecord.category}
              </Descriptions.Item>
              <Descriptions.Item label="Specialty">
                {viewRecord.specialty}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {viewRecord.description ? (
                  <div className="tiptap-view" dangerouslySetInnerHTML={{ __html: viewRecord.description }} />
                ) : "—"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
}
