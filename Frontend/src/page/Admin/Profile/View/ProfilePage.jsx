import { useState, useEffect } from "react";
import { Card, Row, Col, Form, Input, Select, Button, Avatar, Tag, Divider, Typography, Spin, message, Space, List, Modal } from "antd";
import { UserOutlined, PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { getProfile, updateProfile, getCertificates, createCertificate, deleteCertificate } from "../Api/ProfileApi";
import ImageUpload from "@/components/common/ImageUpload";
import { GENDER_OPTIONS } from "@/components/common/Options";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const STATUS_MAP = { HOAT_DONG: { label: "Active", color: "green" }, KHOA: { label: "Locked", color: "red" } };
const ROLE_MAP = { ADMIN: "Administrator", BAC_SI: "Doctor", LE_TAN: "Receptionist", THU_NGAN: "Cashier" };

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [newCert, setNewCert] = useState({ ten_chung_chi: "", noi_cap: "", nam_cap: null });

  const currentRole = (() => {
    const token = localStorage.getItem("accessToken");
    return token ? jwtDecode(token).vai_tro : null;
  })();

  const fetchData = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setAvatar(data.hinh_anh);
      form.setFieldsValue({
        name: data.ten_nhan_vien,
        dob: data.ngay_sinh ? dayjs(data.ngay_sinh).format("YYYY-MM-DD") : null,
        gender: data.gioi_tinh,
        phone: data.so_dien_thoai,
        address: data.dia_chi,
      });
      if (data.chung_chis) setCertificates(data.chung_chis);
    } catch (err) {
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await updateProfile({ ...values, hinh_anh: avatar });
      message.success("Updated successfully");
      fetchData();
    } catch (err) {
      if (err.errorFields) return;
      message.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCert = async () => {
    if (!newCert.ten_chung_chi) return;
    try {
      await createCertificate(newCert);
      message.success("Certificate added");
      setNewCert({ ten_chung_chi: "", noi_cap: "", nam_cap: null });
      const certs = await getCertificates();
      setCertificates(certs);
    } catch (err) {
      message.error("Failed to add certificate");
    }
  };

  const handleDeleteCert = (cert) => {
    Modal.confirm({
      title: "Delete certificate",
      content: `Delete "${cert.ten_chung_chi}"?`,
      onOk: async () => {
        await deleteCertificate(cert.id_chung_chi);
        message.success("Deleted");
        setCertificates((prev) => prev.filter((c) => c.id_chung_chi !== cert.id_chung_chi));
      },
    });
  };

  if (loading) return <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>;

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const statusInfo = STATUS_MAP[userData.trang_thai || "HOAT_DONG"];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 0" }}>
      <Card style={{ borderRadius: 12, textAlign: "center", marginBottom: 24 }}>
        <Avatar size={100} src={avatar} icon={!avatar ? <UserOutlined /> : undefined} style={{ backgroundColor: "#1677ff", marginBottom: 12 }} />
        <div style={{ marginBottom: 8 }}>
          <ImageUpload onUpload={(url) => setAvatar(url)}>
            <Button size="small">Change photo</Button>
          </ImageUpload>
        </div>
        <Title level={4} style={{ margin: 0 }}>{profile?.ten_nhan_vien}</Title>
        <Space size={8} style={{ marginTop: 8 }}>
          <Tag color="blue">{ROLE_MAP[currentRole] || profile?.chuc_vu}</Tag>
          <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
        </Space>
      </Card>

      <Card title="Personal Information" style={{ borderRadius: 12, marginBottom: 24 }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Full name" name="name" rules={[{ required: true, message: "Please enter your full name" }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date of birth" name="dob">
                <Input type="date" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Gender" name="gender">
                <Select size="large" options={GENDER_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone number" name="phone" rules={[{ pattern: /^0\d{9}$/, message: "Phone must be 10 digits, starting with 0" }]}>
                <Input size="large" maxLength={10} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Address" name="address">
            <Input size="large" />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />} size="large" onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        </Form>
      </Card>

      {currentRole === "BAC_SI" && (
        <Card title="Certificates" style={{ borderRadius: 12 }}>
          <List
            dataSource={certificates}
            locale={{ emptyText: "No certificates yet" }}
            renderItem={(cert) => (
              <List.Item
                actions={[<Button key="del" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteCert(cert)} />]}
              >
                <List.Item.Meta
                  title={cert.ten_chung_chi}
                  description={`${cert.noi_cap || ""}${cert.nam_cap ? ` - ${cert.nam_cap}` : ""}`}
                />
              </List.Item>
            )}
          />
          <Divider />
          <Space.Compact style={{ width: "100%" }}>
            <Input placeholder="Certificate name" value={newCert.ten_chung_chi}
              onChange={(e) => setNewCert((p) => ({ ...p, ten_chung_chi: e.target.value }))} />
            <Input placeholder="Issued by" value={newCert.noi_cap}
              onChange={(e) => setNewCert((p) => ({ ...p, noi_cap: e.target.value }))} />
            <Input placeholder="Year" type="number" value={newCert.nam_cap}
              onChange={(e) => setNewCert((p) => ({ ...p, nam_cap: e.target.value ? Number(e.target.value) : null }))} />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCert}>Add</Button>
          </Space.Compact>
        </Card>
      )}
    </div>
  );
}
