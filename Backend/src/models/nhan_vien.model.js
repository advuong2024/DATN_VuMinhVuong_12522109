 const { PrismaClient } = require('@prisma/client');
 const prisma = new PrismaClient();

 const getAll = () => {
    return prisma.nhan_vien.findMany({
        orderBy: {
            id_nhan_vien: 'desc',
        },
        where: { is_deleted: false },
    });
 };

 const getById = (id_nhan_vien) => {
    return prisma.nhan_vien.findFirst({
        where: { 
            id_nhan_vien,
            is_deleted: false
        },
    });
 };

 const insert = (data) => {
    return prisma.nhan_vien.create({
        data,
    });
 };

const update = (id_nhan_vien, data) => {
    return prisma.nhan_vien.update({
        where: { id_nhan_vien },
        data,
    });
};

const remove = (id_nhan_vien) => {
    return prisma.nhan_vien.update({
        where: { id_nhan_vien },
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