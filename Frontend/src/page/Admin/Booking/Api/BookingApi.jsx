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

export const getServices = async (chuyenKhoa) => {
  const params = chuyenKhoa ? { chuyen_khoa: chuyenKhoa } : {};
  const res = await axiosClient.get("/dich-vu", { params });
  return res;
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

export const getCanBook = async (id) => {
  return axiosClient.get(`/dat-lich/${id}/can-book`) 
}

export const reportBusy = async (buoi) => {
  const res = await axiosClient.post("/dat-lich/bao-ban", { buoi });
  return res.data;
}

export const reassignDoctor = async (bookingId, newDoctorId) => {
  const res = await axiosClient.patch(`/dat-lich/${bookingId}/chuyen-bac-si`, {
    id_bac_si_moi: newDoctorId,
  });
  return res.data;
}

export const getDoctorsBySpecialty = async (specialtyId) => {
  const res = await axiosClient.get(`/nhan-vien/bac-si/${specialtyId}`);
  return res.data;
}