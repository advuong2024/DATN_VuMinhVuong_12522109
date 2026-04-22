const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.chi_tiet_dich_vu.findMany({
        orderBy: {
            id_chi_tiet: 'desc',
        },
        where: { is_deleted: false },
    });
};

const getById = (id_chi_tiet) => {
    return prisma.chi_tiet_dich_vu.findFirst({
        where: { 
            id_chi_tiet,
            is_deleted: false
        },
    });
};

const insert = (data) => {
    return prisma.chi_tiet_dich_vu.create({
        data,
    });
};

const update = (id_chi_tiet, data) => {
    return prisma.chi_tiet_dich_vu.update({
        where: { id_chi_tiet },
        data,
    });
};

const remove = (id_chi_tiet) => {
    return prisma.chi_tiet_dich_vu.update({
        where: { id_chi_tiet },
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