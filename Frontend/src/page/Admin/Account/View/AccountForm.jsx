import { Form, Input, Button, Select, Switch, Space, Radio } from "antd";
import { useEffect, useState } from "react";
import { getEmployeesNoAccount, getPatientsNoAccount } from "../Api/AccountApi";
import { ROLE_OPTIONS } from "../Constants/account_option"

export default function AccountForm({ initialValues, onSubmit }) {
  const [form] = Form.useForm();
  const [accountType, setAccountType] = useState("staff");
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployeesNoAccount();
        const employees = Array.isArray(res.data) ? res.data : [];
        setEmployeeOptions(
          employees.map(emp => ({
            label: emp.ten_nhan_vien,
            value: String(emp.id_nhan_vien),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    const fetchPatients = async () => {
      try {
        const res = await getPatientsNoAccount();
        const patients = Array.isArray(res.data) ? res.data : [];
        setPatientOptions(
          patients.map(p => ({
            label: `${p.ten_benh_nhan} (${p.so_dien_thoai || "N/A"})`,
            value: String(p.id_benh_nhan),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
    fetchPatients();
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
      username: values.username,
      password: values.password,
      trang_thai: values.status ? "HOAT_DONG" : "KHOA",
      vai_tro: values.role,
    };

    if (accountType === "staff") {
      payload.id_nhan_vien = Number(values.employeeId);
    } else {
      payload.id_benh_nhan = Number(values.patientId);
    }

    onSubmit(payload);
    form.resetFields();
  };

  const handleTypeChange = (e) => {
    setAccountType(e.target.value);
    form.setFieldsValue({ employeeId: undefined, patientId: undefined });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ status: true, hien_thi: true }}
    >
      <Form.Item label="Loại tài khoản">
        <Radio.Group value={accountType} onChange={handleTypeChange}>
          <Radio value="staff">Nhân viên</Radio>
          <Radio value="patient">Bệnh nhân</Radio>
        </Radio.Group>
      </Form.Item>

      {accountType === "staff" ? (
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
      ) : (
        <Form.Item
          label="Bệnh nhân"
          name="patientId"
          rules={[{ required: true, message: "Vui lòng chọn bệnh nhân" }]}
        >
          <Select
            placeholder="Chọn bệnh nhân"
            options={patientOptions}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      )}

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
          options={
            accountType === "patient"
              ? ROLE_OPTIONS.filter((r) => r.value === "NGUOI_DUNG")
              : ROLE_OPTIONS
          }
        />
      </Form.Item>

      <Form.Item label="Trạng thái" name="status" valuePropName="checked">
        <Switch checkedChildren="Hoạt động" unCheckedChildren="Khóa" />
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
