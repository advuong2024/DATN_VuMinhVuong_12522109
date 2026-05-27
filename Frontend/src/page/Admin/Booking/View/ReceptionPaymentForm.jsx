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
      toast.error("Không thể tải dịch vụ");
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
          throw new Error("Không nhận được phản hồi từ hệ thống tạo phiếu khám");
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

        toast.success("Đón tiếp và thanh toán thành công!");
    } catch (err) {
        console.error(err);
        toast.error(err.message || "Lỗi trong quá trình đón tiếp/thanh toán");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Divider>Thông tin bệnh nhân</Divider>

      <Form.Item label="Tên">
        <Input value={booking?.name} disabled style={{ color: '#000' }} />
      </Form.Item>

      <Form.Item label="SĐT">
        <Input value={booking?.phone} disabled style={{ color: '#000' }} />
      </Form.Item>

      <Form.Item label="Bác sĩ">
        <Input value={booking?.doctor} disabled style={{ color: '#000' }} />
      </Form.Item>

      <Divider>Dịch vụ ban đầu</Divider>

      <Form.Item
        name="services"
        label="Chọn dịch vụ"
        rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 dịch vụ" }]}
      >
        <Select
          mode="multiple"
          placeholder="Chọn dịch vụ"
          allowClear
          options={services.map((s) => ({
            value: s.id_dich_vu,
            label: `${s.ten_dich_vu} - ${s.gia.toLocaleString()} VNĐ`,
          }))}
        />
      </Form.Item>

      <Divider>Tạm ứng</Divider>

      <Form.Item
        name="tam_ung"
        label="Tổng thanh toán"
        initialValue={0}
      >
        <InputNumber
            disabled
            style={{ width: "100%", color: '#d32f2f', fontWeight: 'bold' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            addonAfter="VNĐ"
        />
      </Form.Item>

      <Form.Item
        name="phuong_thuc"
        label="Phương thức thanh toán"
        initialValue="TIEN_MAT"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Chọn phương thức"
          options={ PATIENT_OPTIONS }
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={loading} style={{ marginTop: 10 }}>
        Xác nhận đón tiếp
      </Button>
    </Form>
  );
}