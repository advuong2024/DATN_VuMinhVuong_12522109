const PhieuKham = require("../models/phieu_kham.model");
const prisma = require("../prisma/client");
const { taoThongBao, taoThongBaoNhieuNguoi } = require("../utils/thong_bao.helper");

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

    const { id_benh_nhan, id_bac_si, id_dat_lich } = payload;

    if (!id_dat_lich) {
      if (!id_benh_nhan) {
        throw new Error("Thiếu id_benh_nhan");
      }
      if (!id_bac_si) {
        throw new Error("Thiếu id_bac_si");
      }
    }

    const created = await PhieuKham.insert(payload);

    if (id_bac_si) {
      taoThongBao(
        id_bac_si,
        "ENCOUNTER",
        "Phiếu khám mới",
        "Bạn có phiếu khám mới cần xử lý",
        "/admin/encounter"
      );
    }

    const admins = await prisma.tai_khoan.findMany({
      where: { vai_tro: "ADMIN", trang_thai: "HOAT_DONG" },
      select: { id_nhan_vien: true },
    });

    if (admins.length > 0) {
      taoThongBaoNhieuNguoi(
        admins.map((u) => u.id_nhan_vien),
        "ENCOUNTER",
        "Phiếu khám mới được tạo",
        null,
        "/admin/encounter"
      );
    }

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

    const result = await PhieuKham.update(id, payload);

    res.json({
      message: "Cập nhật thành công",
      encounter: result.encounter,
      payment: result.payment,
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

exports.getMedicalHistoriesByPatient = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id_benh_nhan không hợp lệ" });
    }

    const rows = await PhieuKham.getMedicalHistories(id);

    res.json(rows);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.startEncounter = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await PhieuKham.startEncounter(id);

    const admins = await prisma.tai_khoan.findMany({
      where: { vai_tro: "ADMIN", trang_thai: "HOAT_DONG" },
      select: { id_nhan_vien: true },
    });

    if (admins.length > 0) {
      taoThongBaoNhieuNguoi(
        admins.map((u) => u.id_nhan_vien),
        "ENCOUNTER",
        "Phiếu khám đang được khám",
        null,
        "/admin/encounter"
      );
    }

    return res.json({
      message: "Bắt đầu khám thành công",
      data: result,
    });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    return res.status(400).json({
      message: err.message,
    });
  }
};