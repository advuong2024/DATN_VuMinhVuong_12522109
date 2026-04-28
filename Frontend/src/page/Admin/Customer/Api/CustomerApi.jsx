import axiosClient from "@/components/common/axiosClient";

export const getPatients = (params) => {
  return axiosClient.get("/benh-nhan", { params });
};

export const createPatient = (data) => {
  return axiosClient.post("/benh-nhan", data);
};

export const updatePatient = (id, data) => {
  return axiosClient.put(`/benh-nhan/${id}`, data);
};

export const deletePatient = (id) => {
  return axiosClient.delete(`/benh-nhan/${id}`);
};