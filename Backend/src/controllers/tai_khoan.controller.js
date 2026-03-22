const TaiKhoan = require("../models/tai_khoan.model");

function normalize(body = {}) {
  const data = { ...body };

  const toNumOrNull = (v) =>
    v === undefined || v === null || v === "" || Number.isNaN(Number(v))
      ? null
      : Number(v);

  data.id_nhan_vien = toNumOrNull(data.id_nhan_vien);

  ["ten_dang_nhap", "mat_khau"].forEach((k) => {
    if (typeof data[k] === "string") data[k] = data[k].trim();
  });

  return data;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await TaiKhoan.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    const row = await TaiKhoan.getById(id);
    if (!row)
      return res.status(404).json({ error: "Không tìm thấy" });

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const payload = normalize(req.body);
    const created = await TaiKhoan.insert(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    const payload = normalize(req.body);

    await TaiKhoan.update(id, payload);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    await TaiKhoan.cancel(id);
    res.json({ message: "Đã khóa tài khoản" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    await TaiKhoan.remove(id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};