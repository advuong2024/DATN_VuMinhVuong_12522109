const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.phieu_kham.findMany({
        orderBy: {
          id_phieu_kham: 'desc',
        },
    });
};

const getById = (id_phieu_kham) => {
  return prisma.phieu_kham.findFirst({
    where: { id_phieu_kham },
    include: {
      bac_si: true,
      benh_nhan: true,
      chi_tiets: {
        include: {
          dich_vu: true,
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
  });
};

const insert = async (data) => {
  let {
    id_benh_nhan,
    id_bac_si,
    id_dat_lich,
    trang_thai,
    trieu_chung,
    chan_doan,
    ghi_chu,
    chi_tiets,
  } = data;

  if (id_dat_lich) {
    const booking = await prisma.dat_lich.findUnique({
      where: { id_dat_lich },
    });

    if (!booking) throw new Error("Không tìm thấy lịch đặt");

    id_benh_nhan = booking.id_benh_nhan;
    id_bac_si = booking.id_bac_si;
  }

  return prisma.phieu_kham.create({
    data: {
      trieu_chung,
      chan_doan,
      ghi_chu,

      id_benh_nhan,
      id_bac_si,
      id_dat_lich: id_dat_lich || null,
      trang_thai: trang_thai || "DANG_KHAM",
    },
  });
};

const upsertPayment = async (tx, id_phieu_kham, loai, items) => {
  if (!items || items.length === 0) {
    await tx.thanh_toan.deleteMany({
      where: {
        id_phieu_kham,
        loai_thanh_toan: loai,
      },
    });
    return null;
  }

  const total = items.reduce(
    (sum, i) => sum + Number(i.gia || 0) * Number(i.so_luong || 0),
    0
  );

  const existed = await tx.thanh_toan.findUnique({
    where: {
      id_phieu_kham_loai_thanh_toan: {
        id_phieu_kham,
        loai_thanh_toan: loai,
      },
    },
  });

  const mappedItems = items.map((i) => ({
    loai_item: loai,
    id_item: i.id_chi_tiet,
    gia: i.gia,
    so_luong: i.so_luong,
  }));

  if (existed) {
    return tx.thanh_toan.update({
      where: { id_thanh_toan: existed.id_thanh_toan },
      data: {
        tong_tien: total,

        chi_tiets: {
          deleteMany: {},
          create: mappedItems,
        },
      },
      include: {
        chi_tiets: true,
      },
    });
  }

  return tx.thanh_toan.create({
    data: {
      id_phieu_kham,
      loai_thanh_toan: loai,
      tong_tien: total,
      trang_thai: "CHUA_THANH_TOAN",

      chi_tiets: {
        create: mappedItems,
      },
    },
  });
};

const update = async (id_phieu_kham, data) => {
  const { id_benh_nhan, id_bac_si, chi_tiets, don_thuoc, ...rest } = data;

  return prisma.$transaction(async (tx) => {
    const encounter = await tx.phieu_kham.update({
      where: { id_phieu_kham },
      data: {
        ...rest,

        ...(id_benh_nhan && {
          benh_nhan: { connect: { id_benh_nhan } },
        }),

        ...(id_bac_si && {
          bac_si: { connect: { id_nhan_vien: id_bac_si } },
        }),

        ...(chi_tiets && {
          chi_tiets: {
            deleteMany: {},
            create: chi_tiets.create || [],
          },
        }),

        ...(don_thuoc && {
          don_thuoc: {
            upsert: {
              create: {
                chi_tiets: {
                  create: don_thuoc.create.chi_tiets.create,
                },
              },
              update: {
                chi_tiets: {
                  deleteMany: {},
                  create: don_thuoc.create.chi_tiets.create,
                },
              },
            },
          },
        }),
      },
      include: {
        chi_tiets: true,
        don_thuoc: {
          include: { chi_tiets: true },
        },
      },
    });

    const servicePayment = await upsertPayment(
      tx,
      id_phieu_kham,
      "DICH_VU",
      encounter.chi_tiets
    );

    const medicinePayment = await upsertPayment(
      tx,
      id_phieu_kham,
      "THUOC",
      encounter.don_thuoc?.chi_tiets || []
    );

    return {
      encounter,
      payment: {
        service: servicePayment,
        medicine: medicinePayment,
      },
    };
  });
};

const remove = (id_phieu_kham) => {
    return prisma.phieu_kham.update({
        where: { id_phieu_kham },
        data: {
            is_deleted: true,
        },
    });
};

const getMedicalHistories = (id) => {
    return prisma.phieu_kham.findMany({
        where: {
          id_benh_nhan: Number(id),
        },
        include: {
          bac_si: true,
          benh_nhan: true,
        },
        orderBy: {
          created_at: 'desc',
        },
    });
};

const startEncounter = async (id_phieu_kham) => {
  const id = Number(id_phieu_kham);

  const pk = await prisma.phieu_kham.findUnique({
    where: { id_phieu_kham: id },
  });

  if (!pk) throw new Error("Không tìm thấy phiếu khám");

  if (pk.trang_thai === "DA_HUY") {
    throw new Error("Phiếu đã hủy, không thể bắt đầu khám");
  }

  if (pk.trang_thai === "DANG_KHAM") {
    return pk;
  }

  return prisma.phieu_kham.update({
    where: { id_phieu_kham: id },
    data: {
      trang_thai: "DANG_KHAM",
    },
  });
};

module.exports = {
  getAll,
  getById,
  insert,
  update,
  remove,
  startEncounter,
  getMedicalHistories,
};