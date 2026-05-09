import axiosClient from "@/components/common/axiosClient";

export const getBills = (params) => {
  return axiosClient.get("/thanh-toan/trang-thai", { params });
};

export const getBillDetails = (id) => {
  return axiosClient.get(`/thanh-toan/${id}/details`);
};

export const createBill = (data) => {
  const { id_phieu_kham, loai, total, items } = data;
  return axiosClient.post("/thanh-toan", { id_phieu_kham, loai, total, items });
};

export const payBill = (data) => {
  const { id_phieu_kham, phuong_thuc, co_mua_thuoc } = data;
  return axiosClient.put("/thanh-toan/pay", { id_phieu_kham, phuong_thuc, co_mua_thuoc });
};