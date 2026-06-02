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
import { EyeOutlined, SwapOutlined } from "@ant-design/icons";
import { getBookings, updateStatus, reassignDoctor, getDoctorsBySpecialty } from "../Api/BookingApi"
import { STATUS_COLORS, STATUS_OPTIONS } from "../Constants/booking_option";
import { toast } from "react-toastify";
import EncounterForm from "./ReceptionPaymentForm";
import BookingForm from "./BookingForm";

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
  const [openCreate, setOpenCreate] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: null,
    startDate: null,
    endDate: null,
  });
  const [openEncounter, setOpenEncounter] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [newDoctorId, setNewDoctorId] = useState(null);
  const [transferLoading, setTransferLoading] = useState(false);

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
        id_chuyen_khoa: item.id_chuyen_khoa,
        id_bac_si: item.id_bac_si,
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
    const isBaoBan = status === "BAO_BAN";

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
          disabled
          style={{ width: "100%" }}
          options={options.map(opt => ({
            value: opt.value,
            label: renderLabel(opt),
          }))}
        />
      );
    }

    if (isBaoBan) {
      return (
        <Select
          value={status}
          disabled
          style={{ width: "100%" }}
          options={[{ value: "BAO_BAN", label: <span style={{ color: "#ff7a00" }}>Báo bận</span> }]}
        />
      );
    }

    return (
      <Select
        value={status}
        onChange={(value) => handleChangeStatus(value, record)}
        style={{ width: "100%" }}
        options={options.map(opt => ({
          value: opt.value,
          label: renderLabel(opt),
        }))}
      />
    );
  };

  const columns = [
    { title: "Tên khách hàng", dataIndex: "name", align: "left", width: 180 },
    { title: "Số điện thoại", dataIndex: "phone", align: "left", width: 150 },
    { title: "Chuyên khoa", dataIndex: "specialty", align: "left", ellipsis: true, width: 150 },
    { title: "Ngày",  dataIndex: "date", align: "center", width: 150, 
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    { title: "Giờ", dataIndex: "time", align: "center", width: 80},
    { title: "Tên bác sĩ", dataIndex: "doctor", align: "left", width: 150 },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: 150,
      render: (status, record) => renderStatusSelect(status, record, handleChangeStatus),
    },
    {
      title: "Thao tác",
      align: "center",
      width: 130,
      render: (_, record) => (
        <Space>
          <EyeOutlined style={{ fontSize: 18, cursor: "pointer", color: "#1677ff" }} onClick={() => handleShow(record)} />
          {record.status === "BAO_BAN" && (
            <Button
              size="small"
              icon={<SwapOutlined />}
              onClick={() => handleTransfer(record)}
            >
              Chuyển BS
            </Button>
          )}
        </Space>
      ),
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
      toast.success("Cập nhật thành công!");
    } catch (err) {
      toast.error("Cập nhật thất bại");
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

  const handleTransfer = async (record) => {
    setSelectedTransfer(record);
    setNewDoctorId(null);
    setDoctorOptions([]);
    setOpenTransfer(true);

    try {
      const doctors = await getDoctorsBySpecialty(record.id_chuyen_khoa);
      setDoctorOptions(
        doctors
          .filter((d) => d.id_nhan_vien !== record.id_bac_si)
          .map((d) => ({
            label: d.ten_nhan_vien,
            value: d.id_nhan_vien,
          }))
      );
    } catch (err) {
      toast.error("Không thể tải danh sách bác sĩ");
    }
  };

  const confirmTransfer = async () => {
    if (!newDoctorId) {
      toast.warning("Vui lòng chọn bác sĩ mới");
      return;
    }

    try {
      setTransferLoading(true);
      await reassignDoctor(selectedTransfer.key, newDoctorId);
      toast.success("Chuyển bác sĩ thành công");
      setOpenTransfer(false);
      fetchData(filters);
    } catch (err) {
      toast.error(err.response?.data?.message || "Chuyển bác sĩ thất bại");
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
        <h3 style={{ marginBottom: 16 }}>Quản lý đặt lịch</h3>

        <Row gutter={18} justify="end" style={{ marginBottom: 16, }}>
          <Col span={5}>
            <Input
              placeholder="Tìm theo tên / SĐT"
              style={{ width: "100%" }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                applyFilter({ search: e.target.value });
              }}
            />
          </Col>

          <Col span={4}>
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: "100%" }}
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
              placeholder="Từ ngày"
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
              placeholder="Đến ngày"
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
              XÓA
            </Button>
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
                THÊM
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
          title="THÊM LỊCH HẸN"
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
              };
        
              setData((prev) => [newItem, ...prev]);
              setOpenCreate(false);
            }}
          />
        </Modal>

        <Modal
          open={openEncounter}
          onCancel={() => setOpenEncounter(false)}
          footer={null}
          title="Tạo phiếu khám"
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
          title="Chuyển bác sĩ"
          open={openTransfer}
          onCancel={() => setOpenTransfer(false)}
          onOk={confirmTransfer}
          confirmLoading={transferLoading}
          okText="Xác nhận"
          cancelText="Hủy"
          centered
        >
          {selectedTransfer && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Bệnh nhân">{selectedTransfer.name}</Descriptions.Item>
              <Descriptions.Item label="Ngày">{dayjs(selectedTransfer.date).format("DD/MM/YYYY")}</Descriptions.Item>
              <Descriptions.Item label="Giờ">{selectedTransfer.time}</Descriptions.Item>
              <Descriptions.Item label="BS hiện tại">{selectedTransfer.doctor}</Descriptions.Item>
            </Descriptions>
          )}
          <div style={{ marginTop: 16 }}>
            <p style={{ marginBottom: 8, fontWeight: 500 }}>Chọn bác sĩ mới:</p>
            <Select
              placeholder="Chọn bác sĩ..."
              style={{ width: "100%" }}
              value={newDoctorId}
              onChange={setNewDoctorId}
              options={doctorOptions}
            />
          </div>
        </Modal>

        <Modal
          open={openView}
          onCancel={() => setOpenView(false)}
          footer={null}
          title={<div style={{ textAlign: "center" }}>CHI TIẾT LỊCH HẸN</div>}
        >
          {viewRecord && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên khách hàng">
                {viewRecord.name}
              </Descriptions.Item>

              <Descriptions.Item label="Số điện thoại">
                {viewRecord.phone}
              </Descriptions.Item>

              <Descriptions.Item label="Chuyên khoa">
                {viewRecord.specialty}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày">
                {dayjs(viewRecord.date).format("DD/MM/YYYY")}
              </Descriptions.Item>

              <Descriptions.Item label="Giờ">
                {viewRecord.time}
              </Descriptions.Item>

              <Descriptions.Item label="Tên bác sĩ">
                {viewRecord.doctor}
              </Descriptions.Item>

              <Descriptions.Item label="Lý do">
                {viewRecord.reason || "-"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
    </div>
  );
}