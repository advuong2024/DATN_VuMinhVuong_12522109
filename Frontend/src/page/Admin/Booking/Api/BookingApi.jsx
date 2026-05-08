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

export const createEncounter = async (data) => {
  const res = await axiosClient.post("/phieu-kham", data);
  return res;
};

export const createPayment = async (data) => {
  const res = await axiosClient.post("/thanh-toan", data);
  return res;
};

export const getServices = async () => {
  const res = await axiosClient.get("/dich-vu");
  return res;
};
