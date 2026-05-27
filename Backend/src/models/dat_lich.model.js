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

const getAllDaDen = async (params = {}, user) => {
  const { search } = params;

  const where = {
    trang_thai: "DA_DEN",
    // thoi_gian: getTodayRange(),
  };

  if (user.vai_tro === "BAC_SI") {
    where.id_bac_si = user.id_nhan_vien;
  }

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

  const appointments = await prisma.dat_lich.findMany({
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
        include: {
          thanh_toan: {
            where: {
              trang_thai: "DA_THANH_TOAN",
              loai_thanh_toan: "DICH_VU"
            },
            include: {
              chi_tiets: true,
            },
          },

          chi_tiets: {
            where: {
              loai_chi_tiet: "DICH_VU",
            },
          },

          don_thuoc: {
            include: {
              chi_tiets: {
                include: {
                  thuoc: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      id_dat_lich: "desc",
    },
  });

  return appointments.map((item) => {
    const paidServiceIds =
      item.phieu_kham?.thanh_toan?.flatMap((p) =>
        p.chi_tiets
          .filter((ct) => ct.loai_item === "DICH_VU")
          .map((ct) => Number(ct.id_item))
      ) || [];

    return {
      ...item,

      phieu_kham: {
        ...item.phieu_kham,

        chi_tiets:
          item.phieu_kham?.chi_tiets?.map((ct) => ({
            ...ct,
            is_paid: paidServiceIds.includes(
              Number(ct.id_chi_tiet)
            ),
          })) || [],
      },
    };
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

  if (!booking.doctor) throw new Error("Vui lòng chọn bác sĩ");
  if (!booking.service) throw new Error("Vui lòng chọn dịch vụ");
  if (!booking.date || !booking.time) throw new Error("Thiếu ngày hoặc giờ khám");

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
  return prisma.dat_lich.findMany({
    where: {
      id_bac_si: Number(id_bac_si),
      thoi_gian: {
        gte: dayjs(date).startOf("day").toDate(),
        lte: dayjs(date).endOf("day").toDate(),
      },
    },
  });
};

const canBook = async (id_benh_nhan, date) => {
  const dateRange = date ? {
    gte: dayjs(date).startOf("day").toDate(),
    lte: dayjs(date).endOf("day").toDate(),
  } : undefined;

  const activeBooking =
    await prisma.dat_lich.findFirst({
      where: {
        id_benh_nhan,
        thoi_gian: dateRange,
        trang_thai: "DA_DAT",
      },

      orderBy: {
        thoi_gian: "desc",
      },
    });

  if (activeBooking) {
    return {
      canBook: false,
      message:
        "Bệnh nhân đã có lịch hẹn đang hoạt động",
    };
  }

  const activeEncounter =
    await prisma.phieu_kham.findFirst({
      where: {
        id_benh_nhan,
        ngay_kham: dateRange,
        trang_thai: {
          in: ["CHO_KHAM","DANG_KHAM"]
        },
      },

      orderBy: {
        ngay_kham: "desc",
      },
    });

  if (activeEncounter) {
    return{
      canBook: false,
      message:
        "Bệnh nhân có phiếu khám chưa hoàn tất",
    };
  }

  return {
    canBook: true,
  };
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
    canBook,
};