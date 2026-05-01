import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  Divider,
  Row,
  Col,
} from "antd";

const { TextArea } = Input;

export default function EncounterForm({ services, medicines, onSubmit }) {
  const [form] = Form.useForm();

  return (
    <Card title="Content of examination">
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onSubmit}
        onValuesChange={(changed, allValues) => {
            const services = (allValues.services || []).map((s) => ({
            ...s,
            thanh_tien: (s?.gia || 0) * (s?.so_luong || 0),
            }));

            const medicines = (allValues.medicines || []).map((m) => ({
            ...m,
            thanh_tien: (m?.gia || 0) * (m?.so_luong || 0),
            }));

            form.setFieldsValue({ services, medicines });
        }}
      >
        <Form.Item name="trieu_chung" label="Symptom">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="chan_doan" label="Diagnose">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="ghi_chu" label="Note">
          <TextArea rows={2} />
        </Form.Item>

        <Divider />

        <h3>Service</h3>
        <Form.List name="services">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name }) => (
                      <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                        <Col>
                            <Form.Item
                                name={[name, "id_dich_vu"]}
                                rules={[{ required: true }]}
                                style={{ marginBottom: 0 }}
                            >
                            <Select
                                placeholder="Select service"
                                style={{ width: 200 }}
                                options={services.filter((s) => {
                                    const current = form.getFieldValue("services") || [];

                                    const selectedIds = current
                                    .map((item) => item?.id_dich_vu)
                                    .filter(Boolean);

                                    return (
                                    !selectedIds.includes(s.value) ||
                                    s.value === form.getFieldValue(["services", name, "id_dich_vu"])
                                    );
                                })}
                                onChange={(value) => {
                                    const selected = services.find((s) => s.value === value);
                                    if (selected) {
                                    const current = form.getFieldValue("services") || [];
                                    current[name] = {
                                        ...current[name],
                                        id_dich_vu: value,
                                        gia: selected.price,
                                    };
                                    form.setFieldsValue({ services: current });
                                    }
                                }}
                            />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                name={[name, "so_luong"]}
                                rules={[{ required: true }]}
                                style={{ marginBottom: 0 }}
                            >
                            <InputNumber min={1} placeholder="quantity" />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                name={[name, "gia"]}
                                rules={[{ required: true }]}
                                style={{ marginBottom: 0 }}
                            >
                            <InputNumber disabled min={0} placeholder="price" />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                name={[name, "thanh_tien"]}
                                style={{ marginBottom: 0 }}
                            >
                                <InputNumber disabled placeholder="total" style={{ width: 120 }} />
                            </Form.Item>
                        </Col>

                        <Col>
                          <Button danger onClick={() => remove(name)}>
                            X
                          </Button>
                        </Col>
                      </Row>
                    ))}

                    <Button type="dashed" type="primary" onClick={() => add()}>
                        + Add Service
                    </Button>
                </>
            )}
        </Form.List>
        <Divider />

        <h3>Prescription</h3>
        <Form.List name="medicines">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name }) => (
                        <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                        
                        <Col>
                          <Form.Item
                            name={[name, "id_thuoc"]}
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                            >
                            <Select
                                placeholder="Select medicines"
                                options={medicines}
                                style={{ width: 200 }}
                                options={medicines.filter((m) => {
                                    const current = form.getFieldValue("medicines") || [];

                                    const selectedIds = current
                                    .map((item) => item?.id_thuoc)
                                    .filter(Boolean);

                                    return (
                                    !selectedIds.includes(m.value) ||
                                    m.value === form.getFieldValue(["medicines", name, "id_thuoc"])
                                    );
                                })}
                                onChange={(value) => {
                                    const selected = medicines.find(m => m.value === value);
                                    if (selected) {
                                    const current = [...form.getFieldValue("medicines") || []];
                                    current[name] = {
                                        ...current[name],
                                        id_thuoc: value,
                                        gia: selected.price,
                                    };
                                    form.setFieldsValue({ medicines: current });
                                    }
                                }}
                            />
                          </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                            name={[name, "so_luong"]}
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                            >
                            <InputNumber min={1} placeholder="quantity" style={{ width: 120 }} />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                            name={[name, "gia"]}
                            rules={[{ required: true }]}
                            style={{ marginBottom: 0 }}
                            >
                            <InputNumber disabled min={0} placeholder="price" />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                name={[name, "thanh_tien"]}
                                style={{ marginBottom: 0 }}
                            >
                                <InputNumber disabled placeholder="total" style={{ width: 120 }} />
                            </Form.Item>
                        </Col>

                        <Col flex="auto">
                            <Form.Item
                            name={[name, "lieu_dung"]}
                            style={{ marginBottom: 0 }}
                            >
                            <Input placeholder="Dosage" />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Button danger onClick={() => remove(name)}>
                            X
                            </Button>
                        </Col>

                        </Row>
                    ))}

                    <Button type="dashed" type="primary" onClick={() => add()}>
                        + Add medicines
                    </Button>
                </>
            )}
        </Form.List>

        <Divider />

        <Form.Item>
          <Row justify="end">
            <Space>
              <Button htmlType="submit" type="primary">
                Complete examination
              </Button>
            </Space>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
}