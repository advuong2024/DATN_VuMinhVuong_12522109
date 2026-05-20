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
      toast.error("Load data failed!");
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
            trang_thai: "HOAN_THANH",
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
        toast.success("Examination paused successfully!");
      } else {
        toast.success("Examination completed successfully!");
      }

      if ( values.trang_thai === "HOAN_THANH" && payment) {
        toast.info("Don't forget to process the payment!");
      }

      navigate("/admin/encounter");

    } catch (err) {
      console.error(err);
      toast.error("Create Error!");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Breadcrumb
        items={[
          {
            title: (
              <span onClick={() => navigate("/admin/encounter")} style={{ cursor: "pointer" }}>
                Encounter Management
              </span>
            ),
          },
          {
            title: "Examination",
          },
        ]}
      />
      <Card title="Explore information" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <b>Patient:</b> {bookingData?.name}
          </Col>

          <Col span={12}>
            <b>Doctor:</b> {bookingData?.doctor}
          </Col>

          <Col span={12}>
            <b>Phone:</b> {bookingData?.phone}
          </Col>

          <Col span={12}>
            <b>Specialty:</b> {bookingData?.specialty}
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