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
      where: { id_dat_lich: Number(id_dat_lich) },
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

      chi_tiets: chi_tiets?.length
        ? {
            create: chi_tiets.map((i) => ({
              id_dich_vu: i.id_dich_vu,
              so_luong: i.so_luong,
              gia: i.gia,
              id_bac_si,
              trang_thai: "CHO_THUC_HIEN",
              loai_chi_tiet: i.loai_chi_tiet || "DICH_VU",
            })),
          }
        : undefined,
    },
    include: {
      chi_tiets: true,
    },
  });
};

const upsertPayment = async (tx, id_phieu_kham, loai, items) => {
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
    include: { chi_tiets: true },
  });

  const mappedItems = items
    .filter((i) => i.id_chi_tiet)
    .map((i) => ({
      loai_item: loai,
      id_item: Number(i.id_chi_tiet),
      gia: i.gia,
      so_luong: i.so_luong,
    }));

  if (existed) {
    const existingIds = existed.chi_tiets.map((d) => Number(d.id_item));
    const incomingIds = mappedItems.map((m) => Number(m.id_item));

    const toDelete = existingIds.filter((id) => !incomingIds.includes(id));

    await tx.thanh_toan.update({
      where: { id_thanh_toan: existed.id_thanh_toan },
      data: {
        tong_tien: total,
      },
    });

    if (toDelete.length > 0) {
      await tx.thanh_toan_chi_tiet.deleteMany({
        where: {
          id_thanh_toan: existed.id_thanh_toan,
          loai_item: loai,
          id_item: { in: toDelete },
        },
      });
    }

    for (const item of mappedItems) {
      await tx.thanh_toan_chi_tiet.upsert({
        where: {
          id_thanh_toan_loai_item_id_item: {
            id_thanh_toan: existed.id_thanh_toan,
            loai_item: loai,
            id_item: item.id_item,
          },
        },
        create: {
          ...item,
          id_thanh_toan: existed.id_thanh_toan,
        },
        update: item,
      });
    }

    return tx.thanh_toan.findUnique({
      where: { id_thanh_toan: existed.id_thanh_toan },
      include: { chi_tiets: true },
    });

  }

  if (mappedItems.length === 0) return null;

  return tx.thanh_toan.create({
    data: {
      id_phieu_kham,
      tong_tien: total,
      loai_thanh_toan: loai,
      trang_thai: "CHUA_THANH_TOAN",

      chi_tiets: {
        create: mappedItems,
      },
    },
    include: { chi_tiets: true },
  });
};

const update = async (id_phieu_kham, data) => {
  const { id_benh_nhan, id_bac_si, chi_tiets, don_thuoc, ...rest } = data;

  return prisma.$transaction(async (tx) => {
    await tx.phieu_kham.update({
      where: { id_phieu_kham },
      data: {
        ...rest,
        ...(id_benh_nhan && {
          benh_nhan: { connect: { id_benh_nhan } },
        }),
        ...(id_bac_si && {
          bac_si: { connect: { id_nhan_vien: id_bac_si } },
        }),
      },
    });

    if (Array.isArray(chi_tiets)) {
      const existing = await tx.chi_tiet_dich_vu.findMany({
        where: { id_phieu_kham, loai_chi_tiet: "DICH_VU" },
      });
      const existingIds = existing.map((e) => Number(e.id_chi_tiet));
      const incomingIds = chi_tiets
        .filter((i) => i.id_chi_tiet)
        .map((i) => Number(i.id_chi_tiet));

      const toDelete = existingIds.filter((id) => !incomingIds.includes(id));

      if (toDelete.length > 0) {
        await tx.chi_tiet_dich_vu.deleteMany({
          where: { id_chi_tiet: { in: toDelete } },
        });
      }

      for (const item of chi_tiets) {
        const { id_chi_tiet, ...itemData } = item;
        if (id_chi_tiet) {
          await tx.chi_tiet_dich_vu.update({
            where: { id_chi_tiet: Number(id_chi_tiet) },
            data: itemData,
          });
        } else {
          await tx.chi_tiet_dich_vu.create({
            data: { ...itemData, id_phieu_kham },
          });
        }
      }
    }

    if (don_thuoc) {
      let dt = await tx.don_thuoc.findUnique({
        where: { id_phieu_kham },
      });

      if (!dt) {
        dt = await tx.don_thuoc.create({
          data: { id_phieu_kham },
        });
      }

      const incomingMedicines = Array.isArray(don_thuoc)
        ? don_thuoc
        : don_thuoc.chi_tiets || [];

      const existingMed = await tx.chi_tiet_don_thuoc.findMany({
        where: { id_don_thuoc: dt.id_don_thuoc },
      });
      const existingMedIds = existingMed.map((e) => Number(e.id_chi_tiet));
      const incomingMedIds = incomingMedicines
        .filter((i) => i.id_chi_tiet)
        .map((i) => Number(i.id_chi_tiet));

      const toDeleteMed = existingMedIds.filter(
        (id) => !incomingMedIds.includes(id)
      );

      if (toDeleteMed.length > 0) {
        await tx.chi_tiet_don_thuoc.deleteMany({
          where: { id_chi_tiet: { in: toDeleteMed } },
        });
      }

      for (const item of incomingMedicines) {
        const { id_chi_tiet, ...itemData } = item;
        if (id_chi_tiet) {
          await tx.chi_tiet_don_thuoc.update({
            where: { id_chi_tiet: Number(id_chi_tiet) },
            data: itemData,
          });
        } else {
          await tx.chi_tiet_don_thuoc.create({
            data: { ...itemData, id_don_thuoc: dt.id_don_thuoc },
          });
        }
      }
    }

    const encounter = await tx.phieu_kham.findUnique({
      where: { id_phieu_kham },
      include: {
        chi_tiets: true,
        don_thuoc: {
          include: { chi_tiets: true },
        },
      },
    });

    if (encounter.trang_thai === "HOAN_THANH") {
      await tx.chi_tiet_dich_vu.updateMany({
        where: {
          id_phieu_kham,
          loai_chi_tiet: "PHI_KHAM",
          trang_thai: { not: "HOAN_THANH" },
        },
        data: { trang_thai: "HOAN_THANH" },
      });
    }

    let servicePayment = null;
    let medicinePayment = null;

    if (encounter.chi_tiets && encounter.chi_tiets.length > 0) {
      const onlyDichVu = encounter.chi_tiets.filter(
        (ct) => ct.loai_chi_tiet === "DICH_VU"
      );
      if (onlyDichVu.length > 0) {
        servicePayment = await upsertPayment(
          tx,
          id_phieu_kham,
          "DICH_VU",
          onlyDichVu
        );
      }
    }

    if (encounter.trang_thai === "HOAN_THANH") {
      medicinePayment = await upsertPayment(
        tx,
        id_phieu_kham,
        "THUOC",
        encounter.don_thuoc?.chi_tiets || []
      );
    }

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