const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TaiKhoan = require("../models/tai_khoan.model");

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

    const accessToken = generateAccessToken(account);
    const refreshToken = generateRefreshToken(account);

    await TaiKhoan.saveRefreshToken(
      account.id_tai_khoan,
      refreshToken
    );

    const { password: _, refresh_token, ...safeUser } = account;

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

    const newAccessToken = generateAccessToken(account);
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

    return res.json({ message: "Logout success" });
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