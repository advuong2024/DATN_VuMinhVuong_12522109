import axiosClient from "@/components/common/axiosClient";

export const getCategories = (params) => {
  return axiosClient.get("/danh-muc", { params });
};

export const createCategory = (data) => {
  return axiosClient.post("/danh-muc", data);
};

export const updateCategory = (id, data) => {
  return axiosClient.put(`/danh-muc/${id}`, data);
};

export const deleteCategory = (id) => {
  return axiosClient.delete(`/danh-muc/${id}`);
};