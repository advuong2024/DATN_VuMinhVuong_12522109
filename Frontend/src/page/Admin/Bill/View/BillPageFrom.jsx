import {
  Card,
  Table,
  Button,
  Checkbox,
  Divider,
  message,
  Descriptions,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { payBill } from "../Api/BillApi";
import { toast } from "react-toastify";

export default function PaymentForm({ record, mode, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [hasMedicine, setHasMedicine] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("TIEN_MAT");

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

    const serviceItems = record?.service?.items || [];
    const medicineItems = record?.medicine?.items || [];

    const serviceTotal = serviceItems.reduce(
      (sum, i) => sum + i.price * (i.quantity || 1),
      0
    );

    const medicineTotal = medicineItems.reduce(
      (sum, i) => sum + i.price * (i.quantity || 1),
      0
    );

    setService({
      items: serviceItems,
      total: serviceTotal,
    });

    setMedicine({
      items: medicineItems,
      total: medicineTotal,
    });

    setHasMedicine(record?.medicine?.items?.length > 0);
  }, [record]);

  const serviceColumns = [
    {
      title: "Service",
      dataIndex: "name",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (v) => Number(v).toLocaleString(),
    },
  ];

  const medicineColumns = [
    {
      title: "Medicine",
      dataIndex: "name",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
    },
    {
      title: "Price",
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
      };

      await payBill(payload);

      toast.success("Payment success");

      onSuccess?.();
    } catch (error) {
      console.error(error);

      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!record) return null;

  return (
    <div style={{ maxWidth: 850, margin: "0 auto" }}>
      <h3 style={{ marginBottom: 12 }}>
        {mode === "view"
          ? "View Payment Detail"
          : "Process Payment"}
      </h3>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Descriptions size="small" column={2}>
          <Descriptions.Item label="Patient">
            {record?.name || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Phone">
            {record?.phone || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Doctor">
            {record?.doctor || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Invoice">
            {record?.invoiceId || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        size="small"
        title="Services"
        style={{ marginBottom: 12 }}
      >
        <Table
          size="small"
          dataSource={service.items}
          columns={serviceColumns}
          pagination={false}
          rowKey="id"
        />

        <div style={{ textAlign: "right", marginTop: 8 }}>
          <b>
            Service Total:{" "}
            {service.total.toLocaleString()}
          </b>
        </div>
      </Card>

      <Card
        size="small"
        title="Medicine (Optional)"
        style={{ marginBottom: 12 }}
      >
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
          onChange={(e) =>
            setHasMedicine(e.target.checked)
          }
        >
          Customer buys medicine
        </Checkbox>

        <div style={{ textAlign: "right", marginTop: 8 }}>
          <b>
            Medicine Total:{" "}
            {(
              hasMedicine ? medicine.total : 0
            ).toLocaleString()}
          </b>
        </div>
      </Card>

      <Card size="small">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <b>Payment Method:</b>

            <Select
              value={paymentMethod}
              style={{ width: 180, marginLeft: 10 }}
              onChange={setPaymentMethod}
              options={[
                {
                  label: "Cash",
                  value: "TIEN_MAT",
                },
                {
                  label: "Bank Transfer",
                  value: "CHUYEN_KHOAN",
                },
              ]}
            />
          </div>

          <h3>
            Total: {total.toLocaleString()}
          </h3>
        </div>

        {mode === "process" && (
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button
              type="primary"
              loading={loading}
              onClick={handlePay}
            >
              Payment Bill
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}