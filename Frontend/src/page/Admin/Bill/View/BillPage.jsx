import {
  Input,
  Button,
  Tabs,
  Tag,
  Space,
} from "antd";
import { useState, useEffect } from "react";
import DataTable from "@/components/common/DataTable";
import { getBills } from "../Api/BillApi";
import dayjs from "dayjs";

const { TabPane } = Tabs;

const BillingPage = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
        setDebouncedKeyword(keyword);
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword]);

  useEffect(() => {
   fetchData();
  }, [activeTab, debouncedKeyword]);

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
            status:
                item.trang_thai === "CHUA_THANH_TOAN"
                ? "pending"
                : "paid",
        }));

        setData(mapped);
    } catch (err) {
        console.error(err);
    }
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "name",
      width: 185,
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      width: 150,
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
      width: 185,
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Tag color={record.status === "pending" ? "green" : "blue"}>
          {record.status === "pending"
            ? "Pending Payment"
            : "Paid"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      width: 160,
      align: "center",
      render: (_, record) => (
        <Button type="primary">
          {record.status === "pending"
            ? "Process Payment"
            : "View"}
        </Button>
      ),
    },
  ];

  const tabItems = [
    {
        key: "pending",
        label: "Waiting for Payment",
    },
    {
        key: "paid",
        label: "Paid Invoices",
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h3>Bill Management</h3>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Input
            placeholder="Search by invoice / customer"
            style={{ width: 300 }}
            onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <DataTable
        rowKey="key"
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default BillingPage;