import { Tag, Typography, Table } from "antd";
import dayjs from "dayjs";
import DataTable from "@/components/common/DataTable";

const { Title } = Typography;

const getStatusTag = (status) => {
  switch (status) {
    case "DA_DAT":
      return <Tag color="green">Đã Đặt</Tag>;

    case "DA_HUY":
      return <Tag color="red">Đã hủy</Tag>;

    case "DA_DEN":
      return <Tag color="blue">Đã đến</Tag>;

    default:
      return <Tag>Không xác định</Tag>;
  }
};

const getMedicalStatusTag = (status) => {
  switch (status) {
    case "HOAN_THANH":
      return <Tag color="green">Hoàn thành</Tag>;

    case "DANG_KHAM":
      return <Tag color="processing">Đang khám</Tag>;

    case "CHO_KHAM":
      return <Tag color="orange">Chờ khám</Tag>;

    case "DA_HUY":
      return <Tag color="orange">Đã huỷ</Tag>;

    default:
      return <Tag>Chưa có</Tag>;
  }
};

const columns = [
  {
    title: "Ngày khám",
    dataIndex: "thoi_gian",
    key: "ngay_kham",
    align: "center",

    render: (value) =>
      dayjs(value).format("DD/MM/YYYY"),
  },

  {
    title: "Giờ khám",
    dataIndex: "thoi_gian",
    key: "gio_kham",
    align: "center",

    render: (value) =>
      dayjs(value).format("HH:mm"),
  },

  {
    title: "Chuyên khoa",
    key: "chuyen_khoa",

    render: (_, record) =>
      record.chuyen_khoa?.ten_chuyen_khoa,
  },

  {
    title: "Bác sĩ",
    key: "bac_si",

    render: (_, record) =>
      record.bac_si?.ten_nhan_vien,
  },

  {
    title: "Lý do khám",
    dataIndex: "ly_do",
    key: "ly_do",
  },

  {
    title: "Trạng thái đặt lịch",
    dataIndex: "trang_thai",
    key: "trang_thai",
    align: "center",

    render: (status) =>
      getStatusTag(status),
  },

  {
    title: "Trạng thái phiếu khám",
    key: "trang_thai_phieu",
    align: "center",

    render: (_, record) =>
      getMedicalStatusTag(
        record.phieu_kham?.trang_thai
      ),
  },
];

const AppointmentHistory = ({ data }) => {
  return (
    <div
      style={{
        padding: 24,
        background: "#fff",
        borderRadius: 12,
      }}
    >
      <Title
        level={4}
        style={{
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Lịch sử đặt lịch khám
      </Title>

      <DataTable
        rowKey="id_dat_lich"
        columns={columns}
        data={data}
        bordered
      />
    </div>
  );
};

export default AppointmentHistory;