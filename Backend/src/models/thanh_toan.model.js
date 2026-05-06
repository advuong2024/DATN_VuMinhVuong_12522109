const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.thanh_toan.findMany({
        orderBy: {
            id_thanh_toan: 'desc',
        },
        where: { is_deleted: false },
    });
};

const getById = (id_thanh_toan) => {
    return prisma.thanh_toan.findFirst({
        where: { 
            id_thanh_toan,
            is_deleted: false
         },
    });
};

const insert = (data) => {
    return prisma.thanh_toan.create({
        data,
    });
};

const update = (id_thanh_toan, data) => {
    return prisma.thanh_toan.update({
        where: { id_thanh_toan },
        data,
    });
};

const remove = (id_thanh_toan) => {
    return prisma.thanh_toan.update({
        where: { id_thanh_toan },
        data: {
            is_deleted: true,
        },
    });
};

const getPayments = async (params) => {
  const { keyword, trang_thai } = params;

  return prisma.thanh_toan.findMany({
    where: {
      trang_thai,
      ...(keyword && {
        OR: [
          {
            phieu_kham: {
              benh_nhan: {
                ten_benh_nhan: {
                  contains: keyword,
                },
              },
            },
          },
          {
            phieu_kham: {
              bac_si: {
                ten_nhan_vien: {
                  contains: keyword,
                },
              },
            },
          },
        ],
      }),
    },

    include: {
      phieu_kham: {
        include: {
          benh_nhan: true,
          bac_si: true,
        },
      },
    },

    orderBy: {
      id_thanh_toan: "desc",
    },
  });
};

module.exports = {
    getAll,
    getById,
    insert,
    update,
    remove,
    getPayments,
};