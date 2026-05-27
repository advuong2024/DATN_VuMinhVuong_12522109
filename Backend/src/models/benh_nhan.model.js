const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findByPhoneOrCCCD = async (phone, cccd) => {
  return prisma.benh_nhan.findFirst({
    where: {
      OR: [
        phone ? { so_dien_thoai: phone } : undefined,
        cccd ? { CCCD: cccd } : undefined,
      ].filter(Boolean),
    },
  });
};

const getAll = () => {
    return prisma.benh_nhan.findMany({
        orderBy: {
            id_benh_nhan: 'desc',
        },
        where: { is_deleted: false },
    });
};

const getById = (id_benh_nhan) => {
    return prisma.benh_nhan.findFirst({
        where: { 
            id_benh_nhan,
            is_deleted: false
        },
    });
};

const insert = (data) => {
    return prisma.benh_nhan.create({
        data,
    });
};

const update = (id_benh_nhan, data) => {
    return prisma.benh_nhan.update({
        where: { id_benh_nhan },
        data,
    });
};

const remove = (id_benh_nhan) => {
    return prisma.benh_nhan.update({
        where: { id_benh_nhan },
        data: {
            is_deleted: true,
        }
    });
};

const getAppointmentHistoryByPatient = async (id_benh_nhan) => {
  return await prisma.dat_lich.findMany({
    where: {
      id_benh_nhan: Number(id_benh_nhan),
    },

    orderBy: {
      thoi_gian: "desc",
    },

    select: {
      id_dat_lich: true,
      thoi_gian: true,
      ly_do: true,
      trang_thai: true,

      chuyen_khoa: {
        select: {
          ten_chuyen_khoa: true,
        },
      },

      bac_si: {
        select: {
          ten_nhan_vien: true,
        },
      },

      phieu_kham: {
        select: {
          id_phieu_kham: true,
          trang_thai: true,
        },
      },
    }
  });
};


const getPatientsNoAccount = () => {
  return prisma.benh_nhan.findMany({
    where: {
      is_deleted: false,
      tai_khoan: null,
    },
    orderBy: { id_benh_nhan: 'desc' },
  });
};

module.exports = {
    findByPhoneOrCCCD,
    getAll,
    getById,
    insert,
    update,
    remove,
    getAppointmentHistoryByPatient,
    getPatientsNoAccount,
};