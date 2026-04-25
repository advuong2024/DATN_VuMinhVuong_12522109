import axiosClient from "@/components/common/axiosClient";

export const getAccounts = async (params) => {
  const res = await axiosClient.get("/tai-khoan", { params });
  return res;
};

export const getEmployeesNoAccount = async () => {
  const res = await axiosClient.get("/nhan-vien/chua-co-tai-khoan");
  return res.data;
};

export const createAccount = async (data) => {
  const res = await axiosClient.post("/tai-khoan", data);
  return res;
};

export const updateAccount = async (id, data) => {
  const res = await axiosClient.put(`/tai-khoan/${id}`, data);
  return res;
};

export const updateAccountStatus = async (id, status) => {
  const res = await axiosClient.patch(`/tai-khoan/${id}/status`, {
    trang_thai: status,
  });
  return res;
};

export const updateAccountRole = async (id, role) => {
  const res = await axiosClient.patch(`/tai-khoan/${id}/role`, {
    vai_tro: role,
  });
  return res;
};


export const deleteAccount = async (id) => {
  const res = await axiosClient.delete(`/tai-khoan/${id}`);
  return res;
};

export const resetPassword = async (id, newPassword) => {
  const res = await axiosClient.patch(`/tai-khoan/reset-password/${id}`, {
    newPassword,
  });
  return res.data;
};