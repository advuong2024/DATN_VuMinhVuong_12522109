const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.don_thuoc.findMany({
        orderBy: {
            id_don_thuoc: 'desc',
        },
        where: { is_deleted: false },
    });
};

const getById = (id_don_thuoc) => {
    return prisma.don_thuoc.findFirst({
        where: { 
            id_don_thuoc,
            is_deleted: false
        },
    });
};

const insert = (data) => {
    return prisma.don_thuoc.create({
        data,
    });
};

const update = (id_don_thuoc, data) => {
    return prisma.don_thuoc.update({
        where: { id_don_thuoc },
        data,
    });
};

const remove = (id_don_thuoc) => {
    return prisma.don_thuoc.delete({
        where: { id_don_thuoc },
    });
};

module.exports = {
    getAll,
    getById,
    insert,
    update,
    remove,
};