import { Card, Form, Input, Button, Tabs, Table, InputNumber, Select, Space } from "antd";
import { useState, useEffect } from "react";

const { TextArea } = Input;

export default function EncounterForm({ bookingData, servicesOptions, medicinesOptions, onSubmit }) {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [hiddenServices, setHiddenServices] = useState([]);

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
      title: "Service",
      align: "center",
      dataIndex: "id_dich_vu",
      render: (_, record, index) => (
        <Select
          style={{ width: 200 }}
          placeholder="Select"
          value={record.id_dich_vu}
          disabled={record.is_paid}
          options={servicesOptions}
          onChange={(value) => {
            const selected = servicesOptions.find(s => s.value === value);
            const newData = [...services];
            newData[index] = {
              ...newData[index],
              id_dich_vu: value,
              gia: selected?.price || 0
            };
            setServices(newData);
          }}
        />
      )
    },
    {
      title: "Quantity",
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
      title: "Price",
      align: "center",
      dataIndex: "gia",
      render: (val) => <InputNumber value={val} disabled />
    },
    {
      title: "Total",
      align: "center",
      dataIndex: "thanh_tien",
      render: (val) => <InputNumber value={val} disabled />
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
      title: "Medicine",
      align: "center",
      dataIndex: "id_thuoc",
      render: (_, record, index) => (
        <Select
          style={{ width: 200 }}
          placeholder="Select"
          value={record.id_thuoc}
          options={medicinesOptions}
          onChange={(value) => {
            const selected = medicinesOptions.find(m => m.value === value);
            const newData = [...medicines];
            newData[index] = {
              ...newData[index],
              id_thuoc: value,
              gia: selected?.price || 0
            };
            setMedicines(newData);
          }}
        />
      )
    },
    {
      title: "Quantity",
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
      title: "Price",
      align: "center",
      dataIndex: "gia",
      render: (val) => <InputNumber value={val} disabled />
    },
    {
      title: "Total",
      align: "center",
      dataIndex: "thanh_tien",
      render: (val) => <InputNumber value={val} disabled />
    },
    {
      title: "Dosage",
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
    <Card title="Examination">
      <Form layout="vertical" form={form}>
        <Form.Item
          name="trieu_chung"
          label="Symptom"
          rules={[
            {
              validator: (_, value) => {
                if (!value || !value.trim()) {
                  return Promise.reject(
                    new Error(
                      "Please enter symptom"
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
          label="Diagnose"
          rules={[
            {
              validator: (_, value) => {
                if (!value || !value.trim()) {
                  return Promise.reject(
                    new Error(
                      "Please enter diagnose"
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

        <Form.Item name="ghi_chu" label="Note">
          <TextArea />
        </Form.Item>

        <Tabs
          items={[
            {
              key: "1",
              label: "Services",
              children: (
                <>
                  <Button
                    type="primary"
                    onClick={() => setServices([...services, {}])}
                    style={{ marginBottom: 10 }}
                  >
                    + Add Service
                  </Button>
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
              label: "Medicines",
              children: (
                <>
                  <Button
                    type="primary"
                    onClick={() => setMedicines([...medicines, {}])}
                    style={{ marginBottom: 10 }}
                  >
                    + Add Medicine
                  </Button>
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
            Pause Examination
          </Button>
          <Button type="primary" onClick={handleCompleteExamination}>
            Complete Examination
          </Button>
        </Space>
      </Form>
    </Card>
  );
}
