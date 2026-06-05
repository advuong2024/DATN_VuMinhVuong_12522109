const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TaiKhoan = require("../models/tai_khoan.model");
const BenhNhan = require("../models/benh_nhan.model");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const account = await TaiKhoan.findByUsername(username);

    if (!account) {
      return res.status(401).json({ error: "Sai tài khoản" });
    }

    if (account.trang_thai !== "HOAT_DONG") {
      return res.status(403).json({ error: "Tài khoản bị khóa" });
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      return res.status(400).json({ error: "Sai mật khẩu" });
    }

    const accessToken = generateAccessToken({
      id_tai_khoan: account.id_tai_khoan,
      vai_tro: account.vai_tro,
      id_nhan_vien: account.nhan_vien?.id_nhan_vien,
      id_benh_nhan: account.benh_nhan?.id_benh_nhan,
    });
    const refreshToken = generateRefreshToken(account);

    await TaiKhoan.saveRefreshToken(
      account.id_tai_khoan,
      refreshToken
    );

    const safeUser = {
      id_tai_khoan: account.id_tai_khoan,
      vai_tro: account.vai_tro,
      trang_thai: account.trang_thai,

      nhan_vien: account.nhan_vien
        ? {
            ten_nhan_vien: account.nhan_vien.ten_nhan_vien,
            hinh_anh: account.nhan_vien.hinh_anh,
            id_chuyen_khoa: account.nhan_vien.id_chuyen_khoa,
            chuc_vu: account.nhan_vien.chuc_vu,
          }
        : null,

      benh_nhan: account.benh_nhan
        ? {
            id_benh_nhan: account.benh_nhan.id_benh_nhan,
            ten_benh_nhan: account.benh_nhan.ten_benh_nhan,
            so_dien_thoai: account.benh_nhan.so_dien_thoai,
            ngay_sinh: account.benh_nhan.ngay_sinh,
            gioi_tinh: account.benh_nhan.gioi_tinh,
            dia_chi: account.benh_nhan.dia_chi,
            CCCD: account.benh_nhan.CCCD,
            email: account.benh_nhan.email,
            tien_su_benh: account.benh_nhan.tien_su_benh,
          }
        : null,
    };

    return res.json({
      accessToken,
      refreshToken,
      user: safeUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { phone, password, patientData } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: "Vui lòng nhập số điện thoại và mật khẩu" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    const existingAccount = await TaiKhoan.findByUsername(phone);
    if (existingAccount) {
      return res.status(400).json({ error: "Số điện thoại này đã được đăng ký tài khoản" });
    }

    let benhNhanId;
    let existingPatient = null;

    if (patientData && patientData.id_benh_nhan) {
      existingPatient = await BenhNhan.getById(Number(patientData.id_benh_nhan));
      if (!existingPatient) {
        return res.status(400).json({ error: "Không tìm thấy thông tin bệnh nhân" });
      }
      benhNhanId = existingPatient.id_benh_nhan;
    } else {
      const foundByPhone = await BenhNhan.findByPhoneOrCCCD(phone, null);
      if (foundByPhone) {
        existingPatient = foundByPhone;
        benhNhanId = foundByPhone.id_benh_nhan;
      } else if (patientData) {
        const newPatient = await BenhNhan.insert({
          ten_benh_nhan: patientData.ten_benh_nhan,
          so_dien_thoai: phone,
          ngay_sinh: patientData.ngay_sinh ? new Date(patientData.ngay_sinh) : new Date(),
          gioi_tinh: patientData.gioi_tinh || "KHAC",
          CCCD: patientData.CCCD || "",
          dia_chi: patientData.dia_chi || "",
          email: patientData.email || "",
          tien_su_benh: patientData.tien_su_benh || "",
        });
        benhNhanId = newPatient.id_benh_nhan;
      } else {
        return res.status(400).json({ error: "Không tìm thấy bệnh nhân với số điện thoại này" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = await TaiKhoan.insert({
      username: phone,
      password: hashedPassword,
      vai_tro: "NGUOI_DUNG",
      trang_thai: "HOAT_DONG",
      benh_nhan: {
        connect: { id_benh_nhan: benhNhanId },
      },
    });

    const accessToken = generateAccessToken({
      id_tai_khoan: newAccount.id_tai_khoan,
      username: phone,
      vai_tro: "NGUOI_DUNG",
      id_benh_nhan: benhNhanId,
    });
    const refreshToken = generateRefreshToken(newAccount);

    await TaiKhoan.saveRefreshToken(newAccount.id_tai_khoan, refreshToken);

    const patientInfo = existingPatient || await BenhNhan.getById(benhNhanId);

    return res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id_tai_khoan: newAccount.id_tai_khoan,
        vai_tro: "NGUOI_DUNG",
        trang_thai: "HOAT_DONG",
        benh_nhan: {
          id_benh_nhan: patientInfo.id_benh_nhan,
          ten_benh_nhan: patientInfo.ten_benh_nhan,
          so_dien_thoai: phone,
          ngay_sinh: patientInfo.ngay_sinh,
          gioi_tinh: patientInfo.gioi_tinh,
          dia_chi: patientInfo.dia_chi,
          CCCD: patientInfo.CCCD,
          email: patientInfo.email,
          tien_su_benh: patientInfo.tien_su_benh,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "No refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const account = await TaiKhoan.findByIdWithNV(decoded.id_tai_khoan);

    if (!account || account.refresh_token !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken({
      id_tai_khoan: account.id_tai_khoan,
      vai_tro: account.vai_tro,
      id_nhan_vien: account.nhan_vien?.id_nhan_vien,
      id_benh_nhan: account.benh_nhan?.id_benh_nhan,
    });
    const newRefreshToken = generateRefreshToken(account);

    await TaiKhoan.saveRefreshToken(
      account.id_tai_khoan,
      newRefreshToken
    );

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    return res.status(401).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user?.id_tai_khoan;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await TaiKhoan.clearRefreshToken(userId);

    return res.json({ message: "Đăng xuất thành công" });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password phải >= 6 ký tự",
      });
    }

    await taiKhoanModel.resetPassword(Number(id), newPassword);

    res.json({
      message: "Reset password thành công",
    });
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};