const DanhMucThuoc = require("../models/danh_muc_thuoc.model");

function normalize(body = {}) {
  const data = { ...body };

  ["ten_danh_muc", "mo_ta"].forEach((k) => {
    if (typeof data[k] === "string") data[k] = data[k].trim();
  });

  return data;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await DanhMucThuoc.getAll();
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

    const row = await DanhMucThuoc.getById(id);
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
    const created = await DanhMucThuoc.insert(payload);
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

    await DanhMucThuoc.update(id, payload);
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

    await DanhMucThuoc.remove(id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};