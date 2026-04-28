const DichVu = require("../models/dich_vu.model");

function normalize(body = {}) {
  const name = typeof body.name === "string" ? body.name.trim() : undefined;
  const description =
    typeof body.description === "string"
      ? body.description.trim()
      : undefined;

  const price =
    body.price !== undefined && body.price !== ""
      ? Number(body.price)
      : null;

  const categoryId =
    body.category !== undefined ? Number(body.category) : undefined;

  const specialtyId =
    body.specialty !== undefined ? Number(body.specialty) : undefined;

  return {
    ten_dich_vu: body.name?.trim(),
    gia: body.price ? Number(body.price) : null,
    mo_ta: body.description?.trim(),

    ...(categoryId && !isNaN(categoryId) && {
      danh_muc: {
        connect: { id_danh_muc: categoryId },
      },
    }),

    ...(specialtyId && !isNaN(specialtyId) && {
      chuyen_khoa: {
        connect: { id_chuyen_khoa: specialtyId },
      },
    }),
  };
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

    if (!payload.ten_dich_vu || !payload.gia || !payload.danh_muc || !payload.chuyen_khoa) {
      return res.status(400).json({
        error: "Thiếu thông tin bắt buộc (ten, gia, id_danh_muc, id_chuyen_khoa)",
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