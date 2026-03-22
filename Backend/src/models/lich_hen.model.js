const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.lich_hen.findMany({
        where: {
            is_deleted: false,
            trang_thai: {
                not: "DA_HUY"
            }
        },
        orderBy: {
            id_lich_hen: 'desc',
        },
    });
};

const getById = (id_lich_hen) => {
    return prisma.lich_hen.findFirst({
        where: { 
            id_lich_hen,
            is_deleted: false
        },
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

const cancel = (id_lich_hen) => {
    return prisma.lich_hen.update({
        where: { id_lich_hen },
        data: {
            trang_thai: "DA_HUY",
        },
    });
};

const remove = (id_lich_hen) => {
    return prisma.lich_hen.update({
        where: { id_lich_hen },
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
    cancel,
    remove,
};