import {
  Space,
  Button,
  Input,
  Row,
  Col,
  Modal, 
  Tag,
  Radio,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable";
import { EyeOutlined, BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { encounterUrl } from "@/routes/urls";
import { getBookings, reportBusy } from "../Api/BookingApi"
import { updateEncounterStatus, createEncounter } from "../Api/EncounterApi"
import { toast } from "react-toastify";

export default function BookingManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openBusy, setOpenBusy] = useState(false);
  const [busyBuoi, setBusyBuoi] = useState("CA_NGAY");
  const [busyLoading, setBusyLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData({
      search: debouncedSearch,
    });
  }, [debouncedSearch]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
  
      const res = await getBookings({
        ...filters,});
  
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

      console.log("DATA:", formatted)
  
      setData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

        return (
          <Button
            type={isPaused ? "primary" : "primary"}
            disabled={isDone}
            onClick={() =>
              handleCreateEncounter(record)
            }
          >
            {
              isPaused
                ? "Tiếp tục"
                : "Khám"
            }
          </Button>
        );
      },
    },
  ];

  const handleReportBusy = async () => {
    setBusyBuoi("CA_NGAY");
    setBusyList([]);
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
        <h3 style={{ marginBottom: 16 }}>Quản lý phiên khám</h3>

        <Row gutter={16} justify="end" style={{ marginBottom: 16, }}>
          <Col span={6}>
            <Input
              placeholder="Tìm theo tên / SĐT"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          {user?.vai_tro === "BAC_SI" && (
            <Col>
              <Button
                danger
                icon={<BellOutlined />}
                onClick={handleReportBusy}
              >
                Báo bận
              </Button>
            </Col>
          )}
        </Row>

        <DataTable columns={columns} data={data} loading={false} />

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