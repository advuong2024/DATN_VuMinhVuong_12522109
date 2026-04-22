const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.chuyen_khoa.findMany({
        orderBy: {
            id_chuyen_khoa: 'desc',
        },
        where: { is_deleted: false },
    });
};

const getById = (id_chuyen_khoa) => {
    return prisma.chuyen_khoa.findFirst({
        where: { 
            id_chuyen_khoa,
            is_deleted: false
        },
    });
};

const insert = (data) => {
    return prisma.chuyen_khoa.create({
        data,
    });
};

const update = (id_chuyen_khoa, data) => {
    return prisma.chuyen_khoa.update({
        where: { id_chuyen_khoa },
        data,
    });
};

const remove = (id_chuyen_khoa) => {
    return prisma.chuyen_khoa.update({
        where: { id_chuyen_khoa },
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