const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findByPhoneOrCCCD = async (phone, cccd) => {
  return prisma.benh_nhan.findFirst({
    where: {
      OR: [
        phone ? { so_dien_thoai: phone } : undefined,
        cccd ? { CCCD: cccd } : undefined,
      ].filter(Boolean),
    },
  });
};

const getAll = () => {
    return prisma.benh_nhan.findMany({
        orderBy: {
            id_benh_nhan: 'desc',
        },
        where: { is_deleted: false },
    });
};

const getById = (id_benh_nhan) => {
    return prisma.benh_nhan.findFirst({
        where: { 
            id_benh_nhan,
            is_deleted: false
        },
    });
};

const insert = (data) => {
    return prisma.benh_nhan.create({
        data,
    });
};

const update = (id_benh_nhan, data) => {
    return prisma.benh_nhan.update({
        where: { id_benh_nhan },
        data,
    });
};

const remove = (id_benh_nhan) => {
    return prisma.benh_nhan.update({
        where: { id_benh_nhan },
        data: {
            is_deleted: true,
        }
    });
};

module.exports = {
    findByPhoneOrCCCD,
    getAll,
    getById,
    insert,
    update,
    remove,
};