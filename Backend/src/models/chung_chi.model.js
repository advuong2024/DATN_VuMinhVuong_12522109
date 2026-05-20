const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getByNhanVien = (id_nhan_vien) => {
  return prisma.chung_chi.findMany({
    where: { id_nhan_vien },
    orderBy: { id_chung_chi: "desc" },
  });
};

const getById = (id_chung_chi) => {
  return prisma.chung_chi.findUnique({
    where: { id_chung_chi },
  });
};

const insert = (data) => {
  return prisma.chung_chi.create({ data });
};

const update = (id_chung_chi, data) => {
  return prisma.chung_chi.update({
    where: { id_chung_chi },
    data,
  });
};

const remove = (id_chung_chi) => {
  return prisma.chung_chi.delete({
    where: { id_chung_chi },
  });
};

module.exports = {
  getByNhanVien,
  getById,
  insert,
  update,
  remove,
};
