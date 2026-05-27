import {
  Card,
  Table,
  Button,
  Checkbox,
  Divider,
  message,
  Descriptions,
  Select,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { payBill } from "../Api/BillApi";
import { toast } from "react-toastify";
import PrintPreviewModal from "@/components/print/PrintPreviewModal";
import PrintMedicineInvoice from "@/components/print/PrintMedicineInvoice";

export default function PaymentForm({ record, mode, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [hasMedicine, setHasMedicine] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("TIEN_MAT");
  const [processType, setProcessType] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [service, setService] = useState({
    items: [],
    total: 0,
  });
  const [medicine, setMedicine] = useState({
    items: [],
    total: 0,
  });

  useEffect(() => {
    if (!record) return;

    const serviceItems = [
      ...(record?.consultation?.items || []),
      ...(record?.services?.items || []),
    ];

    const medicineItems =
      record?.medicines?.items || [];

    setService({
      items: serviceItems,
      total:
        (record?.consultation?.total || 0) +
        (record?.services?.total || 0),
    });

    setMedicine({
      items: medicineItems,
      total:
        record?.medicines?.total || 0,
    });

    setHasMedicine(
      medicineItems.length > 0
    );

    setProcessType(
      record?.loai_dang_xu_ly || ""
    );
  }, [record]);

  const serviceColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "name",
    },
    {
      title: "SL",
      dataIndex: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (v) => Number(v).toLocaleString(),
    },
  ];

  const medicineColumns = [
    {
      title: "Thuốc",
      dataIndex: "name",
    },
    {
      title: "SL",
      dataIndex: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (v) => Number(v).toLocaleString(),
    },
  ];

  const total =
    service.total + (hasMedicine ? medicine.total : 0);

  const handlePay = async () => {
    try {
      setLoading(true);

      const payload = {
        id_phieu_kham: record?.id_phieu_kham,
        phuong_thuc: paymentMethod,
        co_mua_thuoc: hasMedicine,
        loai_dang_xu_ly: processType,
      };

      await payBill(payload);

      toast.success("Thanh toán thành công");

      onSuccess?.();
    } catch (error) {
      console.error(error);

      toast.error("Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!record) return null;

  return (
    <div style={{ maxWidth: 850, margin: "0 auto" }}>
      <h3 style={{ marginBottom: 12 }}>
        {mode === "view"
          ? "Xem chi tiết thanh toán"
          : "Xử lý thanh toán"}
      </h3>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Descriptions size="small" column={2}>
          <Descriptions.Item label="Bệnh nhân">
            {record?.name || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="SĐT">
            {record?.phone || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Bác sĩ">
            {record?.doctor || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Hóa đơn">
            {record?.invoiceId || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {service.items.length > 0 && (
        <Card size="small" title="Dịch vụ" style={{ marginBottom: 12 }}>
          <Table
            size="small"
            dataSource={service.items}
            columns={serviceColumns}
            pagination={false}
            rowKey="id"
          />

          <div style={{ textAlign: "right", marginTop: 8 }}>
            <b>Tổng dịch vụ: {service.total.toLocaleString()}</b>
          </div>
        </Card>
      )}

      {medicine.items.length > 0 && (
        <Card size="small" title="Thuốc (Tùy chọn)" style={{ marginBottom: 12 }}>
          <Table
            size="small"
            dataSource={medicine.items}
            columns={medicineColumns}
            pagination={false}
            rowKey="id"
          />

          <Divider style={{ margin: "10px 0" }} />

          <Checkbox
            disabled={mode === "view"}
            checked={hasMedicine}
            onChange={(e) => setHasMedicine(e.target.checked)}
          >
            Khách hàng mua thuốc
          </Checkbox>

          <div style={{ textAlign: "right", marginTop: 8 }}>
            <b>
              Tổng thuốc: {(hasMedicine ? medicine.total : 0).toLocaleString()}
            </b>
          </div>
        </Card>
      )}

      <Card size="small">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <b>Phương thức thanh toán:</b>

            <Select
              value={paymentMethod}
              disabled={mode === "view"}
              style={{ width: 180, marginLeft: 10 }}
              onChange={setPaymentMethod}
              options={[
                {
                  label: "Tiền mặt",
                  value: "TIEN_MAT",
                },
                {
                  label: "Chuyển khoản",
                  value: "CHUYEN_KHOAN",
                },
              ]}
            />
          </div>

          <h3>
            Tổng: {total.toLocaleString()}
          </h3>
        </div>

        {mode === "process" && (
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Space>
              {hasMedicine && (
                <Button onClick={() => setShowInvoice(true)}>
                  In hóa đơn
                </Button>
              )}
              <Button
                type="primary"
                loading={loading}
                onClick={handlePay}
              >
                Thanh toán
              </Button>
            </Space>
          </div>
        )}
      </Card>

      <PrintPreviewModal
        open={showInvoice}
        onClose={() => setShowInvoice(false)}
        title="Hóa đơn mua thuốc"
        filename={`hoa_don_${record?.invoiceId || ""}.pdf`}
      >
        <PrintMedicineInvoice
          patientName={record?.name}
          patientPhone={record?.phone}
          date={dayjs().format("DD/MM/YYYY")}
          invoiceCode={record?.invoiceId || ""}
          medicines={(medicine.items || []).map(m => ({
            name: m.name,
            quantity: m.quantity,
            price: m.price,
          }))}
          total={medicine.total || 0}
          paymentMethod={paymentMethod}
        />
      </PrintPreviewModal>
    </div>
  );
}