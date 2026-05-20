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
  Tag,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { encounterUrl } from "@/routes/urls";
import { getBookings } from "../Api/BookingApi"
import { updateEncounterStatus, createEncounter } from "../Api/EncounterApi"

export default function BookingManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
    { title: "Customer Name", dataIndex: "name", align: "left", width: 185 },
    { title: "Phone Number", dataIndex: "phone", align: "left", width: 170 },
    { title: "Specialty", dataIndex: "specialty", align: "left", width: 200, ellipsis: true},
    { title: "Time", dataIndex: "time", align: "center", width: 95 },
    { title: "Doctor name", dataIndex: "doctor", align: "left", width: 185 },
    {
      title: "Status",
      align: "center",
      width: 150,
      render: (_, record) => {
        const pk = record.phieu_kham;

        if (pk.trang_thai === "NHAP") {
          return <Tag color="gold">Paused</Tag>
        }

        if (pk.trang_thai === "CHO_KHAM") {
          return <Tag color="orange">Pending</Tag>;
        }

        if (pk.trang_thai === "DANG_KHAM") {
          return <Tag color="blue">In Progress</Tag>;
        }

        if (pk.trang_thai === "HOAN_THANH") {
          return <Tag color="green">Done</Tag>;
        }

        return null;
      },
    },
    {
      title: "Actions",
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
                ? "Continue"
                : "Examination"
            }
          </Button>
        );
      },
    },
  ];

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
        <h3 style={{ marginBottom: 16 }}>Encounter Management</h3>

        <Row gutter={16} justify="end" style={{ marginBottom: 16, }}>
          <Col span={6}>
            <Input
              placeholder="Search by name / phone"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
        </Row>

        <DataTable columns={columns} data={data} loading={false} />
    </div>
  );
}