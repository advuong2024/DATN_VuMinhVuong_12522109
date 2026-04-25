import { Form, Input, Button, Select, Switch, Space } from "antd";
import { useEffect, useState } from "react";
import { getEmployeesNoAccount } from "../Api/AccountApi";
import { ROLE_OPTIONS } from "../Constants/account_option"

export default function AccountForm({ initialValues, onSubmit }) {
  const [form] = Form.useForm();
  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployeesNoAccount();

        const employees = Array.isArray(res.data) ? res.data : [];

        const options = employees.map(emp => ({
          label: emp.ten_nhan_vien,
          value: String(emp.id_nhan_vien),
        }));

        setEmployeeOptions(options);

      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (initialValues && employeeOptions.length > 0) {
      form.setFieldsValue({
        ...initialValues,
        employeeId: String(initialValues.employeeId),
      });
    }
  }, [initialValues, employeeOptions]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      trang_thai: values.status ? "HOAT_DONG" : "KHOA",
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
          disabled={!!initialValues}
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