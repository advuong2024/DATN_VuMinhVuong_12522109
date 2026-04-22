import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Table,
  Button,
  Space,
  Tag,
  InputNumber,
  message,
  Breadcrumb,
} from "antd";
import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const { TextArea } = Input;

const services = [
  { value: 1, label: "General Checkup", price: 100000 },
  { value: 2, label: "Blood Test", price: 200000 },
];

const medicines = [
  { value: 1, label: "Paracetamol" },
  { value: 2, label: "Amoxicillin" },
];

const patient = {
  name: "Nguyen Van A",
  phone: "0123456789",
  dob: "01/01/2000",
  allergy: "Penicillin",
};

export default function EncounterPage() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);

  const handleAddService = (value) => {
    const service = services.find((s) => s.value === value);
    if (!service) return;
    const exist = selectedServices.find((s) => s.value === value);
    if (exist) return;
    setSelectedServices([...selectedServices, service]);
  };

  const handleRemoveService = (value) => {
    setSelectedServices(selectedServices.filter((s) => s.value !== value));
  };

  const handleAddMedicine = (value) => {
    const med = medicines.find((m) => m.value === value);
    if (!med) return;
    const exist = selectedMedicines.find((m) => m.value === value);
    if (exist) return;
    setSelectedMedicines([
      ...selectedMedicines,
      { ...med, qty: 1, dosage: "" },
    ]);
  };

  const handleRemoveMedicine = (value) => {
    setSelectedMedicines(
      selectedMedicines.filter((m) => m.value !== value)
    );
  };

  const handleChangeMedicine = (value, field, val) => {
    const newData = selectedMedicines.map((m) =>
      m.value === value ? { ...m, [field]: val } : m
    );
    setSelectedMedicines(newData);
  };

  const handleSubmit = (values) => {
    const payload = {
      encounter: values,
      services: selectedServices,
      medicines: selectedMedicines,
    };
    console.log(payload);
    message.success("Saved successfully!");
  };

  const serviceColumns = [
    { title: "Service Name", dataIndex: "label" },
    {
      title: "Price",
      dataIndex: "price",
      render: (v) => v.toLocaleString(),
    },
    {
      title: "",
      render: (_, record) => (
        <Button danger onClick={() => handleRemoveService(record.value)}>
          X
        </Button>
      ),
    },
  ];

  const medicineColumns = [
    { title: "Medicine Name", dataIndex: "label" },
    {
      title: "Quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(val) =>
            handleChangeMedicine(record.value, "qty", val)
          }
        />
      ),
    },
    {
      title: "Dosage",
      render: (_, record) => (
        <Input
          value={record.dosage}
          onChange={(e) =>
            handleChangeMedicine(
              record.value,
              "dosage",
              e.target.value
            )
          }
        />
      ),
    },
    {
      title: "",
      render: (_, record) => (
        <Button danger onClick={() => handleRemoveMedicine(record.value)}>
          X
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          marginBottom: 16,
          padding: "0px 14px",
          background: "#fafafa",
        }}
      >
        <Breadcrumb
          items={[
            {
              title: (
                <span
                  style={{ cursor: "pointer", fontWeight: 500 }}
                  onClick={() => navigate("/admin/encounter")}
                >
                  Encounter Management
                </span>
              ),
            },
            {
              title: (
                <span style={{ color: "#6b7280" }}>
                  Encounter Detail
                </span>
              ),
            },
          ]}
        />
      </div>

      <Card
        style={{
          marginBottom: 10,
          border: "1px solid #c5c6c9",
          borderRadius: 10,
        }}
      >
        <Row justify="space-between">
          <Col>
            <b>{patient.name}</b> - {patient.phone}
            <div>DOB: {patient.dob}</div>
          </Col>
          <Col>
            {patient.allergy && (
              <Tag color="red">Allergy: {patient.allergy}</Tag>
            )}
          </Col>
        </Row>
      </Card>

        <Row gutter={16}>
            <Col span={14}>
                <Card
                    title="Medical Examination"
                    style={{ borderRadius: 10, border: "1px solid #c5c6c9" }}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Symptoms" name="symptoms">
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="Diagnosis" name="diagnosis">
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="Notes" name="notes">
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="Status" name="status">
                        <Select
                        options={[
                            { label: "In Progress", value: "IN_PROGRESS" },
                            { label: "Completed", value: "COMPLETED" },
                        ]}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Row justify="end">
                        <Space>
                            <Button>Save Draft</Button>
                            <Button type="primary" htmlType="submit">
                            Complete
                            </Button>
                        </Space>
                        </Row>
                    </Form.Item>
                    </Form>
                </Card>
            </Col>

            <Col span={10}>
                <Card
                    title="Services"
                    style={{
                    marginBottom: 16,
                    borderRadius: 10,
                    border: "1px solid #c5c6c9",
                    }}
                >
                    <Select
                        style={{ width: "100%", marginBottom: 10 }}
                        placeholder="Select service"
                        onChange={handleAddService}
                        options={services}
                    />

                    <Table
                        size="small"
                        dataSource={selectedServices}
                        columns={serviceColumns}
                        rowKey="value"
                        pagination={false}
                    />
                </Card>

                <Card
                    title="Prescription"
                    style={{ borderRadius: 10, border: "1px solid #c5c6c9" }}
                >
                    <Select
                        style={{ width: "100%", marginBottom: 10 }}
                        placeholder="Select medicine"
                        onChange={handleAddMedicine}
                        options={medicines}
                    />

                    <Table
                        size="small"
                        dataSource={selectedMedicines}
                        columns={medicineColumns}
                        rowKey="value"
                        pagination={false}
                    />
                </Card>
            </Col>
        </Row>
    </div>
  );
}