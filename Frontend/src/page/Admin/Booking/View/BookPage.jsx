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
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable";
import { EyeOutlined } from "@ant-design/icons";
import { getBookings, updateStatus } from "../Api/BookingApi"
import { STATUS_COLORS, STATUS_OPTIONS } from "../Constants/booking_option";
import { toast } from "react-toastify";
import EncounterForm from "./ReceptionPaymentForm";

export default function BookingManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: null,
    startDate: null,
    endDate: null,
  });
  const [openEncounter, setOpenEncounter] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilter({ search });
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);

      const res = await getBookings({
        ...filters,
        startDate: filters.startDate
          ? dayjs(filters.startDate).format("YYYY-MM-DD")
          : undefined,
        endDate: filters.endDate
          ? dayjs(filters.endDate).format("YYYY-MM-DD")
          : undefined,
      });

      const formatted = res.data.map((item) => ({
        key: item.id_dat_lich,
        name: item.benh_nhan?.ten_benh_nhan,
        phone: item.benh_nhan?.so_dien_thoai,
        specialty: item.chuyen_khoa?.ten_chuyen_khoa,
        date: item.thoi_gian,
        time: item.thoi_gian
          ? dayjs(item.thoi_gian).format("HH:mm")
          : "",
        doctor: item.bac_si?.ten_nhan_vien,
        status: item.trang_thai,
        reason: item.ly_do,
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusSelect = (status, record, handleChangeStatus) => {
    const isDone = status === "DA_DEN";
    const isCancelled = status === "DA_HUY";

    let options = STATUS_OPTIONS;

    if (isCancelled) {
      options = STATUS_OPTIONS.filter(opt => opt.value === "DA_DEN");
    }

    const renderLabel = (opt) => (
      <span style={{ color: opt.color }}>
        {opt.label}
      </span>
    );

    if (isDone) {
      return (
        <Select
          value={status}
          style={{ width: 130 }}
          disabled
          options={options.map(opt => ({
            value: opt.value,
            label: renderLabel(opt),
          }))}
        />
      );
    }

    return (
      <Select
        value={status}
        style={{ width: 130 }}
        onChange={(value) => handleChangeStatus(value, record)}
        options={options.map(opt => ({
          value: opt.value,
          label: renderLabel(opt),
        }))}
      />
    );
  };

  const columns = [
    { title: "Customer Name", dataIndex: "name", align: "left", width: 180 },
    { title: "Phone Number", dataIndex: "phone", align: "left", width: 170 },
    { title: "Specialty", dataIndex: "specialty", align: "left", width: 180, ellipsis: true},
    { title: "Date",  dataIndex: "date", align: "center", 
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-", width: 100 
    },
    { title: "Time", dataIndex: "time", align: "center", width: 90 },
    { title: "Doctor name", dataIndex: "doctor", align: "left", width: 180 },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      width: 150,
      render: (status, record) => renderStatusSelect(status, record, handleChangeStatus),
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ fontSize: 18, cursor: "pointer", color: "#1677ff" }} onClick={() => handleShow(record)} />
        </Space>
      ),
      width: 90,
    },
  ];

  const handleChangeStatus = async (value, record) => {
    if (value === "DA_DEN") {
      setSelectedBooking(record);
      setOpenEncounter(true);
      return;
    }

    try {
      setUpdating(true);

      const newData = data.map((item) =>
        item.key === record.key ? { ...item, status: value } : item
      );
      setData(newData);

      await updateStatus(record.key, value);
      toast.success("Updated!");
    } catch (err) {
      toast.error("Update failed");
      fetchData(filters);
    } finally {
      setUpdating(false);
    }
  };

  const applyFilter = (newFilter) => {
    const updated = { ...filters, ...newFilter };

    setFilters(updated);
    fetchData(updated);
  };

  const handleShow = (record) => {
    setViewRecord(record);
    setOpenView(true);
  };

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
        <h3 style={{ marginBottom: 16 }}>Booking Management</h3>

        <Row gutter={16} justify="end" style={{ marginBottom: 16, }}>
          <Col span={5}>
            <Input
              placeholder="Search by name / phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                applyFilter({ search: e.target.value });
              }}
            />
          </Col>

          <Col span={3}>
            <Select
              placeholder="Select Status"
              allowClear
              value={status}
              onChange={(value) => {
                setStatus(value);
                applyFilter({ status: value });
              }}
              options={STATUS_OPTIONS}
            />
          </Col>

          <Col span={3}>
            <DatePicker
              placeholder="Start Date"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                applyFilter({ startDate: date });
              }}
            />
          </Col>

          <Col span={3}>
            <DatePicker
              placeholder="End Date"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              value={endDate}
              onChange={(date) => {
                setEndDate(date);
                applyFilter({ endDate: date });
              }}
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
              onClick={() => {
                const reset = {
                  search: "",
                  status: null,
                  startDate: null,
                  endDate: null,
                };

                setSearch("");
                setStatus(null);
                setStartDate(null);
                setEndDate(null);

                fetchData(reset);
              }}
            >
              CLEAR
            </Button>
          </Col>
        </Row>

        <DataTable columns={columns} data={data} loading={false} />

        <Modal
          open={openEncounter}
          onCancel={() => setOpenEncounter(false)}
          footer={null}
          title="Create Medical Record"
          width={800}
          centered
        >
          <EncounterForm
            booking={selectedBooking}
            onSuccess={() => {
              setOpenEncounter(false);
              fetchData();
            }}
          />
        </Modal>

        <Modal
          open={openView}
          onCancel={() => setOpenView(false)}
          footer={null}
          title={<div style={{ textAlign: "center" }}>BOOKING DETAILS</div>}
        >
          {viewRecord && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Customer Name">
                {viewRecord.name}
              </Descriptions.Item>

              <Descriptions.Item label="Phone Number">
                {viewRecord.phone}
              </Descriptions.Item>

              <Descriptions.Item label="Specialty">
                {viewRecord.specialty}
              </Descriptions.Item>

              <Descriptions.Item label="Date">
                {dayjs(viewRecord.date).format("DD/MM/YYYY")}
              </Descriptions.Item>

              <Descriptions.Item label="Time">
                {viewRecord.time}
              </Descriptions.Item>

              <Descriptions.Item label="Doctor Name">
                {viewRecord.doctor}
              </Descriptions.Item>

              <Descriptions.Item label="Reason">
                {viewRecord.reason || "-"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
    </div>
  );
}