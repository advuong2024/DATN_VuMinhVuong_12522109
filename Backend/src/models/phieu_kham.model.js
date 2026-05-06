const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.phieu_kham.findMany({
        orderBy: {
          id_phieu_kham: 'desc',
        },
    });
};

const getById = (id_phieu_kham) => {
  return prisma.phieu_kham.findFirst({
    where: { id_phieu_kham },
    include: {
      bac_si: true,
      benh_nhan: true,
      chi_tiets: {
        include: {
          dich_vu: true,
        },
      },
      don_thuoc: {
        include: {
          chi_tiets: {
            include: {
              thuoc: true,
            },
          },
        },
      },
    },
  });
};

const insert = (data) => {
  const { id_benh_nhan, id_nhan_vien, id_dat_lich, ...rest } = data;

  if (!id_benh_nhan) throw new Error("Thiếu id_benh_nhan");
  if (!id_nhan_vien) throw new Error("Thiếu id_nhan_vien");

  return prisma.phieu_kham.create({
    data: {
      ...rest,

      id_benh_nhan: id_benh_nhan,
      id_bac_si: id_nhan_vien,

      id_dat_lich: id_dat_lich || null,
    }
  });
};

const update = async (id_phieu_kham, data) => {
  const { id_benh_nhan, id_bac_si, chi_tiets, don_thuoc, ...rest } = data;

  return prisma.$transaction(async (tx) => {
    const encounter = await tx.phieu_kham.update({
      where: { id_phieu_kham },
      data: {
        ...rest,

        ...(id_benh_nhan && {
          benh_nhan: {
            connect: { id_benh_nhan },
          },
        }),

        ...(id_bac_si && {
          bac_si: {
            connect: { id_nhan_vien: id_bac_si },
          },
        }),

        ...(chi_tiets && {
          chi_tiets: {
            deleteMany: {},
            create: chi_tiets.create || [],
          },
        }),

        ...(don_thuoc && {
          don_thuoc: {
            upsert: {
              create: {
                chi_tiets: {
                  create: don_thuoc.create.chi_tiets.create,
                },
              },
              update: {
                chi_tiets: {
                  deleteMany: {},
                  create: don_thuoc.create.chi_tiets.create,
                },
              },
            },
          },
        }),
      },
      include: {
        chi_tiets: true,
        don_thuoc: {
          include: { chi_tiets: true },
        },
      },
    });

    const serviceTotal = encounter.chi_tiets.reduce(
      (sum, s) => sum + Number(s.gia) * s.so_luong,
      0
    );

    const medicineTotal =
      encounter.don_thuoc?.chi_tiets.reduce(
        (sum, m) => sum + Number(m.gia) * m.so_luong,
        0
      ) || 0;

    const total = serviceTotal + medicineTotal;

    const existedPayment = await tx.thanh_toan.findUnique({
      where: { id_phieu_kham },
    });

    let payment;

    if (existedPayment) {
      payment = await tx.thanh_toan.update({
        where: { id_phieu_kham },
        data: {
          tong_tien: total,
        },
      });
    } else {
      payment = await tx.thanh_toan.create({
        data: {
          id_phieu_kham,
          tong_tien: total,
          trang_thai: "CHUA_THANH_TOAN",
        },
      });
    }

    return { encounter, payment };
  });
};

const remove = (id_phieu_kham) => {
    return prisma.phieu_kham.update({
        where: { id_phieu_kham },
        data: {
            is_deleted: true,
        },
    });
};

const getMedicalHistories = (id) => {
    return prisma.phieu_kham.findMany({
        where: {
          id_benh_nhan: Number(id),
        },
        include: {
          bac_si: true,
          benh_nhan: true,
        },
        orderBy: {
          created_at: 'desc',
        },
    });
};

module.exports = {
  getAll,
  getById,
  insert,
  update,
  remove,
  getMedicalHistories,
};