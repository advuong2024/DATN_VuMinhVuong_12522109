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
        label="Họ và tên"
        name="employeeId"
        rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
      >
        <Select
          placeholder="Chọn nhân viên"
          options={employeeOptions}
          showSearch
          optionFilterProp="label"
          disabled={!!initialValues}
        />
      </Form.Item>

      <Form.Item
        label="Tên đăng nhập"
        name="username"
        rules={[
          { required: true, message: "Vui lòng nhập tên đăng nhập" },
          { min: 4, message: "Ít nhất 4 ký tự" },
        ]}
      >
        <Input placeholder="Nhập tên đăng nhập" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          {
            required: !initialValues,
            message: "Vui lòng nhập mật khẩu",
          },
          { min: 6, message: "Ít nhất 6 ký tự" },
        ]}
      >
        <Input.Password placeholder="Nhập mật khẩu" />
      </Form.Item>

      <Form.Item
        label="Vai trò"
        name="role"
        rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
      >
        <Select
          placeholder="Chọn vai trò"
          options={ROLE_OPTIONS}
        />
      </Form.Item>

      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button htmlType="submit" type="primary">
            {initialValues ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}