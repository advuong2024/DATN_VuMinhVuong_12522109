const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const getAll = (query) => {
    const { trang_thai } = query;
    return prisma.tai_khoan.findMany({
        where: {
          is_deleted: false,
          ...(trang_thai && { trang_thai }),
        },
        include: {
          nhan_vien: true,
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
        },
    });
};

const insert = (data) => {
    return prisma.tai_khoan.create({
        data,
    });
};

const update = (id_tai_khoan, data) => {
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
    include: {
      nhan_vien: true,
    },
  });
};

const findByIdWithNV = (id_tai_khoan) => {
  return prisma.tai_khoan.findUnique({
    where: { id_tai_khoan },
    include: {
      nhan_vien: true,
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
};