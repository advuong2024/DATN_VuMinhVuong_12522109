import {
  Space,
  Button,
  Select,
  DatePicker,
  Input,
  Row,
  Col,
  Modal, 
  Descriptions,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable";
import { EyeOutlined } from "@ant-design/icons";
import BookingForm from "./EncounterForm";
import { useNavigate } from "react-router-dom";
import { encounterUrl } from "@/routes/urls";

const STATUS_COLORS = {
  Pending: "#faad14",
  Confirmed: "#52c41a",
  Done: "#1890ff",
  Cancelled: "#ff4d4f",
}

const STATUS_OPTIONS = [
  { label: "Pending", value: "CHO", color: "#faad14" },
  { label: "Confirmed", value: "XAC_NHAN", color: "#52c41a" },
  { label: "Done", value: "HOAN_THANH", color: "#1890ff" },
  { label: "Cancelled", value: "HUY", color: "#ff4d4f" },
]

const mockData = [
  {
    key: "1",
    name: "Nguyễn Văn Anh",
    phone: "0123456789",
    specialty: "Khám tổng quát",
    date: "2026-04-15",
    time: "09:00",
    doctor: "Nguyễn Văn Anh",
    status: "CHO",
  },
  {
    key: "2",
    name: "Nguyễn Văn Anh",
    phone: "0123456789",
    specialty: "Khám tổng quát và xét nghiệm máu, nước tiểu",
    date: "2026-04-15",
    time: "09:00",
    doctor: "Nguyễn Văn Anh",
    status: "XAC_NHAN",
  },
];

export default function BookingManagement() {
  const [data, setData] = useState(mockData);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const navigate = useNavigate();

  const columns = [
    { title: "Customer Name", dataIndex: "name", align: "left", width: 185 },
    { title: "Phone Number", dataIndex: "phone", align: "left", width: 170 },
    { title: "Specialty", dataIndex: "specialty", align: "left", width: 200, ellipsis: true},
    { title: "Time", dataIndex: "time", align: "center", width: 95 },
    { title: "Doctor name", dataIndex: "doctor", align: "left", width: 185 },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      width: 150,
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 130 }}
          onChange={(value) => handleChangeStatus(value, record)}
          options={STATUS_OPTIONS.map((opt) => ({
            value: opt.value,
            label: <span style={{ color: opt.color }}>{opt.label}</span>,
          }))}
          labelRender={(option) => {
            const opt = STATUS_OPTIONS.find(o => o.value === option.value);
            return (
              <span style={{ color: opt?.color }}>
                {opt?.label}
              </span>
            );
          }}
        />
      ),
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <Button 
            type="primary"
            onClick={() => navigate(`${encounterUrl}/${record.key}`, { state: record })}
        >
            Examination
        </Button>
      ),
      width: 150,
    },
  ];

  const handleChangeStatus = (value, record) => {
    const newData = data.map((item) =>
        item.key === record.key
        ? { ...item, status: value }
        : item
    );

    setData(newData);
  };

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
        <h3 style={{ marginBottom: 16 }}>Encounter Management</h3>

        <Row gutter={16} justify="end" style={{ marginBottom: 16, }}>
          <Col span={5}>
            <Input placeholder="Search by name / phone" />
          </Col>

          <Col span={2}>
            <Button
                block
                style={{
                    fontWeight: 600,
                    backgroundColor: "#af050e",
                    color: "#fff",
                }}
                onClick={() => setOpenCreate(true)}
                >
                ADD
            </Button>
          </Col>
        </Row>

        <DataTable columns={columns} data={data} loading={false} />

        <Modal
            centered
            open={openCreate}
            onCancel={() => setOpenCreate(false)}
            footer={null}
            style={{ textAlign: "center" }}
            title="ADD ENCOUNTER"
            width={800}
        >
            <BookingForm
                services={[]}
                doctors={[]}
                staffs={[]}
                onSubmit={(values) => {
                console.log(values);

                const newItem = {
                    key: Date.now().toString(),
                    name: values.patient?.name,
                    phone: values.patient?.phone,
                    specialty: values.booking?.service,
                    date: values.booking?.date,
                    time: values.booking?.time,
                    doctor: values.booking?.doctor,
                    status: "CHO",
                };

                setData((prev) => [newItem, ...prev]);
                setOpenCreate(false);
                }}
            />
        </Modal>
    </div>
  );
}