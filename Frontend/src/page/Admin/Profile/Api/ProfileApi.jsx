import axiosClient from "@/components/common/axiosClient";
import { jwtDecode } from "jwt-decode";

const getEmployeeId = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  return jwtDecode(token).id_nhan_vien;
};

export const getProfile = async () => {
  const id = getEmployeeId();
  const res = await axiosClient.get(`/nhan-vien/${id}`);
  return res.data;
};

export const updateProfile = async (data) => {
  const id = getEmployeeId();
  const res = await axiosClient.put(`/nhan-vien/${id}`, data);
  return res.data;
};

export const getCertificates = async () => {
  const id = getEmployeeId();
  const res = await axiosClient.get(`/chung-chi/nhan-vien/${id}`);
  return res.data;
};

export const createCertificate = async (data) => {
  const id = getEmployeeId();
  const res = await axiosClient.post("/chung-chi", {
    id_nhan_vien: id,
    name: data.ten_chung_chi,
    issuer: data.noi_cap,
    year: data.nam_cap,
  });
  return res.data;
};

export const deleteCertificate = async (certId) => {
  const res = await axiosClient.delete(`/chung-chi/${certId}`);
  return res.data;
};
