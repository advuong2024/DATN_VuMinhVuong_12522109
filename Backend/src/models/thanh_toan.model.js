const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAll = () => {
    return prisma.thanh_toan.findMany({
        orderBy: {
            id_thanh_toan: 'desc',
        },
        where: { is_deleted: false },
    });
};

const getById = (id_thanh_toan) => {
  return prisma.thanh_toan.findFirst({
    where: { 
      id_thanh_toan,
      is_deleted: false
    },

    include: {
      phieu_kham: {
        include: {
          benh_nhan: true,
          bac_si: true,
        },
      },
      thanh_toan_chi_tiet: true,
    },
  });
};

const insert = async (data) => {
  const {
    id_phieu_kham,
    tong_tien,
    loai_thanh_toan,
    phuong_thuc,
    items,
  } = data;

  const existed = await prisma.thanh_toan.findFirst({
    where: {
      id_phieu_kham: Number(id_phieu_kham),
      loai_thanh_toan,
    },
  });

  if (existed) {
    throw new Error("Đã tồn tại thanh toán cho loại này");
  }

  const result = await prisma.$transaction(async (tx) => {
    const tt = await tx.thanh_toan.create({
      data: {
        id_phieu_kham: Number(id_phieu_kham),
        tong_tien: tong_tien ?? 0,
        loai_thanh_toan,
        phuong_thuc: phuong_thuc ?? null,
        trang_thai: "DA_THANH_TOAN",
      },
    });

    if (Array.isArray(items) && items.length > 0) {
      await tx.thanh_toan_chi_tiet.createMany({
        data: items.map((i) => ({
          id_thanh_toan: tt.id_thanh_toan,
          loai_item: i.loai_item,
          id_item: i.id_item,
        })),
      });
    }

    return tt;
  });

  return result;
};

const update = (id_thanh_toan, data) => {
    return prisma.thanh_toan.update({
        where: { id_thanh_toan },
        data,
    });
};

const remove = (id_thanh_toan) => {
    return prisma.thanh_toan.update({
        where: { id_thanh_toan },
        data: {
            is_deleted: true,
        },
    });
};

const getPayments = async (params) => {
  const { keyword, trang_thai } = params;

  const payments =
    await prisma.thanh_toan.findMany({
      where: {
        trang_thai,

        ...(keyword && {
          OR: [
            {
              phieu_kham: {
                benh_nhan: {
                  ten_benh_nhan: {
                    contains: keyword,
                  },
                },
              },
            },

            {
              phieu_kham: {
                bac_si: {
                  ten_nhan_vien: {
                    contains: keyword,
                  },
                },
              },
            },
          ],
        }),
      },

      include: {
        phieu_kham: {
          include: {
            benh_nhan: true,
            bac_si: true,
          },
        },

        chi_tiets: true,
      },

      orderBy: {
        id_thanh_toan: "desc",
      },
    });

  return payments.map((p) => {
    const tong_tien = p.chi_tiets.reduce(
      (sum, item) =>
        sum +
        Number(item.gia) *
          Number(item.so_luong),
      0
    );

    return {
      ...p,
      tong_tien,
    };
  });
};

const getPaymentDetailByPhieuKham = async (
  id_thanh_toan
) => {
  const payment =
    await prisma.thanh_toan.findUnique({
      where: {
        id_thanh_toan: Number(id_thanh_toan),
      },
      include: {
        phieu_kham: true,
      },
    });

  if (!payment) {
    throw new Error("Not found");
  }

  const id_phieu_kham =
    payment.id_phieu_kham;

  let consultation = null;

  let services = {
    items: [],
    total: 0,
  };

  let medicines = {
    items: [],
    total: 0,
  };

  if (
    payment.loai_thanh_toan === "PHI_KHAM"
  ) {
    consultation = {
      name: "Phí khám",
      price: Number(
        payment.phieu_kham.phi_kham || 0
      ),
      quantity: 1,
      total: Number(
        payment.phieu_kham.phi_kham || 0
      ),
    };
  }

  if (
    payment.loai_thanh_toan === "DICH_VU"
  ) {
    const data =
      await prisma.chi_tiet_dich_vu.findMany({
        where: { id_phieu_kham },
        include: {
          dich_vu: true,
        },
      });

    const items = data.map((i) => ({
      id: i.id_dich_vu,
      name: i.dich_vu.ten_dich_vu,
      price: Number(i.gia),
      quantity: i.so_luong,
      total:
        Number(i.gia) * i.so_luong,
    }));

    services = {
      items,
      total: items.reduce(
        (s, i) => s + i.total,
        0
      ),
    };
  }

  if (
    payment.loai_thanh_toan === "THUOC"
  ) {
    const donThuoc =
      await prisma.don_thuoc.findFirst({
        where: { id_phieu_kham },
        include: {
          chi_tiets: {
            include: {
              thuoc: true,
            },
          },
        },
      });

    const items =
      donThuoc?.chi_tiets?.map((i) => ({
        id: i.id_thuoc,
        name: i.thuoc.ten_thuoc,
        price: Number(i.gia),
        quantity: i.so_luong,
        total:
          Number(i.gia) * i.so_luong,
      })) || [];

    medicines = {
      items,
      total: items.reduce(
        (s, i) => s + i.total,
        0
      ),
    };
  }

  return {
    id_thanh_toan:
      payment.id_thanh_toan,

    id_phieu_kham,

    loai_thanh_toan:
      payment.loai_thanh_toan,

    consultation,

    services,

    medicines,
  };
};

const pay = async (data) => {
  const {
    id_phieu_kham,
    phuong_thuc,
    co_mua_thuoc,
  } = data;

  const isBuyMedicine = Boolean(co_mua_thuoc);

  return prisma.$transaction(async (tx) => {
    await tx.thanh_toan.updateMany({
      where: {
        id_phieu_kham,
        loai_thanh_toan: "DICH_VU",
        trang_thai: "CHUA_THANH_TOAN",
      },
      data: {
        trang_thai: "DA_THANH_TOAN",
        phuong_thuc,
        ngay_thanh_toan: new Date(),
      },
    });

    if (isBuyMedicine) {

      await tx.thanh_toan.updateMany({
        where: {
          id_phieu_kham,
          loai_thanh_toan: "THUOC",
          trang_thai: "CHUA_THANH_TOAN",
        },
        data: {
          trang_thai: "DA_THANH_TOAN",
          phuong_thuc,
          ngay_thanh_toan: new Date(),
        },
      });

      await tx.don_thuoc.updateMany({
        where: {
          id_phieu_kham,
          trang_thai_mua: "CHUA_QUYET_DINH",
        },
        data: {
          trang_thai_mua: "DA_MUA",
        },
      });

    } else {

      await tx.thanh_toan.updateMany({
        where: {
          id_phieu_kham,
          loai_thanh_toan: "THUOC",
          trang_thai: "CHUA_THANH_TOAN",
        },
        data: {
          trang_thai: "HUY",
        },
      });

      await tx.don_thuoc.updateMany({
        where: {
          id_phieu_kham,
          trang_thai_mua: "CHUA_QUYET_DINH",
        },
        data: {
          trang_thai_mua: "KHONG_MUA",
        },
      });
    }

    return true;
  });
};

module.exports = {
  getAll,
  getById,
  insert,
  update,
  remove,
  getPayments,
  getPaymentDetailByPhieuKham,
  pay,
};