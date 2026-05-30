const LichHen = require("../models/dat_lich.model");
const prisma = require("../prisma/client");
const { taoThongBao, taoThongBaoNhieuNguoi } = require("../utils/thong_bao.helper");

const kiemTraSlot = async (id_bac_si) => {
  const bs = await prisma.nhan_vien.findUnique({
    where: { id_nhan_vien: id_bac_si },
    select: { so_luong_toi_da: true },
  });
  if (bs && bs.so_luong_toi_da !== null) {
    const daDat = await LichHen.demLichHomNay(id_bac_si);
    if (daDat >= bs.so_luong_toi_da) {
      const err = new Error("Bác sĩ đã đạt số lượng bệnh nhân tối đa trong ngày");
      err.status = 400;
      throw err;
    }
  }
};

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
    const rows = await LichHen.getAllDaDen(req.query, req.user);
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

    await kiemTraSlot(payload.id_bac_si || payload.id_nhan_vien);

    const created = await LichHen.insert(payload);

    const leTans = await prisma.tai_khoan.findMany({
      where: { vai_tro: "LE_TAN", trang_thai: "HOAT_DONG" },
      select: { id_nhan_vien: true },
    });

    const dsNhan = [
      ...new Set([
        payload.id_bac_si,
        ...leTans.map((u) => u.id_nhan_vien),
      ]),
    ];

    if (dsNhan.length > 0) {
      taoThongBaoNhieuNguoi(
        dsNhan,
        "BOOKING",
        "Lịch hẹn mới",
        "Bệnh nhân đã đặt lịch hẹn",
        "/admin/booking"
      );
    }

    res.status(201).json(created);
  } catch (err) {
    console.error("🔥 ERROR BOOKING:", err);
    if (err.code === "P2002") {
      return res.status(400).json({
        message: "Khung giờ này đã có người đặt",
      });
    }
    res.status(err.status || 500).json({ error: err.message });
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

    const doctorId = Number(booking.doctor?.value || booking.doctor);
    await kiemTraSlot(doctorId);

    const result = await LichHen.insertBooking(data);
    const leTans = await prisma.tai_khoan.findMany({
      where: { vai_tro: "LE_TAN", trang_thai: "HOAT_DONG" },
      select: { id_nhan_vien: true },
    });

    const dsNhan = [
      ...new Set([
        doctorId,
        ...leTans.map((u) => u.id_nhan_vien),
      ]),
    ];

    if (dsNhan.length > 0) {
      taoThongBaoNhieuNguoi(
        dsNhan,
        "BOOKING",
        "Lịch hẹn mới",
        `${patient.name} đã đặt lịch hẹn`,
        "/admin/booking"
      );
    }

    return res.status(201).json({
      message: "Đặt lịch thành công",
      data: result,
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    return res.status(error.status || 500).json({
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
    res.status(500).json({ message: "Cập nhật thất bại" });
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

exports.reportBusy = async (req, res) => {
  try {
    const doctorId = req.user.id_nhan_vien;
    const { buoi } = req.body;

    if (!["SANG", "CHIEU", "CA_NGAY"].includes(buoi)) {
      return res.status(400).json({ message: "Buổi không hợp lệ (SANG / CHIEU / CA_NGAY)" });
    }

    const appointments = await LichHen.getUpcomingByDoctor(doctorId, buoi);

    const tenBS = await prisma.nhan_vien.findUnique({
      where: { id_nhan_vien: doctorId },
      select: { ten_nhan_vien: true },
    });

    const buoiMap = { SANG: "sáng", CHIEU: "chiều", CA_NGAY: "cả ngày" };
    const noiDung = `BS. ${tenBS.ten_nhan_vien} báo bận ${buoiMap[buoi]}. Cần chuyển ${appointments.length} lịch hẹn.`;

    const leTans = await prisma.tai_khoan.findMany({
      where: { vai_tro: "LE_TAN", trang_thai: "HOAT_DONG" },
      select: { id_nhan_vien: true },
    });

    if (leTans.length > 0) {
      taoThongBaoNhieuNguoi(
        leTans.map((u) => u.id_nhan_vien),
        "TRANSFER",
        "Bác sĩ báo bận",
        noiDung,
        "/admin/booking"
      );
    }

    res.json({
      message: "Đã gửi thông báo đến lễ tân",
      data: appointments,
    });
  } catch (err) {
    console.error("🔥 ERROR reportBusy:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.reassignDoctor = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { id_bac_si_moi } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id không hợp lệ" });
    }

    if (!Number.isInteger(id_bac_si_moi)) {
      return res.status(400).json({ error: "id_bac_si_moi không hợp lệ" });
    }

    const existing = await LichHen.getById(id);
    if (!existing) {
      return res.status(404).json({ error: "Không tìm thấy lịch hẹn" });
    }
    if (existing.trang_thai !== "DA_DAT") {
      return res.status(400).json({ error: "Chỉ được chuyển bác sĩ khi lịch hẹn ở trạng thái Đã đặt" });
    }

    const bsMoi = await prisma.nhan_vien.findUnique({
      where: { id_nhan_vien: id_bac_si_moi },
      select: { id_nhan_vien: true, id_chuyen_khoa: true, ten_nhan_vien: true },
    });
    if (!bsMoi || bsMoi.id_chuyen_khoa !== existing.id_chuyen_khoa) {
      return res.status(400).json({ error: "Bác sĩ mới không cùng chuyên khoa" });
    }

    await kiemTraSlot(id_bac_si_moi);

    const updated = await LichHen.reassignDoctor(id, id_bac_si_moi);

    const bsCu = await prisma.nhan_vien.findUnique({
      where: { id_nhan_vien: existing.id_bac_si },
      select: { ten_nhan_vien: true },
    });

    const gio = existing.thoi_gian.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const tenBenhNhan = updated.benh_nhan?.ten_benh_nhan || "";

    taoThongBao(
      existing.id_bac_si,
      "TRANSFER",
      "Đã chuyển lịch hẹn",
      `Lịch ${gio} - ${tenBenhNhan} đã chuyển sang BS. ${bsMoi.ten_nhan_vien}`,
      "/admin/booking"
    );

    taoThongBao(
      id_bac_si_moi,
      "TRANSFER",
      "Lịch hẹn mới được chuyển",
      `Bạn có lịch hẹn mới lúc ${gio} - ${tenBenhNhan}`,
      "/admin/encounter"
    );

    res.json({ message: "Chuyển bác sĩ thành công" });
  } catch (err) {
    console.error("🔥 ERROR reassignDoctor:", err);
    if (err.code === "P2002") {
      return res.status(400).json({ message: "Bác sĩ mới đã có lịch vào khung giờ này" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.canBook = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { date } = req.query;

    const result = await LichHen.canBook(id, date);

    return res.json(result);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    return res.status(500).json({ message: "Lỗi" });
  }
};