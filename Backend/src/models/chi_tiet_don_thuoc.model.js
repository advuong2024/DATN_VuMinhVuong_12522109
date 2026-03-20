const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.chi_tiet_don_thuoc.findMany({
        orderBy: {
            id_chi_tiet_don_thuoc: 'desc',
        },
    });
};

const getById = (id_chi_tiet_don_thuoc) => {
    return prisma.chi_tiet_don_thuoc.findUnique({
        where: { id_chi_tiet_don_thuoc },
    });
};

const insert = (data) => {
    return prisma.chi_tiet_don_thuoc.create({
        data,
    });
};

const update = (id_chi_tiet_don_thuoc, data) => {
    return prisma.chi_tiet_don_thuoc.update({
        where: { id_chi_tiet_don_thuoc },
        data,
    });
};

const remove = (id_chi_tiet_don_thuoc) => {
    return prisma.chi_tiet_don_thuoc.delete({
        where: { id_chi_tiet_don_thuoc },
    });
};

module.exports = {
    getAll,
    getById,
    insert,
    update,
    remove,
};