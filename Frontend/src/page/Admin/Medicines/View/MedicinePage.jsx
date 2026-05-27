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
import MedicineForm from "./MedicineForm";
import { EyeOutlined, EditOutlined, DeleteOutlined, } from "@ant-design/icons";
import { UNIT_OPTIONS } from "../constants/medicine_option";
import {
  getMedicines, createMedicine,
  updateMedicine, deleteMedicine,
} from "../Api/MedicinesApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function MedicineManagement() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const role = JSON.parse(
    localStorage.getItem("user")
  );
  const isAdmin = role?.vai_tro === "ADMIN";
  const canManageMedicine = ["ADMIN", "BAC_SI"].includes(role);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);



  const fetchData = async () => {
    try {
      const res = await getMedicines();

      const formatted = res.data.map((item) => ({
        key: item.id_thuoc,
        name: item.ten_thuoc,
        price: item.gia,
        quantity: item.so_luong,
        unit: item.don_vi_tinh?.toUpperCase(),
        expiryDate: item.han_su_dung ? dayjs(item.han_su_dung) : null,
        category: item.danh_muc?.ten_danh_muc,
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = data.filter((item) => {
    const keyword = searchText.toLowerCase();

    return (
      item.name?.toLowerCase().includes(keyword) ||
      item.category?.toLowerCase().includes(keyword)
    );
  });

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);

    form.setFieldsValue({
      ...record,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
    });

    setOpen(true);
  };

  // const handleView = (record) => {
  //   setViewRecord(record);
  //   setOpenView(true);
  // };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xóa thuốc?",
      content: "Bạn có chắc chắn?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        await deleteMedicine(record.key);
        fetchData();
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await updateMedicine(editingRecord.key, values);
        toast.success("Cập nhật thành công!")
      } else {
        await createMedicine(values);
        toast.success("Tạo mới thành công!")
      }

      await fetchData();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi!");
    }
  };

  const columns = [
    { title: "Tên thuốc", dataIndex: "name", width: 200 },

    {
      title: "Giá",
      dataIndex: "price",
      width: 150,
      render: (p) => (p ? `${Number(p).toLocaleString()} VNĐ` : "0 VNĐ"),
    },

    { title: "Số lượng", dataIndex: "quantity", width: 120 },

    { 
      title: "ĐVT", 
      dataIndex: "unit", 
      width: 120, 
      render: (u) => {
        const found = UNIT_OPTIONS.find(
          (x) => x.value === u?.toUpperCase()
        );
        return found?.label || u || "-";
      }
    },

    {
      title: "Hạn sử dụng",
      dataIndex: "expiryDate",
      width: 150,
      align: "center",
      render: (d) => d ? dayjs(d).format("DD/MM/YYYY") : "-"
    },

    {
      title: "Danh mục",
      dataIndex: "category",
      width: 150,
    },

    {
      title: "Thao tác",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space>
          {/* <EyeOutlined
            style={{ color: "#1677ff", cursor: "pointer", marginRight: 8 }}
            onClick={() => handleView(record)}
          /> */}
          <EditOutlined
            style={{ color: "#faad14", cursor: "pointer", marginRight: 8 }}
            onClick={() => handleEdit(record)}
          />
          {
            isAdmin && (
              <DeleteOutlined
                style={{ color: "#ff4d4f", cursor: "pointer" }}
                onClick={() => handleDelete(record)}
              />
            )
          }
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3>Quản lý thuốc</h3>

      <Row justify="end" style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder="Tìm theo thuốc / danh mục"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col>
          <Button type="primary" style={{ marginLeft: 10, backgroundColor: "#af050e" }} onClick={handleAdd}>
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
        title={<div style={{ textAlign: "center" }}>
          {editingRecord ? "CẬP NHẬT" : "THÊM"} THUỐC
        </div>}
      >
        <MedicineForm
          form={form}
          initialValues={editingRecord}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* <Modal
        open={openView}
        onCancel={() => setOpenView(false)}
        footer={null}
        title={<div style={{ textAlign: "center" }}>MEDICINE DETAILS</div>}
      >
        {viewRecord && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên thuốc">
              {viewRecord.name}
            </Descriptions.Item>

            <Descriptions.Item label="Giá">
              {viewRecord.price
                ? `${Number(viewRecord.price).toLocaleString()} VND`
                : "—"
              }
            </Descriptions.Item>

            <Descriptions.Item label="Số lượng">
              {viewRecord.quantity}
            </Descriptions.Item>

            <Descriptions.Item label="ĐVT">
              {viewRecord.unit}
            </Descriptions.Item>

            <Descriptions.Item label="Hạn sử dụng">
              {dayjs(viewRecord.expiryDate).format("DD-MM-YYYY")}
            </Descriptions.Item>

            <Descriptions.Item label="Danh mục">
              { viewRecord.category }
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal> */}
    </div>
  );
}