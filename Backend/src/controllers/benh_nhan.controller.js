const BenhNhan = require("../models/benh_nhan.model");

function normalize(body = {}) {
  const data = { ...body };

  const toDateOrNull = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  data.ngay_sinh = toDateOrNull(data.ngay_sinh);

  ["ten_benh_nhan", "gioi_tinh", "so_dien_thoai", "dia_chi", "tien_su_benh"]
    .forEach((k) => {
      if (typeof data[k] === "string") data[k] = data[k].trim();
    });

  return {
    ten_benh_nhan: body.name,
    ngay_sinh: body.dob ? new Date(body.dob) : null,
    gioi_tinh: body.gender,
    so_dien_thoai: body.phone,
    CCCD: body.cccd,
    email: body.email,
    dia_chi: body.address,
    tien_su_benh: body.medicalHistory,
  };
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await BenhNhan.getAll();
    res.json(rows);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id không hợp lệ" });
  }

  try {
    const row = await BenhNhan.getById(id);

    if (!row) {
      return res.status(404).json({ error: "Không tìm thấy" });
    }

    res.json(row);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.findPatientByPhone = async (req, res) => {
  try {
    const { phone, cccd } = req.query;

    if (!phone && !cccd) {
      return res.status(400).json({
        message: "Thiếu phone hoặc cccd",
      });
    }

    const patient = await BenhNhan.findByPhoneOrCCCD(phone, cccd);

    return res.json(patient || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.insert = async (req, res) => {
  try {
    const payload = normalize(req.body);
    const created = await BenhNhan.insert(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id không hợp lệ" });
  }

  try {
    const payload = normalize(req.body);
    await BenhNhan.update(id, payload);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id không hợp lệ" });
  }

  try {
    await BenhNhan.remove(id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};