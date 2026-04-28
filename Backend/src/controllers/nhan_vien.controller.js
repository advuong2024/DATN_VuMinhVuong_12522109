const NhanVien = require("../models/nhan_vien.model");

function normalize(body = {}) {
  const toDateOrNull = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  const trim = (v) => (typeof v === "string" ? v.trim() : v);

  const specialtyId = body.specialty ? Number(body.specialty) : null;

  return {
    ten_nhan_vien: trim(body.name),
    ngay_sinh: toDateOrNull(body.dob),
    gioi_tinh: trim(body.gender),
    so_dien_thoai: trim(body.phone),
    dia_chi: trim(body.address),
    chuc_vu: trim(body.position),

    ...(specialtyId && {
      chuyen_khoa: {
        connect: { id_chuyen_khoa: specialtyId },
      },
    }),
  };
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await NhanVien.getAll();
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

    const row = await NhanVien.getById(id);

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

    const created = await NhanVien.insert(payload);

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

    await NhanVien.update(id, payload);

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

    await NhanVien.remove(id);

    res.json({ message: "Xóa mềm thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getBacSiByChuyenKhoa = async (req, res) => {
  try {
    const id_chuyen_khoa = Number(req.params.id);

    if (!Number.isInteger(id_chuyen_khoa)) {
      return res.status(400).json({ error: "id chuyên khoa không hợp lệ" });
    }

    const data = await NhanVien.get_bacsi_Chuyenkhoa(id_chuyen_khoa);

    res.json(data);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getNhanVienChuaCoTK = async (req, res) => {
  try {
    const data = await NhanVien.getNhanVienChuaCoTaiKhoan();
    res.json(data);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ message: "Error" });
  }
};