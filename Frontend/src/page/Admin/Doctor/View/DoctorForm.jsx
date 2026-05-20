import { Form, Input, Select, DatePicker, Button, Space, Row, Col, Divider, List } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { SPECIALTY_OPTIONS, POSITION_OPTIONS } from "../Constants/doctor_option";
import { GENDER_OPTIONS } from "@/components/common/Options";
import { createDoctor, updateDoctor, getSpecialties, getCertificates, createCertificate, deleteCertificate } from "../Api/DoctorApi";
import ImageUpload from "@/components/common/ImageUpload";
import { toast } from "react-toastify";

export default function PatientForm({ form, initialValues, onSuccess }) {
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [certs, setCerts] = useState([]);
  const [pendingCerts, setPendingCerts] = useState([]);
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertYear, setNewCertYear] = useState("");

  const loadCerts = async (id) => {
    try {
      const res = await getCertificates(id);
      setCerts(res.data || []);
    } catch {
      setCerts([]);
    }
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dob: initialValues.dob ? dayjs(initialValues.dob) : null,
      });
      if (initialValues.key) {
        loadCerts(initialValues.key);
      }
    } else {
      form.resetFields();
      setCerts([]);
      setPendingCerts([]);
    }
  }, [initialValues, form]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await getSpecialties();
        const list = res.data?.data || res.data || [];
        setSpecialtyOptions(
          list.map((item) => ({
            label: item.ten_chuyen_khoa,
            value: Number(item.id_chuyen_khoa),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchSpecialties();
  }, []);

  const handleAddCert = () => {
    if (!newCertName.trim()) {
      toast.warning("Nhập tên chứng chỉ");
      return;
    }

    if (initialValues?.key) {
      createCertificate({
        id_nhan_vien: initialValues.key,
        name: newCertName.trim(),
        issuer: newCertIssuer.trim() || null,
        year: newCertYear ? Number(newCertYear) : null,
      }).then((res) => {
        setCerts((prev) => [...prev, res.data]);
        toast.success("Thêm chứng chỉ thành công");
      }).catch(() => toast.error("Thêm chứng chỉ thất bại"));
    } else {
      setPendingCerts((prev) => [
        ...prev,
        {
          _tempId: Date.now(),
          ten_chung_chi: newCertName.trim(),
          noi_cap: newCertIssuer.trim() || null,
          nam_cap: newCertYear ? Number(newCertYear) : null,
        },
      ]);
    }

    setNewCertName("");
    setNewCertIssuer("");
    setNewCertYear("");
  };

  const handleDeleteCert = (item) => {
    if (item.id_chung_chi) {
      deleteCertificate(item.id_chung_chi)
        .then(() => {
          setCerts((prev) => prev.filter((c) => c.id_chung_chi !== item.id_chung_chi));
          toast.success("Đã xóa chứng chỉ");
        })
        .catch(() => toast.error("Xóa chứng chỉ thất bại"));
    } else {
      setPendingCerts((prev) => prev.filter((c) => c._tempId !== item._tempId));
    }
  };

  const handleFinish = async (values) => {
    const payload = {
      ...values,
      dob: values.dob?.format("YYYY-MM-DD"),
      hinh_anh: values.hinh_anh || null,
    };

    try {
      if (initialValues) {
        await updateDoctor(initialValues.key, payload);
        toast.success("Update success");
        onSuccess();
        form.resetFields();
      } else {
        const res = await createDoctor(payload);
        const newId = res.data?.id_nhan_vien || res.data?.id;
        if (newId && pendingCerts.length > 0) {
          await Promise.all(
            pendingCerts.map((c) =>
              createCertificate({
                id_nhan_vien: newId,
                name: c.ten_chung_chi,
                issuer: c.noi_cap,
                year: c.nam_cap,
              })
            )
          );
        }
        toast.success("Create success");
        onSuccess();
        form.resetFields();
      }
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  const allCerts = [...certs, ...pendingCerts];

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Họ tên" name="name"
            rules={[
              { required: true, message: "Please enter doctor name" },
              { pattern: /^[^\d]+$/, message: "Does not contain numbers" },
            ]}
          >
            <Input placeholder="Enter doctor name" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Ngày sinh" name="dob"
            rules={[{ required: true, message: "Please select date of birth" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" allowClear />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Giới tính" name="gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select placeholder="Select gender" options={GENDER_OPTIONS} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Số điện thoại" name="phone"
            rules={[
              { required: true, message: "Please enter phone number" },
              { pattern: /^[0-9]{10}$/, message: "Must be 10 digits" },
            ]}
          >
            <Input placeholder="Enter phone number" maxLength={10} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Chức vụ" name="position"
            rules={[{ required: true, message: "Please select position" }]}
          >
            <Input placeholder="Enter Position" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Chuyên khoa" name="specialty">
            <Select placeholder="Select specialty" options={specialtyOptions} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Bằng cấp" name="degree">
            <Input placeholder="Enter degree" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Năm kinh nghiệm" name="experience">
            <Input placeholder="Enter years of experience" type="number" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Cơ sở" name="location">
            <Input placeholder="Enter location" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Ảnh đại diện" name="hinh_anh">
            <ImageUpload />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Mô tả ngắn" name="short_desc">
            <Input.TextArea rows={3} placeholder="Enter short description" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Địa chỉ" name="address">
            <Input placeholder="Enter address" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Chứng chỉ</Divider>
      <List
        size="small"
        dataSource={allCerts}
        locale={{ emptyText: "Chưa có chứng chỉ" }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <DeleteOutlined
                key="delete"
                style={{ color: "#ff4d4f", cursor: "pointer" }}
                onClick={() => handleDeleteCert(item)}
              />,
            ]}
          >
            <List.Item.Meta
              title={item.ten_chung_chi}
              description={`${item.noi_cap || ""}${item.nam_cap ? ` - ${item.nam_cap}` : ""}`}
            />
          </List.Item>
        )}
      />
      <Space style={{ width: "100%", marginTop: 8 }} align="start">
        <Input
          placeholder="Tên chứng chỉ"
          value={newCertName}
          onChange={(e) => setNewCertName(e.target.value)}
          style={{ width: 200 }}
        />
        <Input
          placeholder="Nơi cấp"
          value={newCertIssuer}
          onChange={(e) => setNewCertIssuer(e.target.value)}
          style={{ width: 160 }}
        />
        <Input
          placeholder="Năm"
          value={newCertYear}
          onChange={(e) => setNewCertYear(e.target.value)}
          type="number"
          style={{ width: 100 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCert}>
          Thêm
        </Button>
      </Space>

      <Form.Item style={{ marginTop: 16 }}>
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" htmlType="submit">
            {initialValues ? "Update" : "Create"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
