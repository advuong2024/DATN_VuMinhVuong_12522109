const LichHen = require("../models/lich_hen.model");

function normalize(body = {}) {
  const data = { ...body };

  const toNumOrNull = (v) =>
    v === undefined || v === null || v === "" || Number.isNaN(Number(v))
      ? null
      : Number(v);

  data.id_benh_nhan = toNumOrNull(data.id_benh_nhan);
  data.id_nhan_vien = toNumOrNull(data.id_nhan_vien);

  if (typeof data.ly_do_kham === "string") {
    data.ly_do_kham = data.ly_do_kham.trim();
  }

  return data;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await LichHen.getAll();
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

    const row = await LichHen.getById(id);

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

    const created = await LichHen.insert(payload);

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

    await LichHen.update(id, payload);

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id không hợp lệ" });
    }

    await LichHen.cancel(id);

    res.json({ message: "Đã hủy lịch hẹn" });
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

    await LichHen.remove(id);

    res.json({ message: "Xóa mềm thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};