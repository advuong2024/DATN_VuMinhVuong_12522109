const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getALL = () => {
    return prisma.thuoc.findMany({
        orderBy: {
            id_thuoc: 'desc',
        },
    });
};

const getById = (id_thuoc) => {
    return prisma.thuoc.findUnique({
        where: { id_thuoc },
    });
};
 
const create = (data) => {
    return prisma.thuoc.create({
        data: data,
    });
};

const update = (id_thuoc, data) => {
    return prisma.thuoc.update({
        where: { id_thuoc },
        data: data,
    });
};

const remove = (id_thuoc) => {
    return prisma.thuoc.delete({
        where: { id_thuoc },
        data: {
            is_deleted: true,
        },
    });
};

module.exports = {
    getALL,
    getById,
    create,
    update,
    remove,
};