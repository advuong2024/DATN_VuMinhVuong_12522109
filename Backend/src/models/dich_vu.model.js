const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = (hien_thi, id_chuyen_khoa) => {
    const where = { is_deleted: false };
    if (hien_thi === 'true') where.hien_thi = true;
    if (id_chuyen_khoa) where.id_chuyen_khoa = Number(id_chuyen_khoa);

    return prisma.dich_vu.findMany({
        include: {
            danh_muc: {
                select: {
                    id_danh_muc: true,
                    ten_danh_muc: true,
                }
            },
            chuyen_khoa: {
                select: {
                    id_chuyen_khoa: true,
                    ten_chuyen_khoa: true,
                }
            }
        },
        orderBy: {
            id_dich_vu: 'desc',
        },
        where,
    });
};

const getById = (id_dich_vu) => {
    return prisma.dich_vu.findFirst({
        where: { 
            id_dich_vu,
            is_deleted: false
        },
    });
};

const insert = (data) => {
    return prisma.dich_vu.create({
        data,
    });
};

const update = (id_dich_vu, data) => {
    return prisma.dich_vu.update({
        where: { id_dich_vu },
        data,
    });
};

const remove = (id_dich_vu) => {
    return prisma.dich_vu.update({
        where: { id_dich_vu },
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