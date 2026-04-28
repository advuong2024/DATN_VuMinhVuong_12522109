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
import BookingForm from "./EncounterForm";
import { useNavigate } from "react-router-dom";
import { encounterUrl } from "@/routes/urls";
import { getBookings } from "../Api/BookingApi"
import { createEncounter } from "../Api/EncounterApi"

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

export default function BookingManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

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

        if (!pk) {
          return <Tag color="orange">Chờ khám</Tag>;
        }

        if (pk.trang_thai === "DANG_KHAM") {
          return <Tag color="blue">Đang khám</Tag>;
        }

        if (pk.trang_thai === "HOAN_THANH") {
          return <Tag color="green">Đã khám xong</Tag>;
        }

        return null;
      },
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => {
        const pk = record.phieu_kham;
        const isDone = pk?.trang_thai === "HOAN_THANH";

        return (
          <Button
            type="primary"
            disabled={isDone}
            onClick={() => handleCreateEncounter(record)}
          >
            Examination
          </Button>
        );
      },
    },
  ];

  const handleCreateEncounter = async (record) => {
    try {
      const pk = record.phieu_kham;

      if (pk) {
        navigate(`${encounterUrl}/${record.patientId}`, {
          state: {
            ...record,
            bookingId: record.bookingId,
            doctorId: record.doctorId,
            encounterId: pk.id_phieu_kham,
          },
        });
        return;
      }

      const res = await createEncounter({
        id_benh_nhan: record.patientId,
        id_nhan_vien: record.doctorId,
        id_dat_lich: record.bookingId,
      });

      const newEncounter = res.data;

      setData((prev) =>
        prev.map((item) =>
          item.key === record.key
            ? { ...item, phieu_kham: newEncounter }
            : item
        )
      );

      navigate(`${encounterUrl}/${record.patientId}`, {
        state: {
          ...record,
          bookingId: record.bookingId,
          doctorId: record.doctorId,
          encounterId: newEncounter.id_phieu_kham,
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