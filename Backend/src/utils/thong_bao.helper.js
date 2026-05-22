const thongBaoModel = require("../models/thong_bao.model");

const taoThongBao = async (idNguoiNhan, loai, tieuDe, noiDung, duongDan) => {
  try {
    await thongBaoModel.create({
      id_nguoi_nhan: idNguoiNhan,
      loai,
      tieu_de: tieuDe,
      noi_dung: noiDung || null,
      duong_dan: duongDan || null,
    });
  } catch (err) {
    console.error("Lỗi tạo thông báo:", err.message);
  }
};

const taoThongBaoNhieuNguoi = async (dsIdNguoiNhan, loai, tieuDe, noiDung, duongDan) => {
  try {
    const data = dsIdNguoiNhan.map((id) => ({
      id_nguoi_nhan: id,
      loai,
      tieu_de: tieuDe,
      noi_dung: noiDung || null,
      duong_dan: duongDan || null,
    }));

    if (data.length > 0) {
      const prisma = require("../prisma/client");
      await prisma.thong_bao.createMany({ data });
    }
  } catch (err) {
    console.error("Lỗi tạo thông báo hàng loạt:", err.message);
  }
};

module.exports = { taoThongBao, taoThongBaoNhieuNguoi };
