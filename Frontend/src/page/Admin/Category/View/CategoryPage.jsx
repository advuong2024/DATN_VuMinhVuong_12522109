import {
  Tabs,
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
import { useState, useEffect  } from "react";
import { EyeOutlined, EditOutlined, DeleteOutlined, } from "@ant-design/icons";
import DataTable from "@/components/common/DataTable";
import CategoryForm from "./CategoryForm";
import { getCategories, createCategory, updateCategory } from "../Api/CategoryApi";
import { getSpecialties, createSpecialty, updateSpecialty } from "../Api/SpecialtyApi";
import { toast } from "react-toastify";

const { TabPane } = Tabs;

export const TYPE_OPTIONS = [
  { label: "Thuốc", value: "THUOC" },
  { label: "Dịch vụ", value: "DICH_VU" },
];

export default function CategoryManagement() {
  const [activeTab, setActiveTab] = useState("medicine");
  const [dataMedicine, setDataMedicine] = useState([]);
  const [dataService, setDataService] = useState([]);
  const [dataSpecialty, setDataSpecialty] = useState([]);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (activeTab === "medicine") fetchMedicine();
    else if (activeTab === "service") fetchService();
    else fetchSpecialty();
  }, [activeTab]);

  useEffect(() => {
    setSearchText("");
  }, [activeTab]);
  
  const fetchMedicine = async () => {
    try {
      const res = await getCategories({ type: "THUOC" });

      const data = res.data.map(item => ({
        key: item.id_danh_muc,
        name: item.ten_danh_muc,
        description: item.mo_ta,
        type: item.loai,
      }));

      setDataMedicine(data);
    } catch (err) {
      console.error("Fetch medicine error:", err);
    }
  };

  const fetchService = async () => {
    try {
      const res = await getCategories({ type: "DICH_VU" });

      const data = res.data.map(item => ({
        key: item.id_danh_muc,
        name: item.ten_danh_muc,
        description: item.mo_ta,
        type: item.loai,
      }));

      setDataService(data);
    } catch (err) {
      console.error("Fetch service error:", err);
    }
  };

  const fetchSpecialty = async () => {
    try {
      const res = await getSpecialties();

      const data = res.data.map(item => ({
        key: item.id_chuyen_khoa,
        name: item.ten_chuyen_khoa,
        description: item.mo_ta,
        hinh_anh: item.hinh_anh || null,
      }));

      setDataSpecialty(data);
    } catch (err) {
      console.error("Fetch specialty error:", err);
    }
  };

  const currentData =
    activeTab === "medicine"
      ? dataMedicine
      : activeTab === "service"
      ? dataService
      : dataSpecialty;

  const filteredData = currentData.filter(item =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const setCurrentData =
    activeTab === "medicine"
      ? setDataMedicine
      : activeTab === "service"
      ? setDataService
      : setDataSpecialty;

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

  const handleSubmit = async (values) => {
    try {
      if (activeTab === "specialty") {
        if (editingRecord) {
          await updateSpecialty(editingRecord.key, values);
          toast.success("Cập nhật thành công!");
        } else {
          await createSpecialty(values);
          toast.success("Tạo mới thành công!");
        }
      } else {
        const type =
          activeTab === "medicine" ? "THUOC" : "DICH_VU";

        if (editingRecord) {
          await updateCategory(editingRecord.key, values);
          toast.success("Cập nhật thành công!");
        } else {
          await createCategory({ ...values, type });
          toast.success("Tạo mới thành công!");
        }
      }

      fetchMedicine();
      fetchService();
      fetchSpecialty();
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { title: "Tên danh mục", dataIndex: "name", width: 250 },

    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
    },

    {
      title: "Loại",
      dataIndex: "type",
      width: 200,
      render: (t) =>
        TYPE_OPTIONS.find((x) => x.value === t)?.label,
    },

    {
      title: "Thao tác",
      align: "center",
      width: 150,
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

  const columnsSpecialty = [
    {
      title: "Ảnh",
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
    { title: "Tên chuyên khoa", dataIndex: "name", width: 350 },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      align: "center",
      width: 150,
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

  const getTitle = () => {
    if (activeTab === "medicine") return "DANH MỤC THUỐC";
    if (activeTab === "service") return "DANH MỤC DỊCH VỤ";
    return "CHUYÊN KHOA";
  };

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3>Quản lý danh mục</h3>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Danh mục thuốc" key="medicine">
          <Header onAdd={handleAdd} onSearch={setSearchText} />
          <DataTable columns={columns} data={filteredData} />
        </TabPane>

        <TabPane tab="Danh mục dịch vụ" key="service">
          <Header onAdd={handleAdd} onSearch={setSearchText} />
          <DataTable columns={columns} data={filteredData} />
        </TabPane>

        <TabPane tab="Chuyên khoa" key="specialty">
          <Header onAdd={handleAdd} onSearch={setSearchText} />
          <DataTable columns={columnsSpecialty} data={filteredData} />
        </TabPane>
      </Tabs>

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={
          <div style={{ textAlign: "center" }}>
            {editingRecord ? "CẬP NHẬT" : "THÊM"} {getTitle()}
          </div>
        }
      >
        <CategoryForm
          form={form}
          initialValues={editingRecord}
          onSubmit={handleSubmit}
          activeTab={activeTab}
        />
      </Modal>

      <Modal
        open={openView}
        onCancel={() => setOpenView(false)}
        footer={null}
        title={<div style={{ textAlign: "center" }}>
          CHI TIẾT {getTitle()}
        </div>}
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
              <Descriptions.Item label="Tên">
                {viewRecord.name}
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả">
                {viewRecord.description}
              </Descriptions.Item>

              {activeTab !== "specialty" && (
                <Descriptions.Item label="Loại">
                  {TYPE_OPTIONS.find(x => x.value === viewRecord.type)?.label}
                </Descriptions.Item>
              )}
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
}

function Header({ onAdd, onSearch }) {
  return (
    <Row justify="end" style={{ marginBottom: 16 }}>
      <Col span={5}>
        <Input 
          placeholder="Tìm theo tên" 
          onChange={(e) => onSearch(e.target.value)}
        />
      </Col>

      <Col>
        <Button
          type="primary"
          style={{ marginLeft: 10, backgroundColor: "#af050e" }}
          onClick={onAdd}
        >
          THÊM
        </Button>
      </Col>
    </Row>
  );
}