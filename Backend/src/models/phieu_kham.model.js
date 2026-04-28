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
        where: { 
            id_phieu_kham,
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

const update = (id_phieu_kham, data) => {
  const { id_benh_nhan, id_bac_si, chi_tiets, don_thuoc, ...rest } = data;

  return prisma.phieu_kham.update({
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

module.exports = {
    getAll,
    getById,
    insert,
    update,
    remove,
};