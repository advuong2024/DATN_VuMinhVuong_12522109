import axiosClient from "@/components/common/axiosClient";

export const getPatientById = (id) => {
  return axiosClient.get(`/benh-nhan/${id}`);
};

export const getServices = () => {
  return axiosClient.get(`/dich-vu`);
};

export const getMedicines = () => {
  return axiosClient.get(`/thuoc`);
};

export const createEncounter = (data) => {
  return axiosClient.post(`/phieu-kham`, data);
};

export const updateEncounter = (id, data) => {
  return axiosClient.put(`/phieu-kham/${id}`, data);
};

export const updateEncounterStatus = (id, status) => {
  return axiosClient.put(`/phieu-kham/${id}/status`, {
    trang_thai: status,
  });
};