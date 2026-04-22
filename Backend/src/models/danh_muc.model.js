const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.danh_muc.findMany({
        orderBy: {
            id_danh_muc: 'desc',
        },
        where: { is_deleted: false },
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