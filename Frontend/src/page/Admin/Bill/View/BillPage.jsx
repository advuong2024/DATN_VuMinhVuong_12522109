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
        invoiceId: "HD" + item.id_thanh_toan,
        name: item.patient_name,
        phone: item.patient_phone,
        date: dayjs(item.ngay_thanh_toan || item.ngay_kham).format("DD/MM/YYYY"),
        doctor: item.doctor_name,
        total: Number(item.tong_tien).toLocaleString() + " VNĐ",
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
              " VNĐ",
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
      title: "Tên khách hàng",
      dataIndex: "name",
      width: 170,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      width: 120,
      align: "center",
    },
    {
      title: "Tên bác sĩ",
      dataIndex: "doctor",
      width: 170,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      width: 150,
    },
    {
      title: "Phương thức",
      dataIndex: "loai_item",
      width: 180,
      render: (value) => {
         if (value === "TONG_HOP") return "Tổng hóa đơn";
        if (value === "PHI_KHAM") return "Phí khám";
        if (value === "THUOC") return "Thuốc";
        if (value === "DICH_VU") return "Dịch vụ";
        return value || "-";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Tag color={record.status === "pending" ? "orange" : "green"}>
          {record.status === "pending"
            ? "Chờ thanh toán"
            : "Đã thanh toán"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      width: 130,
      align: "center",
      render: (_, record) => (
        <Space>
          {record.status === "paid" && (
            <Button
              type="primary"
              onClick={() => openModal(record, "view")}
            >
              Xem
            </Button>
          )}

          {record.status === "pending" && (
            <Button
              type="primary"
              onClick={() => 
                openModal({
                  ...record,
                  loai_dang_xu_ly: record.loai_item,
                }, 
                "process"
              )}
            >
              Xử lý
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h3>Quản lý hóa đơn</h3>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "pending", label: "Chờ thanh toán" },
          { key: "paid", label: "Đã thanh toán" },
        ]}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Input
          placeholder="Tìm hóa đơn / khách hàng"
          style={{ width: 300 }}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <DataTable
        rowKey="key"
        columns={
          activeTab === "paid"
            ? columns.filter(
                (c) => c.title !== "Thao tác"
              )
            : columns
        }
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
                      <div style={{ fontSize: 12, color: "#aaa" }}>Khách hàng</div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{item.name}</div>
                    </div>

                    <div style={{ width: 110 }}>
                      <div style={{ fontSize: 12, color: "#aaa" }}>Ngày</div>
                      <div style={{ fontSize: 13 }}>{item.date}</div>
                    </div>

                    <div style={{ width: 160 }}>
                      <div style={{ fontSize: 12, color: "#aaa" }}>Bác sĩ</div>
                      <div style={{ fontSize: 13 }}>{item.doctor}</div>
                    </div>

                    <div style={{ width: 140 }}>
                      <div style={{ fontSize: 12, color: "#aaa" }}>Tổng</div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1677ff" }}>
                        {item.total}
                      </div>
                    </div>

                    <div style={{ width: 160 }}>
                      <div style={{ fontSize: 12, color: "#aaa" }}>Phương thức</div>
                      <Tag color="blue" style={{ marginTop: 2 }}>
                        {item.loai_item === "PHI_KHAM"
                          ? "Phí khám"
                          : item.loai_item === "THUOC"
                          ? "Thuốc"
                          : item.loai_item === "DICH_VU"
                          ? "Dịch vụ"
                          : item.loai_item || "-"}
                      </Tag>
                    </div>

                    <Tag color="green" style={{ fontWeight: 500 }}>
                      Đã thanh toán
                    </Tag>

                    <Button
                      type="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(item, "view");
                      }}
                    >
                      Xem
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