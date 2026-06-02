import axiosClient from "@/components/common/axiosClient";

export const getBookings = async (params) => {
  return axiosClient.get("/dat-lich/da-den", {params});
};

export const createBooking = (data) => {
  return axiosClient.post("/dat-lich", data);
};

export const findPatientByPhone = (params) => {
  return axiosClient.get("/benh-nhan/tim-kiem", { params });
};

export const getCK = async () => {
  const res = await axiosClient.get("/chuyen-khoa");
  return res.data;
}

export const getDoctorCK = async (id) => {
  const res = await axiosClient.get(`/nhan-vien/bac-si/${id}`);
  return res.data;
}

export const createPatient = async (data) => {
  return axiosClient.post("/benh-nhan", data);
}

export const reportBusy = async (buoi) => {
  const res = await axiosClient.post("/dat-lich/bao-ban", { buoi });
  return res.data;
}

export const getKiemTraBaoBan = async () => {
  const res = await axiosClient.get("/dat-lich/co-the-bao-ban");
  return res.data;
}