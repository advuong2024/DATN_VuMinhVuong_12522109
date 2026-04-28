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
          toast.success("Updated!");
        } else {
          await createSpecialty(values);
          toast.success("Created!");
        }
      } else {
        const type =
          activeTab === "medicine" ? "THUOC" : "DICH_VU";

        if (editingRecord) {
          await updateCategory(editingRecord.key, values);
          toast.success("Updated!");
        } else {
          await createCategory({ ...values, type });
          toast.success("Created!");
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
    { title: "Category Name", dataIndex: "name", width: 250 },

    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },

    {
      title: "Type",
      dataIndex: "type",
      width: 200,
      render: (t) =>
        TYPE_OPTIONS.find((x) => x.value === t)?.label,
    },

    {
      title: "Actions",
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
    { title: "Specialty Name", dataIndex: "name", width: 350 },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Actions",
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
    if (activeTab === "medicine") return "MEDICINE CATEGORY";
    if (activeTab === "service") return "SERVICE CATEGORY";
    return "SPECIALTY";
  };

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3>Category Management</h3>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Category Medicine" key="medicine">
          <Header onAdd={handleAdd} onSearch={setSearchText} />
          <DataTable columns={columns} data={filteredData} />
        </TabPane>

        <TabPane tab="Category Service" key="service">
          <Header onAdd={handleAdd} onSearch={setSearchText} />
          <DataTable columns={columns} data={filteredData} />
        </TabPane>

        <TabPane tab="Specialty" key="specialty">
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
            {editingRecord ? "UPDATE" : "ADD"} {getTitle()}
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
          {getTitle()} DETAIL
        </div>}
      >
        {viewRecord && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">
              {viewRecord.name}
            </Descriptions.Item>

            <Descriptions.Item label="Description">
              {viewRecord.description}
            </Descriptions.Item>

            {activeTab !== "specialty" && (
              <Descriptions.Item label="Type">
                {TYPE_OPTIONS.find(x => x.value === viewRecord.type)?.label}
              </Descriptions.Item>
            )}
          </Descriptions>
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
          placeholder="Search by name" 
          onChange={(e) => onSearch(e.target.value)}
        />
      </Col>

      <Col>
        <Button
          style={{ marginLeft: 10, backgroundColor: "#af050e" }}
          onClick={onAdd}
        >
          ADD
        </Button>
      </Col>
    </Row>
  );
}