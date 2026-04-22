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
import { useState } from "react";
import DataTable from "@/components/common/DataTable";
import ServiceForm from "./ServiceForm";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const mockData = [
  {
    key: "1",
    name: "Khám tổng quát",
    price: 200000,
    category: "KHAM",
    description: "Khám sức khỏe tổng quát",
  },
];

export const CATEGORY_OPTIONS = [
  { label: "Khám bệnh", value: "KHAM" },
  { label: "Xét nghiệm", value: "XET_NGHIEM" },
  { label: "Phẫu thuật", value: "PHAU_THUAT" },
];

export default function ServiceManagement() {
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
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleView = (record) => {
    setViewRecord(record);
    setOpenView(true);
  };

  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
  };

  const handleSubmit = (values) => {
    if (editingRecord) {
      setData((prev) =>
        prev.map((item) =>
          item.key === editingRecord.key ? { ...item, ...values } : item
        )
      );
    } else {
      setData((prev) => [
        ...prev,
        { key: Date.now().toString(), ...values },
      ]);
    }

    setOpen(false);
  };

  const columns = [
    { title: "Service Name", dataIndex: "name", width: 250 },

    {
      title: "Price",
      dataIndex: "price",
      width: 200,
      render: (p) => `${p.toLocaleString()} VND`,
    },

    {
      title: "Category",
      dataIndex: "category",
      width: 200,
      render: (c) =>
        CATEGORY_OPTIONS.find((x) => x.value === c)?.label,
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
          <Input placeholder="Search service..." />
        </Col>

        <Col>
          <Button style={{ marginLeft: 10, backgroundColor: "#af050e" }} onClick={handleAdd}>
            ADD
          </Button>
        </Col>
      </Row>

      <DataTable columns={columns} data={data} />

      {/* ADD / EDIT */}
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

      {/* VIEW */}
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
              {viewRecord.price.toLocaleString()} VND
            </Descriptions.Item>

            <Descriptions.Item label="Category">
              {
                CATEGORY_OPTIONS.find(
                  (x) => x.value === viewRecord.category
                )?.label
              }
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