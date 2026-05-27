import { useState } from "react";
import { Button, Space } from "antd";
import OldPatientForm from "../FromBooking/OldPatientForm";
import NewPatientForm from "../FromBooking/NewPatientForm";

export default function BookingPage() {
  const [mode, setMode] = useState("old");

  return (
    <>
      <Space style={{ marginBottom: 0 }}>
        <Button
          type={mode === "old" ? "primary" : "primary"}
          onClick={() => setMode("old")}
        >
          Bệnh nhân cũ
        </Button>

        <Button
          type={mode === "new" ? "primary" : "primary"}
          onClick={() => setMode("new")}
        >
          Bệnh nhân mới
        </Button>
      </Space>

      {mode === "old" ? <OldPatientForm /> : <NewPatientForm />}
    </>
  );
}