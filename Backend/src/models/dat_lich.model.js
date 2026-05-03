const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require("dayjs");
const getTodayRange = () => ({
  gte: dayjs().startOf("day").toDate(),
  lte: dayjs().endOf("day").toDate(),
});

const getAll = (params = {}) => {
  const { search, status, startDate, endDate } = params;

  const where = {};
  if (search) {
    where.OR = [
        {
            benh_nhan: {
            ten_benh_nhan: {
                contains: search,
            },
            },
        },
        {
            benh_nhan: {
            so_dien_thoai: {
                contains: search,
            },
            },
        },
    ];
  }

  if (status) {
    where.trang_thai = status;
  }

  if (startDate || endDate) {
    where.thoi_gian = {};

    if (startDate) {
      where.thoi_gian.gte = dayjs(startDate).startOf("day").toDate();
    }

    if (endDate) {
      where.thoi_gian.lte = dayjs(endDate).endOf("day").toDate();
    }
  } else {
    where.thoi_gian = getTodayRange();
  }
  return prisma.dat_lich.findMany({
    where,
    include: {
      benh_nhan: {
        select: {
          ten_benh_nhan: true,
          so_dien_thoai: true,
          id_benh_nhan: true,
        },
      },

      bac_si: {
        select: {
          ten_nhan_vien: true,
          id_nhan_vien: true,
        },
      },

      chuyen_khoa: {
        select: {
          ten_chuyen_khoa: true,
          id_chuyen_khoa: true,
        },
      },
    },

    orderBy: {
      id_dat_lich: "desc",
    },
  });
};

const getAllDaDen = (params = {}) => {
  const { search } = params;

  const where = {
    trang_thai: "DA_DEN",
    // thoi_gian: getTodayRange(),
  };

  if (search) {
    where.OR = [
      {
        benh_nhan: {
          ten_benh_nhan: { contains: search },
        },
      },
      {
        benh_nhan: {
          so_dien_thoai: { contains: search },
        },
      },
    ];
  }

  return prisma.dat_lich.findMany({
    where,
    include: {
      benh_nhan: {
        select: {
          ten_benh_nhan: true,
          so_dien_thoai: true,
          id_benh_nhan: true,
        },
      },
      bac_si: {
        select: {
          ten_nhan_vien: true,
          id_nhan_vien: true,
        },
      },
      chuyen_khoa: {
        select: {
          ten_chuyen_khoa: true,
          id_chuyen_khoa: true,
        },
      },
      phieu_kham: {
        select: {
          id_phieu_kham: true,
          trang_thai: true,
        }
      }
    },
    orderBy: {
      id_dat_lich: "desc",
    },
  });
};

const getById = (id_dat_lich) => {
    return prisma.dat_lich.findFirst({
        where: { 
            id_dat_lich,
        },
    });
};

const insert = (data) => {
  return prisma.dat_lich.create({
    data: {
      thoi_gian: data.thoi_gian,
      ly_do: data.ly_do,
      trang_thai: data.trang_thai,

      benh_nhan: {
        connect: { id_benh_nhan: data.id_benh_nhan },
      },

      bac_si: {
        connect: { id_nhan_vien: data.id_bac_si },
      },

      chuyen_khoa: {
        connect: { id_chuyen_khoa: data.id_chuyen_khoa },
      },
    },
  });
};

const insertBooking = async (data) => {
  const { patient, booking } = data;

  if (!booking.doctor) throw new Error("Doctor is required");
  if (!booking.service) throw new Error("Service is required");
  if (!booking.date || !booking.time) throw new Error("Date/time missing");

  let benhNhan = await prisma.benh_nhan.findFirst({
    where: {
      OR: [
        { so_dien_thoai: patient.phone },
        { CCCD: patient.CCCD },
      ],
    },
  });

  if (!benhNhan) {
    benhNhan = await prisma.benh_nhan.create({
      data: {
        ten_benh_nhan: patient.name,
        ngay_sinh: new Date(patient.dob),
        gioi_tinh: patient.gender,
        so_dien_thoai: patient.phone,
        CCCD: patient.CCCD,
        dia_chi: patient.address,
      },
    });
  }

  return prisma.dat_lich.create({
    data: {
      thoi_gian: new Date(`${booking.date}T${booking.time}`),
      ly_do: booking.reason || "",

      benh_nhan: {
        connect: { id_benh_nhan: benhNhan.id_benh_nhan },
      },

      bac_si: {
        connect: {
          id_nhan_vien: Number(
            booking.doctor?.value || booking.doctor
          ),
        },
      },

      chuyen_khoa: {
        connect: {
          id_chuyen_khoa: Number(booking.service),
        },
      },
    },
  });
};

const update = (id_dat_lich, data) => {
    return prisma.dat_lich.update({
        where: { id_dat_lich },
        data,
    });
};

const updateStatus = (id_dat_lich, trang_thai) => {
  return prisma.dat_lich.update({
    where: { id_dat_lich },
    data: { trang_thai },
  });
};

const remove = (id_dat_lich) => {
  return prisma.dat_lich.delete({
    where: { id_dat_lich },
  });
};

const getByDoctorAndDate = (id_bac_si, date) => {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);

  return prisma.dat_lich.findMany({
    where: {
      id_bac_si: Number(id_bac_si),
      thoi_gian: {
        gte: start,
        lte: end,
      },
    },
  });
};

module.exports = {
    getAll,
    getAllDaDen,
    getById,
    insert,
    insertBooking,
    update,
    updateStatus,
    remove,
    getByDoctorAndDate,
};