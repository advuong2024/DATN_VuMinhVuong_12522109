import { Card, Breadcrumb } from "antd";
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

  console.log("bookingData:", bookingData);

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
            so_luong: Number(s.so_luong),
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
                    so_luong: Number(m.so_luong),
                    lieu_dung: m.lieu_dung,
                    gia: Number(m.gia),
                  })),
                },
              },
            }
          : undefined,

        trang_thai: "HOAN_THANH",
      };

      await updateEncounter(bookingData.encounterId, payload);

      toast.success("Create success!");
      navigate("/admin/encounter");
    } catch (err) {
      console.error(err);
      toast.error("Create Error!");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigate("/admin/encounter")} style={{ cursor: "pointer" }}>
          Encounter Management
        </Breadcrumb.Item>

        <Breadcrumb.Item>Examination</Breadcrumb.Item>
      </Breadcrumb>
      <Card title="Explore information" style={{ marginBottom: 16 }}>
        <p><b>Patient:</b> {bookingData?.name}</p>
        <p><b>Docter:</b> {bookingData?.doctor}</p>
      </Card>

      <EncounterForm
        services={services}
        medicines={medicines}
        onSubmit={handleSubmit}
      />
    </div>
  );
}