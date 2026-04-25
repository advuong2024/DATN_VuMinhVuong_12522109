const DichVu = require("../models/dich_vu.model");

function normalize(body = {}) {
  const data = { ...body };

  ["ten", "mo_ta"].forEach((k) => {
    if (typeof data[k] === "string") data[k] = data[k].trim();
  });

  if (data.gia !== undefined) {
    data.gia = Number(data.gia);
  }

  if (data.id_danh_muc !== undefined) {
    data.id_danh_muc = Number(data.id_danh_muc);
  }

  return data;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await DichVu.getAll();
    res.json(rows);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    const row = await DichVu.getById(id);
    if (!row)
      return res.status(404).json({ error: "Không tìm thấy dịch vụ" });

    res.json(row);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const payload = normalize(req.body);

    if (!payload.ten || !payload.gia || !payload.id_danh_muc) {
      return res.status(400).json({
        error: "Thiếu thông tin bắt buộc (ten, gia, id_danh_muc)",
      });
    }

    const created = await DichVu.insert(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    const payload = normalize(req.body);

    await DichVu.update(id, payload);
    res.json({ message: "Cập nhật dịch vụ thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    await DichVu.remove(id);

    res.json({ message: "Xóa dịch vụ thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};