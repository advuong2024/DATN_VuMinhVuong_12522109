const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const getAll = (query) => {
    const { trang_thai, vai_tro } = query;
    return prisma.tai_khoan.findMany({
        where: {
          is_deleted: false,
          ...(trang_thai && { trang_thai }),
          ...(vai_tro && { vai_tro }),
        },
        include: {
          nhan_vien: true,
          benh_nhan: {
            select: { id_benh_nhan: true, ten_benh_nhan: true, so_dien_thoai: true },
          },
        },
        orderBy: {
          id_tai_khoan: 'desc',
        },
    });
};

const getById = (id_tai_khoan) => {
    return prisma.tai_khoan.findFirst({
        where: { 
            id_tai_khoan,
            is_deleted: false
        },
        include: {
            nhan_vien: true,
            benh_nhan: {
              select: { id_benh_nhan: true, ten_benh_nhan: true, so_dien_thoai: true },
            },
        },
    });
};

const insert = async (data) => {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.tai_khoan.create({
        data,
    });
};

const update = async (id_tai_khoan, data) => {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.tai_khoan.update({
        where: { id_tai_khoan },
        data,
    });
};

const updateStatus = (id_tai_khoan, trang_thai) => {
  return prisma.tai_khoan.update({
    where: { id_tai_khoan },
    data: { trang_thai },
  });
};

const updateRole = (id_tai_khoan, vai_tro) => {
  return prisma.tai_khoan.update({
    where: { id_tai_khoan },
    data: { vai_tro },
  });
};

const remove = (id_tai_khoan) => {
    return prisma.tai_khoan.update({
        where: { id_tai_khoan },
        data: {
            is_deleted: true,
        }
    });
};

const findByUsername = (username) => {
  return prisma.tai_khoan.findUnique({
    where: { username },

    select: {
      vai_tro: true,
      trang_thai: true,
      id_tai_khoan: true,
      username: true,
      password: true,

      nhan_vien: {
        select: {
          id_nhan_vien: true,
          ten_nhan_vien: true,
          chuc_vu: true,
          id_chuyen_khoa: true,
          hinh_anh: true
        },
      },
      benh_nhan: {
        select: {
          id_benh_nhan: true,
          ten_benh_nhan: true,
          so_dien_thoai: true,
          ngay_sinh: true,
          gioi_tinh: true,
          dia_chi: true,
          CCCD: true,
          email: true,
          tien_su_benh: true,
        },
      },
    },
  });
};

const findByIdWithNV = (id_tai_khoan) => {
  return prisma.tai_khoan.findUnique({
    where: { id_tai_khoan },
    include: {
      nhan_vien: true,
      benh_nhan: {
        select: {
          id_benh_nhan: true,
          ten_benh_nhan: true,
          so_dien_thoai: true,
          ngay_sinh: true,
          gioi_tinh: true,
          dia_chi: true,
          CCCD: true,
          email: true,
          tien_su_benh: true,
        },
      },
    },
  });
};

const saveRefreshToken = (id_tai_khoan, token) => {
  return prisma.tai_khoan.update({
    where: { id_tai_khoan },
    data: {
      refresh_token: token,
    },
  });
};

const clearRefreshToken = (id_tai_khoan) => {
  return prisma.tai_khoan.update({
    where: { id_tai_khoan },
    data: {
      refresh_token: null,
    },
  });
};

const findByBenhNhanId = (id_benh_nhan) => {
  return prisma.tai_khoan.findFirst({
    where: { id_benh_nhan, is_deleted: false },
    select: {
      id_tai_khoan: true,
      username: true,
      vai_tro: true,
      trang_thai: true,
    },
  });
};

const resetPassword = async (id_tai_khoan, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);

  return prisma.tai_khoan.update({
    where: { id_tai_khoan },
    data: {
      password: hashed,
    },
  });
};

module.exports = {
    getAll,
    getById,
    insert,
    update,
    updateStatus,
    remove,
    findByUsername,
    findByIdWithNV,
    saveRefreshToken,
    clearRefreshToken,
    resetPassword,
    updateRole,
    findByBenhNhanId,
};
