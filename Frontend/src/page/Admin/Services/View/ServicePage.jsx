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
        shortDescription: item.mo_ta_ngan || null,
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
      content: "Bạn có chắc chắn?",
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
        toast.success("Cập nhật thành công!");
      } else {
        await createService(values);
        toast.success("Tạo mới thành công!");
      }
      fetchServices();
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi!");
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "hinh_anh",
      width: 100,
      align: "center",
      render: (url) =>
        url ? (
          <Image src={url} width={48} height={48} style={{ borderRadius: 8, objectFit: "cover" }} />
        ) : (
          <div style={{ width: 48, height: 48, borderRadius: 8, background: "#f0f0f0" }} />
        ),
    },
    { title: "Tên dịch vụ", dataIndex: "name", width: 230 },
    {
      title: "Giá",
      dataIndex: "price",
      width: 180,
      render: (p) => (p ? `${Number(p).toLocaleString()} VNĐ` : "0 VNĐ"),
    },
    { title: "Danh mục", dataIndex: "category", width: 180, },
    { title: "Chuyên khoa", dataIndex: "specialty", width: 180 },
    {
      title: "Mô tả ngắn",
      dataIndex: "shortDescription",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Thao tác",
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
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3>Quản lý dịch vụ</h3>

      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder="Tìm theo dịch vụ, danh mục, chuyên khoa"
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
            THÊM
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
            {editingRecord ? "CẬP NHẬT" : "THÊM"} DỊCH VỤ
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
        title={<div style={{ textAlign: "center" }}>CHI TIẾT DỊCH VỤ</div>}
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
              <Descriptions.Item label="Tên dịch vụ">
                {viewRecord.name}
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                {viewRecord.price
                  ? `${Number(viewRecord.price).toLocaleString()} VNĐ`
                  : "—"
                }
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                {viewRecord.category}
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên khoa">
                {viewRecord.specialty}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả ngắn">
                {viewRecord.shortDescription || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
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
