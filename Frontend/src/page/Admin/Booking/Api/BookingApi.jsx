import axiosClient from "@/components/common/axiosClient";

export const getBookings = async (params) => {
  return axiosClient.get("/dat-lich", { params });
};

export const updateStatus = async (id, status) => {
  const res = await axiosClient.patch(`/dat-lich/${id}/status`, {
    trang_thai: status,
  });
  return res;
};