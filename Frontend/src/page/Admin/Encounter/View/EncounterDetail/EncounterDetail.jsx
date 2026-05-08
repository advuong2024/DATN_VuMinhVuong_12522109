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

        chi_tiets: {
          create: (values.services || []).map((s) => ({
            id_dich_vu: Number(s.id_dich_vu),
            so_luong: Number(s.so_luong || 1),
            gia: Number(s.gia),
            trang_thai: "HOAN_THANH",
            id_bac_si: bookingData.doctorId,
          })),
        },

        don_thuoc: values.medicines?.length
          ? {
              create: {
                chi_tiets: {
                  create: values.medicines.map((m) => ({
                    id_thuoc: Number(m.id_thuoc),
                    so_luong: Number(m.so_luong || 1),
                    lieu_dung: m.lieu_dung,
                    gia: Number(m.gia),
                  })),
                },
              },
            }
          : undefined,

        trang_thai: "HOAN_THANH",
      };

      const res = await updateEncounter(bookingData.encounterId, payload);

      const payment = res?.data?.payment;

      toast.success("encounter successfully!");

      if (payment) {
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
        servicesOptions={services}
        medicinesOptions={medicines}
        onSubmit={handleSubmit}
      />
    </div>
  );
}