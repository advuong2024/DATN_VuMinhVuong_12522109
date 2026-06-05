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
import { getNhanVienById } from "../../../User/Booking/Api/BookingApi"
import { PATIENT_OPTIONS } from "@/components/common/Options";

export default function ReceptionPaymentForm({ booking, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [doctorFee, setDoctorFee] = useState(0);
  const [form] = Form.useForm();

  const selectedServices = Form.useWatch("services", form);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const totalService = (selectedServices || []).reduce((sum, id) => {
      const sv = services.find((s) => String(s.id_dich_vu) === String(id));
      return sum + (sv ? Number(sv.gia) : 0);
    }, 0);
    form.setFieldsValue({ tam_ung: doctorFee + totalService });
  }, [selectedServices, services, doctorFee, form]);

  const fetchData = async () => {
    try {
      const doctor = await getNhanVienById(booking.id_bac_si);
      setDoctorFee(Number(doctor.phi_kham) || 0);

      const chuyenKhoa = doctor?.id_chuyen_khoa;
      const res = await getServices(chuyenKhoa);
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu");
    }
  };

  const handleSubmit = async (values) => {
    try {
        setLoading(true);

        const chiTietDichVu = (values.services || []).map((id) => {
          const sv = services.find((s) => String(s.id_dich_vu) === String(id));
          return {
            id_dich_vu: id,
            so_luong: 1,
            gia: sv ? Number(sv.gia) : 0,
            loai_chi_tiet: "PHI_KHAM",
          };
        });

        const res = await createEncounter({
            id_dat_lich: booking.key,
            trieu_chung: "",
            chan_doan: "",
            ghi_chu: "",
            chi_tiets: [
              {
                id_dich_vu: 1,
                so_luong: 1,
                gia: doctorFee,
                loai_chi_tiet: "PHI_KHAM",
              },
              ...chiTietDichVu,
            ],
            trang_thai: "CHO_KHAM",
        });

        const encounter = res.data;

        if (!encounter || !encounter.chi_tiets) {
          throw new Error("Không nhận được phản hồi từ hệ thống tạo phiếu khám");
        }

        const map = new Map(
          encounter.chi_tiets.map(ct => [String(ct.id_dich_vu), ct.id_chi_tiet])
        );

        const items = [
          {
            loai_item: "PHI_KHAM",
            id_item: map.get("1"),
            gia: doctorFee,
            so_luong: 1,
          },
          ...(values.services || []).map((id) => {
            const sv = services.find((s) => String(s.id_dich_vu) === String(id));
            return {
              loai_item: "PHI_KHAM",
              id_item: map.get(String(id)),
              gia: sv ? Number(sv.gia) : 0,
              so_luong: 1,
            };
          }),
        ];

        await createPayment({
          id_phieu_kham: encounter.id_phieu_kham,
          tong_tien: items.reduce((sum, i) => sum + (i.gia * i.so_luong), 0),
          phuong_thuc: values.phuong_thuc,
          items,
        });

        await updateStatus(booking.key, "DA_DEN");

        toast.success("Đón tiếp và thanh toán thành công!");
        onSuccess?.();
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

      <Divider>Phí khám bệnh</Divider>

      <div style={{ padding: "12px 16px", background: "#f6ffed", borderRadius: 8, border: "1px solid #b7eb8f", marginBottom: 16 }}>
        <div><strong>Bác sĩ:</strong> {booking?.doctor}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#52c41a", marginTop: 4 }}>
          Phí khám: {doctorFee ? `${doctorFee.toLocaleString()} VNĐ` : "Đang tải..."}
        </div>
      </div>

      <Divider>Dịch vụ bổ sung</Divider>

      <Form.Item
        name="services"
        label="Chọn dịch vụ"
      >
        <Select
          mode="multiple"
          placeholder="Chọn dịch vụ"
          allowClear
          options={services.map((s) => ({
            value: s.id_dich_vu,
            label: `${s.ten_dich_vu} - ${Number(s.gia).toLocaleString()} VNĐ`,
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
