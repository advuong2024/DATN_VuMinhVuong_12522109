import axiosClient from "@/components/common/axiosClient";

export const login = async (data) => {
  const res = await axiosClient.post(`/auth/login`, data);
  return res.data;
};

export const refreshTokenApi = (refreshToken) => {
  return axiosClient.post("/auth/refresh", {
    refreshToken,
  });
};