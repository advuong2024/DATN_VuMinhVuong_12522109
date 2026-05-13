import { useState } from "react";
import { Button, Space } from "antd";
import OldPatientForm from "./FormEncounter/OldPatientForm";
import NewPatientForm from "./FormEncounter/NewPatientForm";

export default function BookingPage() {
  const [mode, setMode] = useState("old");

  return (
    <>
      <Space style={{ marginBottom: 0 }}>
        <Button
          type={mode === "old" ? "primary" : "primary"}
          onClick={() => setMode("old")}
        >
          Existing Patient
        </Button>

        <Button
          type={mode === "new" ? "primary" : "primary"}
          onClick={() => setMode("new")}
        >
          New Patient
        </Button>
      </Space>

      {mode === "old" ? <OldPatientForm /> : <NewPatientForm />}
    </>
  );
}