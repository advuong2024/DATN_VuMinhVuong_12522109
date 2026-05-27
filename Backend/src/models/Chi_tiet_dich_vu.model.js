const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.chi_tiet_dich_vu.findMany({
        orderBy: { id_chi_tiet: 'desc' },
    });
};

const getById = (id_chi_tiet) => {
    return prisma.chi_tiet_dich_vu.findFirst({
        where: { id_chi_tiet },
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
    return prisma.chi_tiet_dich_vu.delete({
        where: { id_chi_tiet },
    });
};

const _includeAll = {
    dich_vu: true,
    bac_si: {
        select: { id_nhan_vien: true, ten_nhan_vien: true },
    },
    nhan_vien_thuc_hien: {
        select: { id_nhan_vien: true, ten_nhan_vien: true },
    },
    phieu_kham: {
        include: {
            benh_nhan: {
                select: { id_benh_nhan: true, ten_benh_nhan: true, so_dien_thoai: true },
            },
        },
    },
};

const _notPhiKham = { NOT: { loai_chi_tiet: "PHI_KHAM" } };

const getPending = () => {
    return prisma.chi_tiet_dich_vu.findMany({
        where: { trang_thai: "CHO_THUC_HIEN", ..._notPhiKham },
        include: _includeAll,
        orderBy: { id_chi_tiet: 'desc' },
    });
};

const getByStatus = (trang_thai) => {
    return prisma.chi_tiet_dich_vu.findMany({
        where: { trang_thai, ..._notPhiKham },
        include: _includeAll,
        orderBy: { id_chi_tiet: 'desc' },
    });
};

const updateStatus = (id_chi_tiet, trang_thai) => {
    return prisma.chi_tiet_dich_vu.update({
        where: { id_chi_tiet },
        data: { trang_thai },
    });
};

const getByPhieuKham = (id_phieu_kham) => {
    return prisma.chi_tiet_dich_vu.findMany({
        where: { id_phieu_kham },
        include: {
            dich_vu: true,
            bac_si: {
                select: { id_nhan_vien: true, ten_nhan_vien: true },
            },
        },
        orderBy: { id_chi_tiet: 'asc' },
    });
};

const updateResult = async (id_chi_tiet, data) => {
    return prisma.chi_tiet_dich_vu.update({
        where: { id_chi_tiet },
        data: {
            ...data,
            trang_thai: "HOAN_THANH",
            ngay_thuc_hien: new Date(),
        },
    });
};

module.exports = {
    getAll,
    getById,
    insert,
    update,
    remove,
    getPending,
    getByPhieuKham,
    getByStatus,
    updateStatus,
    updateResult,
};
