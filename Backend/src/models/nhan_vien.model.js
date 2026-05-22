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

 const get_bacsi_Chuyenkhoa = (id_chuyen_khoa) => {
    return prisma.nhan_vien.findMany({
        where: {
            id_chuyen_khoa,
            is_deleted: false
        },
        select: {
            id_nhan_vien: true,
            ten_nhan_vien: true,
            hinh_anh: true
        }
    });
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