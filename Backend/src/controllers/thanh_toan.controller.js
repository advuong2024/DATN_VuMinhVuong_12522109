const ThanhToan = require("../models/thanh_toan.model");

function normalize(body = {}) {
  const data = { ...body };

  const toNumOrNull = (v) =>
    v === undefined || v === null || v === "" || Number.isNaN(Number(v))
      ? null
      : Number(v);

  data.id_phieu_kham = toNumOrNull(data.id_phieu_kham);
  data.tong_tien = toNumOrNull(data.tong_tien);

  if (typeof data.phuong_thuc === "string") {
    data.phuong_thuc = data.phuong_thuc.trim();
  }

  return data;
}

exports.getAll = async (_req, res) => {
  try {
    const rows = await ThanhToan.getAll();
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

    const row = await ThanhToan.getById(id);

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

    const created = await ThanhToan.insert(payload);

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

    await ThanhToan.update(id, payload);

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

    await ThanhToan.remove(id);

    res.json({ message: "Xóa mềm thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const { keyword, trang_thai } = req.query;

    const data = await ThanhToan.getPayments({
      keyword,
      trang_thai,
    });

    const validStatus = ["CHUA_THANH_TOAN", "DA_THANH_TOAN"];

    if (trang_thai && !validStatus.includes(trang_thai)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const result = data.map((item) => ({
      id_thanh_toan: item.id_thanh_toan,
      tong_tien: item.tong_tien,
      trang_thai: item.trang_thai,
      ngay_thanh_toan: item.ngay_thanh_toan,
      ngay_kham: item.phieu_kham?.ngay_kham,
      loai_thanh_toan: item.loai_thanh_toan,
      patient_name: item.phieu_kham?.benh_nhan?.ten_benh_nhan,
      patient_phone: item.phieu_kham?.benh_nhan?.so_dien_thoai,
      doctor_name: item.phieu_kham?.bac_si?.ten_nhan_vien,
    }));

    res.json(result);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPaymentDetail = async (req, res) => {
  try {
    const data = await ThanhToan.getPaymentDetailByPhieuKham(
      req.params.id
    );

    res.json(data);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.pay = async (req, res) => {
  try {
    const {
      id_phieu_kham,
      phuong_thuc,
      co_mua_thuoc,
    } = req.body;

    if (!id_phieu_kham) {
      return res.status(400).json({
        message: "Missing id_phieu_kham",
      });
    }

    const result = await ThanhToan.pay({
      id_phieu_kham,
      phuong_thuc,
      co_mua_thuoc,
    });

    return res.status(200).json({
      message: "Payment success",
      data: result,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};