 const { PrismaClient } = require('@prisma/client');
 const prisma = new PrismaClient();

  const getAll = () => {
   return prisma.nhan_vien.findMany({
     where: { is_deleted: false },
     orderBy: { id_nhan_vien: "desc" },
     include: {
       chuyen_khoa: {
         select: {
             ten_chuyen_khoa: true,
             id_chuyen_khoa: true,
         }
       },
       chung_chis: {
         select: {
           id_chung_chi: true,
           ten_chung_chi: true,
           noi_cap: true,
           nam_cap: true,
         }
       }
     }
   });
  };

const get_bacsi_Chuyenkhoa = async (id_chuyen_khoa, date) => {
  const dayjs = require("dayjs");
  const prisma = require("../prisma/client");

  const bacSiList = await prisma.nhan_vien.findMany({
    where: {
      id_chuyen_khoa,
      is_deleted: false
    },
    select: {
      id_nhan_vien: true,
      ten_nhan_vien: true,
      hinh_anh: true,
      so_luong_toi_da: true,
    }
  });

  const ngay = date ? dayjs(date) : dayjs();
  const startOfDay = ngay.startOf("day").toDate();
  const endOfDay = ngay.endOf("day").toDate();

  const result = await Promise.all(
    bacSiList.map(async (bs) => {
      const daDat = await prisma.dat_lich.count({
        where: {
          id_bac_si: bs.id_nhan_vien,
          trang_thai: { in: ["DA_DAT", "DA_DEN"] },
          thoi_gian: { gte: startOfDay, lte: endOfDay },
        },
      });

      return {
        id_nhan_vien: bs.id_nhan_vien,
        ten_nhan_vien: bs.ten_nhan_vien,
        hinh_anh: bs.hinh_anh,
        so_luong_toi_da: bs.so_luong_toi_da,
        da_dat_hom_nay: daDat,
        con_lai: bs.so_luong_toi_da !== null ? bs.so_luong_toi_da - daDat : null,
      };
    })
  );

  return result;
};

 const getNhanVienChuaCoTaiKhoan = () => {
  return prisma.nhan_vien.findMany({
    where: {
      tai_khoan: null,
    },
    select: {
      id_nhan_vien: true,
      ten_nhan_vien: true,
    },
  });
 };

 const getById = (id_nhan_vien) => {
    return prisma.nhan_vien.findFirst({
        where: { 
            id_nhan_vien,
            is_deleted: false
        },
        include: {
            chuyen_khoa: {
                select: {
                    ten_chuyen_khoa: true,
                    id_chuyen_khoa: true,
                }
            },
            chung_chis: {
                select: {
                    id_chung_chi: true,
                    ten_chung_chi: true,
                    noi_cap: true,
                    nam_cap: true,
                }
            }
        }
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
    get_bacsi_Chuyenkhoa,
    getNhanVienChuaCoTaiKhoan,
};