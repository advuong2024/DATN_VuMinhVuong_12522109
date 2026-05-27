import axiosClient from "@/components/common/axiosClient";

export const getAllServices = async () => {
  const res = await axiosClient.get("/dich-vu", { params: { hien_thi: true } });
  return res.data;
};

export const getAllCategories = async () => {
  const res = await axiosClient.get("/danh-muc?type=dich_vu");
  return res.data;
};
