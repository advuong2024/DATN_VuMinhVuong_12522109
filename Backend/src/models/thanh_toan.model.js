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

    include: {
      phieu_kham: {
        include: {
          benh_nhan: true,
          bac_si: true,
        },
      },
      thanh_toan_chi_tiet: true,
    },
  });
};

const insert = async (data) => {
  const {
    id_phieu_kham,
    tong_tien,
    loai_thanh_toan,
    phuong_thuc,
    items,
  } = data;

  const existed = await prisma.thanh_toan.findFirst({
    where: {
      id_phieu_kham: Number(id_phieu_kham),
      loai_thanh_toan,
    },
  });

  if (existed) {
    throw new Error("Đã tồn tại thanh toán cho loại này");
  }

  const result = await prisma.$transaction(async (tx) => {
    const tt = await tx.thanh_toan.create({
      data: {
        id_phieu_kham: Number(id_phieu_kham),
        tong_tien: tong_tien ?? 0,
        loai_thanh_toan,
        phuong_thuc: phuong_thuc ?? null,
        trang_thai: "DA_THANH_TOAN",
      },
    });

    if (Array.isArray(items) && items.length > 0) {
      await tx.thanh_toan_chi_tiet.createMany({
        data: items.map((i) => ({
          id_thanh_toan: tt.id_thanh_toan,
          loai_item: i.loai_item,
          id_item: i.id_item,
        })),
      });
    }

    return tt;
  });

  return result;
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
      chi_tiets: true,
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