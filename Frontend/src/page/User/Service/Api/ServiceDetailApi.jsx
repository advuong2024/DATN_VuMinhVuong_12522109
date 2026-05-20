import axiosClient from "@/components/common/axiosClient";

export const getServiceById = async (id) => {
  const res = await axiosClient.get(`/dich-vu/${id}`);
  return res.data;
};
