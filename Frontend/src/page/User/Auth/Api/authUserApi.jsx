import axiosClient from "@/components/common/axiosClient";

export const loginPatient = async (data) => {
  const res = await axiosClient.post("/auth/login", data);
  return res.data;
};

export const registerPatient = async (data) => {
  const res = await axiosClient.post("/auth/register", data);
  return res.data;
};
