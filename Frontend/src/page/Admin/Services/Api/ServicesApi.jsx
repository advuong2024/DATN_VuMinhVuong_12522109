import axiosClient from "@/components/common/axiosClient";

export const getServices = (params) => {
  return axiosClient.get("/dich-vu", { params });
};

export const createService = (data) => {
  return axiosClient.post("/dich-vu", data);
};

export const updateService = (id, data) => {
  return axiosClient.put(`/dich-vu/${id}`, data);
};

export const deleteService = (id) => {
  return axiosClient.delete(`/dich-vu/${id}`);
};

export const getCategory = () => {
  return axiosClient.get("/danh-muc");
};

export const getSpecialty = () => {
  return axiosClient.get("/chuyen-khoa");
};