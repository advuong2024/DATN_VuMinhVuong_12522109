const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.benh_nhan.findMany({
        orderBy: {
            id_benh_nhan: 'desc',
        },
    });
};

const getById = (id_benh_nhan) => {
    return prisma.benh_nhan.findUnique({
        where: { id_benh_nhan },
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
    getAll,
    getById,
    insert,
    update,
    remove,
};