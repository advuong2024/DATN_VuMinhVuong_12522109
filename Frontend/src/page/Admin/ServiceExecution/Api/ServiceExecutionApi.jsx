import axiosClient from "@/components/common/axiosClient";

export const getPendingServices = () => {
  return axiosClient.get("/chi-tiet-dich-vu/cho-thuc-hien");
};

export const getServicesByStatus = (trangThai) => {
  return axiosClient.get(`/chi-tiet-dich-vu/theo-trang-thai/${trangThai}`);
};

export const updateServiceStatus = (id, trangThai) => {
  return axiosClient.patch(`/chi-tiet-dich-vu/${id}/trang-thai`, { trang_thai: trangThai });
};

export const updateServiceResult = (id, formData) => {
  return axiosClient.patch(`/chi-tiet-dich-vu/${id}/ket-qua`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getServicesByEncounter = (id) => {
  return axiosClient.get(`/chi-tiet-dich-vu/phieu-kham/${id}`);
};
