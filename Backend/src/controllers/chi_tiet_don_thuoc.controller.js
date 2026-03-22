const ChiTietDonThuoc = require("../models/chi_tiet_don_thuoc.model");

function normalize(body = {}) {
  const data = { ...body };

  const toNumOrNull = (v) =>
    v === undefined || v === null || v === "" || Number.isNaN(Number(v))
      ? null
      : Number(v);

  data.id_don_thuoc = toNumOrNull(data.id_don_thuoc);
  data.id_thuoc = toNumOrNull(data.id_thuoc);
  data.so_luong = toNumOrNull(data.so_luong);
  data.gia_tai_thoi_diem = toNumOrNull(data.gia_tai_thoi_diem);

  ["lieu_dung"].forEach((k) => {
    if (typeof data[k] === "string") data[k] = data[k].trim();
  });

  return data;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await ChiTietDonThuoc.getAll();
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

    const row = await ChiTietDonThuoc.getById(id);
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
    const created = await ChiTietDonThuoc.insert(payload);
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

    await ChiTietDonThuoc.update(id, payload);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    await ChiTietDonThuoc.remove(id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};