const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.lich_hen.findMany({
        orderBy: {
            id_lich_hen: 'desc',
        },
    });
};

const getById = (id_lich_hen) => {
    return prisma.lich_hen.findUnique({
        where: { id_lich_hen },
    });
};

const insert = (data) => {
    return prisma.lich_hen.create({
        data,
    });
};

const update = (id_lich_hen, data) => {
    return prisma.lich_hen.update({
        where: { id_lich_hen },
        data,
    });
};

const remove = (id_lich_hen) => {
    return prisma.lich_hen.update({
        where: { id_lich_hen },
        data: {
            trang_thai: "DA_HUY",
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