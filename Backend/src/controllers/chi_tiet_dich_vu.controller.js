const ChiTietDichVu = require("../models/Chi_tiet_dich_vu.model");
const cloudinary = require("../utils/cloudinary");

function normalize(body = {}) {
  if (body.ghi_chu && typeof body.ghi_chu === "string") {
    body.ghi_chu = body.ghi_chu.trim();
  }
  return body;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await ChiTietDichVu.getAll();
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

    const row = await ChiTietDichVu.getById(id);
    if (!row)
      return res.status(404).json({ error: "Không tìm thấy" });

    res.json(row);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const payload = normalize(req.body);

    if (!payload.id_dich_vu)
      return res.status(400).json({ error: "Thiếu id_dich_vu" });

    const created = await ChiTietDichVu.insert(payload);
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
    await ChiTietDichVu.update(id, payload);
    res.json({ message: "Cập nhật thành công" });
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

    await ChiTietDichVu.remove(id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPending = async (_req, res) => {
  try {
    const rows = await ChiTietDichVu.getPending();
    res.json(rows);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getByStatus = async (req, res) => {
  try {
    const { trang_thai } = req.params;
    const valid = ["CHO_THUC_HIEN", "DANG_THUC_HIEN", "HOAN_THANH"];
    if (!valid.includes(trang_thai))
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });

    const rows = await ChiTietDichVu.getByStatus(trang_thai);
    res.json(rows);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    const { trang_thai } = req.body;
    const valid = ["CHO_THUC_HIEN", "DANG_THUC_HIEN", "HOAN_THANH"];
    if (!valid.includes(trang_thai))
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });

    await ChiTietDichVu.updateStatus(id, trang_thai);
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getByPhieuKham = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    const rows = await ChiTietDichVu.getByPhieuKham(id);
    res.json(rows);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateResult = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ error: "id không hợp lệ" });

    const { ket_qua } = req.body;

    let file_ket_qua = null;
    if (req.file) {
      const resourceType = req.file.mimetype === "application/pdf" ? "raw" : "auto";
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "phongkham/ket-qua",
        resource_type: resourceType,
      });
      file_ket_qua = result.secure_url;
    }

    const data = {
      ...(ket_qua !== undefined && { ket_qua }),
      ...(file_ket_qua && { file_ket_qua }),
      nguoi_thuc_hien: req.user?.id_nhan_vien || null,
    };

    const updated = await ChiTietDichVu.updateResult(id, data);
    res.json(updated);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
