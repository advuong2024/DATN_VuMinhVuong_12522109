import {
  Input,
  Button,
  Tabs,
  Tag,
  Space,
  Modal,
} from "antd";
import { useState, useEffect } from "react";
import DataTable from "@/components/common/DataTable";
import { getBills, getBillDetails } from "../Api/BillApi";
import dayjs from "dayjs";
import PaymentForm from "./BillPageFrom";

const BillingPage = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [mode, setMode] = useState("view");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword]);

  useEffect(() => {
    fetchData();
  }, [activeTab, debouncedKeyword, reload]);

  const fetchData = async () => {
    try {
      const res = await getBills({
        keyword: debouncedKeyword,
        trang_thai:
          activeTab === "pending"
            ? "CHUA_THANH_TOAN"
            : "DA_THANH_TOAN",
      });

      const mapped = res.data.map((item) => ({
        key: item.id_thanh_toan,
        invoiceId: "IN" + item.id_thanh_toan,
        name: item.patient_name,
        phone: item.patient_phone,
        date: dayjs(item.ngay_thanh_toan || item.ngay_kham).format("DD/MM/YYYY"),
        doctor: item.doctor_name,
        total: Number(item.tong_tien).toLocaleString() + " VND",
        loai_thanh_toan: item.loai_thanh_toan,
        status:
          item.trang_thai === "CHUA_THANH_TOAN"
            ? "pending"
            : "paid",
        raw: item,
      }));

      console.log("FETCHED BILLS:", mapped);

      setData(mapped);
    } catch (err) {
      console.error(err);
    }
  };


  const openModal = async (record, type) => {
    try {
      const res = await getBillDetails(record.key);

      const merged = {
        ...record,
        ...res.data,
      };

      setSelectedBill(merged);
      setMode(type);
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "name",
      width: 170,
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 120,
      align: "center",
    },
    {
      title: "Doctor Name",
      dataIndex: "doctor",
      width: 170,
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      width: 150,
    },
    {
      title: "Payment Method",
      dataIndex: "loai_thanh_toan",
      width: 180,
      render: (value) => {
        if (value === "PHI_KHAM") return "Examination Fee";
        if (value === "THUOC") return "Medication";
        if (value === "DICH_VU") return "Service";
        return value || "-";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Tag color={record.status === "pending" ? "orange" : "green"}>
          {record.status === "pending"
            ? "Pending"
            : "Paid"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      width: 130,
      align: "center",
      render: (_, record) => (
        <Space>
          {record.status === "paid" && (
            <Button
              type="primary"
              onClick={() => openModal(record, "view")}
            >
              View
            </Button>
          )}

          {record.status === "pending" && (
            <Button
              type="primary"
              onClick={() => openModal(record, "process")}
            >
              Process
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h3>Bill Management</h3>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "pending", label: "Waiting Payment" },
          { key: "paid", label: "Paid Invoices" },
        ]}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Input
          placeholder="Search invoice / customer"
          style={{ width: 300 }}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <DataTable
        rowKey="key"
        columns={columns}
        data={data}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={900}
        destroyOnHidden
        centered
      >
        <PaymentForm
          record={selectedBill}
          mode={mode}
          onSuccess={() => {
            setOpen(false);
            setReload(!reload);
          }}
        />
      </Modal>
    </div>
  );
};

export default BillingPage;