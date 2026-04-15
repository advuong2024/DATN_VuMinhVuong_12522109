import {
  Space,
  Button,
  Select,
  DatePicker,
  Input,
  Row,
  Col,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable";
import { EyeOutlined } from "@ant-design/icons";

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
    service: "Khám tổng quát",
    date: "2026-04-15",
    time: "09:00",
    status: "CHO",
  },
  {
    key: "2",
    name: "Nguyễn Văn Anh",
    phone: "0123456789",
    service: "Khám tổng quát và xét nghiệm máu, nước tiểu",
    date: "2026-04-15",
    time: "09:00",
    status: "XAC_NHAN",
  },
];

export default function BookingManagement() {
  const [data, setData] = useState(mockData);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const columns = [
    { title: "Customer Name", dataIndex: "name", align: "left", width: 180 },
    { title: "Phone Number", dataIndex: "phone", align: "left", width: 180 },
    { title: "Service", dataIndex: "service", align: "left", width: 200, ellipsis: true},
    { title: "Date",  dataIndex: "date", align: "center", render: (date) => dayjs(date).format("DD/MM/YYYY"), width: 120 },
    { title: "Time", dataIndex: "time", align: "center", width: 100 },
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
        <Space>
          <EyeOutlined style={{ fontSize: 18, cursor: "pointer", color: "#1677ff" }} onClick={() => handleShow(record)} />
        </Space>
      ),
      width: 120,
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
        <h3 style={{ marginBottom: 16 }}>Booking Management</h3>

        <Row gutter={16} justify="end" style={{ marginBottom: 16, }}>
          <Col span={5}>
            <Input placeholder="Search by name / phone" />
          </Col>

          <Col span={3}>
            <Select
              placeholder="Select Status"
              style={{ width: "100%" }}
              allowClear
              options={STATUS_OPTIONS}
            />
          </Col>

          <Col span={3}>
            <DatePicker
              placeholder="Start Date"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </Col>

          <Col span={3}>
            <DatePicker
              placeholder="End Date"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              value={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </Col>

          <Col span={2}>
            <Button
              block
              disabled={!startDate && !endDate}
              style={{
                fontWeight: 600,
                backgroundColor: startDate || endDate ? "#af050e" : "#d45258",
                color: startDate || endDate ? "#fff" : "#fff",
              }}
              onClick={() => { setStartDate(null); setEndDate(null); }}
            >
              CLEAR
            </Button>
          </Col>
        </Row>

        <DataTable columns={columns} data={data} loading={false} />
    </div>
  );
}