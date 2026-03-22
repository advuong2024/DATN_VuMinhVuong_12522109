const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.phieu_kham.findMany({
        orderBy: {
            id_phieu_kham: 'desc',
        },
        where: { is_deleted: false },
    });
};

const getById = (id_phieu_kham) => {
    return prisma.phieu_kham.findFirst({
        where: { 
            id_phieu_kham,
            is_deleted: false
        },
    });
};

const insert = (data) => {
    return prisma.phieu_kham.create({
        data,
    });
};

const update = (id_phieu_kham, data) => {
    return prisma.phieu_kham.update({
        where: { id_phieu_kham },
        data,
    });
};  

const remove = (id_phieu_kham) => {
    return prisma.phieu_kham.update({
        where: { id_phieu_kham },
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