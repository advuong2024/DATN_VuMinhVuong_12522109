import axiosClient from "@/components/common/axiosClient";

export const getMedicines = (params) => {
  return axiosClient.get("/thuoc", { params });
};

export const createMedicine = (data) => {
  return axiosClient.post("/thuoc", data);
};

export const updateMedicine = (id, data) => {
  return axiosClient.put(`/thuoc/${id}`, data);
};

export const deleteMedicine = (id) => {
  return axiosClient.delete(`/thuoc/${id}`);
};

export const getCategory = () => {
  return axiosClient.get("/danh-muc");
};