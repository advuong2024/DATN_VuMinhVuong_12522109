import axiosClient from "@/components/common/axiosClient";

export const getDoctors = (params) => {
  return axiosClient.get("/nhan-vien", { params });
};

export const createDoctor = (data) => {
  return axiosClient.post("/nhan-vien", data);
};

export const updateDoctor = (id, data) => {
  return axiosClient.put(`/nhan-vien/${id}`, data);
};

export const deleteDoctor = (id) => {
  return axiosClient.delete(`/nhan-vien/${id}`);
};

export const getSpecialties = () => {
  return axiosClient.get("/chuyen-khoa");
};

export const getCertificates = (nhanVienId) => {
  return axiosClient.get(`/chung-chi/nhan-vien/${nhanVienId}`);
};

export const createCertificate = (data) => {
  return axiosClient.post("/chung-chi", data);
};

export const updateCertificate = (id, data) => {
  return axiosClient.put(`/chung-chi/${id}`, data);
};

export const deleteCertificate = (id) => {
  return axiosClient.delete(`/chung-chi/${id}`);
};
