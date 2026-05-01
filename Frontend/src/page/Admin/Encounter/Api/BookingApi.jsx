import axiosClient from "@/components/common/axiosClient";

export const getBookings = async (params) => {
  return axiosClient.get("/dat-lich/da-den", params);
};

export const createBooking = (data) => {
  return axiosClient.post("/dat-lich", data);
};

export const findPatientByPhone = (params) => {
  return axiosClient.get("/benh-nhan/tim-kiem", { params });
};