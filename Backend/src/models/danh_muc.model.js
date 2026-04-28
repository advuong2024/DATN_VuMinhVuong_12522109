const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = (filters = {}) => {
  const { type } = filters;

  return prisma.danh_muc.findMany({
    where: {
      is_deleted: false,
      ...(type && { loai: type }),
    },
    orderBy: {
      id_danh_muc: "desc",
    },
  });
};

const getById = (id_danh_muc) => {
    return prisma.danh_muc.findUnique({
        where: { 
            id_danh_muc,
            is_deleted: false
        },
    });
};

const insert = (data) => {
    return prisma.danh_muc.create({
        data,
    });
};

const update = (id_danh_muc, data) => {
    return prisma.danh_muc.update({
        where: { id_danh_muc },
        data,
    });
};

const remove = (id_danh_muc) => {
    return prisma.danh_muc.update({
        where: { id_danh_muc },
        data: {
            is_deleted: true,
        }
    });
};

module.exports = {
    getAll,
    getById,
    insert,
    update,
    remove,
};