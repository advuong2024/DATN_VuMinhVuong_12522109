import axiosClient from "@/components/common/axiosClient";

export const getBills = (params) => {
  return axiosClient.get("/thanh-toan/trang-thai", { params });
};