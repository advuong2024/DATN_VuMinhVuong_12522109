const prisma = require("../prisma/client");

const thongBaoModel = {
  getByNguoiNhan: (idNguoiNhan, limit = 10, offset = 0) =>
    prisma.thong_bao.findMany({
      where: { id_nguoi_nhan: idNguoiNhan },
      orderBy: { created_at: "desc" },
      take: limit,
      skip: offset,
    }),

  getUnreadCount: (idNguoiNhan) =>
    prisma.thong_bao.count({
      where: { id_nguoi_nhan: idNguoiNhan, da_doc: false },
    }),

  create: (data) => prisma.thong_bao.create({ data }),

  markAsRead: (idThongBao, idNguoiNhan) =>
    prisma.thong_bao.updateMany({
      where: { id_thong_bao: idThongBao, id_nguoi_nhan: idNguoiNhan },
      data: { da_doc: true },
    }),

  markAllAsRead: (idNguoiNhan) =>
    prisma.thong_bao.updateMany({
      where: { id_nguoi_nhan: idNguoiNhan, da_doc: false },
      data: { da_doc: true },
    }),
};

module.exports = thongBaoModel;
