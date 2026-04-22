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
import { useState } from "react";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import DataTable from "@/components/common/DataTable";
import CategoryForm from "./CategoryForm";

const { TabPane } = Tabs;

export const TYPE_OPTIONS = [
  { label: "Thuốc", value: "MEDICINE" },
  { label: "Dịch vụ", value: "SERVICE" },
];

const medicineCategories = [
  {
    key: "1",
    name: "Kháng sinh",
    description: "Dùng để điều trị nhiễm khuẩn",
    type: "MEDICINE",
  },
];

const serviceCategories = [
  {
    key: "2",
    name: "Khám tổng quát",
    description: "Kiểm tra sức khỏe tổng thể",
    type: "SERVICE",
  },
];

const specialtyDataInit = [
  {
    key: "3",
    name: "Nội tổng quát",
    description: "Khám các bệnh lý nội khoa",
  },
];

export default function CategoryManagement() {
  const [activeTab, setActiveTab] = useState("medicine");

  const [dataMedicine, setDataMedicine] = useState(medicineCategories);
  const [dataService, setDataService] = useState(serviceCategories);
  const [dataSpecialty, setDataSpecialty] = useState(specialtyDataInit);

  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [editingRecord, setEditingRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);

  const [form] = Form.useForm();

  const currentData =
    activeTab === "medicine"
      ? dataMedicine
      : activeTab === "service"
      ? dataService
      : dataSpecialty;

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

  const handleDelete = (record) => {
    setCurrentData((prev) =>
      prev.filter((item) => item.key !== record.key)
    );
  };

  const handleSubmit = (values) => {
    if (editingRecord) {
      setCurrentData((prev) =>
        prev.map((item) =>
          item.key === editingRecord.key
            ? { ...item, ...values }
            : item
        )
      );
    } else {
      setCurrentData((prev) => [
        ...prev,
        { key: Date.now().toString(), ...values },
      ]);
    }

    setOpen(false);
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
          <DeleteOutlined
            style={{ color: "#ff4d4f", cursor: "pointer" }}
            onClick={() => handleDelete(record)}
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
          <Header onAdd={handleAdd} />
          <DataTable columns={columns} data={dataMedicine} />
        </TabPane>

        <TabPane tab="Category Service" key="service">
          <Header onAdd={handleAdd} />
          <DataTable columns={columns} data={dataService} />
        </TabPane>

        <TabPane tab="Specialty" key="specialty">
          <Header onAdd={handleAdd} />
          <DataTable columns={columnsSpecialty} data={dataSpecialty} />
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

function Header({ onAdd }) {
  return (
    <Row justify="end" style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Input placeholder="Search..." />
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