import axiosClient from "@/components/common/axiosClient";

export const getSpecialtyById = async (id) => {
  const res = await axiosClient.get(`/chuyen-khoa/${id}`);
  return res.data;
};

export const getDoctorsBySpecialty = async (id) => {
  const res = await axiosClient.get(`/nhan-vien/bac-si/${id}`);
  return res.data;
};
