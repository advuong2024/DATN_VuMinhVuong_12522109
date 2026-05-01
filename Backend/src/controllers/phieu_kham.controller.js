const PhieuKham = require("../models/phieu_kham.model");

function normalize(body = {}) {
  const data = { ...body };

  const toNumOrNull = (v) =>
    v === undefined || v === null || v === "" || Number.isNaN(Number(v))
      ? null
      : Number(v);

  data.id_benh_nhan = toNumOrNull(data.id_benh_nhan);
  data.id_bac_si = toNumOrNull(data.id_bac_si);

  ["trieu_chung", "chan_doan", "ghi_chu"].forEach((k) => {
    if (typeof data[k] === "string") data[k] = data[k].trim();
  });

  return data;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await PhieuKham.getAll();
    res.json(rows);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id không hợp lệ" });
    }

    const row = await PhieuKham.getById(id);

    if (!row) {
      return res.status(404).json({ error: "Không tìm thấy" });
    }

    res.json(row);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const payload = normalize(req.body);

    const { id_benh_nhan, id_nhan_vien } = payload;

    if (!id_benh_nhan) {
      throw new Error("Thiếu id_benh_nhan");
    }
    if (!id_nhan_vien) {
      throw new Error("Thiếu id_bac_si");
    }

    const created = await PhieuKham.insert(payload);

    res.status(201).json(created);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id không hợp lệ" });
    }

    const existing = await PhieuKham.getById(id);
    if (!existing) {
      return res.status(404).json({ error: "Không tìm thấy phiếu khám" });
    }

    const payload = normalize(req.body);
    if (!payload) {
      return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }

    const updated = await PhieuKham.update(id, payload);

    res.json({
      message: "Cập nhật thành công",
      data: updated,
    });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id không hợp lệ" });
    }

    await PhieuKham.remove(id);

    res.json({ message: "Xóa mềm thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};