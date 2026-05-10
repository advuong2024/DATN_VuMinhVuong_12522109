import {
  Input,
  Button,
  Tabs,
  Tag,
  Space,
  Modal,
  Table,
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
        loai_item: item.loai_item,
        status:
          item.trang_thai === "CHUA_THANH_TOAN"
            ? "pending"
            : "paid",
        raw: item,
      }));

      console.log("FETCHED BILLS:", mapped);

      if (activeTab === "paid") {
        const groupedMap = {};

        mapped.forEach((item) => {
          const key = item.raw.id_phieu_kham;

          const amount = Number(
            item.total.replace(/[^\d]/g, "")
          );

          if (!groupedMap[key]) {
            groupedMap[key] = {
              ...item,
              key,

              loai_item: "TONG_HOP",

              totalAmount: amount,

              payments: [item],
            };
          } else {
            groupedMap[key].payments.push(item);

            groupedMap[key].totalAmount += amount;
          }
        });

        const finalData = Object.values(groupedMap).map(
          (item) => ({
            ...item,

            total:
              item.totalAmount.toLocaleString() +
              " VND",
          })
        );

        setData(finalData);
      } else {
        setData(mapped);
      }
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
      dataIndex: "loai_item",
      width: 180,
      render: (value) => {
         if (value === "TONG_HOP") return "Total Invoice";
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
        columns={columns.filter(
          (c) => c.title !== "Actions"
        )}
        data={data}
        expandable={{
          expandRowByClick: true,
          expandedRowRender: (record) => (
            <div style={{ padding: "0px 0px", background: "#f8f9fc" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {record.payments?.map((item, index) => (
                  <div
                    key={item.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#ffffff",
                      border: "1px solid #e6e9f0",
                      borderRadius: 8,
                      padding: "10px 16px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Index */}
                    {/* <div style={{ width: 28, color: "#aaa", fontWeight: 600, fontSize: 13 }}>
                      {index + 1}
                    </div> */}

                    <div style={{ width: 160 }}>
                      <div style={{ fontSize: 12, color: "#aaa" }}>Customer</div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{item.name}</div>
                    </div>

                    <div style={{ width: 110 }}>
                      <div style={{ fontSize: 12, color: "#aaa" }}>Date</div>
                      <div style={{ fontSize: 13 }}>{item.date}</div>
                    </div>

                    <div style={{ width: 160 }}>
                      <div style={{ fontSize: 12, color: "#aaa" }}>Doctor</div>
                      <div style={{ fontSize: 13 }}>{item.doctor}</div>
                    </div>

                    <div style={{ width: 140 }}>
                      <div style={{ fontSize: 12, color: "#aaa" }}>Total</div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1677ff" }}>
                        {item.total}
                      </div>
                    </div>

                    <div style={{ width: 160 }}>
                      <div style={{ fontSize: 12, color: "#aaa" }}>Method</div>
                      <Tag color="blue" style={{ marginTop: 2 }}>
                        {item.loai_item === "PHI_KHAM"
                          ? "Examination Fee"
                          : item.loai_item === "THUOC"
                          ? "Medication"
                          : item.loai_item === "DICH_VU"
                          ? "Service"
                          : item.loai_item || "-"}
                      </Tag>
                    </div>

                    <Tag color="green" style={{ fontWeight: 500 }}>
                      Paid
                    </Tag>

                    <Button
                      type="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(item, "view");
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ),
          rowExpandable: (record) => record.payments?.length > 0,
        }}
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