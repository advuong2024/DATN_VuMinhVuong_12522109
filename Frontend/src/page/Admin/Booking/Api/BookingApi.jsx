import axiosClient from "@/components/common/axiosClient";

export const getBookings = async (params) => {
  return axiosClient.get("/dat-lich", { params });
};