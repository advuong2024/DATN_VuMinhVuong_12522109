const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getALL = () => {
    return prisma.thuoc.findMany({
        include: {
            danh_muc: {
                select: {
                    ten_danh_muc: true,
                    id_danh_muc: true,
                }
            }
        },
        orderBy: {
            id_thuoc: 'desc',
        },
        where: { is_deleted: false },
    });
};

const getById = (id_thuoc) => {
    return prisma.thuoc.findFirst({
        where: { 
            id_thuoc,
            is_deleted: false
        },
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
    return prisma.thuoc.update({
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