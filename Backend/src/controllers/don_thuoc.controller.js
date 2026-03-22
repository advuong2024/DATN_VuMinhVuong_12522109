const DonThuoc = require("../models/don_thuoc.model");

function normalize(body = {}) {
  const data = { ...body };

  const toNumOrNull = (v) =>
    v === undefined || v === null || v === "" || Number.isNaN(Number(v))
      ? null
      : Number(v);

  data.id_phieu_kham = toNumOrNull(data.id_phieu_kham);

  if (typeof data.ghi_chu === "string") {
    data.ghi_chu = data.ghi_chu.trim();
  }

  return data;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await DonThuoc.getAll(); // model đã filter is_deleted
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

    const row = await DonThuoc.getById(id); // model đã filter is_deleted
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
    const created = await DonThuoc.insert(payload);
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

    await DonThuoc.update(id, payload);
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

    await DonThuoc.remove(id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};