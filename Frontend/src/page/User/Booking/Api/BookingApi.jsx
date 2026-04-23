import axiosClient from "@/components/common/axiosClient";

export const getCK = async () => {
    const res = await axiosClient.get("/chuyen-khoa");
    return res.data;
}

export const getDoctorCK = async (id) => {
    const res = await axiosClient.get(`/nhan-vien/bac-si/${id}`);
    return res.data;
}

export const getCustomer = async (id) => {
    const res = await axiosClient.get(`/benh-nhan/${id}`);
    return res.data;
}

export const postCustomer = async (data) => {
    const res = await axiosClient.post("/benh-nhan", data);
    return res.data;
}

export const postBook = async (data) => {
    const res = await axiosClient.post("/dat-lich", data);
    return res.data;
}

export const updateCustomer = async (id, data) => {
    const res = await axiosClient.put(`/benh-nhan/${id}`, data);
    return res.data;
}

export const getBookedSlots = async (params) => {
  const res = await axiosClient.get("/dat-lich/da-dat", {
    params,
  });
  return res.data;
};