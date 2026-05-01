const LichHen = require("../models/dat_lich.model");

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

exports.getAll = async (req, res) => {
  try {
    const rows = await LichHen.getAll(req.query);
    res.json(rows);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDaDen = async (req, res) => {
  try {
    const rows = await LichHen.getAllDaDen(req.query);
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

    const row = await LichHen.getById(id);

    if (!row) {
      return res.status(404).json({ error: "Không tìm thấy" });
    }

    res.json(row);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getBooked = async (req, res) => {
  try {
    const { id_bac_si, date } = req.query;

    const data = await LichHen.getByDoctorAndDate(id_bac_si, date);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.insert = async (req, res) => {
  try {
    const payload = normalize(req.body);

    const created = await LichHen.insert(payload);

    res.status(201).json(created);
  } catch (err) {
    console.error("🔥 ERROR BOOKING:", err);
    if (err.code === "P2002") {
      return res.status(400).json({
        message: "Khung giờ này đã có người đặt",
      });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.patient || !data?.booking) {
      return res.status(400).json({
        message: "Thiếu thông tin patient hoặc booking",
      });
    }

    const { patient, booking } = data;

    if (!patient.phone || !patient.name) {
      return res.status(400).json({
        message: "Thiếu thông tin bệnh nhân",
      });
    }

    if (!booking.service || !booking.doctor || !booking.date) {
      return res.status(400).json({
        message: "Thiếu thông tin lịch khám",
      });
    }

    const result = await LichHen.insertBooking(data);

    return res.status(201).json({
      message: "Đặt lịch thành công",
      data: result,
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
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
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { trang_thai } = req.body;

    const result = await LichHen.updateStatus(id, trang_thai);

    res.json(result);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ message: "Update failed" });
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
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};