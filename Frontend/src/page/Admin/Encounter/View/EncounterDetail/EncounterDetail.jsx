import { Card, Breadcrumb, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EncounterForm from "./EncounterFrom";

import {
  getServices,
  getMedicines,
  updateEncounter,
} from "../../Api/EncounterApi";
import { toast } from "react-toastify";

export default function EncounterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  const [services, setServices] = useState([]);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [serviceRes, medicineRes] = await Promise.all([
        getServices(),
        getMedicines(),
      ]);

      setServices(
        serviceRes.data.map((s) => ({
          label: s.ten_dich_vu,
          value: s.id_dich_vu,
          price: s.gia,
        }))
      );

      setMedicines(
        medicineRes.data.map((m) => ({
          label: m.ten_thuoc,
          value: m.id_thuoc,
          price: m.gia,
        }))
      );

    } catch {
      toast.error("Tải dữ liệu thất bại!");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        trieu_chung: values.trieu_chung,
        chan_doan: values.chan_doan,
        ghi_chu: values.ghi_chu,
        trang_thai: values.trang_thai,

        chi_tiets: (values.services || [])
          .filter((s) => s.id_dich_vu)
          .map((s) => ({
            id_chi_tiet: s.id_chi_tiet,
            id_dich_vu: Number(s.id_dich_vu),
            so_luong: Number(s.so_luong || 1),
            gia: Number(s.gia),
            trang_thai: s.loai_chi_tiet === "PHI_KHAM" ? "HOAN_THANH" : (s.trang_thai || "CHO_THUC_HIEN"),
            id_bac_si: bookingData.doctorId,
            loai_chi_tiet: s.loai_chi_tiet || "DICH_VU",
          })),

        don_thuoc: (values.medicines || [])
          .filter((m) => m.id_thuoc)
          .map((m) => ({
            id_chi_tiet: m.id_chi_tiet,
            id_thuoc: Number(m.id_thuoc),
            so_luong: Number(m.so_luong || 1),
            lieu_dung: m.lieu_dung,
            gia: Number(m.gia),
          })),
      };

      const res = await updateEncounter(bookingData.encounterId, payload);
      const payment = res?.data?.payment;
      if (values.trang_thai === "NHAP") {
        toast.success("Tạm dừng khám bệnh!");
      } else {
        toast.success("Hoàn thành khám bệnh!");
      }
      
      navigate("/admin/encounter");

    } catch (err) {
      console.error(err);
      toast.error("Lỗi tạo phiếu khám!");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Breadcrumb
        items={[
          {
            title: (
              <span onClick={() => navigate("/admin/encounter")} style={{ cursor: "pointer" }}>
                Quản lý phiên khám
              </span>
            ),
          },
          {
            title: "Khám bệnh",
          },
        ]}
      />
      <Card title="Thông tin khám" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <b>Bệnh nhân:</b> {bookingData?.name}
          </Col>

          <Col span={12}>
            <b>Bác sĩ:</b> {bookingData?.doctor}
          </Col>

          <Col span={12}>
            <b>SĐT:</b> {bookingData?.phone}
          </Col>

          <Col span={12}>
            <b>Chuyên khoa:</b> {bookingData?.specialty}
          </Col>
        </Row>
      </Card>

      <EncounterForm
        bookingData= {bookingData}
        servicesOptions={services}
        medicinesOptions={medicines}
        onSubmit={handleSubmit}
        initialValues={{
          trieu_chung: bookingData?.trieu_chung,
          chan_doan: bookingData?.chan_doan,
          ghi_chu: bookingData?.ghi_chu,
        }}
      />
    </div>
  );
}