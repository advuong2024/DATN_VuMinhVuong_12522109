const ChungChi = require("../models/chung_chi.model");

function normalize(body = {}) {
  return {
    id_nhan_vien: body.id_nhan_vien ? Number(body.id_nhan_vien) : undefined,
    ten_chung_chi: body.name?.trim(),
    noi_cap: body.issuer?.trim() || null,
    nam_cap: body.year ? Number(body.year) : null,
  };
}

exports.getByNhanVien = async (req, res) => {
  try {
    const id = Number(req.params.id_nhan_vien);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id nhân viên không hợp lệ" });
    const rows = await ChungChi.getByNhanVien(id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const payload = normalize(req.body);
    if (!payload.id_nhan_vien || !payload.ten_chung_chi)
      return res.status(400).json({ error: "Thiếu id_nhan_vien hoặc tên chứng chỉ" });
    const created = await ChungChi.insert(payload);
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
    await ChungChi.update(id, payload);
    res.json({ message: "Cập nhật chứng chỉ thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });
    await ChungChi.remove(id);
    res.json({ message: "Xóa chứng chỉ thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
