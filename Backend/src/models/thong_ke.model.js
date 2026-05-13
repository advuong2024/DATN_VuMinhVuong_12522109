const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSummary = async () => {
  const now = new Date();

  const firstDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const [
    totalPatients,
    totalDoctors,
    todayAppointments,
    totalRevenue,
  ] = await Promise.all([
    prisma.benh_nhan.count(),

    prisma.nhan_vien.count({
      where: {
        chuc_vu: "BAC_SI",
      },
    }),

    prisma.dat_lich.count({
      where: {
        thoi_gian: {
          gte: new Date( new Date().setHours( 0, 0, 0, 0 )),

          lte: new Date( new Date().setHours( 23, 59, 59, 999 )),
        },
      },
    }),

    prisma.thanh_toan.aggregate({
      _sum: {
        tong_tien: true,
      },

      where: {
        trang_thai:
          "DA_THANH_TOAN",

        ngay_thanh_toan: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    }),
  ]);

  return {
    totalPatients,
    totalDoctors,
    todayAppointments,

    totalRevenue:
      totalRevenue._sum
        .tong_tien || 0,
  };
};

const getRecentPatients = async () => {
  return prisma.phieu_kham.findMany({
    take: 5,
    orderBy: {
      created_at: "desc",
    },

    select: {
      id_phieu_kham: true,
      ngay_kham: true,
      trang_thai: true,

      benh_nhan: {
        select: {
          ten_benh_nhan: true,
        },
      },

      bac_si: {
        select: {
          ten_nhan_vien: true,
        },
      },
    },
  });
};

const getPerformance = async () => {
  const totalAppointments =
    await prisma.dat_lich.count();

  const completedAppointments =
    await prisma.phieu_kham.count({
      where: {
        trang_thai: "HOAN_THANH",
      },
    });

  const cancelledAppointments =
    await prisma.dat_lich.count({
      where: {
        trang_thai: "DA_HUY",
      },
    });

  const appointmentRate =
    totalAppointments === 0
      ? 0
      : Math.round(
          (completedAppointments /
            totalAppointments) *
            100
        );

  const completionRate =
    totalAppointments === 0
      ? 0
      : Math.round(
          ((totalAppointments -
            cancelledAppointments) /
            totalAppointments) *
            100
        );

  return {
    appointmentRate,
    patientSatisfaction: 92,
    completionRate,
  };
};

const getRevenueChart = async (range) => {
  let startDate = new Date();

  if (range === "7") {
    startDate.setDate(startDate.getDate() - 7);
  }

  if (range === "15") {
    startDate.setDate(startDate.getDate() - 15);
  }

  if (range === "30") {
    startDate.setDate(startDate.getDate() - 30);
  }

  const revenues =
    await prisma.thanh_toan.findMany({
      where: {
        trang_thai: "DA_THANH_TOAN",

        created_at: {
          gte: startDate,
        },
      },

      select: {
        tong_tien: true,
        created_at: true,
      },

      orderBy: {
        created_at: "asc",
      },
    });

  const grouped = {};

  revenues.forEach((item) => {
    const date = item.created_at
      .toISOString()
      .split("T")[0];

    if (!grouped[date]) {
      grouped[date] = 0;
    }

    grouped[date] += Number(item.tong_tien);
  });

  return Object.keys(grouped).map((date) => ({
    date,
    revenue: grouped[date],
  }));
};

module.exports = {
  getSummary,
  getRecentPatients,
  getPerformance,
  getRevenueChart,
};