import { Card, Form, Input, Button, Tabs, Table, InputNumber, Select, Space } from "antd";
import { useState } from "react";

const { TextArea } = Input;

export default function EncounterForm({ servicesOptions, medicinesOptions, onSubmit }) {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const calcTotal = (gia = 0, so_luong = 0) => gia * so_luong;

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
      render: (_, __, index) => (
        <Button danger onClick={() => setServices(services.filter((_, i) => i !== index))}>
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

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    onSubmit({
      ...values,
      services,
      medicines
    });
  };

  return (
    <Card title="Examination">
      <Form layout="vertical" form={form}>
        <Form.Item name="trieu_chung" label="Symptom">
          <TextArea />
        </Form.Item>

        <Form.Item name="chan_doan" label="Diagnose">
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
          <Button type="primary" onClick={handleSubmit}>
            Complete Examination
          </Button>
        </Space>
      </Form>
    </Card>
  );
}
