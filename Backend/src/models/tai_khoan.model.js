const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.tai_khoan.findMany({
        orderBy: {
            id_tai_khoan: 'desc',
        },
    });
};

const getById = (id_tai_khoan) => {
    return prisma.tai_khoan.findUnique({
        where: { id_tai_khoan },
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

const remove = (id_tai_khoan) => {
    return prisma.tai_khoan.update({
        where: { id_tai_khoan },
        data: {
            trang_thai: "KHOA",
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