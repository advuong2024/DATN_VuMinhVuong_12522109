const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.thanh_toan.findMany({
        orderBy: {
            id_thanh_toan: 'desc',
        },
        where: { is_deleted: false },
    });
};

const getById = (id_thanh_toan) => {
    return prisma.thanh_toan.findFirst({
        where: { 
            id_thanh_toan,
            is_deleted: false
         },
    });
};

const insert = (data) => {
    return prisma.thanh_toan.create({
        data,
    });
};

const update = (id_thanh_toan, data) => {
    return prisma.thanh_toan.update({
        where: { id_thanh_toan },
        data,
    });
};

const remove = (id_thanh_toan) => {
    return prisma.thanh_toan.update({
        where: { id_thanh_toan },
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