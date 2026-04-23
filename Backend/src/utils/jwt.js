const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id_tai_khoan: user.id_tai_khoan,
      username: user.username,
      vai_tro: user.vai_tro,
      id_nhan_vien: user.id_nhan_vien,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id_tai_khoan: user.id_tai_khoan,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7}d`,
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};