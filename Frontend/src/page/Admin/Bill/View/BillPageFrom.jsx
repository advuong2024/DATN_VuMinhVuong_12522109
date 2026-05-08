import { Card, Table, Button, Checkbox, Divider, message } from "antd";
import { useEffect, useState } from "react";

export default function PaymentForm({ record, mode }) {
  const [hasMedicine, setHasMedicine] = useState(false);

  const [service, setService] = useState({ items: [], total: 0 });
  const [medicine, setMedicine] = useState({ items: [], total: 0 });

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

    setService({ items: serviceItems, total: serviceTotal });
    setMedicine({ items: medicineItems, total: medicineTotal });

    setHasMedicine(false);
  }, [record]);

  const serviceColumns = [
    { title: "Service", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    { title: "Qty", dataIndex: "quantity" },
  ];

  const medicineColumns = [
    { title: "Medicine", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    { title: "Qty", dataIndex: "quantity" },
  ];

  const total =
    service.total + (hasMedicine ? medicine.total : 0);

  const handlePay = () => {
    const payload = {
      id_phieu_kham: record?.key,
      tong_tien: total,
      dich_vu: service.items,
      thuoc: hasMedicine ? medicine.items : [],
      co_mua_thuoc: hasMedicine,
    };

    console.log("PAYLOAD:", payload);

    message.success("Payment success");
  };

  return (
    <div>
      <h2>
        {mode === "view"
          ? "View Payment Detail"
          : "Process Payment"}
      </h2>

      <Card title="Service Payment" style={{ marginBottom: 16 }}>
        <Table
          dataSource={service.items}
          columns={serviceColumns}
          pagination={false}
          rowKey="id"
        />

        <div style={{ textAlign: "right", marginTop: 12 }}>
          <b>Service Total: {service.total}</b>
        </div>
      </Card>

      <Card title="Medicine (Optional)">
        <Table
          dataSource={medicine.items}
          columns={medicineColumns}
          pagination={false}
          rowKey="id"
        />

        <Divider />

        <Checkbox
          disabled={mode === "view"}
          checked={hasMedicine}
          onChange={(e) => setHasMedicine(e.target.checked)}
        >
          Customer buys medicine
        </Checkbox>

        <div style={{ textAlign: "right", marginTop: 12 }}>
          <b>
            Medicine Total:{" "}
            {hasMedicine ? medicine.total : 0}
          </b>
        </div>
      </Card>

      {/* ===== FINAL TOTAL + SINGLE BUTTON ===== */}
      <Card style={{ marginTop: 16, textAlign: "right" }}>
        <h3>
          Total Payment: {total}
        </h3>

        {mode === "process" && (
          <Button
            type="primary"
            onClick={handlePay}
          >
            Payment Bill
          </Button>
        )}
      </Card>
    </div>
  );
}