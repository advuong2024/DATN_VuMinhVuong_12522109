import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Divider,
} from "antd";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateStatus, createEncounter, createPayment, getServices } from "../Api/BookingApi"
import { PATIENT_OPTIONS } from "@/components/common/Options";

export default function ReceptionPaymentForm({ booking, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [form] = Form.useForm();

  const selectedServices = Form.useWatch("services", form);

  useEffect(() => {
    fetchServices();
  }, []);
    
  useEffect(() => {
    if (!services || services.length === 0) return;

    if (!selectedServices || selectedServices.length === 0) {
      form.setFieldsValue({ tam_ung: 0 });
      return;
    }
    
    const total = selectedServices.reduce((sum, id) => {
        const service = services.find((s) => String(s.id_dich_vu) === String(id));
        const giaDichVu = service ? Number(service.gia) : 0; 
        return sum + giaDichVu;
    }, 0);
    
    form.setFieldsValue({ tam_ung: total });
  }, [selectedServices, services, form]);

  const fetchServices = async () => {
    try {
      const res = await getServices();
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Cannot load services");
    }
  };

  const handleSubmit = async (values) => {
    try {
        setLoading(true);

        const res = await createEncounter({
            id_dat_lich: booking.key,
            trieu_chung: "",
            chan_doan: "",
            ghi_chu: "",
            chi_tiets: values.services.map((id) => {
              const service = services.find((s) => String(s.id_dich_vu) === String(id));
              return {
                id_dich_vu: id,
                so_luong: 1,
                gia: service ? Number(service.gia) : 0,
                loai_chi_tiet: "PHI_KHAM"
              };
            }),
            trang_thai: "CHO_KHAM",
        });

        const encounter = res.data;

        if (!encounter || !encounter.chi_tiets) {
          throw new Error("No detailed response received from the encounter creation system.");
        }

        const map = new Map(
          encounter.chi_tiets.map(ct => [String(ct.id_dich_vu), ct.id_chi_tiet])
        );

        const items = values.services.map((id) => {
          const service = services.find((s) => String(s.id_dich_vu) === String(id));
          return {
            loai_item: "PHI_KHAM",
            id_item: map.get(String(id)),
            gia: service ? Number(service.gia) : 0,
            so_luong: 1,
          };
        });

        await createPayment({
          id_phieu_kham: encounter.id_phieu_kham,
          tong_tien: items.reduce((sum, i) => sum + (i.gia * i.so_luong), 0),
          phuong_thuc: values.phuong_thuc,
          items,
        });

        await updateStatus(booking.key, "DA_DEN");

        toast.success("Check-in and payment successful!");
        onSuccess();
    } catch (err) {
        console.error(err);
        toast.error(err.message || "Error during check-in/payment");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Divider>Patient Information</Divider>

      <Form.Item label="Name">
        <Input value={booking?.name} disabled style={{ color: '#000' }} />
      </Form.Item>

      <Form.Item label="Phone">
        <Input value={booking?.phone} disabled style={{ color: '#000' }} />
      </Form.Item>

      <Form.Item label="Doctor">
        <Input value={booking?.doctor} disabled style={{ color: '#000' }} />
      </Form.Item>

      <Divider>Initial Services</Divider>

      <Form.Item
        name="services"
        label="Select Services"
        rules={[{ required: true, message: "Please select at least 1 service" }]}
      >
        <Select
          mode="multiple"
          placeholder="Select services"
          allowClear
          options={services.map((s) => ({
            value: s.id_dich_vu,
            label: `${s.ten_dich_vu} - ${s.gia.toLocaleString()} VND`,
          }))}
        />
      </Form.Item>

      <Divider>Initial Payment</Divider>

      <Form.Item
        name="tam_ung"
        label="Total Payment"
        initialValue={0}
      >
        <InputNumber
            disabled
            style={{ width: "100%", color: '#d32f2f', fontWeight: 'bold' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            addonAfter="VND"
        />
      </Form.Item>

      <Form.Item
        name="phuong_thuc"
        label="Payment Method"
        initialValue="TIEN_MAT"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select payment method"
          options={ PATIENT_OPTIONS }
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={loading} style={{ marginTop: 10 }}>
        Confirm Check-in
      </Button>
    </Form>
  );
}