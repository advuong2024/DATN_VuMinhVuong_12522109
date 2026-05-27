import { useState, useEffect, useMemo, useCallback } from "react";
import { Tabs, Button, Input, Row, Col, Tag, Modal } from "antd";
import { SearchOutlined, PlayCircleOutlined, RightCircleOutlined, EyeOutlined, } from "@ant-design/icons";
import DataTable from "@/components/common/DataTable";
import ServiceExecutionForm from "./ServiceExecutionForm";
import { getServicesByStatus, updateServiceStatus } from "../Api/ServiceExecutionApi";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const STATUS_MAP = {
  CHO_THUC_HIEN: "CHO_THUC_HIEN",
  DANG_THUC_HIEN: "DANG_THUC_HIEN",
  HOAN_THANH: "HOAN_THANH",
};

export default function ServiceExecutionPage() {
  const [activeTab, setActiveTab] = useState(STATUS_MAP.CHO_THUC_HIEN);
  const [dataMap, setDataMap] = useState({
    CHO_THUC_HIEN: [],
    DANG_THUC_HIEN: [],
    HOAN_THANH: [],
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [openView, setOpenView] = useState(false);

  const STATUSES = Object.values(STATUS_MAP);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [cho, dang, hoan] = await Promise.all(
        STATUSES.map((s) => getServicesByStatus(s))
      );
      setDataMap({
        CHO_THUC_HIEN: cho.data,
        DANG_THUC_HIEN: dang.data,
        HOAN_THANH: hoan.data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const data = dataMap[activeTab];

  const filteredData = useMemo(() => {
    if (!searchText) return data;
    const kw = searchText.toLowerCase();
    return data.filter(
      (item) =>
        item.phieu_kham?.benh_nhan?.ten_benh_nhan?.toLowerCase().includes(kw) ||
        item.phieu_kham?.benh_nhan?.so_dien_thoai?.includes(kw) ||
        item.dich_vu?.ten_dich_vu?.toLowerCase().includes(kw)
    );
  }, [data, searchText]);

  const handleStart = useCallback(async (record) => {
    try {
      await updateServiceStatus(record.id_chi_tiet, STATUS_MAP.DANG_THUC_HIEN);
      toast.success("Đã chuyển sang trạng thái Đang thực hiện");
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi chuyển trạng thái");
    }
  }, [fetchAll]);

  const handleContinue = useCallback((record) => {
    setSelectedRecord(record);
    setOpenForm(true);
  }, []);

  const handleView = useCallback((record) => {
    setViewRecord(record);
    setOpenView(true);
  }, []);

  const handleFormSuccess = () => {
    setOpenForm(false);
    setSelectedRecord(null);
    fetchAll();
  };

  const columns = useMemo(() => {
    const isHoanThanh = activeTab === STATUS_MAP.HOAN_THANH;
    const W = isHoanThanh
      ? { bn: 150, sdt: 120, dv: 160, bs: 150, nt: 150, nt2: 130, tt: 110, tac: 80 }
      : { bn: 250, sdt: 160, dv: 280, bs: 200, tt: 140, tac: 100 };

    return [
      { title: "Bệnh nhân", dataIndex: ["phieu_kham", "benh_nhan", "ten_benh_nhan"], width: W.bn, ellipsis: true },
      { title: "SĐT", dataIndex: ["phieu_kham", "benh_nhan", "so_dien_thoai"], width: W.sdt },
      { title: "Dịch vụ", dataIndex: ["dich_vu", "ten_dich_vu"], width: W.dv, ellipsis: true },
      { title: "Bác sĩ", dataIndex: ["bac_si", "ten_nhan_vien"], width: W.bs, ellipsis: true },
      ...(isHoanThanh
        ? [
            { title: "Người TH", dataIndex: ["nhan_vien_thuc_hien", "ten_nhan_vien"], width: W.nt, ellipsis: true, render: (val) => val || "-" },
            { title: "Ngày TH", dataIndex: "ngay_thuc_hien", width: W.nt2, render: (val) => (val ? dayjs(val).format("DD/MM/YYYY") : "-") },
          ]
        : []),
      {
        title: "Trạng thái",
        width: W.tt,
        align: "center",
        render: (_, record) => {
          if (record.trang_thai === STATUS_MAP.CHO_THUC_HIEN) return <Tag color="orange">Chờ TH</Tag>;
          if (record.trang_thai === STATUS_MAP.DANG_THUC_HIEN) return <Tag color="blue">Đang TH</Tag>;
          return <Tag color="green">Hoàn thành</Tag>;
        },
      },
      {
        title: "Thao tác",
        width: W.tac,
        align: "center",
        render: (_, record) => {
          if (record.trang_thai === STATUS_MAP.CHO_THUC_HIEN)
            return <Button type="primary" size="small" icon={<PlayCircleOutlined />} onClick={() => handleStart(record)} />;
          if (record.trang_thai === STATUS_MAP.DANG_THUC_HIEN)
            return <Button type="primary" size="small" icon={<RightCircleOutlined />} onClick={() => handleContinue(record)} />;
          if (record.trang_thai === STATUS_MAP.HOAN_THANH)
            return (
              <EyeOutlined
                style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                onClick={() => handleView(record)}
              />
            );
          return null;
        },
      },
    ];
  }, [activeTab, handleStart, handleContinue, handleView]);

  const tabItems = [
    { key: STATUS_MAP.CHO_THUC_HIEN, label: "Chờ thực hiện" },
    { key: STATUS_MAP.DANG_THUC_HIEN, label: "Đang thực hiện" },
    { key: STATUS_MAP.HOAN_THANH, label: "Hoàn thành" },
  ];

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      <h3 style={{ marginBottom: 16 }}>Thực hiện dịch vụ</h3>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} style={{ marginBottom: 0 }} />

      <Row gutter={16} justify="end" style={{ marginBottom: 12 }}>
        <Col span={6}>
          <Input
            placeholder="Tìm theo tên BN, SĐT, dịch vụ..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        rowKey="id_chi_tiet"
      />

      <Modal
        open={openForm}
        onCancel={() => { setOpenForm(false); setSelectedRecord(null); }}
        footer={null}
        width={600}
        title="Nhập kết quả dịch vụ"
      >
        {selectedRecord && (
          <ServiceExecutionForm
            record={selectedRecord}
            onSuccess={handleFormSuccess}
            onCancel={() => { setOpenForm(false); setSelectedRecord(null); }}
          />
        )}
      </Modal>

      <Modal
        open={openView}
        onCancel={() => { setOpenView(false); setViewRecord(null); }}
        footer={null}
        width={600}
        title={
          <div style={{ textAlign: "center" }}>
            Chi tiết kết quả khám
          </div>
        } 
        
      >
        {viewRecord && (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  { label: "Bệnh nhân", value: viewRecord.phieu_kham?.benh_nhan?.ten_benh_nhan },
                  { label: "SĐT", value: viewRecord.phieu_kham?.benh_nhan?.so_dien_thoai },
                  { label: "Dịch vụ", value: viewRecord.dich_vu?.ten_dich_vu },
                  { label: "Bác sĩ yêu cầu", value: viewRecord.bac_si?.ten_nhan_vien },
                  { label: "Người thực hiện", value: viewRecord.nhan_vien_thuc_hien?.ten_nhan_vien },
                  { label: "Ngày thực hiện", value: viewRecord.ngay_thuc_hien ? dayjs(viewRecord.ngay_thuc_hien).format("DD/MM/YYYY HH:mm") : "-" },
                  { label: "Kết quả", value: viewRecord.ket_qua },
                ].map((row) => (
                  <tr key={row.label} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, width: 160, background: "#fafafa", verticalAlign: "top" }}>{row.label}</td>
                    <td style={{ padding: "8px 12px", whiteSpace: "pre-wrap" }}>{row.value || "-"}</td>
                  </tr>
                ))}
                {viewRecord.file_ket_qua && (
                  <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, width: 160, background: "#fafafa" }}>File đính kèm</td>
                    <td style={{ padding: "8px 12px" }}>
                      {viewRecord.file_ket_qua.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
                        <img src={viewRecord.file_ket_qua} alt="Kết quả" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 4 }} />
                      ) : (
                        <a href={viewRecord.file_ket_qua} target="_blank" rel="noopener noreferrer">Tải file</a>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
