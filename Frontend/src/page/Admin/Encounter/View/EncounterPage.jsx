import {
  Space,
  Button,
  Input,
  Row,
  Col,
  Modal,
  Tag,
  Radio,
  DatePicker,
  Tooltip,
} from "antd";
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable";
import { LeftOutlined, RightOutlined, BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { encounterUrl } from "@/routes/urls";
import { getBookings, getKiemTraBaoBan, reportBusy } from "../Api/BookingApi"
import { updateEncounterStatus, createEncounter } from "../Api/EncounterApi"
import { toast } from "react-toastify";

const DATE_FORMAT = "DD/MM/YYYY";

export default function BookingManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [coTheBaoBan, setCoTheBaoBan] = useState(true);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openBusy, setOpenBusy] = useState(false);
  const [busyBuoi, setBusyBuoi] = useState("CA_NGAY");
  const [busyLoading, setBusyLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = useCallback(async (filters = {}) => {
    try {
      setLoading(true);

      const dateStr = selectedDate.format("YYYY-MM-DD");
      const res = await getBookings({
        startDate: dateStr,
        endDate: dateStr,
        ...filters,
      });

      const formatted = res.data.map((item) => ({
        key: item.id_dat_lich,
        bookingId: item.id_dat_lich,
        name: item.benh_nhan?.ten_benh_nhan,
        patientId: item.benh_nhan?.id_benh_nhan,
        phone: item.benh_nhan?.so_dien_thoai,
        specialty: item.chuyen_khoa?.ten_chuyen_khoa,
        date: item.thoi_gian,
        time: item.thoi_gian
          ? dayjs(item.thoi_gian).format("HH:mm")
          : "",
        doctor: item.bac_si?.ten_nhan_vien,
        doctorId: item.bac_si?.id_nhan_vien,
        phieu_kham: item.phieu_kham,
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData({ search: debouncedSearch });
  }, [debouncedSearch, fetchData]);

  useEffect(() => {
    if (user?.vai_tro !== "BAC_SI") return;
    getKiemTraBaoBan()
      .then((res) => setCoTheBaoBan(res.coTheBaoBan))
      .catch(() => setCoTheBaoBan(false));
  }, [selectedDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const goToPrevDay = () => {
    setSelectedDate((prev) => prev.subtract(1, "day"));
  };

  const maxDate = dayjs().add(3, "day");

  const goToNextDay = () => {
    setSelectedDate((prev) => prev.add(1, "day"));
  };

  const goToToday = () => {
    setSelectedDate(dayjs());
  };

  const isToday = selectedDate.isSame(dayjs(), "day");
  const isMaxForward = selectedDate.isSame(maxDate, "day");

  const columns = [
    { title: "Tên khách hàng", dataIndex: "name", align: "left", width: 185 },
    { title: "Số điện thoại", dataIndex: "phone", align: "left", width: 170 },
    { title: "Chuyên khoa", dataIndex: "specialty", align: "left", width: 200, ellipsis: true},
    { title: "Giờ", dataIndex: "time", align: "center", width: 95 },
    { title: "Tên bác sĩ", dataIndex: "doctor", align: "left", width: 185 },
    {
      title: "Trạng thái",
      align: "center",
      width: 150,
      render: (_, record) => {
        const pk = record.phieu_kham;

        if (!pk) {
          return <Tag color="default">Chưa khám</Tag>;
        }

        if (pk.trang_thai === "NHAP") {
          return <Tag color="gold">Tạm dừng</Tag>
        }

        if (pk.trang_thai === "CHO_KHAM") {
          return <Tag color="orange">Chờ khám</Tag>;
        }

        if (pk.trang_thai === "DANG_KHAM") {
          return <Tag color="blue">Đang khám</Tag>;
        }

        if (pk.trang_thai === "HOAN_THANH") {
          return <Tag color="green">Hoàn thành</Tag>;
        }

        return null;
      },
    },
    {
      title: "Thao tác",
      align: "center",
      width: 150,
      render: (_, record) => {
        const pk = record.phieu_kham;

        const isDone =
          pk?.trang_thai === "HOAN_THANH";

        const isPaused =
          pk?.trang_thai === "NHAP";

        const hasEncounter = !!pk;

        return (
          <Button
            type={isPaused ? "primary" : "primary"}
            disabled={isDone}
            onClick={() =>
              handleCreateEncounter(record)
            }
          >
            {
              isDone
                ? "Đã xong"
                : isPaused
                  ? "Tiếp tục"
                  : hasEncounter
                    ? "Khám"
                    : "Khám"
            }
          </Button>
        );
      },
    },
  ];

  const handleReportBusy = async () => {
    setBusyBuoi("CA_NGAY");
    setOpenBusy(true);
  };

  const confirmBusy = async () => {
    try {
      setBusyLoading(true);
      const res = await reportBusy(busyBuoi);
      toast.success(res.message || "Đã gửi thông báo đến lễ tân");
      setOpenBusy(false);
    } catch (err) {
      toast.error("Gửi thông báo thất bại");
    } finally {
      setBusyLoading(false);
    }
  };

  const handleCreateEncounter = async (record) => {
    try {
      let encounterId = record.phieu_kham?.id_phieu_kham;

      if (!encounterId) {
        const res = await createEncounter({
          id_dat_lich: record.bookingId,
          trang_thai: "DANG_KHAM",
          trieu_chung: "",
          chan_doan: "",
          ghi_chu: "",
        });

        encounterId = res.data.id_phieu_kham;
      } else {
        await updateEncounterStatus(
          encounterId,
          "DANG_KHAM"
        );
      }

      navigate(`${encounterUrl}/${record.patientId}`, {
        state: {
          ...record,
          bookingId: record.bookingId,
          doctorId: record.doctorId,
          encounterId,
          phieu_kham: record.phieu_kham,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <h3 style={{ margin: 0 }}>Quản lý khám bệnh</h3>
        </Col>
      </Row>

      <Row gutter={16} align="middle" style={{ marginBottom: 16, marginTop: 20 }}>
        <Col>
          <Space.Compact>
            <Button type="primary" icon={<LeftOutlined />} onClick={goToPrevDay} />
            <DatePicker
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              format={DATE_FORMAT}
              allowClear={false}
              disabledDate={(current) => current && current.isAfter(maxDate, "day")}
              style={{ width: 140, textAlign: "center" }}
            />
            <Button
              type="primary"
              icon={<RightOutlined />}
              onClick={goToNextDay}
              disabled={isMaxForward}
            />
          </Space.Compact>
        </Col>
        <Col>
          <Button type="primary" onClick={goToToday} disabled={isToday}>
            Hôm nay
          </Button>
        </Col>
        <Col flex="auto">
          <Row justify="end" gutter={16}>
            <Col span={8} style={{ maxWidth: 300 }}>
              <Input
                placeholder="Tìm theo tên / SĐT"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            {user?.vai_tro === "BAC_SI" && (
              <Col>
                <Tooltip
                  title={
                    !coTheBaoBan
                      ? "Có lịch hẹn trong vòng 1 giờ tới, không thể báo bận"
                      : undefined
                  }
                >
                  <Button
                    type="primary"
                    danger
                    icon={<BellOutlined />}
                    onClick={handleReportBusy}
                    disabled={!coTheBaoBan}
                  >
                    Báo bận
                  </Button>
                </Tooltip>
              </Col>
            )}
          </Row>
        </Col>
      </Row>

      <DataTable columns={columns} data={data} loading={loading} />

      <Modal
        title="📢 Báo bận"
        open={openBusy}
        onOk={confirmBusy}
        onCancel={() => setOpenBusy(false)}
        confirmLoading={busyLoading}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p style={{ marginBottom: 12, fontWeight: 500 }}>Chọn thời gian bạn bận:</p>
        <Radio.Group
          value={busyBuoi}
          onChange={(e) => setBusyBuoi(e.target.value)}
          style={{ marginBottom: 16 }}
        >
          <Radio value="CA_NGAY">Cả ngày</Radio>
          <Radio value="SANG">Buổi sáng (trước 12:00)</Radio>
          <Radio value="CHIEU">Buổi chiều (từ 12:00)</Radio>
        </Radio.Group>
        <p style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>
          Thông báo sẽ được gửi đến lễ tân để xử lý.
        </p>
      </Modal>
    </div>
  );
}
