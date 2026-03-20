const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.danh_muc_thuoc.findMany({
        orderBy: {
            id_danh_muc_thuoc: 'desc',
        },
    });
};

const getById = (id_danh_muc_thuoc) => {
    return prisma.danh_muc_thuoc.findUnique({
        where: { id_danh_muc_thuoc },
    });
};

const insert = (data) => {
    return prisma.danh_muc_thuoc.create({
        data,
    });
};

const update = (id_danh_muc_thuoc, data) => {
    return prisma.danh_muc_thuoc.update({
        where: { id_danh_muc_thuoc },
        data,
    });
};

const remove = (id_danh_muc_thuoc) => {
    return prisma.danh_muc_thuoc.delete({
        where: { id_danh_muc_thuoc },
    });
};

module.exports = {
    getAll,
    getById,
    insert,
    update,
    remove,
};