const thongBaoModel = require("../models/thong_bao.model");

const thongBaoController = {
  getList: async (req, res, next) => {
    try {
      const { limit = 10, offset = 0 } = req.query;
      const list = await thongBaoModel.getByNguoiNhan(
        req.user.id_nhan_vien,
        Number(limit),
        Number(offset)
      );
      res.json({ data: list });
    } catch (err) {
      next(err);
    }
  },

  getUnreadCount: async (req, res, next) => {
    try {
      const count = await thongBaoModel.getUnreadCount(req.user.id_nhan_vien);
      res.json({ data: count });
    } catch (err) {
      next(err);
    }
  },

  markRead: async (req, res, next) => {
    try {
      await thongBaoModel.markAsRead(
        Number(req.params.id),
        req.user.id_nhan_vien
      );
      res.json({ message: "ok" });
    } catch (err) {
      next(err);
    }
  },

  markAllRead: async (req, res, next) => {
    try {
      await thongBaoModel.markAllAsRead(req.user.id_nhan_vien);
      res.json({ message: "ok" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = thongBaoController;
