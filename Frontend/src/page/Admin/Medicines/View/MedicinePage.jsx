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
import MedicineForm from "./MedicineForm";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { UNIT_OPTIONS } from "../constants/medicine_option";

const mockData = [
  {
    key: "1",
    name: "Paracetamol",
    price: 50000,
    quantity: 100,
    unit: "VIEN",
    expiryDate: "2026-12-31",
    category: "GIAM_DAU",
  },
];

export const CATEGORY_OPTIONS = [
  { label: "Kháng sinh", value: "KHANG_SINH" },
  { label: "Giảm đau", value: "GIAM_DAU" },
  { label: "Vitamin", value: "VITAMIN" },
];

export default function MedicineManagement() {
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
    { title: "Medicine Name", dataIndex: "name", width: 200 },

    {
      title: "Price",
      dataIndex: "price",
      width: 150,
      render: (p) => `${p.toLocaleString()} VND`,
    },

    { title: "Quantity", dataIndex: "quantity", width: 120 },

    { 
        title: "Unit", 
        dataIndex: "unit", 
        width: 120, 
        render: (u) => UNIT_OPTIONS.find((x) => x.value === u)?.label,
    },

    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      width: 150,
    },

    {
      title: "Category",
      dataIndex: "category",
      width: 150,
      render: (c) =>
        CATEGORY_OPTIONS.find((x) => x.value === c)?.label,
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
      <h3>Medicine Management</h3>

      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input placeholder="Search medicine..." />
        </Col>

        <Col>
          <Button style={{ marginLeft: 10, backgroundColor: "#af050e" }} onClick={handleAdd}>
            ADD
          </Button>
        </Col>
      </Row>

      <DataTable columns={columns} data={data} />

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={<div style={{ textAlign: "center" }}>
          {editingRecord ? "UPDATE" : "ADD"} MEDICINE
        </div>}
      >
        <MedicineForm
          form={form}
          initialValues={editingRecord}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={openView}
        onCancel={() => setOpenView(false)}
        footer={null}
        title={<div style={{ textAlign: "center" }}>MEDICINE DETAILS</div>}
      >
        {viewRecord && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Medicine Name">
              {viewRecord.name}
            </Descriptions.Item>

            <Descriptions.Item label="Price">
              {viewRecord.price.toLocaleString()} VND
            </Descriptions.Item>

            <Descriptions.Item label="Quantity">
              {viewRecord.quantity}
            </Descriptions.Item>

            <Descriptions.Item label="Unit">
              {viewRecord.unit}
            </Descriptions.Item>

            <Descriptions.Item label="Expiry Date">
              {viewRecord.expiryDate}
            </Descriptions.Item>

            <Descriptions.Item label="Category">
              {
                CATEGORY_OPTIONS.find(
                  (x) => x.value === viewRecord.category
                )?.label
              }
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}