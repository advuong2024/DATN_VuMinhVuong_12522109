const ChiTietDV = require("../models/chi_tiet_dich_vu.model");

function normalize(body = {}) {
  const data = { ...body };

  if (typeof data.ghi_chu === "string") {
    data.ghi_chu = data.ghi_chu.trim();
  }

  return data;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await ChiTietDV.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id không hợp lệ" });
    }

    const row = await ChiTietDV.getById(id);
    if (!row) {
      return res.status(404).json({ error: "Không tìm thấy" });
    }

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const payload = normalize(req.body);

    if (!payload.id_dich_vu || !payload.don_gia) {
      return res.status(400).json({
        error: "Thiếu id_dich_vu hoặc don_gia",
      });
    }

    const created = await ChiTietDV.insert(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id không hợp lệ" });
    }

    const payload = normalize(req.body);

    await ChiTietDV.update(id, payload);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id không hợp lệ" });
    }

    await ChiTietDV.remove(id);

    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};