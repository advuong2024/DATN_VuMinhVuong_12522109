import { Card, Form, Input, Button, Tabs, Table, InputNumber, Select, Space, Tag, Modal } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { CheckCircleOutlined, HourglassOutlined, EyeOutlined } from "@ant-design/icons";
import PrintPreviewModal from "@/components/print/PrintPreviewModal";
import PrintServiceRequest from "@/components/print/PrintServiceRequest";
import PrintEncounter from "@/components/print/PrintEncounter";
import PrintPrescription from "@/components/print/PrintPrescription";

const { TextArea } = Input;

export default function EncounterForm({ bookingData, servicesOptions, medicinesOptions, onSubmit }) {
  const [form] = Form.useForm();
  const symptoms = Form.useWatch("trieu_chung", form);
  const diagnosis = Form.useWatch("chan_doan", form);
  const [services, setServices] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [hiddenServices, setHiddenServices] = useState([]);
  const [showServiceRequest, setShowServiceRequest] = useState(false);
  const [showEncounter, setShowEncounter] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [viewingResult, setViewingResult] = useState(null);

  const calcTotal = (gia = 0, so_luong = 0) => gia * so_luong;

  useEffect(() => {
    if (!bookingData) return;

    const pk = bookingData.phieu_kham;

    const allServices =
      pk?.chi_tiets?.map((ct) => ({
        id_chi_tiet: ct.id_chi_tiet,
        id_dich_vu: ct.id_dich_vu,
        so_luong: ct.so_luong,
        gia: Number(ct.gia),
        thanh_tien: ct.so_luong * Number(ct.gia),
        loai_chi_tiet: ct.loai_chi_tiet,
        trang_thai: ct.trang_thai,
        ket_qua: ct.ket_qua,
        file_ket_qua: ct.file_ket_qua,
        is_paid: ct.is_paid,
      })) || [];

    const visibleServices = allServices.filter(s => s.loai_chi_tiet !== "PHI_KHAM");
    const internalServices = allServices.filter(s => s.loai_chi_tiet === "PHI_KHAM");

    const medicineData =
      bookingData.don_thuoc?.chi_tiets?.map((ct) => ({
        id_chi_tiet: ct.id_chi_tiet,
        id_thuoc: ct.id_thuoc,
        so_luong: ct.so_luong,
        lieu_dung: ct.lieu_dung,
        gia: Number(ct.gia),
        thanh_tien: ct.so_luong * Number(ct.gia),
      })) || [];

    setServices(visibleServices);
    setHiddenServices(internalServices);
    setMedicines(medicineData);

    form.setFieldsValue({
      trieu_chung: pk?.trieu_chung,
      chan_doan: pk?.chan_doan,
      ghi_chu: bookingData.ghi_chu,
      trang_thai: bookingData.trang_thai,
    });
  }, [bookingData]);

  const serviceColumns = [
    {
      title: "Dịch vụ",
      align: "center",
      dataIndex: "id_dich_vu",
      render: (_, record, index) => {
        const hiddenIds = services.flatMap((s, i) => {
          if (i === index) return [];
          if (s.id_chi_tiet && s.trang_thai !== "HOAN_THANH") return [s.id_dich_vu];
          if (!s.id_chi_tiet && s.id_dich_vu) return [s.id_dich_vu];
          return [];
        });
        return (
          <Select
            style={{ width: 200 }}
            placeholder="Chọn"
            value={record.id_dich_vu}
            disabled={record.is_paid}
            options={servicesOptions.filter(o => !hiddenIds.includes(o.value))}
            onChange={(value) => {
              const selected = servicesOptions.find(s => s.value === value);
              const newData = [...services];
              const price = selected?.price || 0;
              const quantity = newData[index]?.so_luong || 1;
              newData[index] = {
                ...newData[index],
                id_dich_vu: value,
                gia: price,
                thanh_tien: calcTotal(price, quantity)
              };
              setServices(newData);
            }}
          />
        );
      }
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={record.so_luong}
          disabled={record.is_paid}
          onChange={(value) => {
            const newData = [...services];
            newData[index].so_luong = value;
            newData[index].thanh_tien = calcTotal(newData[index].gia, value);
            setServices(newData);
          }}
        />
      )
    },
    {
      title: "Đơn giá",
      align: "center",
      dataIndex: "gia",
      render: (val) => <InputNumber value={val} disabled />
    },
    {
      title: "Thành tiền",
      align: "center",
      dataIndex: "thanh_tien",
      render: (val) => <InputNumber value={val} disabled />
    },
    {
      title: "Kết quả",
      align: "center",
      width: 120,
      render: (_, record) => {
        if (record.trang_thai === "HOAN_THANH")
          return (
            <Space>
              <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>
              <EyeOutlined
                style={{ fontSize: 16, color: "#1677ff", cursor: "pointer" }}
                onClick={() => { setViewingResult(record); setOpenResult(true); }}
              />
            </Space>
          );
        return <Tag color="orange" icon={<HourglassOutlined />}>Chờ TH</Tag>;
      },
    },
    {
      title: "",
      align: "center",
      render: (_, record, index) => (
        <Button danger disabled={record.is_paid} onClick={() => setServices(services.filter((_, i) => i !== index))}>
          X
        </Button>
      )
    }
  ];

  const medicineColumns = [
    {
      title: "Thuốc",
      align: "center",
      dataIndex: "id_thuoc",
      render: (_, record, index) => {
        const hiddenIds = medicines.flatMap((s, i) =>
          i !== index && s.id_thuoc ? [s.id_thuoc] : []
        );
        return (
          <Select
            style={{ width: 200 }}
            placeholder="Chọn"
            value={record.id_thuoc}
            options={medicinesOptions.filter(o => !hiddenIds.includes(o.value))}
            onChange={(value) => {
              const selected = medicinesOptions.find(m => m.value === value);
              const newData = [...medicines];
              const price = selected?.price || 0;
              const quantity = newData[index]?.so_luong || 1;
              newData[index] = {
                ...newData[index],
                id_thuoc: value,
                gia: price,
                thanh_tien: calcTotal(price, quantity)
              };
              setMedicines(newData);
            }}
          />
        );
      }
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={record.so_luong}
          onChange={(value) => {
            const newData = [...medicines];
            newData[index].so_luong = value;
            newData[index].thanh_tien = calcTotal(newData[index].gia, value);
            setMedicines(newData);
          }}
        />
      )
    },
    {
      title: "Liều dùng",
      align: "center",
      dataIndex: "lieu_dung",
      render: (_, record, index) => (
        <Input
          value={record.lieu_dung}
          onChange={(e) => {
            const newData = [...medicines];
            newData[index].lieu_dung = e.target.value;
            setMedicines(newData);
          }}
        />
      )
    },
    {
      title: "",
      align: "center",
      render: (_, __, index) => (
        <Button danger onClick={() => setMedicines(medicines.filter((_, i) => i !== index))}>
          X
        </Button>
      )
    }
  ];

  const handlePauseExamination = async () => {
    try {
      const values = form.getFieldsValue();

      onSubmit({
        ...values,
        services: [...hiddenServices, ...services],
        medicines,
        trang_thai: "NHAP",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteExamination = async () => {
    try {
      const values = form.getFieldsValue();

      onSubmit({
        ...values,
        services: [...hiddenServices, ...services],
        medicines,
        trang_thai: "HOAN_THANH",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card title="Khám bệnh">
      <Form layout="vertical" form={form}>
        <Form.Item
          name="trieu_chung"
          label="Triệu chứng"
          rules={[
            {
              validator: (_, value) => {
                if (!value || !value.trim()) {
                  return Promise.reject(
                    new Error(
                      "Vui lòng nhập triệu chứng"
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item
          name="chan_doan"
          label="Chẩn đoán"
          rules={[
            {
              validator: (_, value) => {
                if (!value || !value.trim()) {
                  return Promise.reject(
                    new Error(
                      "Vui lòng nhập chẩn đoán"
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item name="ghi_chu" label="Ghi chú">
          <TextArea />
        </Form.Item>

        <Tabs
          items={[
            {
              key: "1",
              label: "Dịch vụ",
              children: (
                <>
                  <Space style={{ marginBottom: 10 }}>
                    <Button
                      type="primary"
                      onClick={() => setServices([...services, { so_luong: 1 }])}
                    >
                      + Thêm dịch vụ
                    </Button>
                    <Button
                      type="primary"
                      disabled={services.length === 0}
                      onClick={() => setShowServiceRequest(true)}
                    >
                      In phiếu yêu cầu
                    </Button>
                  </Space>
                  <Table
                    dataSource={services}
                    columns={serviceColumns}
                    pagination={false}
                    rowKey={(_, index) => index}
                  />
                </>
              )
            },
            {
              key: "2",
              label: "Thuốc",
              children: (
                <>
                  <Space style={{ marginBottom: 10 }}>
                    <Button
                      type="primary"
                      onClick={() => setMedicines([...medicines, { so_luong: 1 }])}
                    >
                      + Thêm thuốc
                    </Button>
                    <Button
                      type="primary"
                      disabled={medicines.length === 0}
                      onClick={() => setShowPrescription(true)}
                    >
                      In đơn thuốc
                    </Button>
                  </Space>
                  <Table
                    dataSource={medicines}
                    columns={medicineColumns}
                    pagination={false}
                    rowKey={(_, index) => index}
                  />
                </>
              )
            }
          ]}
        />

        <Space style={{ marginTop: 20 }}>
          <Button type="primary" onClick={handlePauseExamination}>
            Tạm dừng
          </Button>
          <Button
            type="primary"
            disabled={!symptoms?.trim() || !diagnosis?.trim()}
            onClick={handleCompleteExamination}
          >
            Hoàn thành
          </Button>
          <Button
            type="primary"
            disabled={!symptoms?.trim() || !diagnosis?.trim()}
            onClick={() => setShowEncounter(true)}
          >
            In phiếu khám
          </Button>
        </Space>
      </Form>

      <PrintPreviewModal
        open={showServiceRequest}
        onClose={() => setShowServiceRequest(false)}
        title="Phiếu yêu cầu dịch vụ"
        filename={`yeu_cau_dich_vu_${bookingData?.encounterId || ""}.pdf`}
      >
        <PrintServiceRequest
          patientName={bookingData?.name}
          patientPhone={bookingData?.phone}
          doctorName={bookingData?.doctor}
          encounterCode={bookingData?.encounterId ? `PK${String(bookingData.encounterId).padStart(3, "0")}` : ""}
          date={dayjs().format("DD/MM/YYYY")}
          services={services.filter(s => s.id_dich_vu).map(s => ({
            name: servicesOptions.find(o => o.value === s.id_dich_vu)?.label || "",
            quantity: s.so_luong || 1,
            price: s.gia || 0,
          }))}
          total={services.filter(s => s.id_dich_vu).reduce((sum, s) => sum + (s.gia || 0) * (s.so_luong || 1), 0)}
        />
      </PrintPreviewModal>

      <PrintPreviewModal
        open={showEncounter}
        onClose={() => setShowEncounter(false)}
        title="Phiếu khám bệnh"
        filename={`phieu_kham_${bookingData?.encounterId || ""}.pdf`}
      >
        <PrintEncounter
          patientName={bookingData?.name}
          patientPhone={bookingData?.phone}
          doctorName={bookingData?.doctor}
          encounterCode={bookingData?.encounterId ? `PK${String(bookingData.encounterId).padStart(3, "0")}` : ""}
          date={dayjs().format("DD/MM/YYYY")}
          symptoms={form.getFieldValue("trieu_chung")}
          diagnosis={form.getFieldValue("chan_doan")}
          note={form.getFieldValue("ghi_chu")}
          services={[...hiddenServices, ...services].filter(s => s.id_dich_vu).map(s => ({
            name: servicesOptions.find(o => o.value === s.id_dich_vu)?.label || "",
            quantity: s.so_luong || 1,
            price: s.gia || 0,
          }))}
          status={bookingData?.trang_thai || "CHO_KHAM"}
        />
      </PrintPreviewModal>

      <PrintPreviewModal
        open={showPrescription}
        onClose={() => setShowPrescription(false)}
        title="Đơn thuốc"
        filename={`don_thuoc_${bookingData?.encounterId || ""}.pdf`}
      >
        <PrintPrescription
          patientName={bookingData?.name}
          patientPhone={bookingData?.phone}
          doctorName={bookingData?.doctor}
          encounterCode={bookingData?.encounterId ? `PK${String(bookingData.encounterId).padStart(3, "0")}` : ""}
          date={dayjs().format("DD/MM/YYYY")}
          diagnosis={form.getFieldValue("chan_doan")}
          note={form.getFieldValue("ghi_chu")}
          medicines={medicines.filter(m => m.id_thuoc).map(m => ({
            name: medicinesOptions.find(o => o.value === m.id_thuoc)?.label || "",
            quantity: m.so_luong || 1,
            price: m.gia || 0,
            unit: "",
            dosage: m.lieu_dung || "",
          }))}
        />
      </PrintPreviewModal>

      <Modal
        open={openResult}
        onCancel={() => { setOpenResult(false); setViewingResult(null); }}
        footer={null}
        width={600}
        title={
          <div style={{textAlign: "center"}}>Kết quả khám</div>
        }
      >
        {viewingResult && (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  { label: "Dịch vụ", value: servicesOptions.find(o => o.value === viewingResult.id_dich_vu)?.label || "-" },
                  { label: "Bệnh nhân", value: bookingData?.name },
                  { label: "Bác sĩ yêu cầu", value: bookingData?.doctor },
                  { label: "Kết quả", value: viewingResult.ket_qua },
                ].map((row) => (
                  <tr key={row.label} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, width: 140, background: "#fafafa", verticalAlign: "top" }}>{row.label}</td>
                    <td style={{ padding: "8px 12px", whiteSpace: "pre-wrap" }}>{row.value || "-"}</td>
                  </tr>
                ))}
                {viewingResult.file_ket_qua && (
                  <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, width: 140, background: "#fafafa" }}>File đính kèm</td>
                    <td style={{ padding: "8px 12px" }}>
                      {viewingResult.file_ket_qua.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
                        <img src={viewingResult.file_ket_qua} alt="Kết quả" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 4 }} />
                      ) : (
                        <a href={viewingResult.file_ket_qua} target="_blank" rel="noopener noreferrer">Tải file</a>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </Card>
  );
}
