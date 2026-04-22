const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.dich_vu.findMany({
        orderBy: {
            id_dich_vu: 'desc',
        },
        where: { is_deleted: false },
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