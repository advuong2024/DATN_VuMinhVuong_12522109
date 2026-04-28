const Thuoc = require("../models/thuoc.model");

function normalize(body = {}) {
  const name =
    typeof body.name === "string" ? body.name.trim() : undefined;

  const price =
    body.price !== undefined && body.price !== ""
      ? Number(body.price)
      : null;

  const quantity =
    body.quantity !== undefined && body.quantity !== ""
      ? Number(body.quantity)
      : null;

  const unit =
    typeof body.unit === "string" ? body.unit.trim().toUpperCase() : undefined;

  const expiryDate =
    body.expiryDate ? new Date(body.expiryDate) : undefined;

  const categoryId =
    body.category !== undefined && body.category !== ""
      ? Number(body.category)
      : undefined;

  return {
    ten_thuoc: name,
    gia: price,
    so_luong: quantity,
    don_vi_tinh: unit,
    han_su_dung: expiryDate,

    ...(categoryId && !isNaN(categoryId) && {
      danh_muc: {
        connect: { id_danh_muc: categoryId },
      },
    }),
  };
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await Thuoc.getALL();
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

    const row = await Thuoc.getById(id);

    if (!row) {
      return res.status(404).json({ error: "Không tìm thấy" });
    }

    res.json(row);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = normalize(req.body);

    const created = await Thuoc.create(payload);

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

    const payload = normalize(req.body);

    await Thuoc.update(id, payload);

    res.json({ message: "Cập nhật thành công" });
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

    await Thuoc.remove(id);

    res.json({ message: "Xóa mềm thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};