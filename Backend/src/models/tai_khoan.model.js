const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.tai_khoan.findMany({
        where: {
            is_deleted: false,
            trang_thai: {
                not: "KHOA"
            }
        },
        orderBy: {
            id_tai_khoan: 'desc',
        },
    });
};

const getById = (id_tai_khoan) => {
    return prisma.tai_khoan.findFirst({
        where: { 
            id_tai_khoan,
            is_deleted: false
        },
    });
};

const insert = (data) => {
    return prisma.tai_khoan.create({
        data,
    });
};

const update = (id_tai_khoan, data) => {
    return prisma.tai_khoan.update({
        where: { id_tai_khoan },
        data,
    });
};

const cancel = (id_tai_khoan) => {
    return prisma.tai_khoan.update({
        where: { id_tai_khoan },
        data: {
            trang_thai: "KHOA",
        },
    });
};

const remove = (id_tai_khoan) => {
    return prisma.tai_khoan.update({
        where: { id_tai_khoan },
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
    cancel,
    remove,
};