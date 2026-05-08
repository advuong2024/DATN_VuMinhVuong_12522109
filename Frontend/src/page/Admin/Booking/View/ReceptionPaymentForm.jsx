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
import { updateStatus, createEncounter, 
    createPayment, getServices } from "../Api/BookingApi"
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
    if (!selectedServices || services.length === 0) return;
    
    const total = selectedServices.reduce((sum, id) => {
        const service = services.find((s) => s.id_dich_vu === id);
        return sum + (service?.gia || 0);
    }, 0);
    
    form.setFieldsValue({ tam_ung: total });
  }, [selectedServices, services]);

  const fetchServices = async () => {
    try {
      const res = await getServices();
      setServices(res.data);
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
            chi_tiets: {
              create: values.services.map((id) => ({
                id_dich_vu: id,
                so_luong: 1,
                gia: services.find((s) => s.id_dich_vu === id)?.gia || 0,
              })),
            },
            trang_thai: "CHO_KHAM",
        });

        const encounterId = res.data.id_phieu_kham;

        await createPayment({
          id_phieu_kham: encounterId,
          loai_thanh_toan: "PHI_KHAM",
          trang_thai: "DA_THANH_TOAN",
          tong_tien: values.tam_ung || 0,
          phuong_thuc: values.phuong_thuc,
        });

        await updateStatus(booking.key, "DA_DEN");

        toast.success("Check-in and payment successful!");
        onSuccess();
    } catch (err) {
        console.error(err);
        toast.error("Error during check-in/payment");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Divider>Patient Information</Divider>

      <Form.Item label="Name">
        <Input value={booking?.name} disabled />
      </Form.Item>

      <Form.Item label="Phone">
        <Input value={booking?.phone} disabled />
      </Form.Item>

      <Form.Item label="Doctor">
        <Input value={booking?.doctor} disabled />
      </Form.Item>

      <Divider>Initial Services</Divider>

      <Form.Item
        name="services"
        label="Select Services"
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          placeholder="Select services"
          options={services.map((s) => ({
            value: s.id_dich_vu,
            label: `${s.ten_dich_vu} - ${s.gia.toLocaleString()}đ`,
          }))}
        />
      </Form.Item>

      <Divider>Initial Payment</Divider>

      <Form.Item
        name="tam_ung"
        label="Total Payment"
        >
        <InputNumber
            disabled
            style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="phuong_thuc"
        label="Payment Method"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select payment method"
          options={ PATIENT_OPTIONS }
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={loading}>
        Confirm Check-in
      </Button>
    </Form>
  );
}