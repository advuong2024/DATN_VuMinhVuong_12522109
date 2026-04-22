import { Form, Input, Button, Select, Switch, Space } from "antd";
import { useEffect, useState } from "react";

const ROLE_OPTIONS = [
  { label: "Admin", value: "ADMIN" },
  { label: "Staff", value: "STAFF" },
];

export default function AccountForm({ initialValues, onSubmit }) {
  const [form] = Form.useForm();
  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        status: initialValues.status === "ACTIVE",
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  useEffect(() => {
    const data = [
        { id: "1", name: "Nguyễn Văn A" },
        { id: "2", name: "Trần Thị B" },
    ];

    setEmployeeOptions(
        data.map(emp => ({
        label: emp.name,
        value: emp.id,
        }))
    );
  }, []);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      status: values.status ? "ACTIVE" : "INACTIVE",
    };

    onSubmit(payload);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="Full Name"
        name="employeeId"
        rules={[{ required: true, message: "Please select an employee" }]}
      >
        <Select
            placeholder="Select Employee"
            options={employeeOptions}
            showSearch
            optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Please enter a username" },
          { min: 4, message: "At least 4 characters" },
        ]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: !initialValues,
            message: "Please enter a password",
          },
          { min: 6, message: "At least 6 characters" },
        ]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: "Please select a role" }]}
      >
        <Select
          placeholder="Select Role"
          options={ROLE_OPTIONS}
        />
      </Form.Item>

      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button htmlType="submit" type="primary">
            {initialValues ? "Update" : "Add"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}