import axiosClient from "@/components/common/axiosClient";

export const getSpecialties = () => {
  return axiosClient.get("/chuyen-khoa");
};

export const createSpecialty = (data) => {
  return axiosClient.post("/chuyen-khoa", data);
};

export const updateSpecialty = (id, data) => {
  return axiosClient.put(`/chuyen-khoa/${id}`, data);
};

export const deleteSpecialty = (id) => {
  return axiosClient.delete(`/chuyen-khoa/${id}`);
};