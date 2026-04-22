const ChuyenKhoa = require("../models/chuyen_khoa.model");

function normalize(body = {}) {
  const data = { ...body };

  ["ten", "mo_ta"].forEach((k) => {
    if (typeof data[k] === "string") data[k] = data[k].trim();
  });

  return data;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await ChuyenKhoa.getAll();
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

    const row = await ChuyenKhoa.getById(id);
    if (!row) {
      return res.status(404).json({ error: "Không tìm thấy chuyên khoa" });
    }

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const payload = normalize(req.body);

    if (!payload.ten) {
      return res.status(400).json({
        error: "Tên chuyên khoa là bắt buộc",
      });
    }

    const created = await ChuyenKhoa.insert(payload);
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

    await ChuyenKhoa.update(id, payload);
    res.json({ message: "Cập nhật chuyên khoa thành công" });
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
    await ChuyenKhoa.remove(id);

    res.json({ message: "Xóa chuyên khoa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};